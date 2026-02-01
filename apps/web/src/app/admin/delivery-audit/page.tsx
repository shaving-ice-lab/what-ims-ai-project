'use client';

import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import AdminLayout from '../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface AuditItem {
  key: string;
  id: number;
  supplierId: number;
  supplierName: string;
  changeType: 'min_order' | 'delivery_days' | 'delivery_area';
  oldValue: string;
  newValue: string;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  auditTime?: string;
  auditBy?: string;
  rejectReason?: string;
}

export default function DeliveryAuditPage() {
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);
  const [rejectForm] = Form.useForm();

  // 筛选条件
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // 模拟审核数据
  const [auditData, setAuditData] = useState<AuditItem[]>([
    {
      key: '1',
      id: 1,
      supplierId: 1,
      supplierName: '生鲜供应商A',
      changeType: 'min_order',
      oldValue: '100元',
      newValue: '150元',
      submitTime: '2024-01-29 10:30:00',
      status: 'pending',
    },
    {
      key: '2',
      id: 2,
      supplierId: 2,
      supplierName: '粮油供应商B',
      changeType: 'delivery_days',
      oldValue: '周一、周三、周五',
      newValue: '周一、周二、周三、周四、周五',
      submitTime: '2024-01-29 09:15:00',
      status: 'pending',
    },
    {
      key: '3',
      id: 3,
      supplierId: 3,
      supplierName: '调味品供应商C',
      changeType: 'delivery_area',
      oldValue: '北京市朝阳区、海淀区',
      newValue: '北京市朝阳区、海淀区、西城区、东城区',
      submitTime: '2024-01-28 16:20:00',
      status: 'approved',
      auditTime: '2024-01-28 17:00:00',
      auditBy: '管理员A',
    },
    {
      key: '4',
      id: 4,
      supplierId: 4,
      supplierName: '冷冻食品供应商D',
      changeType: 'min_order',
      oldValue: '200元',
      newValue: '50元',
      submitTime: '2024-01-28 14:10:00',
      status: 'rejected',
      auditTime: '2024-01-28 15:30:00',
      auditBy: '管理员A',
      rejectReason: '起送价过低，不符合运营要求',
    },
  ]);

  // 变更类型标签
  const changeTypeLabels: Record<string, { label: string; color: string }> = {
    min_order: { label: '起送价', color: 'blue' },
    delivery_days: { label: '配送日', color: 'green' },
    delivery_area: { label: '配送区域', color: 'orange' },
  };

  // 状态标签
  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'warning' },
    approved: { label: '已通过', color: 'success' },
    rejected: { label: '已驳回', color: 'error' },
  };

  // 待审核数量
  const pendingCount = auditData.filter((item) => item.status === 'pending').length;

  // 查看详情
  const handleViewDetail = (record: AuditItem) => {
    setSelectedItem(record);
    setDetailVisible(true);
  };

  // 审核通过
  const handleApprove = (id: number) => {
    setAuditData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'approved' as const,
              auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
              auditBy: '当前管理员',
            }
          : item
      )
    );
    message.success('审核已通过');
    setDetailVisible(false);
  };

  // 打开驳回弹窗
  const handleOpenReject = (record: AuditItem) => {
    setSelectedItem(record);
    setRejectVisible(true);
  };

  // 审核驳回
  const handleReject = async (values: { reason: string }) => {
    if (!selectedItem) return;

    setAuditData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: 'rejected' as const,
              auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
              auditBy: '当前管理员',
              rejectReason: values.reason,
            }
          : item
      )
    );
    message.success('已驳回');
    setRejectVisible(false);
    setDetailVisible(false);
    rejectForm.resetFields();
  };

  // 表格列定义
  const columns: ColumnsType<AuditItem> = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      render: (type: string) => {
        const config = changeTypeLabels[type];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '原值',
      dataIndex: 'oldValue',
      key: 'oldValue',
      ellipsis: true,
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusLabels[status];
        return (
          <Badge status={config?.color as 'warning' | 'success' | 'error'} text={config?.label} />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleOpenReject(record)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = auditData.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              配送设置审核
              {pendingCount > 0 && <Badge count={pendingCount} style={{ marginLeft: 12 }} />}
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              审核供应商提交的配送设置变更申请
            </Paragraph>
          </Col>
        </Row>

        <Card>
          {/* 筛选栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="状态筛选"
                style={{ width: '100%' }}
                options={[
                  { value: null, label: '全部状态' },
                  { value: 'pending', label: '待审核' },
                  { value: 'approved', label: '已通过' },
                  { value: 'rejected', label: '已驳回' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </Col>
          </Row>

          {/* 审核列表 */}
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>

        {/* 详情弹窗 */}
        <Modal
          title="审核详情"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={
            selectedItem?.status === 'pending' ? (
              <Space>
                <Button onClick={() => setDetailVisible(false)}>取消</Button>
                <Button danger onClick={() => handleOpenReject(selectedItem)}>
                  驳回
                </Button>
                <Button type="primary" onClick={() => handleApprove(selectedItem.id)}>
                  通过
                </Button>
              </Space>
            ) : null
          }
          width={600}
        >
          {selectedItem && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="供应商">{selectedItem.supplierName}</Descriptions.Item>
                <Descriptions.Item label="变更类型">
                  <Tag color={changeTypeLabels[selectedItem.changeType]?.color}>
                    {changeTypeLabels[selectedItem.changeType]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="提交时间" span={2}>
                  {selectedItem.submitTime}
                </Descriptions.Item>
                <Descriptions.Item label="状态" span={2}>
                  <Badge
                    status={
                      statusLabels[selectedItem.status]?.color as 'warning' | 'success' | 'error'
                    }
                    text={statusLabels[selectedItem.status]?.label}
                  />
                </Descriptions.Item>
              </Descriptions>

              <Card size="small" title="变更对比">
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary">原值：</Text>
                    <div
                      style={{
                        background: '#fff1f0',
                        padding: 12,
                        borderRadius: 4,
                        marginTop: 8,
                      }}
                    >
                      {selectedItem.oldValue}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">新值：</Text>
                    <div
                      style={{
                        background: '#f6ffed',
                        padding: 12,
                        borderRadius: 4,
                        marginTop: 8,
                      }}
                    >
                      {selectedItem.newValue}
                    </div>
                  </Col>
                </Row>
              </Card>

              {selectedItem.status !== 'pending' && (
                <Card size="small" title="审核记录">
                  <Timeline
                    items={[
                      {
                        color: 'blue',
                        children: `${selectedItem.submitTime} 供应商提交变更申请`,
                      },
                      {
                        color: selectedItem.status === 'approved' ? 'green' : 'red',
                        children: (
                          <div>
                            <div>
                              {selectedItem.auditTime} {selectedItem.auditBy}{' '}
                              {selectedItem.status === 'approved' ? '审核通过' : '审核驳回'}
                            </div>
                            {selectedItem.rejectReason && (
                              <div style={{ color: '#ff4d4f', marginTop: 4 }}>
                                驳回原因：{selectedItem.rejectReason}
                              </div>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
                </Card>
              )}
            </Space>
          )}
        </Modal>

        {/* 驳回弹窗 */}
        <Modal
          title="驳回申请"
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
