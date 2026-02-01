import MainLayout from '@/components/layouts/MainLayout';
import {
    ExportOutlined,
    EyeOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Descriptions, Input, message, Modal, Row, Select, Space, Table, Tag, Timeline } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styles from './orders.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Order {
  id: string;
  orderNo: string;
  storeId: number;
  storeName: string;
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
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

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    keyword: '',
    storeId: '',
    supplierId: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟数据
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
          orderNo: 'ORD20240629001',
          storeId: 1,
          storeName: '星巴克中关村店',
          supplierId: 1,
          supplierName: '北京生鲜供应商',
          totalAmount: 5678.90,
          status: 'pending',
          paymentStatus: 'unpaid',
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
          orderNo: 'ORD20240629002',
          storeId: 2,
          storeName: '麦当劳西单店',
          supplierId: 2,
          supplierName: '上海食品供应商',
          totalAmount: 3456.78,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'wechat',
          createdAt: '2024-06-29 09:30:00',
          updatedAt: '2024-06-29 09:45:00',
          items: [],
        },
        {
          id: '3',
          orderNo: 'ORD20240629003',
          storeId: 3,
          storeName: '肯德基朝阳店',
          supplierId: 3,
          supplierName: '天津蔬菜供应商',
          totalAmount: 8901.23,
          status: 'delivering',
          paymentStatus: 'paid',
          paymentMethod: 'alipay',
          createdAt: '2024-06-29 08:00:00',
          updatedAt: '2024-06-29 10:30:00',
          items: [],
        },
        {
          id: '4',
          orderNo: 'ORD20240629004',
          storeId: 4,
          storeName: '必胜客国贸店',
          supplierId: 1,
          supplierName: '北京生鲜供应商',
          totalAmount: 2345.67,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'wechat',
          createdAt: '2024-06-28 15:00:00',
          updatedAt: '2024-06-29 09:00:00',
          items: [],
        },
        {
          id: '5',
          orderNo: 'ORD20240629005',
          storeId: 5,
          storeName: '海底捞三里屯店',
          supplierId: 2,
          supplierName: '上海食品供应商',
          totalAmount: 12345.00,
          status: 'cancelled',
          paymentStatus: 'refunded',
          createdAt: '2024-06-28 14:00:00',
          updatedAt: '2024-06-28 16:00:00',
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
      storeId: '',
      supplierId: '',
    });
    fetchOrders();
  };

  const handleExport = () => {
    message.success('导出功能开发中');
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleUpdateStatus = (_orderId: string, newStatus: string) => {
    Modal.confirm({
      title: '确认操作',
      content: `确定要将订单状态更新为${getStatusText(newStatus)}吗？`,
      onOk: () => {
        message.success('订单状态已更新');
        fetchOrders();
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
      unpaid: '未支付',
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
      title: '门店',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
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
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: Order) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleUpdateStatus(record.id, 'confirmed')}
            >
              确认
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleUpdateStatus(record.id, 'delivering')}
            >
              发货
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card>
          <div className={styles.header}>
            <h2>订单管理</h2>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
                刷新
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
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
                  <Option value="unpaid">未支付</Option>
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
                  placeholder="订单号/门店/供应商"
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
            scroll={{ x: 1200 }}
          />
        </Card>

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
                <Descriptions.Item label="门店">{selectedOrder.storeName}</Descriptions.Item>
                <Descriptions.Item label="供应商">{selectedOrder.supplierName}</Descriptions.Item>
                <Descriptions.Item label="订单金额">¥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="支付状态">
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="支付方式">{selectedOrder.paymentMethod || '-'}</Descriptions.Item>
                <Descriptions.Item label="下单时间">{selectedOrder.createdAt}</Descriptions.Item>
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
                {selectedOrder.status !== 'pending' && (
                  <Timeline.Item color="blue">
                    确认订单 - {selectedOrder.updatedAt}
                  </Timeline.Item>
                )}
                {['delivering', 'delivered', 'completed'].includes(selectedOrder.status) && (
                  <Timeline.Item color="blue">
                    开始配送
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
      </div>
    </MainLayout>
  );
};

export default AdminOrders;
