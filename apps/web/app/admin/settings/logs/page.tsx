'use client';

import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface LogItem {
  key: string;
  id: number;
  operateTime: string;
  userName: string;
  userType: 'admin' | 'supplier' | 'store';
  module: string;
  operateType: string;
  description: string;
  ipAddress: string;
  beforeData: string | null;
  afterData: string | null;
}

export default function OperationLogsPage() {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  // 筛选条件
  const [searchUser, setSearchUser] = useState('');
  const [filterModule, setFilterModule] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟日志数据
  const logsData: LogItem[] = [
    {
      key: '1',
      id: 1,
      operateTime: '2024-01-29 14:30:25',
      userName: '管理员A',
      userType: 'admin',
      module: '加价管理',
      operateType: '新增',
      description: '新建加价规则：默认加价规则',
      ipAddress: '192.168.1.100',
      beforeData: null,
      afterData: JSON.stringify(
        { name: '默认加价规则', markupType: 'percentage', markupValue: 3 },
        null,
        2
      ),
    },
    {
      key: '2',
      id: 2,
      operateTime: '2024-01-29 14:25:10',
      userName: '管理员A',
      userType: 'admin',
      module: '系统设置',
      operateType: '修改',
      description: '修改系统参数：支付超时时间',
      ipAddress: '192.168.1.100',
      beforeData: JSON.stringify({ payment_timeout: 30 }, null, 2),
      afterData: JSON.stringify({ payment_timeout: 45 }, null, 2),
    },
    {
      key: '3',
      id: 3,
      operateTime: '2024-01-29 13:45:00',
      userName: '生鲜供应商A',
      userType: 'supplier',
      module: '物料价格',
      operateType: '修改',
      description: '修改物料价格：金龙鱼大豆油5L',
      ipAddress: '10.0.0.50',
      beforeData: JSON.stringify({ price: 56.0 }, null, 2),
      afterData: JSON.stringify({ price: 58.0 }, null, 2),
    },
    {
      key: '4',
      id: 4,
      operateTime: '2024-01-29 12:30:15',
      userName: '门店A',
      userType: 'store',
      module: '订单管理',
      operateType: '新增',
      description: '创建订单：ORD202401290001',
      ipAddress: '10.0.1.20',
      beforeData: null,
      afterData: JSON.stringify({ orderNo: 'ORD202401290001', amount: 358.0 }, null, 2),
    },
    {
      key: '5',
      id: 5,
      operateTime: '2024-01-29 11:20:00',
      userName: '管理员B',
      userType: 'admin',
      module: '用户管理',
      operateType: '删除',
      description: '禁用供应商账号：测试供应商',
      ipAddress: '192.168.1.101',
      beforeData: JSON.stringify({ status: 'active' }, null, 2),
      afterData: JSON.stringify({ status: 'inactive' }, null, 2),
    },
  ];

  // 模块选项
  const moduleOptions = [
    { value: '加价管理', label: '加价管理' },
    { value: '系统设置', label: '系统设置' },
    { value: '物料价格', label: '物料价格' },
    { value: '订单管理', label: '订单管理' },
    { value: '用户管理', label: '用户管理' },
  ];

  // 操作类型选项
  const typeOptions = [
    { value: '新增', label: '新增' },
    { value: '修改', label: '修改' },
    { value: '删除', label: '删除' },
    { value: '查询', label: '查询' },
    { value: '登录', label: '登录' },
    { value: '登出', label: '登出' },
  ];

  // 用户类型颜色
  const userTypeColors: Record<string, string> = {
    admin: 'blue',
    supplier: 'green',
    store: 'orange',
  };

  const userTypeLabels: Record<string, string> = {
    admin: '管理员',
    supplier: '供应商',
    store: '门店',
  };

  // 操作类型颜色
  const operateTypeColors: Record<string, string> = {
    新增: 'green',
    修改: 'blue',
    删除: 'red',
    查询: 'default',
    登录: 'cyan',
    登出: 'default',
  };

  // 查看详情
  const handleViewDetail = (record: LogItem) => {
    setSelectedLog(record);
    setDetailVisible(true);
  };

  // 导出日志
  const handleExport = () => {
    console.log('Exporting logs...');
  };

  // 表格列定义
  const columns: ColumnsType<LogItem> = [
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 180,
    },
    {
      title: '操作用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      key: 'userType',
      width: 100,
      render: (type: string) => <Tag color={userTypeColors[type]}>{userTypeLabels[type]}</Tag>,
    },
    {
      title: '模块名称',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      key: 'operateType',
      width: 100,
      render: (type: string) => <Tag color={operateTypeColors[type]}>{type}</Tag>,
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 130,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 过滤数据
  const filteredData = logsData.filter((item) => {
    if (searchUser && !item.userName.includes(searchUser)) return false;
    if (filterModule && item.module !== filterModule) return false;
    if (filterType && item.operateType !== filterType) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Title level={3}>操作日志</Title>
        <Paragraph type="secondary">查看系统操作日志，追踪用户行为和数据变更记录</Paragraph>

        <Card>
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={5}>
              <Input
                placeholder="搜索用户"
                prefix={<SearchOutlined />}
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="模块"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部模块' }, ...moduleOptions]}
                value={filterModule}
                onChange={setFilterModule}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="操作类型"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部类型' }, ...typeOptions]}
                value={filterType}
                onChange={setFilterType}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={7}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出日志
              </Button>
            </Col>
          </Row>

          {/* 日志表格 */}
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1100 }}
          />
        </Card>

        {/* 详情弹窗 */}
        <Modal
          title="操作详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={null}
          width={700}
        >
          {selectedLog && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="操作时间">{selectedLog.operateTime}</Descriptions.Item>
                <Descriptions.Item label="操作用户">{selectedLog.userName}</Descriptions.Item>
                <Descriptions.Item label="用户类型">
                  <Tag color={userTypeColors[selectedLog.userType]}>
                    {userTypeLabels[selectedLog.userType]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="IP地址">{selectedLog.ipAddress}</Descriptions.Item>
                <Descriptions.Item label="模块名称">{selectedLog.module}</Descriptions.Item>
                <Descriptions.Item label="操作类型">
                  <Tag color={operateTypeColors[selectedLog.operateType]}>
                    {selectedLog.operateType}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="操作描述" span={2}>
                  {selectedLog.description}
                </Descriptions.Item>
              </Descriptions>

              {(selectedLog.beforeData || selectedLog.afterData) && (
                <Row gutter={16}>
                  {selectedLog.beforeData && (
                    <Col span={12}>
                      <Card size="small" title="操作前数据">
                        <pre
                          style={{
                            background: '#fff1f0',
                            padding: 12,
                            borderRadius: 4,
                            margin: 0,
                            fontSize: 12,
                            overflow: 'auto',
                          }}
                        >
                          {selectedLog.beforeData}
                        </pre>
                      </Card>
                    </Col>
                  )}
                  {selectedLog.afterData && (
                    <Col span={selectedLog.beforeData ? 12 : 24}>
                      <Card size="small" title="操作后数据">
                        <pre
                          style={{
                            background: '#f6ffed',
                            padding: 12,
                            borderRadius: 4,
                            margin: 0,
                            fontSize: 12,
                            overflow: 'auto',
                          }}
                        >
                          {selectedLog.afterData}
                        </pre>
                      </Card>
                    </Col>
                  )}
                </Row>
              )}
            </Space>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
