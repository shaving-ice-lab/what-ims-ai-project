import MainLayout from '@/components/layouts/MainLayout';
import {
    EditOutlined,
    ExclamationCircleOutlined,
    KeyOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Form, Input, InputNumber, message, Modal, Row, Select, Space, Switch, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './suppliers.module.css';

const { Option } = Select;
const { TabPane } = Tabs;

interface Supplier {
  id: number;
  userId: number;
  name: string;
  displayName: string;
  contactName: string;
  contactPhone: string;
  address: string;
  status: boolean;
  managementMode: string;
  markupEnabled: boolean;
  webhookUrl?: string;
  webhookEnabled: boolean;
  apiUrl?: string;
  apiKey?: string;
  minOrderAmount: number;
  deliveryDays: string[];
  createdAt: string;
}

interface DeliveryArea {
  id: number;
  supplierId: number;
  province: string;
  city: string;
  district?: string;
}

const AdminSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    managementMode: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockSuppliers: Supplier[] = [
        {
          id: 1,
          userId: 101,
          name: '北京生鲜供应商',
          displayName: '优质生鲜供应',
          contactName: '张经理',
          contactPhone: '13800138001',
          address: '北京市朝阳区农贸市场A区',
          status: true,
          managementMode: 'self',
          markupEnabled: true,
          webhookUrl: 'https://api.supplier.com/webhook',
          webhookEnabled: true,
          apiUrl: 'https://api.supplier.com',
          apiKey: 'sk-1234567890',
          minOrderAmount: 500,
          deliveryDays: ['1', '3', '5'],
          createdAt: '2024-01-15 10:00:00',
        },
        {
          id: 2,
          userId: 102,
          name: '上海食品供应商',
          displayName: '上海食品供应商',
          contactName: '李经理',
          contactPhone: '13900139001',
          address: '上海市浦东新区食品城B座',
          status: true,
          managementMode: 'platform',
          markupEnabled: true,
          webhookEnabled: false,
          minOrderAmount: 300,
          deliveryDays: ['2', '4', '6'],
          createdAt: '2024-01-20 14:00:00',
        },
        {
          id: 3,
          userId: 103,
          name: '天津蔬菜供应商',
          displayName: '新鲜蔬菜直供',
          contactName: '王经理',
          contactPhone: '13700137001',
          address: '天津市西青区蔬菜批发市场',
          status: false,
          managementMode: 'self',
          markupEnabled: false,
          webhookEnabled: false,
          minOrderAmount: 200,
          deliveryDays: ['1', '2', '3', '4', '5'],
          createdAt: '2024-02-01 09:00:00',
        },
      ];
      setSuppliers(mockSuppliers);
      setPagination({ ...pagination, total: mockSuppliers.length });
      setLoading(false);
    }, 500);
  };

  const fetchDeliveryAreas = (supplierId: number) => {
    // 模拟API调用
    const mockAreas: DeliveryArea[] = [
      { id: 1, supplierId, province: '北京市', city: '北京市', district: '朝阳区' },
      { id: 2, supplierId, province: '北京市', city: '北京市', district: '海淀区' },
      { id: 3, supplierId, province: '天津市', city: '天津市', district: '和平区' },
    ];
    setDeliveryAreas(mockAreas);
  };

  const handleSearch = () => {
    fetchSuppliers();
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      status: '',
      managementMode: '',
    });
    fetchSuppliers();
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue({
      ...supplier,
      status: supplier.status,
      webhookEnabled: supplier.webhookEnabled,
      markupEnabled: supplier.markupEnabled,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (_supplier: Supplier) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除供应商"${_supplier.name}"吗？删除后将无法恢复。`,
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        message.success('供应商已删除');
        fetchSuppliers();
      },
    });
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      if (editingSupplier) {
        message.success('供应商信息已更新');
      } else {
        message.success('供应商已添加');
      }
      setEditModalVisible(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleViewDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    fetchDeliveryAreas(supplier.id);
    setDetailModalVisible(true);
  };

  const handleToggleStatus = (supplier: Supplier) => {
    Modal.confirm({
      title: supplier.status ? '禁用供应商' : '启用供应商',
      content: `确定要${supplier.status ? '禁用' : '启用'}供应商"${supplier.name}"吗？`,
      onOk: () => {
        message.success(`供应商已${supplier.status ? '禁用' : '启用'}`);
        fetchSuppliers();
      },
    });
  };

  const handleRegenerateApiKey = (_supplier: Supplier) => {
    Modal.confirm({
      title: '重新生成API密钥',
      content: '确定要重新生成API密钥吗？原密钥将立即失效。',
      icon: <KeyOutlined />,
      onOk: () => {
        message.success('API密钥已重新生成');
        // 显示新密钥
        Modal.info({
          title: '新的API密钥',
          content: (
            <div>
              <p>请妥善保管新的API密钥，此密钥仅显示一次：</p>
              <Input.Password value="sk-new-1234567890" readOnly />
            </div>
          ),
        });
      },
    });
  };

  const handleTestWebhook = (_supplier: Supplier) => {
    message.loading('正在测试Webhook...', 2).then(() => {
      message.success('Webhook测试成功');
    });
  };

  const getManagementModeText = (mode: string) => {
    const modeMap: Record<string, string> = {
      self: '自主管理',
      platform: '平台代管',
      webhook: 'Webhook对接',
      api: 'API对接',
    };
    return modeMap[mode] || mode;
  };

  const getManagementModeColor = (mode: string) => {
    const colorMap: Record<string, string> = {
      self: 'blue',
      platform: 'green',
      webhook: 'orange',
      api: 'purple',
    };
    return colorMap[mode] || 'default';
  };

  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 200,
      render: (text: string, record: Supplier) => (
        <span style={{ color: text !== record.name ? '#1890ff' : undefined }}>
          {text}
        </span>
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
      title: '管理模式',
      dataIndex: 'managementMode',
      key: 'managementMode',
      width: 120,
      render: (mode: string) => (
        <Tag color={getManagementModeColor(mode)}>
          {getManagementModeText(mode)}
        </Tag>
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
      render: (_: any, record: Supplier) => (
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
          {record.managementMode === 'platform' && (
            <Button
              type="link"
              size="small"
            >
              代管
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
            <h2>供应商管理</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加供应商
            </Button>
          </div>

          <div className={styles.filters}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="供应商名称/联系人"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="管理模式"
                  value={filters.managementMode}
                  onChange={(value) => setFilters({ ...filters, managementMode: value })}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="">全部</Option>
                  <Option value="self">自主管理</Option>
                  <Option value="platform">平台代管</Option>
                  <Option value="webhook">Webhook对接</Option>
                  <Option value="api">API对接</Option>
                </Select>
              </Col>
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
              <Col xs={24} sm={12} md={6}>
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    搜索
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button icon={<ReloadOutlined />} onClick={fetchSuppliers}>
                    刷新
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          <Table
            columns={columns}
            dataSource={suppliers}
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
          title="供应商详情"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedSupplier && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="供应商名称">{selectedSupplier.name}</Descriptions.Item>
                  <Descriptions.Item label="显示名称">
                    <span style={{ color: selectedSupplier.displayName !== selectedSupplier.name ? '#1890ff' : undefined }}>
                      {selectedSupplier.displayName}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="联系人">{selectedSupplier.contactName}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{selectedSupplier.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="地址" span={2}>{selectedSupplier.address}</Descriptions.Item>
                  <Descriptions.Item label="管理模式">
                    <Tag color={getManagementModeColor(selectedSupplier.managementMode)}>
                      {getManagementModeText(selectedSupplier.managementMode)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="加价开关">
                    <Tag color={selectedSupplier.markupEnabled ? 'green' : 'default'}>
                      {selectedSupplier.markupEnabled ? '已开启' : '已关闭'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={selectedSupplier.status ? 'green' : 'red'}>
                      {selectedSupplier.status ? '启用' : '禁用'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">{selectedSupplier.createdAt}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              
              <TabPane tab="配送设置" key="2">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="起送价">¥{selectedSupplier.minOrderAmount}</Descriptions.Item>
                  <Descriptions.Item label="配送日">
                    {selectedSupplier.deliveryDays.map(day => {
                      const dayMap: Record<string, string> = {
                        '1': '周一', '2': '周二', '3': '周三', '4': '周四',
                        '5': '周五', '6': '周六', '7': '周日',
                      };
                      return dayMap[day] || day;
                    }).join('、')}
                  </Descriptions.Item>
                </Descriptions>
                
                <h4 style={{ marginTop: 16 }}>配送区域</h4>
                <Table
                  dataSource={deliveryAreas}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: '省份', dataIndex: 'province' },
                    { title: '城市', dataIndex: 'city' },
                    { title: '区县', dataIndex: 'district' },
                  ]}
                />
              </TabPane>
              
              {(selectedSupplier.managementMode === 'webhook' || selectedSupplier.managementMode === 'api') && (
                <TabPane tab="对接配置" key="3">
                  {selectedSupplier.managementMode === 'webhook' && (
                    <>
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="Webhook URL">
                          {selectedSupplier.webhookUrl}
                        </Descriptions.Item>
                        <Descriptions.Item label="Webhook状态">
                          <Tag color={selectedSupplier.webhookEnabled ? 'green' : 'default'}>
                            {selectedSupplier.webhookEnabled ? '已启用' : '已禁用'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                      <div style={{ marginTop: 16 }}>
                        <Button 
                          type="primary" 
                          icon={<GlobalOutlined />}
                          onClick={() => handleTestWebhook(selectedSupplier)}
                        >
                          测试Webhook
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {selectedSupplier.managementMode === 'api' && (
                    <>
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="API地址">
                          {selectedSupplier.apiUrl}
                        </Descriptions.Item>
                        <Descriptions.Item label="API密钥">
                          <Input.Password value={selectedSupplier.apiKey} readOnly style={{ width: 300 }} />
                          <Button
                            type="link"
                            icon={<KeyOutlined />}
                            onClick={() => handleRegenerateApiKey(selectedSupplier)}
                          >
                            重新生成
                          </Button>
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  )}
                </TabPane>
              )}
            </Tabs>
          )}
        </Modal>

        {/* 编辑模态框 */}
        <Modal
          title={editingSupplier ? '编辑供应商' : '添加供应商'}
          visible={editModalVisible}
          onOk={handleSave}
          onCancel={() => setEditModalVisible(false)}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="供应商名称"
                  rules={[{ required: true, message: '请输入供应商名称' }]}
                >
                  <Input placeholder="请输入供应商名称" disabled={editingSupplier !== null} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="displayName"
                  label="显示名称"
                  tooltip="门店端显示的名称，可与真实名称不同"
                  rules={[{ required: true, message: '请输入显示名称' }]}
                >
                  <Input placeholder="请输入显示名称" />
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

            <Form.Item
              name="address"
              label="地址"
              rules={[{ required: true, message: '请输入地址' }]}
            >
              <Input placeholder="请输入详细地址" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="managementMode"
                  label="管理模式"
                  rules={[{ required: true, message: '请选择管理模式' }]}
                >
                  <Select placeholder="请选择管理模式">
                    <Option value="self">自主管理</Option>
                    <Option value="platform">平台代管</Option>
                    <Option value="webhook">Webhook对接</Option>
                    <Option value="api">API对接</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="minOrderAmount"
                  label="起送价"
                  rules={[{ required: true, message: '请输入起送价' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    placeholder="请输入起送价"
                    addonAfter="元"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="deliveryDays"
                  label="配送日"
                  rules={[{ required: true, message: '请选择配送日' }]}
                >
                  <Select mode="multiple" placeholder="请选择配送日">
                    <Option value="1">周一</Option>
                    <Option value="2">周二</Option>
                    <Option value="3">周三</Option>
                    <Option value="4">周四</Option>
                    <Option value="5">周五</Option>
                    <Option value="6">周六</Option>
                    <Option value="7">周日</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

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

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.managementMode !== currentValues.managementMode
              }
            >
              {({ getFieldValue }) => {
                const mode = getFieldValue('managementMode');
                if (mode === 'webhook') {
                  return (
                    <>
                      <Form.Item
                        name="webhookUrl"
                        label="Webhook URL"
                        rules={[{ required: true, message: '请输入Webhook URL' }]}
                      >
                        <Input placeholder="https://example.com/webhook" />
                      </Form.Item>
                      <Form.Item
                        name="webhookEnabled"
                        label="启用Webhook"
                        valuePropName="checked"
                      >
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                      </Form.Item>
                    </>
                  );
                } else if (mode === 'api') {
                  return (
                    <Form.Item
                      name="apiUrl"
                      label="API地址"
                      rules={[{ required: true, message: '请输入API地址' }]}
                    >
                      <Input placeholder="https://api.example.com" />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>

            {!editingSupplier && (
              <Alert
                message="提示"
                description="创建供应商后，系统将自动生成登录账号并发送给供应商。"
                type="info"
                showIcon
              />
            )}
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminSuppliers;
