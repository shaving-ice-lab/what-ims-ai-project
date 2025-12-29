'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InboxOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

interface MediaItem {
  id: number;
  url: string;
  name: string;
  category: string;
  brand: string;
  spec: string;
  tags: string[];
  skuCodes: string[];
  size: number;
  uploadTime: string;
}

export default function MediaLibraryPage() {
  const [loading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editForm] = Form.useForm();

  // 筛选条件
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  // 分类选项
  const categoryOptions = [
    { value: '粮油', label: '粮油' },
    { value: '调味品', label: '调味品' },
    { value: '生鲜', label: '生鲜' },
    { value: '饮料', label: '饮料' },
    { value: '其他', label: '其他' },
  ];

  // 品牌选项
  const brandOptions = [
    { value: '金龙鱼', label: '金龙鱼' },
    { value: '福临门', label: '福临门' },
    { value: '海天', label: '海天' },
    { value: '太太乐', label: '太太乐' },
    { value: '中粮', label: '中粮' },
  ];

  // 模拟图片数据
  const [mediaData, setMediaData] = useState<MediaItem[]>([
    {
      id: 1,
      url: 'https://via.placeholder.com/200',
      name: '金龙鱼大豆油',
      category: '粮油',
      brand: '金龙鱼',
      spec: '5L',
      tags: ['食用油', '大豆油'],
      skuCodes: ['SKU001', 'SKU002'],
      size: 125000,
      uploadTime: '2024-01-20',
    },
    {
      id: 2,
      url: 'https://via.placeholder.com/200',
      name: '海天酱油',
      category: '调味品',
      brand: '海天',
      spec: '500ml',
      tags: ['酱油', '调味'],
      skuCodes: ['SKU003'],
      size: 89000,
      uploadTime: '2024-01-21',
    },
    {
      id: 3,
      url: 'https://via.placeholder.com/200',
      name: '福临门花生油',
      category: '粮油',
      brand: '福临门',
      spec: '5L',
      tags: ['食用油', '花生油'],
      skuCodes: ['SKU004'],
      size: 156000,
      uploadTime: '2024-01-22',
    },
    {
      id: 4,
      url: 'https://via.placeholder.com/200',
      name: '太太乐鸡精',
      category: '调味品',
      brand: '太太乐',
      spec: '200g',
      tags: ['调味', '鸡精'],
      skuCodes: [],
      size: 45000,
      uploadTime: '2024-01-23',
    },
  ]);

  // 预览图片
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // 编辑图片信息
  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    editForm.setFieldsValue(item);
    setEditVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = async (values: Partial<MediaItem>) => {
    if (!editingItem) return;
    setMediaData((prev) =>
      prev.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item))
    );
    message.success('图片信息已更新');
    setEditVisible(false);
    editForm.resetFields();
  };

  // 删除图片
  const handleDelete = (id: number) => {
    setMediaData((prev) => prev.filter((item) => item.id !== id));
    message.success('图片已删除');
  };

  // 批量删除
  const handleBatchDelete = () => {
    setMediaData((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    message.success(`已删除 ${selectedItems.length} 张图片`);
  };

  // 选择/取消选择
  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    }
  };

  // 上传处理
  const handleUpload = (info: { fileList: UploadFile[] }) => {
    if (info.fileList.length > 0) {
      message.success(`已上传 ${info.fileList.length} 张图片`);
      setUploadVisible(false);
    }
  };

  // 过滤数据
  const filteredData = mediaData.filter((item) => {
    if (
      searchText &&
      !item.name.includes(searchText) &&
      !item.tags.some((t) => t.includes(searchText))
    ) {
      return false;
    }
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterBrand && item.brand !== filterBrand) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Title level={3}>图片素材库</Title>
        <Paragraph type="secondary">管理商品图片素材，支持按分类、品牌筛选和批量操作</Paragraph>

        <Card>
          {/* 工具栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="搜索名称或标签"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="分类筛选"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部分类' }, ...categoryOptions]}
                value={filterCategory}
                onChange={setFilterCategory}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="品牌筛选"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部品牌' }, ...brandOptions]}
                value={filterBrand}
                onChange={setFilterBrand}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Space>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadVisible(true)}
                >
                  批量上传
                </Button>
                {selectedItems.length > 0 && (
                  <Button danger onClick={handleBatchDelete}>
                    删除选中 ({selectedItems.length})
                  </Button>
                )}
              </Space>
            </Col>
          </Row>

          {/* 图片网格 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
            </div>
          ) : filteredData.length === 0 ? (
            <Empty description="暂无图片" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredData.map((item) => (
                <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                  <Card
                    hoverable
                    size="small"
                    cover={
                      <div style={{ position: 'relative' }}>
                        <Image
                          src={item.url}
                          alt={item.name}
                          height={120}
                          style={{ objectFit: 'cover', width: '100%' }}
                          preview={false}
                          onClick={() => handlePreview(item.url)}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        />
                        <div style={{ position: 'absolute', top: 4, left: 4 }}>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => handleSelect(item.id, e.target.checked)}
                          />
                        </div>
                      </div>
                    }
                    actions={[
                      <EyeOutlined key="view" onClick={() => handlePreview(item.url)} />,
                      <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
                      <DeleteOutlined key="delete" onClick={() => handleDelete(item.id)} />,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Text ellipsis style={{ fontSize: 12 }}>
                          {item.name}
                        </Text>
                      }
                      description={
                        <Space size={4} wrap>
                          <Tag color="blue" style={{ fontSize: 10 }}>
                            {item.category}
                          </Tag>
                          <Tag style={{ fontSize: 10 }}>{item.brand}</Tag>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* 图片预览 */}
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: previewVisible,
            src: previewImage,
            onVisibleChange: (visible) => setPreviewVisible(visible),
          }}
        />

        {/* 上传弹窗 */}
        <Modal
          title="批量上传图片"
          open={uploadVisible}
          onCancel={() => setUploadVisible(false)}
          footer={null}
          width={600}
        >
          <Dragger multiple accept="image/*" beforeUpload={() => false} onChange={handleUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">支持批量上传，支持 jpg、png、gif 格式</p>
          </Dragger>
        </Modal>

        {/* 编辑弹窗 */}
        <Modal
          title="编辑图片信息"
          open={editVisible}
          onCancel={() => {
            setEditVisible(false);
            editForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form form={editForm} layout="vertical" onFinish={handleSaveEdit}>
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
              <Input placeholder="请输入图片名称" />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Select options={categoryOptions} placeholder="请选择分类" />
            </Form.Item>
            <Form.Item name="brand" label="品牌">
              <Select options={brandOptions} placeholder="请选择品牌" allowClear />
            </Form.Item>
            <Form.Item name="spec" label="规格">
              <Input placeholder="请输入规格" />
            </Form.Item>
            <Form.Item name="tags" label="标签">
              <Select mode="tags" placeholder="输入标签后按回车添加" />
            </Form.Item>
            <Form.Item name="skuCodes" label="关联SKU编码">
              <Select mode="tags" placeholder="输入SKU编码后按回车添加" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button
                  onClick={() => {
                    setEditVisible(false);
                    editForm.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
