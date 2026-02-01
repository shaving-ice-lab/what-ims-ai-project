'use client';

import { PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Row, Select, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

interface OrderItem {
  key: string;
  id: number;
  orderNo: string;
  storeName: string;
  storeAddress: string;
  contactName: string;
  contactPhone: string;
  orderTime: string;
  totalAmount: number;
  items: { name: string; spec: string; quantity: number; price: number }[];
  status: string;
}

export default function SupplierPrintPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<OrderItem | null>(null);

  // 模拟订单数据
  const ordersData: OrderItem[] = [
    {
      key: '1',
      id: 1,
      orderNo: 'ORD202401290001',
      storeName: '门店A - 朝阳店',
      storeAddress: '北京市朝阳区XX路XX号',
      contactName: '张三',
      contactPhone: '138****8888',
      orderTime: '2024-01-29 10:30',
      totalAmount: 358.0,
      items: [
        { name: '金龙鱼大豆油', spec: '5L/桶', quantity: 2, price: 58.0 },
        { name: '海天酱油', spec: '500ml/瓶', quantity: 5, price: 12.5 },
        { name: '中粮大米', spec: '10kg/袋', quantity: 2, price: 45.0 },
      ],
      status: 'confirmed',
    },
    {
      key: '2',
      id: 2,
      orderNo: 'ORD202401290002',
      storeName: '门店B - 海淀店',
      storeAddress: '北京市海淀区YY路YY号',
      contactName: '李四',
      contactPhone: '139****9999',
      orderTime: '2024-01-29 09:15',
      totalAmount: 256.0,
      items: [
        { name: '福临门花生油', spec: '5L/桶', quantity: 2, price: 68.0 },
        { name: '太太乐鸡精', spec: '200g/袋', quantity: 10, price: 8.8 },
      ],
      status: 'confirmed',
    },
  ];

  // 打印预览
  const handlePreview = (order: OrderItem) => {
    setPreviewOrder(order);
  };

  // 打印单张
  const handlePrintSingle = () => {
    window.print();
  };

  // 批量打印
  const handleBatchPrint = () => {
    window.print();
  };

  // 表格列定义
  const columns: ColumnsType<OrderItem> = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '门店名称', dataIndex: 'storeName', key: 'storeName' },
    { title: '下单时间', dataIndex: 'orderTime', key: 'orderTime' },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handlePreview(record)}>
          预览
        </Button>
      ),
    },
  ];

  // 过滤数据
  const filteredData = ordersData.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>送货单打印</Title>
      <Paragraph type="secondary">选择订单并打印送货单</Paragraph>

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card title="订单列表">
            {/* 筛选栏 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} md={10}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="订单状态"
                  style={{ width: '100%' }}
                  options={[
                    { value: null, label: '全部状态' },
                    { value: 'confirmed', label: '已确认' },
                    { value: 'shipped', label: '配送中' },
                  ]}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
                {selectedRowKeys.length > 0 && (
                  <Button type="primary" icon={<PrinterOutlined />} onClick={handleBatchPrint}>
                    批量打印 ({selectedRowKeys.length})
                  </Button>
                )}
              </Col>
            </Row>

            {/* 订单表格 */}
            <Table
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              dataSource={filteredData}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="送货单预览"
            extra={
              previewOrder && (
                <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrintSingle}>
                  打印
                </Button>
              )
            }
          >
            {previewOrder ? (
              <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>
                    【送货单】
                  </Text>
                </div>
                <div style={{ marginBottom: 8 }}>订单号：{previewOrder.orderNo}</div>
                <div style={{ marginBottom: 8 }}>下单时间：{previewOrder.orderTime}</div>
                <Divider dashed style={{ margin: '8px 0' }} />
                <div style={{ marginBottom: 8 }}>门店：{previewOrder.storeName}</div>
                <div style={{ marginBottom: 8 }}>地址：{previewOrder.storeAddress}</div>
                <div style={{ marginBottom: 8 }}>联系人：{previewOrder.contactName}</div>
                <div style={{ marginBottom: 8 }}>电话：{previewOrder.contactPhone}</div>
                <Divider dashed style={{ margin: '8px 0' }} />
                <div style={{ marginBottom: 8 }}>商品明细：</div>
                {previewOrder.items.map((item, i) => (
                  <div key={i} style={{ marginBottom: 4, paddingLeft: 16 }}>
                    {item.name} {item.spec} x{item.quantity} ¥
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
                <Divider dashed style={{ margin: '8px 0' }} />
                <div style={{ marginBottom: 16 }}>
                  <Text strong>合计金额：¥{previewOrder.totalAmount.toFixed(2)}</Text>
                </div>
                <Divider dashed style={{ margin: '8px 0' }} />
                <div style={{ marginBottom: 8 }}>配送员签名：____________</div>
                <div style={{ marginBottom: 8 }}>门店签收：____________</div>
                <div>日期：____________</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                请选择订单预览送货单
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
