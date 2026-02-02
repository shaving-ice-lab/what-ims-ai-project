"use client";

/**
 * STable - 统一表格组件
 * 基于 shadcn/ui Table 组件封装
 * 支持分页、排序、行选择等
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import * as React from "react";

export interface STableColumn<T> {
  /** 列标识 */
  key: string;
  /** 列标题 */
  title: React.ReactNode;
  /** 数据字段 */
  dataIndex?: keyof T;
  /** 宽度 */
  width?: number | string;
  /** 对齐方式 */
  align?: "left" | "center" | "right";
  /** 是否可排序 */
  sortable?: boolean;
  /** 渲染函数 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

export interface STablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
}

export interface STableProps<T> {
  /** 列配置 */
  columns: STableColumn<T>[];
  /** 数据源 */
  dataSource: T[];
  /** 行key */
  rowKey: keyof T | ((record: T) => string | number);
  /** 是否显示序号列 */
  showIndex?: boolean;
  /** 序号列标题 */
  indexTitle?: string;
  /** 分页配置 */
  pagination?: STablePagination | false;
  /** 加载状态 */
  loading?: boolean;
  /** 行选择配置 */
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  };
  /** 排序变化回调 */
  onSortChange?: (key: string, direction: "asc" | "desc" | null) => void;
  /** 空状态 */
  emptyText?: string;
  /** 额外类名 */
  className?: string;
}

function STable<T extends object>({
  columns,
  dataSource,
  rowKey,
  showIndex = false,
  indexTitle = "序号",
  pagination,
  loading = false,
  rowSelection,
  onSortChange,
  emptyText = "暂无数据",
  className,
}: STableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);

  const getRowKey = (record: T): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] as string | number;
  };

  const handleSort = (key: string) => {
    let newDirection: "asc" | "desc" | null = "asc";
    if (sortKey === key) {
      if (sortDirection === "asc") newDirection = "desc";
      else if (sortDirection === "desc") newDirection = null;
    }
    setSortKey(newDirection ? key : null);
    setSortDirection(newDirection);
    onSortChange?.(key, newDirection);
  };

  const handleSelectAll = () => {
    if (!rowSelection) return;
    const allKeys = dataSource.map(getRowKey);
    const allSelected = allKeys.every((key) =>
      rowSelection.selectedRowKeys.includes(key)
    );
    if (allSelected) {
      rowSelection.onChange([], []);
    } else {
      rowSelection.onChange(allKeys, dataSource);
    }
  };

  const handleSelectRow = (record: T) => {
    if (!rowSelection) return;
    const key = getRowKey(record);
    const isSelected = rowSelection.selectedRowKeys.includes(key);
    if (isSelected) {
      rowSelection.onChange(
        rowSelection.selectedRowKeys.filter((k) => k !== key),
        dataSource.filter(
          (r) => rowSelection.selectedRowKeys.includes(getRowKey(r)) && getRowKey(r) !== key
        )
      );
    } else {
      rowSelection.onChange(
        [...rowSelection.selectedRowKeys, key],
        [...dataSource.filter((r) => rowSelection.selectedRowKeys.includes(getRowKey(r))), record]
      );
    }
  };

  const allSelected =
    rowSelection &&
    dataSource.length > 0 &&
    dataSource.every((r) => rowSelection.selectedRowKeys.includes(getRowKey(r)));

  const someSelected =
    rowSelection &&
    !allSelected &&
    dataSource.some((r) => rowSelection.selectedRowKeys.includes(getRowKey(r)));

  const selectAllState = allSelected ? true : someSelected ? "indeterminate" : false;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {rowSelection && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={handleSelectAll}
                    aria-label="选择全部行"
                  />
                </TableHead>
              )}
              {showIndex && (
                <TableHead className="w-[60px] text-center">
                  {indexTitle}
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.title}
                      {sortKey === column.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (showIndex ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : dataSource.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (showIndex ? 1 : 0)
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              dataSource.map((record, index) => {
                const key = getRowKey(record);
                const isSelected = rowSelection?.selectedRowKeys.includes(key);
                return (
                  <TableRow key={key} data-state={isSelected ? "selected" : undefined}>
                    {rowSelection && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(record)}
                          aria-label={`选择第 ${index + 1} 行`}
                        />
                      </TableCell>
                    )}
                    {showIndex && (
                      <TableCell className="text-center">
                        {pagination
                          ? (pagination.current - 1) * pagination.pageSize + index + 1
                          : index + 1}
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(
                              column.dataIndex
                                ? record[column.dataIndex]
                                : undefined,
                              record,
                              index
                            )
                          : column.dataIndex
                          ? String(record[column.dataIndex] ?? "")
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {pagination.total} 条
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) =>
                pagination.onChange?.(1, parseInt(value))
              }
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  pagination.onChange?.(1, pagination.pageSize)
                }
                disabled={pagination.current === 1}
                aria-label="首页"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  pagination.onChange?.(
                    pagination.current - 1,
                    pagination.pageSize
                  )
                }
                disabled={pagination.current === 1}
                aria-label="上一页"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                {pagination.current} /{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  pagination.onChange?.(
                    pagination.current + 1,
                    pagination.pageSize
                  )
                }
                disabled={
                  pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                aria-label="下一页"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  pagination.onChange?.(
                    Math.ceil(pagination.total / pagination.pageSize),
                    pagination.pageSize
                  )
                }
                disabled={
                  pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                aria-label="末页"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default STable;
