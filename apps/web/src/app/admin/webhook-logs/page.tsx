'use client';

import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface WebhookLogItem {
  key: string;
  id: number;
  pushTime: string;
  targetType: 'store' | 'supplier';
  targetName: string;
  eventType: string;
  orderId: string | null;
  status: 'success' | 'failed' | 'pending';
  responseCode: number | null;
  duration: number;
  requestBody: string;
  responseBody: string;
  retryCount: number;
}

export default function WebhookLogsPage() {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLogItem | null>(null);

  // 筛选条件
  const [filterTargetType, setFilterTargetType] = useState<string | null>(null);
  const [filterEventType, setFilterEventType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 事件类型选项
  const eventTypeOptions = [
    { value: 'order_created', label: '订单创建' },
    { value: 'order_paid', label: '订单支付' },
    { value: 'order_confirmed', label: '订单确认' },
    { value: 'order_shipped', label: '订单配送' },
    { value: 'order_completed', label: '订单完成' },
    { value: 'order_cancelled', label: '订单取消' },
  ];

  // 模拟日志数据
  const logsData: WebhookLogItem[] = [
    {
      key: '1',
      id: 1,
      pushTime: '2024-01-29 14:30:25',
      targetType: 'supplier',
      targetName: '生鲜供应商A',
      eventType: 'order_created',
      orderId: 'ORD202401290001',
      status: 'success',
      responseCode: 200,
      duration: 156,
      requestBody: JSON.stringify({ order_id: 'ORD202401290001', event: 'order_created' }, null, 2),
      responseBody: JSON.stringify({ code: 0, message: 'success' }, null, 2),
      retryCount: 0,
    },
    {
      key: '2',
      id: 2,
      pushTime: '2024-01-29 14:25:10',
      targetType: 'store',
      targetName: '门店A - 朝阳店',
      eventType: 'order_confirmed',
      orderId: 'ORD202401290002',
      status: 'success',
      responseCode: 200,
      duration: 89,
      requestBody: JSON.stringify(
        { order_id: 'ORD202401290002', event: 'order_confirmed' },
        null,
        2
      ),
      responseBody: JSON.stringify({ code: 0, message: 'success' }, null, 2),
      retryCount: 0,
    },
    {
      key: '3',
      id: 3,
      pushTime: '2024-01-29 14:20:00',
      targetType: 'supplier',
      targetName: '粮油供应商B',
      eventType: 'order_paid',
      orderId: 'ORD202401290003',
      status: 'failed',
      responseCode: 500,
      duration: 3024,
      requestBody: JSON.stringify({ order_id: 'ORD202401290003', event: 'order_paid' }, null, 2),
      responseBody: JSON.stringify({ error: 'Internal Server Error' }, null, 2),
      retryCount: 3,
    },
    {
      key: '4',
      id: 4,
      pushTime: '2024-01-29 14:15:30',
      targetType: 'store',
      targetName: '门店B - 海淀店',
      eventType: 'order_shipped',
      orderId: 'ORD202401290004',
      status: 'success',
      responseCode: 200,
      duration: 112,
      requestBody: JSON.stringify({ order_id: 'ORD202401290004', event: 'order_shipped' }, null, 2),
      responseBody: JSON.stringify({ code: 0, message: 'success' }, null, 2),
      retryCount: 0,
    },
  ];

  // 统计数据
  const statsData = {
    totalPush: logsData.length,
    successCount: logsData.filter((l) => l.status === 'success').length,
    failedCount: logsData.filter((l) => l.status === 'failed').length,
    successRate: (
      (logsData.filter((l) => l.status === 'success').length / logsData.length) *
      100
    ).toFixed(1),
    avgDuration: Math.round(logsData.reduce((sum, l) => sum + l.duration, 0) / logsData.length),
  };

  // 查看详情
  const handleViewDetail = (record: WebhookLogItem) => {
    setSelectedLog(record);
    setDetailVisible(true);
  };

  // 状态标签
  const statusLabels: Record<string, { label: string; color: string; icon: JSX.Element | null }> = {
    success: { label: '成功', color: 'success', icon: <CheckCircleOutlined /> },
    failed: { label: '失败', color: 'error', icon: <CloseCircleOutlined /> },
    pending: { label: '处理中', color: 'processing', icon: null },
  };

  // 表格列定义
  const columns: ColumnsType<WebhookLogItem> = [
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      key: 'pushTime',
      width: 180,
    },
    {
      title: '目标类型',
      dataIndex: 'targetType',
      key: 'targetType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'store' ? 'blue' : 'green'}>
          {type === 'store' ? '门店' : '供应商'}
        </Tag>
      ),
    },
    {
      title: '目标名称',
      dataIndex: 'targetName',
      key: 'targetName',
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      render: (type: string) => {
        const option = eventTypeOptions.find((o) => o.value === type);
        return option?.label || type;
      },
    },
    {
      title: '关联订单',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id: string | null) => id || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusLabels[status];
        return (
          <Tag color={config?.color} icon={config?.icon}>
            {config?.label}
          </Tag>
        );
      },
    },
    {
      title: '响应码',
      dataIndex: 'responseCode',
      key: 'responseCode',
      render: (code: number | null) => code || '-',
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      render: (ms: number) => `${ms}ms`,
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
    if (filterTargetType && item.targetType !== filterTargetType) return false;
    if (filterEventType && item.eventType !== filterEventType) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Title level={3}>Webhook推送日志</Title>
        <Paragraph type="secondary">查看系统Webhook推送记录和状态</Paragraph>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="总推送数" value={statsData.totalPush} />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="成功数"
                value={statsData.successCount}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="失败数"
                value={statsData.failedCount}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="成功率" value={statsData.successRate} suffix="%" />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic title="平均耗时" value={statsData.avgDuration} suffix="ms" />
            </Card>
          </Col>
        </Row>

        <Card>
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="目标类型"
                style={{ width: '100%' }}
                options={[
                  { value: null, label: '全部类型' },
                  { value: 'store', label: '门店' },
                  { value: 'supplier', label: '供应商' },
                ]}
                value={filterTargetType}
                onChange={setFilterTargetType}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="事件类型"
                style={{ width: '100%' }}
                options={[{ value: null, label: '全部事件' }, ...eventTypeOptions]}
                value={filterEventType}
                onChange={setFilterEventType}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="推送状态"
                style={{ width: '100%' }}
                options={[
                  { value: null, label: '全部状态' },
                  { value: 'success', label: '成功' },
                  { value: 'failed', label: '失败' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
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
          </Row>

          {/* 日志表格 */}
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1100 }}
          />
        </Card>

        {/* 详情弹窗 */}
        <Modal
          title="推送详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={null}
          width={700}
        >
          {selectedLog && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="推送时间">{selectedLog.pushTime}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={statusLabels[selectedLog.status]?.color}>
                    {statusLabels[selectedLog.status]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="目标类型">
                  {selectedLog.targetType === 'store' ? '门店' : '供应商'}
                </Descriptions.Item>
                <Descriptions.Item label="目标名称">{selectedLog.targetName}</Descriptions.Item>
                <Descriptions.Item label="事件类型">
                  {eventTypeOptions.find((o) => o.value === selectedLog.eventType)?.label}
                </Descriptions.Item>
                <Descriptions.Item label="关联订单">{selectedLog.orderId || '-'}</Descriptions.Item>
                <Descriptions.Item label="响应状态码">
                  {selectedLog.responseCode || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="耗时">{selectedLog.duration}ms</Descriptions.Item>
                <Descriptions.Item label="重试次数" span={2}>
                  {selectedLog.retryCount}
                </Descriptions.Item>
              </Descriptions>

              <Card size="small" title="请求内容">
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 4,
                    margin: 0,
                    fontSize: 12,
                    overflow: 'auto',
                  }}
                >
                  {selectedLog.requestBody}
                </pre>
              </Card>

              <Card size="small" title="响应内容">
                <pre
                  style={{
                    background: selectedLog.status === 'success' ? '#f6ffed' : '#fff1f0',
                    padding: 12,
                    borderRadius: 4,
                    margin: 0,
                    fontSize: 12,
                    overflow: 'auto',
                  }}
                >
                  {selectedLog.responseBody}
                </pre>
              </Card>
            </Space>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
