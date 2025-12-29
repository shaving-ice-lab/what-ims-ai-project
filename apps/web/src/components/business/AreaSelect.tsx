'use client';

/**
 * AreaSelect - 配送区域选择组件
 * 省市区三级联动，支持多选、数据懒加载、已选区域列表展示
 */

import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import type { CascaderProps } from 'antd';
import { Button, Cascader, Space, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

const { Text } = Typography;

export interface AreaNode {
  /** 区域编码或名称 */
  value: string;
  /** 区域标签 */
  label: string;
  /** 是否叶子节点 */
  isLeaf?: boolean;
  /** 子区域 */
  children?: AreaNode[];
}

export interface SelectedArea {
  /** 省 */
  province: string;
  /** 省标签 */
  provinceLabel: string;
  /** 市 */
  city?: string;
  /** 市标签 */
  cityLabel?: string;
  /** 区 */
  district?: string;
  /** 区标签 */
  districtLabel?: string;
}

export interface AreaSelectProps {
  /** 区域数据（完整树结构） */
  areaData?: AreaNode[];
  /** 懒加载区域数据的函数 */
  loadAreaData?: (selectedOptions: AreaNode[]) => Promise<AreaNode[]>;
  /** 选中的区域列表 */
  value?: SelectedArea[];
  /** 选中变化回调 */
  onChange?: (value: SelectedArea[]) => void;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 最大选择数量 */
  maxCount?: number;
  /** 是否允许选择非叶子节点（省/市级） */
  allowNonLeaf?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示已选区域列表 */
  showSelectedList?: boolean;
}

const AreaSelect: React.FC<AreaSelectProps> = ({
  areaData: propAreaData,
  loadAreaData,
  value = [],
  onChange,
  multiple = true,
  maxCount,
  allowNonLeaf = true,
  placeholder = '选择配送区域',
  disabled = false,
  showSelectedList = true,
}) => {
  const [areaData, setAreaData] = useState<AreaNode[]>(propAreaData || []);
  const [selectedAreas, setSelectedAreas] = useState<SelectedArea[]>(value);
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);

  // 使用props传入的数据
  useEffect(() => {
    if (propAreaData) {
      setAreaData(propAreaData);
    }
  }, [propAreaData]);

  // 同步外部value
  useEffect(() => {
    setSelectedAreas(value);
  }, [value]);

  // 懒加载子区域数据
  const handleLoadData = useCallback(
    async (selectedOptions: AreaNode[]) => {
      if (!loadAreaData || selectedOptions.length === 0) return;

      const targetOption = selectedOptions[selectedOptions.length - 1];
      if (!targetOption) return;

      try {
        const children = await loadAreaData(selectedOptions);
        targetOption.children = children;
        setAreaData([...areaData]);
      } catch (error) {
        console.error('加载区域数据失败:', error);
      }
    },
    [loadAreaData, areaData]
  );

  // 查找区域标签
  const findAreaLabel = useCallback(
    (level: number, values: string[]): string => {
      let nodes = areaData;
      for (let i = 0; i <= level; i++) {
        const node = nodes.find((n) => n.value === values[i]);
        if (!node) return values[level] || '';
        if (i === level) return node.label;
        nodes = node.children || [];
      }
      return values[level] || '';
    },
    [areaData]
  );

  // 添加区域
  const handleAddArea = useCallback(
    (values: (string | number)[]) => {
      if (!values || values.length === 0) return;

      const stringValues = values.map(String);
      const provinceValue = stringValues[0];
      if (!provinceValue) return;

      // 构建选中的区域对象
      const newArea: SelectedArea = {
        province: provinceValue,
        provinceLabel: findAreaLabel(0, stringValues),
      };

      if (stringValues[1]) {
        newArea.city = stringValues[1];
        newArea.cityLabel = findAreaLabel(1, stringValues);
      }

      if (stringValues[2]) {
        newArea.district = stringValues[2];
        newArea.districtLabel = findAreaLabel(2, stringValues);
      }

      // 检查是否已存在
      const exists = selectedAreas.some(
        (area) =>
          area.province === newArea.province &&
          area.city === newArea.city &&
          area.district === newArea.district
      );

      if (exists) return;

      // 检查最大数量限制
      if (maxCount && selectedAreas.length >= maxCount) return;

      let newSelectedAreas: SelectedArea[];
      if (multiple) {
        newSelectedAreas = [...selectedAreas, newArea];
      } else {
        newSelectedAreas = [newArea];
      }

      setSelectedAreas(newSelectedAreas);
      onChange?.(newSelectedAreas);
      setCascaderValue([]); // 清空选择器
    },
    [selectedAreas, findAreaLabel, multiple, maxCount, onChange]
  );

  // 移除区域
  const handleRemoveArea = useCallback(
    (index: number) => {
      const newSelectedAreas = selectedAreas.filter((_, i) => i !== index);
      setSelectedAreas(newSelectedAreas);
      onChange?.(newSelectedAreas);
    },
    [selectedAreas, onChange]
  );

  // 清空所有区域
  const handleClearAll = useCallback(() => {
    setSelectedAreas([]);
    onChange?.([]);
  }, [onChange]);

  // 格式化区域显示文本
  const formatAreaText = (area: SelectedArea): string => {
    const parts = [area.provinceLabel];
    if (area.cityLabel) parts.push(area.cityLabel);
    if (area.districtLabel) parts.push(area.districtLabel);
    return parts.join(' / ');
  };

  // 渲染已选区域列表
  const renderSelectedList = () => {
    if (!showSelectedList || selectedAreas.length === 0) return null;

    return (
      <div
        style={{
          marginTop: 8,
          padding: 12,
          backgroundColor: '#fafafa',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text strong>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            已选区域 ({selectedAreas.length}
            {maxCount ? `/${maxCount}` : ''})
          </Text>
          {selectedAreas.length > 1 && (
            <Button type="link" size="small" danger onClick={handleClearAll}>
              清空全部
            </Button>
          )}
        </div>
        <Space wrap>
          {selectedAreas.map((area, index) => (
            <Tag
              key={`${area.province}-${area.city || ''}-${area.district || ''}`}
              closable
              onClose={() => handleRemoveArea(index)}
              color="blue"
            >
              {formatAreaText(area)}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  // Cascader配置
  const cascaderProps: CascaderProps<AreaNode> = {
    options: areaData,
    value: cascaderValue,
    onChange: handleAddArea,
    loadData: loadAreaData ? handleLoadData : undefined,
    changeOnSelect: allowNonLeaf,
    placeholder,
    disabled: disabled || (maxCount !== undefined && selectedAreas.length >= maxCount),
    showSearch: {
      filter: (inputValue, path) =>
        path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
    },
    style: { width: '100%' },
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <Cascader {...cascaderProps} />
        {multiple && (
          <Button
            icon={<PlusOutlined />}
            disabled={disabled || (maxCount !== undefined && selectedAreas.length >= maxCount)}
            onClick={() => {
              if (cascaderValue.length > 0) {
                handleAddArea(cascaderValue);
              }
            }}
          >
            添加
          </Button>
        )}
      </Space.Compact>
      {renderSelectedList()}
    </div>
  );
};

export default AreaSelect;
