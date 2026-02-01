'use client';

import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function SupplierAccountPage() {
  // 模拟供应商信息
  const supplierInfo = {
    name: '粮油供应商B',
    code: 'SUP20240001',
    contactName: '王经理',
    contactPhone: '138****8888',
    status: 'active',
    createdAt: '2024-01-01',
  };

  // 模拟配送设置
  const deliverySettings = {
    minOrderAmount: 100,
    deliveryDays: ['周一', '周三', '周五'],
    deliveryMode: '自配送',
    deliveryAreas: ['北京市朝阳区', '北京市海淀区', '北京市西城区', '北京市东城区'],
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>账户信息</Title>
      <Paragraph type="secondary">查看您的供应商账户信息</Paragraph>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          {/* 基本信息 */}
          <Card
            title={
              <span>
                <ShopOutlined style={{ marginRight: 8 }} />
                供应商基本信息
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="供应商名称">{supplierInfo.name}</Descriptions.Item>
              <Descriptions.Item label="供应商编号">{supplierInfo.code}</Descriptions.Item>
              <Descriptions.Item label="联系人">{supplierInfo.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <PhoneOutlined style={{ marginRight: 4 }} />
                {supplierInfo.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={supplierInfo.status === 'active' ? 'green' : 'red'}>
                  {supplierInfo.status === 'active' ? '正常' : '已禁用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {supplierInfo.createdAt}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          {/* 配送设置 */}
          <Card
            title={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                当前配送设置
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="起送价">
                <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                  ¥{deliverySettings.minOrderAmount}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="配送日">
                {deliverySettings.deliveryDays.map((day) => (
                  <Tag key={day} color="blue" style={{ marginBottom: 4 }}>
                    {day}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="配送模式">
                <Tag color="purple">{deliverySettings.deliveryMode}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <Paragraph strong style={{ marginBottom: 8 }}>
                配送区域：
              </Paragraph>
              <div>
                {deliverySettings.deliveryAreas.map((area) => (
                  <Tag key={area} style={{ marginBottom: 4 }}>
                    {area}
                  </Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
