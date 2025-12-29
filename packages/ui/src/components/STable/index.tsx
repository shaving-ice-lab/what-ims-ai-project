import React from 'react';

import { Button, Table, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface STableColumn<T> {
  title: string;
  dataIndex: keyof T | string;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: string }[];
  onFilter?: (value: string | number | boolean, record: T) => boolean;
}

export interface STableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: STableColumn<T>[];
  /** 是否显示导出按钮 */
  showExport?: boolean;
  /** 导出文件名 */
  exportFileName?: string;
  /** 导出回调 */
  onExport?: () => void;
}

export function STable<T extends object>({
  columns,
  showExport = false,
  exportFileName = 'export',
  onExport,
  pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  },
  rowKey = 'id',
  ...restProps
}: STableProps<T>) {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      console.log('Export:', exportFileName);
    }
  };

  const antdColumns: ColumnsType<T> = columns.map((col) => ({
    ...col,
    dataIndex: col.dataIndex as string,
    key: col.key || (col.dataIndex as string),
  }));

  return (
    <div className="s-table-wrapper">
      {showExport && (
        <div className="s-table-toolbar" style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button onClick={handleExport}>导出</Button>
        </div>
      )}
      <Table<T> columns={antdColumns} pagination={pagination} rowKey={rowKey} {...restProps} />
    </div>
  );
}

export default STable;
