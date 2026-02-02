"use client";

/**
 * SearchBar - 搜索筛选栏组件
 * 动态表单项配置、展开/收起、重置功能
 */

import { Button } from "@/components/ui/button";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Loader2, RotateCcw, Search } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

export type SearchFieldType = "input" | "select" | "dateRange" | "date";

export interface SearchField {
  /** 字段名 */
  name: string;
  /** 标签 */
  label: string;
  /** 字段类型 */
  type: SearchFieldType;
  /** 占位符 */
  placeholder?: string;
  /** 选项（用于 select 类型） */
  options?: { label: string; value: string | number }[];
  /** 默认值 */
  defaultValue?: unknown;
  /** 是否展开时才显示 */
  expandOnly?: boolean;
}

export interface SearchBarProps {
  /** 搜索字段配置 */
  fields: SearchField[];
  /** 搜索回调 */
  onSearch: (values: Record<string, unknown>) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 是否显示展开/收起按钮 */
  showExpand?: boolean;
  /** 默认展开状态 */
  defaultExpanded?: boolean;
  /** 搜索防抖时间（毫秒） */
  debounceTime?: number;
  /** 是否加载中 */
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  fields,
  onSearch,
  onReset,
  showExpand = true,
  defaultExpanded = false,
  debounceTime: _debounceTime = 300,
  loading = false,
}) => {
  // debounceTime is reserved for future use in auto-search functionality
  void _debounceTime;
  
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [values, setValues] = React.useState<Record<string, unknown>>({});

  // 获取可见字段
  const visibleFields = expanded
    ? fields
    : fields.filter((f) => !f.expandOnly);

  // 是否有可展开的字段
  const hasExpandableFields = fields.some((f) => f.expandOnly);

  // 设置默认值
  React.useEffect(() => {
    const defaultValues: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      }
    });
    setValues(defaultValues);
  }, [fields]);

  // 更新值
  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // 提交搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };

  // 重置
  const handleReset = React.useCallback(() => {
    setValues({});
    onReset?.();
    onSearch({});
  }, [onReset, onSearch]);

  // 渲染字段
  const renderField = (field: SearchField) => {
    const value = values[field.name];

    switch (field.type) {
      case "select":
        return (
          <Select
            value={value as string | undefined}
            onValueChange={(v) => handleValueChange(field.name, v)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || `请选择${field.label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "dateRange":
        return (
          <DateRangePicker
            date={value as DateRange | undefined}
            onDateChange={(range) => handleValueChange(field.name, range)}
          />
        );
      case "date":
        return (
          <DatePicker
            date={value as Date | undefined}
            onDateChange={(date) => handleValueChange(field.name, date)}
          />
        );
      default:
        return (
          <Input
            placeholder={field.placeholder || `请输入${field.label}`}
            value={(value as string) || ""}
            onChange={(e) => handleValueChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {visibleFields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={field.name} className="text-xs font-medium text-muted-foreground">
              {field.label}
            </Label>
            {renderField(field)}
          </div>
        ))}
        <div className="flex items-end gap-2 col-span-1 sm:col-span-2 md:col-span-1">
          <Button type="submit" disabled={loading} className="flex-1 md:flex-none">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            搜索
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            重置
          </Button>
          {showExpand && hasExpandableFields && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
