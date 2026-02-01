import MainLayout from '@/components/layouts/MainLayout';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tabs, Tag, Tree, TreeSelect, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './materials.module.css';

const { Option } = Select;
const { TabPane } = Tabs;

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
  sort: number;
  children?: Category[];
}

interface Material {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: boolean;
  createdAt: string;
  skuCount: number;
}

interface MaterialSku {
  id: number;
  materialId: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  barcode?: string;
  imageUrl?: string;
  status: boolean;
  supplierCount: number;
}

const AdminMaterials: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [loading, setLoading] = useState(false);
  
  // 分类相关状态
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm] = Form.useForm();
  
  // 物料相关状态
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialForm] = Form.useForm();
  const [materialFilters, setMaterialFilters] = useState({
    categoryId: '',
    keyword: '',
    status: '',
  });
  
  // SKU相关状态
  const [skus, setSkus] = useState<MaterialSku[]>([]);
  const [skuModalVisible, setSkuModalVisible] = useState(false);
  const [editingSku, setEditingSku] = useState<MaterialSku | null>(null);
  const [skuForm] = Form.useForm();
  const [skuFilters, setSkuFilters] = useState({
    materialId: '',
    keyword: '',
    status: '',
  });
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
    fetchSkus();
  }, []);

  // 构建分类树结构
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap: { [key: number]: Category } = {};
    const tree: Category[] = [];
    
    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });
    
    categories.forEach(cat => {
      if (cat.parentId === null || cat.parentId === 0) {
        const node = categoryMap[cat.id];
        if (node) {
          tree.push(node);
        }
      } else {
        const parent = categoryMap[cat.parentId];
        const node = categoryMap[cat.id];
        if (parent && node) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    });
    
    return tree;
  };

  const fetchCategories = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockCategories: Category[] = [
        { id: 1, name: '蔬菜类', parentId: null, level: 1, sort: 1 },
        { id: 2, name: '叶菜类', parentId: 1, level: 2, sort: 1 },
        { id: 3, name: '根茎类', parentId: 1, level: 2, sort: 2 },
        { id: 4, name: '肉类', parentId: null, level: 1, sort: 2 },
        { id: 5, name: '猪肉', parentId: 4, level: 2, sort: 1 },
        { id: 6, name: '牛肉', parentId: 4, level: 2, sort: 2 },
        { id: 7, name: '水产类', parentId: null, level: 1, sort: 3 },
        { id: 8, name: '调料类', parentId: null, level: 1, sort: 4 },
      ];
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  };

  const fetchMaterials = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockMaterials: Material[] = [
        {
          id: 1,
          categoryId: 2,
          categoryName: '叶菜类',
          name: '西红柿',
          description: '新鲜西红柿',
          imageUrl: 'https://via.placeholder.com/100',
          status: true,
          createdAt: '2024-06-29 10:00:00',
          skuCount: 3,
        },
        {
          id: 2,
          categoryId: 2,
          categoryName: '叶菜类',
          name: '黄瓜',
          description: '新鲜黄瓜',
          imageUrl: 'https://via.placeholder.com/100',
          status: true,
          createdAt: '2024-06-29 09:00:00',
          skuCount: 2,
        },
        {
          id: 3,
          categoryId: 5,
          categoryName: '猪肉',
          name: '猪里脊肉',
          description: '优质猪里脊',
          status: true,
          createdAt: '2024-06-28 15:00:00',
          skuCount: 4,
        },
      ];
      setMaterials(mockMaterials);
      setPagination({ ...pagination, total: mockMaterials.length });
      setLoading(false);
    }, 500);
  };

  const fetchSkus = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockSkus: MaterialSku[] = [
        {
          id: 1,
          materialId: 1,
          materialName: '西红柿',
          brand: '绿源',
          spec: '500g/盒',
          unit: '盒',
          barcode: '6901234567890',
          imageUrl: 'https://via.placeholder.com/100',
          status: true,
          supplierCount: 5,
        },
        {
          id: 2,
          materialId: 1,
          materialName: '西红柿',
          brand: '农家',
          spec: '1kg/袋',
          unit: '袋',
          barcode: '6901234567891',
          status: true,
          supplierCount: 3,
        },
        {
          id: 3,
          materialId: 2,
          materialName: '黄瓜',
          brand: '绿源',
          spec: '500g/袋',
          unit: '袋',
          barcode: '6901234567892',
          status: true,
          supplierCount: 4,
        },
      ];
      setSkus(mockSkus);
      setLoading(false);
    }, 500);
  };

  // 分类管理函数
  const handleAddCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.setFieldsValue(category);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分类"${category.name}"吗？删除后该分类下的所有物料将被移到未分类。`,
      onOk: () => {
        message.success('分类已删除');
        fetchCategories();
      },
    });
  };

  const handleSaveCategory = async () => {
    try {
      await categoryForm.validateFields();
      if (editingCategory) {
        message.success('分类已更新');
      } else {
        message.success('分类已添加');
      }
      setCategoryModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 物料管理函数
  const handleAddMaterial = () => {
    setEditingMaterial(null);
    materialForm.resetFields();
    setMaterialModalVisible(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    materialForm.setFieldsValue(material);
    setMaterialModalVisible(true);
  };

  const handleDeleteMaterial = (material: Material) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除物料"${material.name}"吗？删除后相关的SKU也将被删除。`,
      onOk: () => {
        message.success('物料已删除');
        fetchMaterials();
      },
    });
  };

  const handleSaveMaterial = async () => {
    try {
      await materialForm.validateFields();
      if (editingMaterial) {
        message.success('物料已更新');
      } else {
        message.success('物料已添加');
      }
      setMaterialModalVisible(false);
      fetchMaterials();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // SKU管理函数
  const handleAddSku = () => {
    setEditingSku(null);
    skuForm.resetFields();
    setSkuModalVisible(true);
  };

  const handleEditSku = (sku: MaterialSku) => {
    setEditingSku(sku);
    skuForm.setFieldsValue(sku);
    setSkuModalVisible(true);
  };

  const handleDeleteSku = (sku: MaterialSku) => {
    if (sku.supplierCount > 0) {
      Modal.warning({
        title: '无法删除',
        content: `该SKU已有${sku.supplierCount}个供应商在使用，无法删除。`,
      });
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除SKU"${sku.brand} ${sku.spec}"吗？`,
      onOk: () => {
        message.success('SKU已删除');
        fetchSkus();
      },
    });
  };

  const handleSaveSku = async () => {
    try {
      await skuForm.validateFields();
      if (editingSku) {
        message.success('SKU已更新');
      } else {
        message.success('SKU已添加');
      }
      setSkuModalVisible(false);
      fetchSkus();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 分类树组件
  const CategoryTree: React.FC = () => {
    const treeData = buildCategoryTree(categories);
    
    const renderTreeNodes = (data: Category[]): any[] =>
      data.map(item => ({
        title: (
          <div className={styles.categoryNode}>
            <span>{item.name}</span>
            <Space className={styles.categoryActions}>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(item);
                }}
              />
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(item);
                }}
              />
            </Space>
          </div>
        ),
        key: item.id,
        children: item.children ? renderTreeNodes(item.children) : undefined,
      }));

    return (
      <Card
        title="物料分类"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
            添加分类
          </Button>
        }
      >
        <Tree
          showLine
          defaultExpandAll
          treeData={renderTreeNodes(treeData)}
        />
      </Card>
    );
  };

  // 物料表格列
  const materialColumns = [
    {
      title: '物料图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url: string) => (
        <img src={url || 'https://via.placeholder.com/50'} alt="物料" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'SKU数量',
      dataIndex: 'skuCount',
      key: 'skuCount',
      align: 'center' as const,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Material) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditMaterial(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMaterial(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // SKU表格列
  const skuColumns = [
    {
      title: 'SKU图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (url: string) => (
        <img src={url || 'https://via.placeholder.com/50'} alt="SKU" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '条形码',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: '供应商数',
      dataIndex: 'supplierCount',
      key: 'supplierCount',
      align: 'center' as const,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaterialSku) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSku(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSku(record)}
            disabled={record.supplierCount > 0}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="物料管理" key="materials">
              <div className={styles.toolbar}>
                <Space>
                  <Select
                    placeholder="选择分类"
                    value={materialFilters.categoryId}
                    onChange={(value) => setMaterialFilters({ ...materialFilters, categoryId: value })}
                    style={{ width: 150 }}
                    allowClear
                  >
                    {categories.map(cat => (
                      <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                  </Select>
                  <Input
                    placeholder="物料名称"
                    value={materialFilters.keyword}
                    onChange={(e) => setMaterialFilters({ ...materialFilters, keyword: e.target.value })}
                    style={{ width: 200 }}
                  />
                  <Select
                    placeholder="状态"
                    value={materialFilters.status}
                    onChange={(value) => setMaterialFilters({ ...materialFilters, status: value })}
                    style={{ width: 100 }}
                    allowClear
                  >
                    <Option value="1">启用</Option>
                    <Option value="0">停用</Option>
                  </Select>
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={fetchMaterials}>
                    刷新
                  </Button>
                </Space>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMaterial}>
                    添加物料
                  </Button>
                  <Button icon={<UploadOutlined />}>
                    批量导入
                  </Button>
                </Space>
              </div>
              <Table
                columns={materialColumns}
                dataSource={materials}
                rowKey="id"
                loading={loading}
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
              />
            </TabPane>
            
            <TabPane tab="SKU管理" key="skus">
              <div className={styles.toolbar}>
                <Space>
                  <Select
                    placeholder="选择物料"
                    value={skuFilters.materialId}
                    onChange={(value) => setSkuFilters({ ...skuFilters, materialId: value })}
                    style={{ width: 200 }}
                    allowClear
                  >
                    {materials.map(mat => (
                      <Option key={mat.id} value={mat.id}>{mat.name}</Option>
                    ))}
                  </Select>
                  <Input
                    placeholder="品牌/规格/条码"
                    value={skuFilters.keyword}
                    onChange={(e) => setSkuFilters({ ...skuFilters, keyword: e.target.value })}
                    style={{ width: 200 }}
                  />
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={fetchSkus}>
                    刷新
                  </Button>
                </Space>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSku}>
                    添加SKU
                  </Button>
                </Space>
              </div>
              <Table
                columns={skuColumns}
                dataSource={skus}
                rowKey="id"
                loading={loading}
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
              />
            </TabPane>
            
            <TabPane tab="分类管理" key="categories">
              <CategoryTree />
            </TabPane>
          </Tabs>
        </Card>

        {/* 分类编辑模态框 */}
        <Modal
          title={editingCategory ? '编辑分类' : '添加分类'}
          visible={categoryModalVisible}
          onOk={handleSaveCategory}
          onCancel={() => setCategoryModalVisible(false)}
        >
          <Form form={categoryForm} layout="vertical">
            <Form.Item
              name="name"
              label="分类名称"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item name="parentId" label="上级分类">
              <TreeSelect
                placeholder="请选择上级分类"
                allowClear
                treeData={buildCategoryTree(categories).map(cat => ({
                  title: cat.name,
                  value: cat.id,
                  children: cat.children?.map(child => ({
                    title: child.name,
                    value: child.id,
                  })),
                }))}
              />
            </Form.Item>
            <Form.Item name="sort" label="排序" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 物料编辑模态框 */}
        <Modal
          title={editingMaterial ? '编辑物料' : '添加物料'}
          visible={materialModalVisible}
          onOk={handleSaveMaterial}
          onCancel={() => setMaterialModalVisible(false)}
        >
          <Form form={materialForm} layout="vertical">
            <Form.Item
              name="name"
              label="物料名称"
              rules={[{ required: true, message: '请输入物料名称' }]}
            >
              <Input placeholder="请输入物料名称" />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="所属分类"
              rules={[{ required: true, message: '请选择所属分类' }]}
            >
              <TreeSelect
                placeholder="请选择所属分类"
                treeData={buildCategoryTree(categories).map(cat => ({
                  title: cat.name,
                  value: cat.id,
                  children: cat.children?.map(child => ({
                    title: child.name,
                    value: child.id,
                  })),
                }))}
              />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} placeholder="请输入物料描述" />
            </Form.Item>
            <Form.Item name="imageUrl" label="物料图片">
              <Upload listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
              <Select>
                <Option value={true}>启用</Option>
                <Option value={false}>停用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* SKU编辑模态框 */}
        <Modal
          title={editingSku ? '编辑SKU' : '添加SKU'}
          visible={skuModalVisible}
          onOk={handleSaveSku}
          onCancel={() => setSkuModalVisible(false)}
        >
          <Form form={skuForm} layout="vertical">
            <Form.Item
              name="materialId"
              label="所属物料"
              rules={[{ required: true, message: '请选择所属物料' }]}
            >
              <Select placeholder="请选择所属物料">
                {materials.map(mat => (
                  <Option key={mat.id} value={mat.id}>{mat.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="brand"
              label="品牌"
              rules={[{ required: true, message: '请输入品牌' }]}
            >
              <Input placeholder="请输入品牌" />
            </Form.Item>
            <Form.Item
              name="spec"
              label="规格"
              rules={[{ required: true, message: '请输入规格' }]}
            >
              <Input placeholder="例如：500g/盒" />
            </Form.Item>
            <Form.Item
              name="unit"
              label="单位"
              rules={[{ required: true, message: '请输入单位' }]}
            >
              <Input placeholder="例如：盒、袋、斤" />
            </Form.Item>
            <Form.Item name="barcode" label="条形码">
              <Input placeholder="请输入条形码" />
            </Form.Item>
            <Form.Item name="imageUrl" label="SKU图片">
              <Upload listType="picture-card">
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={true}>
              <Select>
                <Option value={true}>启用</Option>
                <Option value={false}>停用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminMaterials;
