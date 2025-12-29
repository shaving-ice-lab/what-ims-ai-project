import MainLayout from '@/components/layouts/MainLayout';
import {
    CheckCircleOutlined,
    EyeOutlined,
    PrinterOutlined,
    ReloadOutlined,
    SearchOutlined,
    TruckOutlined
} from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Descriptions, Divider, Input, message, Modal, Row, Select, Space, Steps, Table, Tag } from 'antd';
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
  storeAddress: string;
  storeContact: string;
  storePhone: string;
  totalAmount: number;
  status: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  remark?: string;
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

const SupplierOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
    keyword: '',
    storeId: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 统计数据
  const [stats] = useState({
    pending: 3,
    confirmed: 5,
    delivering: 2,
    completed: 45,
    todayAmount: 12345.67,
    monthAmount: 156789.00,
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
          orderNo: 'SO20240629001',
          storeId: 1,
          storeName: '星巴克中关村店',
          storeAddress: '北京市海淀区中关村大街1号',
          storeContact: '张经理',
          storePhone: '13800138001',
          totalAmount: 3456.78,
          status: 'pending',
          expectedDeliveryDate: '2024-06-30',
          remark: '请按时送达',
          createdAt: '2024-06-29 10:00:00',
          updatedAt: '2024-06-29 10:00:00',
          items: [
            {
              id: 1,
              materialName: '西红柿',
              brand: '绿源',
              spec: '500g/盒',
              unit: '盒',
              quantity: 30,
              unitPrice: 8.5,
              subtotal: 255,
            },
            {
              id: 2,
              materialName: '黄瓜',
              brand: '农家',
              spec: '500g/袋',
              unit: '袋',
              quantity: 25,
              unitPrice: 6.0,
              subtotal: 150,
            },
            {
              id: 3,
              materialName: '生菜',
              brand: '有机农场',
              spec: '300g/袋',
              unit: '袋',
              quantity: 20,
              unitPrice: 5.5,
              subtotal: 110,
            },
          ],
        },
        {
          id: '2',
          orderNo: 'SO20240629002',
          storeId: 2,
          storeName: '麦当劳西单店',
          storeAddress: '北京市西城区西单北大街1号',
          storeContact: '李经理',
          storePhone: '13900139001',
          totalAmount: 2345.67,
          status: 'confirmed',
          expectedDeliveryDate: '2024-06-30',
          createdAt: '2024-06-29 09:30:00',
          updatedAt: '2024-06-29 09:45:00',
          items: [],
        },
        {
          id: '3',
          orderNo: 'SO20240629003',
          storeId: 3,
          storeName: '肯德基朝阳店',
          storeAddress: '北京市朝阳区建国路1号',
          storeContact: '王经理',
          storePhone: '13700137001',
          totalAmount: 4567.89,
          status: 'delivering',
          expectedDeliveryDate: '2024-06-29',
          actualDeliveryDate: '2024-06-29',
          createdAt: '2024-06-29 08:00:00',
          updatedAt: '2024-06-29 11:00:00',
          items: [],
        },
        {
          id: '4',
          orderNo: 'SO20240628001',
          storeId: 4,
          storeName: '必胜客国贸店',
          storeAddress: '北京市朝阳区建国门外大街1号',
          storeContact: '赵经理',
          storePhone: '13600136001',
          totalAmount: 1234.56,
          status: 'completed',
          expectedDeliveryDate: '2024-06-28',
          actualDeliveryDate: '2024-06-28',
          createdAt: '2024-06-28 15:00:00',
          updatedAt: '2024-06-28 18:00:00',
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
      dateRange: null,
      keyword: '',
      storeId: '',
    });
    fetchOrders();
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleConfirmOrder = (_orderId: string) => {
    Modal.confirm({
      title: '确认订单',
      content: '确定要确认这个订单吗？确认后将开始准备配送。',
      onOk: () => {
        message.success('订单已确认');
        fetchOrders();
      },
    });
  };

  const handleStartDelivery = (_orderId: string) => {
    Modal.confirm({
      title: '开始配送',
      content: '确定要开始配送这个订单吗？',
      onOk: () => {
        message.success('已开始配送');
        fetchOrders();
      },
    });
  };

  const handleCompleteDelivery = (_orderId: string) => {
    Modal.confirm({
      title: '完成配送',
      content: '确定已完成配送吗？',
      onOk: () => {
        message.success('配送已完成');
        fetchOrders();
      },
    });
  };

  const handlePrintDeliveryNote = (order: Order) => {
    message.info(`打印送货单: ${order.orderNo}`);
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

  const getStatusStep = (status: string) => {
    const statusSteps: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      delivering: 2,
      delivered: 3,
      completed: 3,
      cancelled: -1,
    };
    return statusSteps[status] || 0;
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
      width: 180,
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
      title: '配送日期',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 120,
    },
    {
      title: '状态',
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
      title: '下单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 280,
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
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmOrder(record.id)}
            >
              确认
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button
              type="primary"
              size="small"
              icon={<TruckOutlined />}
              onClick={() => handleStartDelivery(record.id)}
            >
              配送
            </Button>
          )}
          {record.status === 'delivering' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleCompleteDelivery(record.id)}
            >
              完成
            </Button>
          )}
          {['confirmed', 'delivering'].includes(record.status) && (
            <Button
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => handlePrintDeliveryNote(record)}
            >
              打印
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber} style={{ color: '#faad14' }}>
                  {stats.pending}
                </div>
                <div className={styles.statLabel}>待处理订单</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber} style={{ color: '#1890ff' }}>
                  {stats.confirmed}
                </div>
                <div className={styles.statLabel}>待配送订单</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  ¥{stats.todayAmount.toFixed(2)}
                </div>
                <div className={styles.statLabel}>今日销售额</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  ¥{stats.monthAmount.toFixed(2)}
                </div>
                <div className={styles.statLabel}>本月销售额</div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card>
          <div className={styles.header}>
            <h2>订单管理</h2>
            <Space>
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
                  <Option value="completed">已完成</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={filters.dateRange}
                  onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] })}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="订单号/门店名称"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  onPressEnter={handleSearch}
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
          width={900}
        >
          {selectedOrder && (
            <>
              <Steps 
                current={getStatusStep(selectedOrder.status)} 
                style={{ marginBottom: 24 }}
                items={[
                  { title: '订单创建' },
                  { title: '确认订单' },
                  { title: '配送中' },
                  { title: '已完成' },
                ]}
              />

              <Descriptions bordered column={2}>
                <Descriptions.Item label="订单号">{selectedOrder.orderNo}</Descriptions.Item>
                <Descriptions.Item label="订单状态">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="门店名称">{selectedOrder.storeName}</Descriptions.Item>
                <Descriptions.Item label="联系人">{selectedOrder.storeContact}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{selectedOrder.storePhone}</Descriptions.Item>
                <Descriptions.Item label="配送地址" span={2}>
                  {selectedOrder.storeAddress}
                </Descriptions.Item>
                <Descriptions.Item label="订单金额">¥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="期望送达日期">{selectedOrder.expectedDeliveryDate}</Descriptions.Item>
                {selectedOrder.actualDeliveryDate && (
                  <Descriptions.Item label="实际送达日期">{selectedOrder.actualDeliveryDate}</Descriptions.Item>
                )}
                <Descriptions.Item label="下单时间">{selectedOrder.createdAt}</Descriptions.Item>
                {selectedOrder.remark && (
                  <Descriptions.Item label="备注" span={2}>{selectedOrder.remark}</Descriptions.Item>
                )}
              </Descriptions>

              {selectedOrder.items.length > 0 && (
                <>
                  <Divider />
                  <h4>商品明细</h4>
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="id"
                    pagination={false}
                    summary={(pageData) => {
                      let totalQuantity = 0;
                      let totalAmount = 0;
                      pageData.forEach(({ quantity, subtotal }) => {
                        totalQuantity += quantity;
                        totalAmount += subtotal;
                      });
                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={4}>
                            <strong>合计</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} align="right">
                            <strong>{totalQuantity}</strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}></Table.Summary.Cell>
                          <Table.Summary.Cell index={3} align="right">
                            <strong>¥{totalAmount.toFixed(2)}</strong>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      );
                    }}
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

              <Divider />
              <div style={{ textAlign: 'right' }}>
                {selectedOrder.status === 'pending' && (
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        handleConfirmOrder(selectedOrder.id);
                        setDetailModalVisible(false);
                      }}
                    >
                      确认订单
                    </Button>
                  </Space>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <Space>
                    <Button
                      icon={<PrinterOutlined />}
                      onClick={() => handlePrintDeliveryNote(selectedOrder)}
                    >
                      打印送货单
                    </Button>
                    <Button
                      type="primary"
                      icon={<TruckOutlined />}
                      onClick={() => {
                        handleStartDelivery(selectedOrder.id);
                        setDetailModalVisible(false);
                      }}
                    >
                      开始配送
                    </Button>
                  </Space>
                )}
                {selectedOrder.status === 'delivering' && (
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleCompleteDelivery(selectedOrder.id);
                        setDetailModalVisible(false);
                      }}
                    >
                      完成配送
                    </Button>
                  </Space>
                )}
              </div>
            </>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default SupplierOrders;
