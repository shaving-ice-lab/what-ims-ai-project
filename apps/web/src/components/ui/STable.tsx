'use client';

/**
 * STable - 统一表格组件
 * 基于 Ant Design Table 组件封装
 * 支持列配置化、内置分页、排序、行选择等
 */

import { Table, type TableProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useCallback, useState } from 'react';

export interface STableProps<T extends object = object> extends Omit<TableProps<T>, 'onChange'> {
  /** 是否显示序号列 */
  showIndex?: boolean;
  /** 序号列标题 */
  indexTitle?: string;
  /** 表格变化回调 */
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => void;
  /** 默认分页配置 */
  defaultPagination?: TablePaginationConfig;
}

function STable<T extends object = object>({
  columns,
  showIndex = false,
  indexTitle = '序号',
  pagination,
  defaultPagination,
  onChange,
  ...rest
}: STableProps<T>) {
  // 从pagination prop或defaultPagination获取初始值
  const initialPage =
    (pagination && typeof pagination === 'object' ? pagination.current : undefined) ||
    defaultPagination?.current ||
    1;
  const initialPageSize =
    (pagination && typeof pagination === 'object' ? pagination.pageSize : undefined) ||
    defaultPagination?.pageSize ||
    10;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 使用受控模式时，从外部prop获取当前页码
  const effectivePage =
    pagination && typeof pagination === 'object' && pagination.current
      ? pagination.current
      : currentPage;
  const effectivePageSize =
    pagination && typeof pagination === 'object' && pagination.pageSize
      ? pagination.pageSize
      : pageSize;

  // 添加序号列
  const enhancedColumns: ColumnsType<T> = showIndex
    ? [
        {
          title: indexTitle,
          key: '__index__',
          width: 60,
          align: 'center',
          render: (_: unknown, __: T, index: number) =>
            (effectivePage - 1) * effectivePageSize + index + 1,
        },
        ...(columns || []),
      ]
    : columns || [];

  // 默认分页配置
  const defaultPaginationConfig: TablePaginationConfig = {
    current: effectivePage,
    pageSize: effectivePageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
    ...defaultPagination,
  };

  // 处理表格变化
  const handleChange = useCallback(
    (
      newPagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[]
    ) => {
      // 只在非受控模式下更新内部状态
      if (!pagination || typeof pagination !== 'object' || !pagination.current) {
        if (newPagination.current) {
          setCurrentPage(newPagination.current);
        }
      }
      if (!pagination || typeof pagination !== 'object' || !pagination.pageSize) {
        if (newPagination.pageSize) {
          setPageSize(newPagination.pageSize);
        }
      }
      onChange?.(newPagination, filters, sorter);
    },
    [onChange, pagination]
  );

  return (
    <Table<T>
      columns={enhancedColumns}
      pagination={pagination === false ? false : { ...defaultPaginationConfig, ...pagination }}
      onChange={handleChange}
      {...rest}
    />
  );
}

export default STable;
