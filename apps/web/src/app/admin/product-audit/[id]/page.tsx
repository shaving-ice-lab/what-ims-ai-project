'use client';

import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface ProductDetail {
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  price: number;
  supplierId: number;
  supplierName: string;
  image: string;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  isNewBrand: boolean;
  description: string;
  packageSpec: string;
}

interface PriceHistory {
  key: string;
  date: string;
  price: number;
  source: string;
}

interface SimilarProduct {
  key: string;
  name: string;
  brand: string;
  price: number;
  supplier: string;
}

export default function ProductAuditDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectForm] = Form.useForm();

  // 模拟价格历史
  const priceHistory: PriceHistory[] = [
    { key: '1', date: '2024-01-29', price: 58.0, source: '当前报价' },
    { key: '2', date: '2024-01-15', price: 56.0, source: '历史报价' },
    { key: '3', date: '2024-01-01', price: 55.0, source: '历史报价' },
  ];

  // 模拟同品牌同规格产品
  const similarProducts: SimilarProduct[] = [
    { key: '1', name: '金龙鱼大豆油', brand: '金龙鱼', price: 56.0, supplier: '粮油供应商A' },
    { key: '2', name: '金龙鱼大豆油', brand: '金龙鱼', price: 59.0, supplier: '粮油供应商C' },
  ];

  // 加载产品数据
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setProduct({
          id: Number(productId),
          name: '金龙鱼大豆油',
          brand: '金龙鱼',
          spec: '5L/桶',
          unit: '桶',
          price: 58.0,
          supplierId: 2,
          supplierName: '粮油供应商B',
          image: 'https://via.placeholder.com/200',
          submitTime: '2024-01-29 10:30:00',
          status: 'pending',
          isNewBrand: false,
          description: '金龙鱼精炼一级大豆油，适合中餐烹饪',
          packageSpec: '4桶/箱',
        });
      } catch {
        message.error('加载产品数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // 审核通过
  const handleApprove = () => {
    setProduct((prev) => (prev ? { ...prev, status: 'approved' } : null));
    message.success('审核已通过');
  };

  // 审核驳回
  const handleReject = async (_values: { reason: string }) => {
    setProduct((prev) => (prev ? { ...prev, status: 'rejected' } : null));
    message.success('已驳回');
    setRejectVisible(false);
    rejectForm.resetFields();
  };

  // 价格对比列
  const priceColumns: ColumnsType<PriceHistory> = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    { title: '来源', dataIndex: 'source', key: 'source' },
  ];

  // 同类产品列
  const similarColumns: ColumnsType<SimilarProduct> = [
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        const isLowest = price <= Math.min(...similarProducts.map((p) => p.price));
        return (
          <span style={{ color: isLowest ? '#52c41a' : undefined }}>
            ¥{price.toFixed(2)}
            {isLowest && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                最低
              </Tag>
            )}
          </span>
        );
      },
    },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
  ];

  // 价格分析
  const avgPrice = similarProducts.reduce((sum, p) => sum + p.price, 0) / similarProducts.length;
  const priceDeviation = product ? (((product.price - avgPrice) / avgPrice) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>产品不存在</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            返回列表
          </Button>
        </Space>

        <Title level={3}>产品审核详情</Title>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            {/* 产品信息 */}
            <Card title="产品信息" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                </Col>
                <Col span={16}>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="产品名称" span={2}>
                      {product.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="品牌">
                      <Space>
                        {product.brand}
                        {product.isNewBrand && <Tag color="blue">新品牌</Tag>}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="规格">{product.spec}</Descriptions.Item>
                    <Descriptions.Item label="单位">{product.unit}</Descriptions.Item>
                    <Descriptions.Item label="包装规格">{product.packageSpec}</Descriptions.Item>
                    <Descriptions.Item label="报价">
                      <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                        ¥{product.price.toFixed(2)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="供应商">{product.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="产品描述" span={2}>
                      {product.description}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* 品牌信息核实 */}
            {product.isNewBrand && (
              <Alert
                message="新品牌提醒"
                description="这是一个新品牌，请仔细核实品牌信息的真实性和合规性"
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginBottom: 24 }}
              />
            )}

            {/* 价格合理性检查 */}
            <Card title="价格合理性检查" style={{ marginBottom: 24 }}>
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Statistic title="当前报价" value={product.price} prefix="¥" precision={2} />
                </Col>
                <Col span={8}>
                  <Statistic title="市场均价" value={avgPrice} prefix="¥" precision={2} />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="价格偏差"
                    value={priceDeviation}
                    suffix="%"
                    valueStyle={{
                      color:
                        Number(priceDeviation) > 10
                          ? '#ff4d4f'
                          : Number(priceDeviation) < -10
                            ? '#52c41a'
                            : undefined,
                    }}
                  />
                </Col>
              </Row>

              <Paragraph type="secondary">历史价格对比</Paragraph>
              <Table
                dataSource={priceHistory}
                columns={priceColumns}
                pagination={false}
                size="small"
              />

              <Paragraph type="secondary" style={{ marginTop: 16 }}>
                同品牌同规格对比
              </Paragraph>
              <Table
                dataSource={similarProducts}
                columns={similarColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* 审核操作 */}
            <Card title="审核操作" style={{ marginBottom: 24 }}>
              {product.status === 'pending' ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    block
                    size="large"
                    onClick={handleApprove}
                  >
                    审核通过
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    block
                    size="large"
                    onClick={() => setRejectVisible(true)}
                  >
                    审核驳回
                  </Button>
                </Space>
              ) : (
                <Alert
                  message={product.status === 'approved' ? '审核已通过' : '审核已驳回'}
                  type={product.status === 'approved' ? 'success' : 'error'}
                  showIcon
                />
              )}
            </Card>

            {/* 审核检查清单 */}
            <Card title="审核检查清单" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color="green">✓</Tag> 产品信息完整性
                </div>
                <div>
                  <Tag color="green">✓</Tag> 品牌信息真实性
                </div>
                <div>
                  <Tag color={Number(priceDeviation) > 20 ? 'red' : 'green'}>
                    {Number(priceDeviation) > 20 ? '!' : '✓'}
                  </Tag>{' '}
                  价格合理性
                </div>
                <div>
                  <Tag color="green">✓</Tag> 图片匹配度
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 驳回弹窗 */}
        <Modal
          title="驳回产品"
          open={rejectVisible}
          onCancel={() => {
            setRejectVisible(false);
            rejectForm.resetFields();
          }}
          footer={null}
        >
          <Form form={rejectForm} layout="vertical" onFinish={handleReject}>
            <Form.Item
              name="reason"
              label="驳回原因"
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <TextArea rows={4} placeholder="请输入驳回原因" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" danger>
                  确认驳回
                </Button>
                <Button
                  onClick={() => {
                    setRejectVisible(false);
                    rejectForm.resetFields();
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
