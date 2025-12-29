'use client';

/**
 * StoreSelect - 门店选择组件
 * 基于Ant Design Select，支持按区域筛选、搜索
 */

import { EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Cascader, Select, Space, Tag } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

export interface StoreOption {
  /** 门店ID */
  id: number;
  /** 门店名称 */
  name: string;
  /** 门店编号 */
  storeNo?: string;
  /** 省 */
  province?: string;
  /** 市 */
  city?: string;
  /** 区 */
  district?: string;
  /** 详细地址 */
  address?: string;
  /** 联系人 */
  contactName?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 状态：1-启用，0-禁用 */
  status: number;
}

export interface AreaOption {
  /** 区域值（省/市/区编码或名称） */
  value: string;
  /** 区域标签 */
  label: string;
  /** 子区域 */
  children?: AreaOption[];
}

export interface StoreSelectProps extends Omit<SelectProps, 'options' | 'value' | 'onChange'> {
  /** 门店列表数据 */
  stores?: StoreOption[];
  /** 远程加载门店数据的函数 */
  fetchStores?: (params?: {
    keyword?: string;
    province?: string;
    city?: string;
    district?: string;
  }) => Promise<StoreOption[]>;
  /** 区域选项（用于区域筛选） */
  areaOptions?: AreaOption[];
  /** 选中的门店ID */
  value?: number | number[];
  /** 选中变化回调 */
  onChange?: (value: number | number[] | undefined) => void;
  /** 是否多选模式 */
  multiple?: boolean;
  /** 是否显示区域筛选 */
  showAreaFilter?: boolean;
  /** 是否显示门店状态 */
  showStatus?: boolean;
  /** 是否只显示启用的门店 */
  onlyActive?: boolean;
  /** 是否显示地址信息 */
  showAddress?: boolean;
}

const StoreSelect: React.FC<StoreSelectProps> = ({
  stores: propStores,
  fetchStores,
  areaOptions,
  value,
  onChange,
  multiple = false,
  showAreaFilter = false,
  showStatus = true,
  onlyActive = true,
  showAddress = false,
  placeholder,
  loading: propLoading,
  disabled,
  ...restProps
}) => {
  const [stores, setStores] = useState<StoreOption[]>(propStores || []);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedArea, setSelectedArea] = useState<string[]>([]);

  // 加载门店数据
  const loadStores = useCallback(
    async (params?: { keyword?: string; province?: string; city?: string; district?: string }) => {
      if (fetchStores) {
        setLoading(true);
        try {
          const data = await fetchStores(params);
          setStores(data);
        } catch (error) {
          console.error('加载门店数据失败:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchStores]
  );

  // 初始化加载
  useEffect(() => {
    if (fetchStores && stores.length === 0) {
      loadStores();
    }
  }, [fetchStores, loadStores, stores.length]);

  // 使用props传入的stores
  useEffect(() => {
    if (propStores) {
      setStores(propStores);
    }
  }, [propStores]);

  // 搜索处理
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (fetchStores) {
        const [province, city, district] = selectedArea;
        loadStores({ keyword: value, province, city, district });
      }
    },
    [fetchStores, loadStores, selectedArea]
  );

  // 区域筛选变化
  const handleAreaChange = useCallback(
    (value: (string | number)[]) => {
      const areaValues = value as string[];
      setSelectedArea(areaValues);
      if (fetchStores) {
        const [province, city, district] = areaValues;
        loadStores({ keyword: searchValue, province, city, district });
      }
    },
    [fetchStores, loadStores, searchValue]
  );

  // 过滤门店列表
  const filteredStores = stores.filter((store) => {
    // 只显示启用的门店
    if (onlyActive && store.status !== 1) {
      return false;
    }
    // 区域过滤
    if (selectedArea.length > 0 && !fetchStores) {
      const [province, city, district] = selectedArea;
      if (province && store.province !== province) return false;
      if (city && store.city !== city) return false;
      if (district && store.district !== district) return false;
    }
    // 本地搜索过滤（如果没有远程搜索）
    if (!fetchStores && searchValue) {
      const keyword = searchValue.toLowerCase();
      return (
        store.name.toLowerCase().includes(keyword) ||
        store.storeNo?.toLowerCase().includes(keyword) ||
        store.address?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  // 渲染门店选项
  const renderOption = (store: StoreOption) => {
    const statusBadge =
      showStatus && store.status !== 1 ? (
        <Tag color="red" style={{ marginLeft: 8 }}>
          已禁用
        </Tag>
      ) : null;

    const addressInfo =
      showAddress && store.address ? (
        <div style={{ color: '#999', fontSize: 12 }}>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {store.province}
          {store.city}
          {store.district} {store.address}
        </div>
      ) : null;

    return (
      <div>
        <Space>
          <ShopOutlined />
          <span>{store.name}</span>
          {store.storeNo && <span style={{ color: '#999', fontSize: 12 }}>({store.storeNo})</span>}
          {statusBadge}
        </Space>
        {addressInfo}
      </div>
    );
  };

  // 渲染选中标签
  const tagRender: SelectProps['tagRender'] = (props) => {
    const { label, value, closable, onClose } = props;
    const store = stores.find((s) => s.id === value);
    const isDisabled = store && store.status !== 1;

    return (
      <Tag
        color={isDisabled ? 'red' : 'green'}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  // 选项列表
  const options = filteredStores.map((store) => ({
    label: renderOption(store),
    value: store.id,
    disabled: onlyActive && store.status !== 1,
    title: store.name,
  }));

  // 获取显示值
  const getDisplayValue = () => {
    if (multiple) {
      return value as number[] | undefined;
    }
    return value as number | undefined;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {showAreaFilter && areaOptions && (
        <Cascader
          options={areaOptions}
          value={selectedArea}
          onChange={handleAreaChange}
          placeholder="选择区域筛选"
          changeOnSelect
          allowClear
          style={{ width: '100%' }}
        />
      )}
      <Select
        showSearch
        allowClear
        mode={multiple ? 'multiple' : undefined}
        placeholder={placeholder || '请选择门店'}
        value={getDisplayValue()}
        onChange={onChange}
        onSearch={handleSearch}
        loading={propLoading || loading}
        disabled={disabled}
        filterOption={!fetchStores}
        optionFilterProp="title"
        options={options}
        tagRender={multiple ? tagRender : undefined}
        notFoundContent={loading ? '加载中...' : '暂无门店'}
        style={{ width: '100%' }}
        {...restProps}
      />
    </Space>
  );
};

export default StoreSelect;
