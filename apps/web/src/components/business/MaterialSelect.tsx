'use client';

/**
 * MaterialSelect - 物料选择组件
 * 弹窗选择器，支持分类树筛选、物料搜索、已选物料列表、多选
 */

import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TreeDataNode } from 'antd';
import {
  Button,
  Col,
  Empty,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tree,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

const { Text } = Typography;

export interface MaterialOption {
  /** 物料ID */
  id: number;
  /** 物料名称 */
  name: string;
  /** 物料编号 */
  materialNo?: string;
  /** 分类ID */
  categoryId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 品牌 */
  brand?: string;
  /** 规格 */
  spec?: string;
  /** 单位 */
  unit?: string;
  /** 图片URL */
  imageUrl?: string;
  /** 状态：1-启用，0-禁用 */
  status: number;
}

export interface CategoryTreeNode {
  /** 分类ID */
  id: number;
  /** 分类名称 */
  name: string;
  /** 子分类 */
  children?: CategoryTreeNode[];
}

export interface MaterialSelectProps {
  /** 物料列表数据 */
  materials?: MaterialOption[];
  /** 远程加载物料数据的函数 */
  fetchMaterials?: (params?: {
    keyword?: string;
    categoryId?: number;
  }) => Promise<MaterialOption[]>;
  /** 分类树数据 */
  categoryTree?: CategoryTreeNode[];
  /** 远程加载分类树的函数 */
  fetchCategories?: () => Promise<CategoryTreeNode[]>;
  /** 选中的物料ID列表 */
  value?: number[];
  /** 选中变化回调 */
  onChange?: (value: number[], selectedMaterials: MaterialOption[]) => void;
  /** 是否多选模式 */
  multiple?: boolean;
  /** 最大选择数量 */
  maxCount?: number;
  /** 触发器按钮文本 */
  triggerText?: string;
  /** 弹窗标题 */
  modalTitle?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只显示启用的物料 */
  onlyActive?: boolean;
}

const MaterialSelect: React.FC<MaterialSelectProps> = ({
  materials: propMaterials,
  fetchMaterials,
  categoryTree: propCategoryTree,
  fetchCategories,
  value = [],
  onChange,
  multiple = true,
  maxCount,
  triggerText = '选择物料',
  modalTitle = '选择物料',
  disabled = false,
  onlyActive = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [materials, setMaterials] = useState<MaterialOption[]>(propMaterials || []);
  const [categoryTree, setCategoryTree] = useState<CategoryTreeNode[]>(propCategoryTree || []);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedIds, setSelectedIds] = useState<number[]>(value);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialOption[]>([]);

  // 转换分类树为Tree组件格式
  const convertToTreeData = (nodes: CategoryTreeNode[]): TreeDataNode[] => {
    return nodes.map((node) => ({
      key: node.id,
      title: node.name,
      children: node.children ? convertToTreeData(node.children) : undefined,
    }));
  };

  // 加载物料数据
  const loadMaterials = useCallback(
    async (params?: { keyword?: string; categoryId?: number }) => {
      if (fetchMaterials) {
        setLoading(true);
        try {
          const data = await fetchMaterials(params);
          setMaterials(data);
        } catch (error) {
          console.error('加载物料数据失败:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchMaterials]
  );

  // 加载分类数据
  const loadCategories = useCallback(async () => {
    if (fetchCategories) {
      try {
        const data = await fetchCategories();
        setCategoryTree(data);
      } catch (error) {
        console.error('加载分类数据失败:', error);
      }
    }
  }, [fetchCategories]);

  // 初始化
  useEffect(() => {
    if (visible) {
      if (fetchMaterials && materials.length === 0) {
        loadMaterials();
      }
      if (fetchCategories && categoryTree.length === 0) {
        loadCategories();
      }
      setSelectedIds(value);
      // 初始化已选物料
      const selected = materials.filter((m) => value.includes(m.id));
      setSelectedMaterials(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, value]);

  // 使用props传入的数据
  useEffect(() => {
    if (propMaterials) setMaterials(propMaterials);
  }, [propMaterials]);

  useEffect(() => {
    if (propCategoryTree) setCategoryTree(propCategoryTree);
  }, [propCategoryTree]);

  // 搜索处理
  const handleSearch = useCallback(() => {
    if (fetchMaterials) {
      loadMaterials({ keyword: searchValue, categoryId: selectedCategoryId });
    }
  }, [fetchMaterials, loadMaterials, searchValue, selectedCategoryId]);

  // 分类选择
  const handleCategorySelect = useCallback(
    (selectedKeys: React.Key[]) => {
      const categoryId = selectedKeys[0] as number | undefined;
      setSelectedCategoryId(categoryId);
      if (fetchMaterials) {
        loadMaterials({ keyword: searchValue, categoryId });
      }
    },
    [fetchMaterials, loadMaterials, searchValue]
  );

  // 过滤物料列表
  const filteredMaterials = materials.filter((material) => {
    if (onlyActive && material.status !== 1) return false;
    if (!fetchMaterials) {
      // 本地搜索
      if (searchValue) {
        const keyword = searchValue.toLowerCase();
        const matches =
          material.name.toLowerCase().includes(keyword) ||
          material.materialNo?.toLowerCase().includes(keyword);
        if (!matches) return false;
      }
      // 本地分类筛选
      if (selectedCategoryId && material.categoryId !== selectedCategoryId) {
        return false;
      }
    }
    return true;
  });

  // 选择/取消选择物料
  const handleSelectMaterial = useCallback(
    (material: MaterialOption) => {
      let newSelectedIds: number[];
      let newSelectedMaterials: MaterialOption[];

      if (selectedIds.includes(material.id)) {
        // 取消选择
        newSelectedIds = selectedIds.filter((id) => id !== material.id);
        newSelectedMaterials = selectedMaterials.filter((m) => m.id !== material.id);
      } else {
        // 选择
        if (!multiple) {
          newSelectedIds = [material.id];
          newSelectedMaterials = [material];
        } else if (maxCount && selectedIds.length >= maxCount) {
          return; // 已达到最大数量
        } else {
          newSelectedIds = [...selectedIds, material.id];
          newSelectedMaterials = [...selectedMaterials, material];
        }
      }

      setSelectedIds(newSelectedIds);
      setSelectedMaterials(newSelectedMaterials);
    },
    [selectedIds, selectedMaterials, multiple, maxCount]
  );

  // 移除已选物料
  const handleRemoveMaterial = useCallback(
    (materialId: number) => {
      setSelectedIds(selectedIds.filter((id) => id !== materialId));
      setSelectedMaterials(selectedMaterials.filter((m) => m.id !== materialId));
    },
    [selectedIds, selectedMaterials]
  );

  // 确认选择
  const handleConfirm = useCallback(() => {
    onChange?.(selectedIds, selectedMaterials);
    setVisible(false);
  }, [onChange, selectedIds, selectedMaterials]);

  // 取消选择
  const handleCancel = useCallback(() => {
    setSelectedIds(value);
    setSelectedMaterials(materials.filter((m) => value.includes(m.id)));
    setVisible(false);
  }, [value, materials]);

  // 物料表格列配置
  const columns: TableColumnsType<MaterialOption> = [
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          {record.imageUrl && (
            <img
              src={record.imageUrl}
              alt={name}
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <div>
            <div>{name}</div>
            {record.materialNo && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.materialNo}
              </Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => {
        const isSelected = selectedIds.includes(record.id);
        return (
          <Button
            type={isSelected ? 'default' : 'primary'}
            size="small"
            onClick={() => handleSelectMaterial(record)}
            disabled={!isSelected && maxCount !== undefined && selectedIds.length >= maxCount}
          >
            {isSelected ? '取消' : '选择'}
          </Button>
        );
      },
    },
  ];

  // 已选物料列表
  const renderSelectedList = () => {
    if (selectedMaterials.length === 0) {
      return <Empty description="暂未选择物料" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {selectedMaterials.map((material) => (
          <div
            key={material.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Space>
              <span>{material.name}</span>
              {material.spec && <Tag>{material.spec}</Tag>}
            </Space>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveMaterial(material.id)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)} disabled={disabled}>
        {triggerText}
        {value.length > 0 && <Tag style={{ marginLeft: 8 }}>{value.length}</Tag>}
      </Button>

      <Modal
        title={modalTitle}
        open={visible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        width={1000}
        okText="确认选择"
        cancelText="取消"
      >
        <Row gutter={16}>
          {/* 左侧分类树 */}
          <Col span={6}>
            <div
              style={{
                borderRight: '1px solid #f0f0f0',
                paddingRight: 16,
                height: 500,
                overflow: 'auto',
              }}
            >
              <Text strong style={{ marginBottom: 8, display: 'block' }}>
                物料分类
              </Text>
              {categoryTree.length > 0 ? (
                <Tree
                  treeData={convertToTreeData(categoryTree)}
                  onSelect={handleCategorySelect}
                  selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
                  defaultExpandAll
                />
              ) : (
                <Empty description="暂无分类" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Col>

          {/* 中间物料列表 */}
          <Col span={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="搜索物料名称/编号"
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
              <Spin spinning={loading}>
                <Table
                  dataSource={filteredMaterials}
                  columns={columns}
                  rowKey="id"
                  size="small"
                  pagination={{ pageSize: 10, size: 'small' }}
                  scroll={{ y: 400 }}
                />
              </Spin>
            </Space>
          </Col>

          {/* 右侧已选列表 */}
          <Col span={6}>
            <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 16 }}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>
                已选物料 ({selectedMaterials.length}
                {maxCount ? `/${maxCount}` : ''})
              </Text>
              {renderSelectedList()}
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default MaterialSelect;
