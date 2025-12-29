'use client';

/**
 * SupplierSelect - 供应商选择组件
 * 基于Ant Design Select，支持搜索、多选、显示供应商状态
 */

import { ShopOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select, Space, Tag } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

export interface SupplierOption {
  /** 供应商ID */
  id: number;
  /** 供应商名称 */
  name: string;
  /** 显示名称 */
  displayName?: string;
  /** 供应商编号 */
  supplierNo?: string;
  /** 状态：1-启用，0-禁用 */
  status: number;
  /** 联系人 */
  contactName?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 起送价 */
  minOrderAmount?: number;
  /** 配送模式 */
  deliveryMode?: 'self_delivery' | 'express_delivery';
}

export interface SupplierSelectProps extends Omit<SelectProps, 'options' | 'value' | 'onChange'> {
  /** 供应商列表数据 */
  suppliers?: SupplierOption[];
  /** 远程加载供应商数据的函数 */
  fetchSuppliers?: (keyword?: string) => Promise<SupplierOption[]>;
  /** 选中的供应商ID（单选模式） */
  value?: number | number[];
  /** 选中变化回调 */
  onChange?: (value: number | number[] | undefined) => void;
  /** 是否多选模式 */
  multiple?: boolean;
  /** 是否显示供应商状态 */
  showStatus?: boolean;
  /** 是否只显示启用的供应商 */
  onlyActive?: boolean;
  /** 是否显示起送价 */
  showMinOrder?: boolean;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({
  suppliers: propSuppliers,
  fetchSuppliers,
  value,
  onChange,
  multiple = false,
  showStatus = true,
  onlyActive = true,
  showMinOrder = false,
  placeholder,
  loading: propLoading,
  disabled,
  ...restProps
}) => {
  const [suppliers, setSuppliers] = useState<SupplierOption[]>(propSuppliers || []);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // 加载供应商数据
  const loadSuppliers = useCallback(
    async (keyword?: string) => {
      if (fetchSuppliers) {
        setLoading(true);
        try {
          const data = await fetchSuppliers(keyword);
          setSuppliers(data);
        } catch (error) {
          console.error('加载供应商数据失败:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchSuppliers]
  );

  // 初始化加载
  useEffect(() => {
    if (fetchSuppliers && suppliers.length === 0) {
      loadSuppliers();
    }
  }, [fetchSuppliers, loadSuppliers, suppliers.length]);

  // 使用props传入的suppliers
  useEffect(() => {
    if (propSuppliers) {
      setSuppliers(propSuppliers);
    }
  }, [propSuppliers]);

  // 搜索处理
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (fetchSuppliers) {
        loadSuppliers(value);
      }
    },
    [fetchSuppliers, loadSuppliers]
  );

  // 过滤供应商列表
  const filteredSuppliers = suppliers.filter((supplier) => {
    // 只显示启用的供应商
    if (onlyActive && supplier.status !== 1) {
      return false;
    }
    // 本地搜索过滤（如果没有远程搜索）
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

  // 渲染供应商选项
  const renderOption = (supplier: SupplierOption) => {
    const displayName = supplier.displayName || supplier.name;
    const statusBadge =
      showStatus && supplier.status !== 1 ? (
        <Tag color="red" style={{ marginLeft: 8 }}>
          已禁用
        </Tag>
      ) : null;

    const minOrderInfo =
      showMinOrder && supplier.minOrderAmount ? (
        <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>
          起送¥{supplier.minOrderAmount}
        </span>
      ) : null;

    return (
      <Space>
        <ShopOutlined />
        <span>{displayName}</span>
        {supplier.supplierNo && (
          <span style={{ color: '#999', fontSize: 12 }}>({supplier.supplierNo})</span>
        )}
        {statusBadge}
        {minOrderInfo}
      </Space>
    );
  };

  // 渲染选中标签
  const tagRender = (props: {
    label: React.ReactNode;
    value: number;
    closable: boolean;
    onClose: () => void;
  }) => {
    const { label, closable, onClose } = props;
    const supplier = suppliers.find((s) => s.id === props.value);
    const isDisabled = supplier && supplier.status !== 1;

    return (
      <Tag
        color={isDisabled ? 'red' : 'blue'}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  // 选项列表
  const options = filteredSuppliers.map((supplier) => ({
    label: renderOption(supplier),
    value: supplier.id,
    disabled: onlyActive && supplier.status !== 1,
    title: supplier.displayName || supplier.name,
  }));

  // 获取显示值
  const getDisplayValue = () => {
    if (multiple) {
      return value as number[] | undefined;
    }
    return value as number | undefined;
  };

  return (
    <Select
      showSearch
      allowClear
      mode={multiple ? 'multiple' : undefined}
      placeholder={placeholder || (multiple ? '请选择供应商' : '请选择供应商')}
      value={getDisplayValue()}
      onChange={onChange}
      onSearch={handleSearch}
      loading={propLoading || loading}
      disabled={disabled}
      filterOption={!fetchSuppliers}
      optionFilterProp="title"
      options={options}
      tagRender={multiple ? tagRender : undefined}
      notFoundContent={loading ? '加载中...' : '暂无供应商'}
      style={{ width: '100%' }}
      {...restProps}
    />
  );
};

export default SupplierSelect;
