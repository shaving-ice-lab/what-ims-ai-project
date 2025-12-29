'use client';

/**
 * SearchBar - 搜索筛选栏组件
 * 动态表单项配置、展开/收起、重置功能
 */

import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const { RangePicker } = DatePicker;

export type SearchFieldType = 'input' | 'select' | 'dateRange' | 'date';

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
  debounceTime = 300,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取可见字段
  const visibleFields = expanded ? fields : fields.filter((f) => !f.expandOnly);

  // 是否有可展开的字段
  const hasExpandableFields = fields.some((f) => f.expandOnly);

  // 设置默认值
  useEffect(() => {
    const defaultValues: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      }
    });
    form.setFieldsValue(defaultValues);
  }, [fields, form]);

  // 防抖搜索
  const handleSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      const values = form.getFieldsValue();
      onSearch(values);
    }, debounceTime);
  }, [form, onSearch, debounceTime]);

  // 重置
  const handleReset = useCallback(() => {
    form.resetFields();
    onReset?.();
    onSearch({});
  }, [form, onReset, onSearch]);

  // 渲染字段
  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            placeholder={field.placeholder || `请选择${field.label}`}
            allowClear
            options={field.options}
            style={{ width: '100%' }}
          />
        );
      case 'dateRange':
        return <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />;
      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder || `请选择${field.label}`}
            style={{ width: '100%' }}
          />
        );
      default:
        return <Input placeholder={field.placeholder || `请输入${field.label}`} allowClear />;
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSearch}>
      <Row gutter={16}>
        {visibleFields.map((field) => (
          <Col key={field.name} xs={24} sm={12} md={8} lg={6}>
            <Form.Item name={field.name} label={field.label}>
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label=" ">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
              {showExpand && hasExpandableFields && (
                <Button
                  type="link"
                  onClick={() => setExpanded(!expanded)}
                  icon={expanded ? <UpOutlined /> : <DownOutlined />}
                >
                  {expanded ? '收起' : '展开'}
                </Button>
              )}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
