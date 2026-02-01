import MainLayout from '@/components/layouts/MainLayout';
import {
    CheckCircleOutlined,
    DollarOutlined,
    EyeOutlined,
    ReloadOutlined,
    ReloadOutlined as ReorderOutlined,
    SearchOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Badge, Button, Card, Col, DatePicker, Descriptions, Input, message, Modal, Row, Select, Space, Table, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './orders.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Order {
  id: string;
  orderNo: string;
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  serviceFee: number;
  actualAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  materialName: string;
  brand: string;
  spec: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const StoreOrders: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentQRCode, setPaymentQRCode] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    keyword: '',
    supplierId: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNo: 'PO20240629001',
          supplierId: 1,
          supplierName: '北京生鲜供应商',
          totalAmount: 2345.67,
          serviceFee: 7.04,
          actualAmount: 2352.71,
          status: 'pending',
          paymentStatus: 'unpaid',
          expectedDeliveryDate: '2024-06-30',
          createdAt: '2024-06-29 10:00:00',
          updatedAt: '2024-06-29 10:00:00',
          items: [
            {
              id: 1,
              materialName: '西红柿',
              brand: '绿源',
              spec: '500g/盒',
              unit: '盒',
              quantity: 20,
              unitPrice: 8.5,
              subtotal: 170,
            },
            {
              id: 2,
              materialName: '黄瓜',
              brand: '农家',
              spec: '500g/袋',
              unit: '袋',
              quantity: 15,
              unitPrice: 6.0,
              subtotal: 90,
            },
          ],
        },
        {
          id: '2',
          orderNo: 'PO20240629002',
          supplierId: 2,
          supplierName: '上海食品供应商',
          totalAmount: 3456.78,
          serviceFee: 10.37,
          actualAmount: 3467.15,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'wechat',
          expectedDeliveryDate: '2024-06-30',
          createdAt: '2024-06-29 09:30:00',
          updatedAt: '2024-06-29 09:45:00',
          items: [],
        },
        {
          id: '3',
          orderNo: 'PO20240629003',
          supplierId: 3,
          supplierName: '天津蔬菜供应商',
          totalAmount: 1234.56,
          serviceFee: 3.70,
          actualAmount: 1238.26,
          status: 'delivering',
          paymentStatus: 'paid',
          paymentMethod: 'alipay',
          expectedDeliveryDate: '2024-06-29',
          createdAt: '2024-06-29 08:00:00',
          updatedAt: '2024-06-29 11:00:00',
          items: [],
        },
        {
          id: '4',
          orderNo: 'PO20240628001',
          supplierId: 1,
          supplierName: '北京生鲜供应商',
          totalAmount: 5678.90,
          serviceFee: 17.04,
          actualAmount: 5695.94,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'wechat',
          expectedDeliveryDate: '2024-06-28',
          actualDeliveryDate: '2024-06-28',
          createdAt: '2024-06-28 15:00:00',
          updatedAt: '2024-06-29 09:00:00',
          items: [],
        },
        {
          id: '5',
          orderNo: 'PO20240628002',
          supplierId: 2,
          supplierName: '上海食品供应商',
          totalAmount: 8901.23,
          serviceFee: 26.70,
          actualAmount: 8927.93,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'alipay',
          expectedDeliveryDate: '2024-06-27',
          actualDeliveryDate: '2024-06-27',
          createdAt: '2024-06-27 14:00:00',
          updatedAt: '2024-06-28 10:00:00',
          items: [],
        },
        {
          id: '6',
          orderNo: 'PO20240627001',
          supplierId: 1,
          supplierName: '北京生鲜供应商',
          totalAmount: 1567.89,
          serviceFee: 4.70,
          actualAmount: 1572.59,
          status: 'cancelled',
          paymentStatus: 'refunded',
          expectedDeliveryDate: '2024-06-27',
          createdAt: '2024-06-27 10:00:00',
          updatedAt: '2024-06-27 11:00:00',
          items: [],
        },
      ];
      setOrders(mockOrders);
      setPagination({ ...pagination, total: mockOrders.length });
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const handleReset = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      dateRange: null,
      keyword: '',
      supplierId: '',
    });
    fetchOrders();
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handlePay = (order: Order) => {
    // 模拟生成支付二维码
    setSelectedOrder(order);
    setPaymentQRCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxpay://pay/example');
    setPaymentModalVisible(true);
  };

  const handleConfirmReceipt = (_orderId: string) => {
    Modal.confirm({
      title: '确认收货',
      content: '确认已收到所有商品吗？确认后订单将完成。',
      onOk: () => {
        message.success('已确认收货');
        fetchOrders();
      },
    });
  };

  const handleCancelOrder = (_orderId: string) => {
    Modal.confirm({
      title: '取消订单',
      content: '确定要取消这个订单吗？',
      onOk: () => {
        message.success('订单已取消');
        fetchOrders();
      },
    });
  };

  const handleReorder = (_order: Order) => {
    Modal.confirm({
      title: '再来一单',
      content: '将把该订单的所有商品加入购物车，确定吗？',
      onOk: () => {
        message.success('商品已加入购物车');
        router.push('/store/cart');
      },
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'gold',
      confirmed: 'blue',
      delivering: 'cyan',
      delivered: 'purple',
      completed: 'green',
      cancelled: 'red',
    };
    return statusMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      delivering: '配送中',
      delivered: '已送达',
      completed: '已完成',
      cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      unpaid: 'red',
      paid: 'green',
      refunded: 'orange',
    };
    return statusMap[status] || 'default';
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      unpaid: '待支付',
      paid: '已支付',
      refunded: '已退款',
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: '订单金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '配送日期',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 120,
    },
    {
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 250,
      render: (_: any, record: Order) => (
        <Space wrap>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
          >
            详情
          </Button>
          {record.paymentStatus === 'unpaid' && (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => handlePay(record)}
            >
              支付
            </Button>
          )}
          {record.status === 'delivered' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmReceipt(record.id)}
            >
              确认收货
            </Button>
          )}
          {record.status === 'pending' && Date.now() - new Date(record.createdAt).getTime() < 3600000 && (
            <Button
              size="small"
              danger
              onClick={() => handleCancelOrder(record.id)}
            >
              取消
            </Button>
          )}
          {['completed', 'cancelled'].includes(record.status) && (
            <Button
              size="small"
              icon={<ReorderOutlined />}
              onClick={() => handleReorder(record)}
            >
              再来一单
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const stats = {
    total: orders.length,
    unpaid: orders.filter(o => o.paymentStatus === 'unpaid').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    toReceive: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  <Badge count={stats.total} showZero color="#1890ff" />
                </div>
                <div className={styles.statLabel}>全部订单</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  <Badge count={stats.unpaid} showZero color="#ff4d4f" />
                </div>
                <div className={styles.statLabel}>待支付</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  <Badge count={stats.delivering} showZero color="#faad14" />
                </div>
                <div className={styles.statLabel}>配送中</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  <Badge count={stats.toReceive} showZero color="#52c41a" />
                </div>
                <div className={styles.statLabel}>待收货</div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card>
          <div className={styles.header}>
            <h2>订单管理</h2>
            <Space>
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                onClick={() => router.push('/store/order')}
              >
                去订货
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
                刷新
              </Button>
            </Space>
          </div>

          <div className={styles.filters}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="订单状态"
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="">全部状态</Option>
                  <Option value="pending">待确认</Option>
                  <Option value="confirmed">已确认</Option>
                  <Option value="delivering">配送中</Option>
                  <Option value="delivered">已送达</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="支付状态"
                  value={filters.paymentStatus}
                  onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="">全部状态</Option>
                  <Option value="unpaid">待支付</Option>
                  <Option value="paid">已支付</Option>
                  <Option value="refunded">已退款</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filters.dateRange}
                  onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] })}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    搜索
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Space>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="订单号/供应商"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  onPressEnter={handleSearch}
                />
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            scroll={{ x: 1300 }}
          />
        </Card>

        {/* 订单详情模态框 */}
        <Modal
          title="订单详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedOrder && (
            <>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="订单号">{selectedOrder.orderNo}</Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="供应商">{selectedOrder.supplierName}</Descriptions.Item>
                <Descriptions.Item label="支付状态">
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="商品金额">¥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="服务费">¥{selectedOrder.serviceFee.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="实付金额">
                  <strong style={{ color: '#ff4d4f' }}>¥{selectedOrder.actualAmount.toFixed(2)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="支付方式">{selectedOrder.paymentMethod || '-'}</Descriptions.Item>
                <Descriptions.Item label="期望配送日期">{selectedOrder.expectedDeliveryDate}</Descriptions.Item>
                {selectedOrder.actualDeliveryDate && (
                  <Descriptions.Item label="实际送达日期">{selectedOrder.actualDeliveryDate}</Descriptions.Item>
                )}
                <Descriptions.Item label="下单时间">{selectedOrder.createdAt}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{selectedOrder.updatedAt}</Descriptions.Item>
              </Descriptions>

              {selectedOrder.items.length > 0 && (
                <>
                  <h4 style={{ marginTop: 24 }}>商品明细</h4>
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      {
                        title: '商品名称',
                        dataIndex: 'materialName',
                      },
                      {
                        title: '品牌',
                        dataIndex: 'brand',
                      },
                      {
                        title: '规格',
                        dataIndex: 'spec',
                      },
                      {
                        title: '单位',
                        dataIndex: 'unit',
                      },
                      {
                        title: '数量',
                        dataIndex: 'quantity',
                        align: 'right' as const,
                      },
                      {
                        title: '单价',
                        dataIndex: 'unitPrice',
                        align: 'right' as const,
                        render: (price: number) => `¥${price.toFixed(2)}`,
                      },
                      {
                        title: '小计',
                        dataIndex: 'subtotal',
                        align: 'right' as const,
                        render: (price: number) => `¥${price.toFixed(2)}`,
                      },
                    ]}
                  />
                </>
              )}

              <h4 style={{ marginTop: 24 }}>订单时间线</h4>
              <Timeline>
                <Timeline.Item color="green">
                  创建订单 - {selectedOrder.createdAt}
                </Timeline.Item>
                {selectedOrder.paymentStatus === 'paid' && (
                  <Timeline.Item color="green">
                    支付成功
                  </Timeline.Item>
                )}
                {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                  <Timeline.Item color="blue">
                    订单确认 - {selectedOrder.updatedAt}
                  </Timeline.Item>
                )}
                {['delivering', 'delivered', 'completed'].includes(selectedOrder.status) && (
                  <Timeline.Item color="blue">
                    开始配送
                  </Timeline.Item>
                )}
                {['delivered', 'completed'].includes(selectedOrder.status) && (
                  <Timeline.Item color="blue">
                    已送达 - {selectedOrder.actualDeliveryDate}
                  </Timeline.Item>
                )}
                {selectedOrder.status === 'completed' && (
                  <Timeline.Item color="green">
                    订单完成 - {selectedOrder.updatedAt}
                  </Timeline.Item>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <Timeline.Item color="red">
                    订单取消 - {selectedOrder.updatedAt}
                  </Timeline.Item>
                )}
              </Timeline>
            </>
          )}
        </Modal>

        {/* 支付模态框 */}
        <Modal
          title="订单支付"
          visible={paymentModalVisible}
          onCancel={() => setPaymentModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setPaymentModalVisible(false)}>
              取消
            </Button>,
          ]}
        >
          {selectedOrder && (
            <div style={{ textAlign: 'center' }}>
              <h3>订单金额：¥{selectedOrder.actualAmount.toFixed(2)}</h3>
              <p>请使用微信或支付宝扫码支付</p>
              <img src={paymentQRCode} alt="支付二维码" style={{ marginTop: 20 }} />
              <p style={{ marginTop: 20, color: '#8c8c8c' }}>
                支付完成后，请等待系统确认
              </p>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StoreOrders;
