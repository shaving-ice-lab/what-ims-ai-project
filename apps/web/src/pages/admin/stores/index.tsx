import MainLayout from '@/components/layouts/MainLayout';
import {
    EditOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    ShopOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Form, Input, message, Modal, Row, Select, Space, Switch, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './stores.module.css';

const { Option } = Select;
const { TabPane } = Tabs;

interface Store {
  id: number;
  userId: number;
  code: string;
  name: string;
  contactName: string;
  contactPhone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  status: boolean;
  markupEnabled: boolean;
  createdAt: string;
}

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    province: '',
    city: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockStores: Store[] = [
        {
          id: 1,
          userId: 201,
          code: 'STORE001',
          name: '星巴克中关村店',
          contactName: '张经理',
          contactPhone: '13800138001',
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          address: '中关村大街1号',
          status: true,
          markupEnabled: true,
          createdAt: '2024-01-15 10:00:00',
        },
        {
          id: 2,
          userId: 202,
          code: 'STORE002',
          name: '麦当劳西单店',
          contactName: '李经理',
          contactPhone: '13900139001',
          province: '北京市',
          city: '北京市',
          district: '西城区',
          address: '西单北大街1号',
          status: true,
          markupEnabled: true,
          createdAt: '2024-01-20 14:00:00',
        },
        {
          id: 3,
          userId: 203,
          code: 'STORE003',
          name: '肯德基朝阳店',
          contactName: '王经理',
          contactPhone: '13700137001',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '建国路1号',
          status: false,
          markupEnabled: false,
          createdAt: '2024-02-01 09:00:00',
        },
        {
          id: 4,
          userId: 204,
          code: 'STORE004',
          name: '必胜客国贸店',
          contactName: '赵经理',
          contactPhone: '13600136001',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '建国门外大街1号',
          status: true,
          markupEnabled: true,
          createdAt: '2024-02-10 15:00:00',
        },
      ];
      setStores(mockStores);
      setPagination({ ...pagination, total: mockStores.length });
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    fetchStores();
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      status: '',
      province: '',
      city: '',
    });
    fetchStores();
  };

  const handleAdd = () => {
    setEditingStore(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    form.setFieldsValue({
      ...store,
      status: store.status,
      markupEnabled: store.markupEnabled,
    });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      if (editingStore) {
        message.success('门店信息已更新');
      } else {
        message.success('门店已添加');
      }
      setEditModalVisible(false);
      fetchStores();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleViewDetail = (store: Store) => {
    setSelectedStore(store);
    setDetailModalVisible(true);
  };

  const handleToggleStatus = (store: Store) => {
    Modal.confirm({
      title: store.status ? '禁用门店' : '启用门店',
      content: `确定要${store.status ? '禁用' : '启用'}门店"${store.name}"吗？`,
      onOk: () => {
        message.success(`门店已${store.status ? '禁用' : '启用'}`);
        fetchStores();
      },
    });
  };

  const handleDelete = (store: Store) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除门店"${store.name}"吗？删除后将无法恢复。`,
      onOk: () => {
        message.success('门店已删除');
        fetchStores();
      },
    });
  };

  const columns = [
    {
      title: '门店编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => (
        <Space>
          <ShopOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '地区',
      key: 'area',
      width: 200,
      render: (_: any, record: Store) => (
        <Space>
          <EnvironmentOutlined />
          {record.province} {record.city} {record.district}
        </Space>
      ),
    },
    {
      title: '加价开关',
      dataIndex: 'markupEnabled',
      key: 'markupEnabled',
      width: 100,
      align: 'center' as const,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'default'}>
          {enabled ? '已开启' : '已关闭'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: Store) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.status ? '禁用' : '启用'}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 获取省份列表
  const provinces = Array.from(new Set(stores.map(s => s.province)));
  const cities = filters.province 
    ? Array.from(new Set(stores.filter(s => s.province === filters.province).map(s => s.city)))
    : [];

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card>
          <div className={styles.header}>
            <h2>门店管理</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加门店
            </Button>
          </div>

          <div className={styles.filters}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="门店名称/编码/联系人"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="选择省份"
                  value={filters.province}
                  onChange={(value) => setFilters({ ...filters, province: value, city: '' })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {provinces.map(province => (
                    <Option key={province} value={province}>{province}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="选择城市"
                  value={filters.city}
                  onChange={(value) => setFilters({ ...filters, city: value })}
                  style={{ width: '100%' }}
                  disabled={!filters.province}
                  allowClear
                >
                  {cities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    搜索
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button icon={<ReloadOutlined />} onClick={fetchStores}>
                    刷新
                  </Button>
                </Space>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="状态"
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="">全部</Option>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={stores}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>

        {/* 详情模态框 */}
        <Modal
          title="门店详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedStore && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="门店编码">{selectedStore.code}</Descriptions.Item>
                  <Descriptions.Item label="门店名称">{selectedStore.name}</Descriptions.Item>
                  <Descriptions.Item label="联系人">
                    <Space>
                      <UserOutlined />
                      {selectedStore.contactName}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="联系电话">
                    <Space>
                      <PhoneOutlined />
                      {selectedStore.contactPhone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="所在省份">{selectedStore.province}</Descriptions.Item>
                  <Descriptions.Item label="所在城市">{selectedStore.city}</Descriptions.Item>
                  <Descriptions.Item label="所在区县">{selectedStore.district}</Descriptions.Item>
                  <Descriptions.Item label="详细地址">{selectedStore.address}</Descriptions.Item>
                  <Descriptions.Item label="加价开关">
                    <Tag color={selectedStore.markupEnabled ? 'green' : 'default'}>
                      {selectedStore.markupEnabled ? '已开启' : '已关闭'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={selectedStore.status ? 'green' : 'red'}>
                      {selectedStore.status ? '启用' : '禁用'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间" span={2}>{selectedStore.createdAt}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              
              <TabPane tab="订单统计" key="2">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>156</div>
                        <div>总订单数</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>¥125,678</div>
                        <div>总订单金额</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>23</div>
                        <div>本月订单数</div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>¥28,456</div>
                        <div>本月订单金额</div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          )}
        </Modal>

        {/* 编辑模态框 */}
        <Modal
          title={editingStore ? '编辑门店' : '添加门店'}
          visible={editModalVisible}
          onOk={handleSave}
          onCancel={() => setEditModalVisible(false)}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="门店编码"
                  rules={[
                    { required: true, message: '请输入门店编码' },
                    { pattern: /^[A-Z0-9]+$/, message: '门店编码只能包含大写字母和数字' },
                  ]}
                >
                  <Input placeholder="请输入门店编码" disabled={editingStore !== null} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="门店名称"
                  rules={[{ required: true, message: '请输入门店名称' }]}
                >
                  <Input placeholder="请输入门店名称" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contactName"
                  label="联系人"
                  rules={[{ required: true, message: '请输入联系人' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                  ]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="province"
                  label="省份"
                  rules={[{ required: true, message: '请选择省份' }]}
                >
                  <Select placeholder="请选择省份">
                    <Option value="北京市">北京市</Option>
                    <Option value="上海市">上海市</Option>
                    <Option value="天津市">天津市</Option>
                    <Option value="重庆市">重庆市</Option>
                    <Option value="广东省">广东省</Option>
                    <Option value="江苏省">江苏省</Option>
                    <Option value="浙江省">浙江省</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="city"
                  label="城市"
                  rules={[{ required: true, message: '请选择城市' }]}
                >
                  <Select placeholder="请选择城市">
                    <Option value="北京市">北京市</Option>
                    <Option value="上海市">上海市</Option>
                    <Option value="天津市">天津市</Option>
                    <Option value="重庆市">重庆市</Option>
                    <Option value="广州市">广州市</Option>
                    <Option value="深圳市">深圳市</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="district"
                  label="区县"
                  rules={[{ required: true, message: '请输入区县' }]}
                >
                  <Input placeholder="请输入区县" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="详细地址"
              rules={[{ required: true, message: '请输入详细地址' }]}
            >
              <Input placeholder="请输入详细地址" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="状态"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="markupEnabled"
                  label="加价开关"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>

            {!editingStore && (
              <Form.Item>
                <div style={{ padding: 16, background: '#e6f7ff', borderRadius: 4 }}>
                  <p style={{ margin: 0 }}>
                    <strong>提示：</strong>创建门店后，系统将自动生成登录账号并发送给门店联系人。
                  </p>
                </div>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminStores;
