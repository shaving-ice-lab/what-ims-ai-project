"use client";

/**
 * SupplierSelect - 供应商选择组件
 * 支持搜索、多选、显示供应商状态
 */

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2, Search, Store } from "lucide-react";
import * as React from "react";

export interface SupplierOption {
  id: number;
  name: string;
  displayName?: string;
  supplierNo?: string;
  status: number;
  contactName?: string;
  contactPhone?: string;
  minOrderAmount?: number;
  deliveryMode?: "self_delivery" | "express_delivery";
}

export interface SupplierSelectProps {
  suppliers?: SupplierOption[];
  fetchSuppliers?: (keyword?: string) => Promise<SupplierOption[]>;
  value?: number | number[];
  onChange?: (value: number | number[] | undefined) => void;
  multiple?: boolean;
  showStatus?: boolean;
  onlyActive?: boolean;
  showMinOrder?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({
  suppliers: propSuppliers = [],
  fetchSuppliers,
  value,
  onChange,
  multiple = false,
  showStatus = true,
  onlyActive = true,
  showMinOrder = false,
  placeholder = "请选择供应商",
  loading: propLoading,
  disabled,
  className,
}) => {
  const [suppliers, setSuppliers] = React.useState<SupplierOption[]>(propSuppliers);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // Load suppliers
  const loadSuppliers = React.useCallback(
    async (keyword?: string) => {
      if (fetchSuppliers) {
        setLoading(true);
        try {
          const data = await fetchSuppliers(keyword);
          setSuppliers(data);
        } catch (error) {
          console.error("加载供应商数据失败:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchSuppliers]
  );

  // Initial load
  React.useEffect(() => {
    if (fetchSuppliers && suppliers.length === 0) {
      loadSuppliers();
    }
  }, [fetchSuppliers, suppliers.length, loadSuppliers]);

  // Sync props
  React.useEffect(() => {
    if (propSuppliers.length > 0) {
      setSuppliers(propSuppliers);
    }
  }, [propSuppliers]);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (onlyActive && supplier.status !== 1) return false;
    if (!fetchSuppliers && searchValue) {
      const keyword = searchValue.toLowerCase();
      return (
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.displayName?.toLowerCase().includes(keyword) ||
        supplier.supplierNo?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  // Handle single select
  const handleSingleSelect = (supplierId: string) => {
    onChange?.(parseInt(supplierId));
    setOpen(false);
  };

  // Handle multi select toggle
  const handleMultiSelectToggle = (supplierId: number) => {
    const currentValues = (value as number[]) || [];
    const newValues = currentValues.includes(supplierId)
      ? currentValues.filter((id) => id !== supplierId)
      : [...currentValues, supplierId];
    onChange?.(newValues);
  };

  // Get display label
  const getDisplayLabel = () => {
    if (!value) return placeholder;
    if (multiple) {
      const selectedCount = (value as number[])?.length || 0;
      if (selectedCount === 0) return placeholder;
      return `已选择 ${selectedCount} 个供应商`;
    }
    const supplier = suppliers.find((s) => s.id === value);
    return supplier?.displayName || supplier?.name || placeholder;
  };

  // Single select mode
  if (!multiple) {
    return (
      <Select
        value={value?.toString()}
        onValueChange={handleSingleSelect}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredSuppliers.map((supplier) => (
            <SelectItem
              key={supplier.id}
              value={supplier.id.toString()}
              disabled={onlyActive && supplier.status !== 1}
            >
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.displayName || supplier.name}</span>
                {supplier.supplierNo && (
                  <span className="text-xs text-muted-foreground">
                    ({supplier.supplierNo})
                  </span>
                )}
                {showStatus && supplier.status !== 1 && (
                  <Badge variant="error" className="ml-1">
                    已禁用
                  </Badge>
                )}
                {showMinOrder && supplier.minOrderAmount && (
                  <span className="text-xs text-muted-foreground ml-1">
                    起送¥{supplier.minOrderAmount}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Multiple select mode
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={!value || (value as number[]).length === 0 ? "text-muted-foreground" : ""}>
          {getDisplayLabel()}
        </span>
        {(propLoading || loading) ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索供应商..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (fetchSuppliers) {
                    loadSuppliers(e.target.value);
                  }
                }}
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="max-h-[200px]">
            {filteredSuppliers.map((supplier) => {
              const isSelected = (value as number[])?.includes(supplier.id);
              return (
                <div
                  key={supplier.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent",
                    isSelected && "bg-accent"
                  )}
                  onClick={() => handleMultiSelectToggle(supplier.id)}
                >
                  <Checkbox checked={isSelected} />
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{supplier.displayName || supplier.name}</span>
                  {supplier.supplierNo && (
                    <span className="text-xs text-muted-foreground">
                      ({supplier.supplierNo})
                    </span>
                  )}
                  {showStatus && supplier.status !== 1 && (
                    <Badge variant="error">已禁用</Badge>
                  )}
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SupplierSelect;
