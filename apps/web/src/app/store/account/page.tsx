'use client';

import { EnvironmentOutlined, PhoneOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Row, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function StoreAccountPage() {
  // 模拟门店信息
  const storeInfo = {
    name: '门店A - 朝阳店',
    code: 'STORE20240001',
    contactName: '张店长',
    contactPhone: '138****8888',
    status: 'active',
  };

  // 模拟收货地址
  const deliveryAddress = {
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: 'XX路XX号XX商场B1层',
    contactName: '张三',
    contactPhone: '138****8888',
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>账户信息</Title>
      <Paragraph type="secondary">查看您的门店账户信息</Paragraph>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          {/* 基本信息 */}
          <Card
            title={
              <span>
                <ShopOutlined style={{ marginRight: 8 }} />
                门店基本信息
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="门店名称">{storeInfo.name}</Descriptions.Item>
              <Descriptions.Item label="门店编号">{storeInfo.code}</Descriptions.Item>
              <Descriptions.Item label="联系人">
                <UserOutlined style={{ marginRight: 4 }} />
                {storeInfo.contactName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <PhoneOutlined style={{ marginRight: 4 }} />
                {storeInfo.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={storeInfo.status === 'active' ? 'green' : 'red'}>
                  {storeInfo.status === 'active' ? '正常' : '已禁用'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          {/* 收货地址 */}
          <Card
            title={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                收货地址
              </span>
            }
            extra={<Tag color="blue">由管理员维护</Tag>}
            style={{ marginBottom: 24 }}
          >
            <Descriptions column={1}>
              <Descriptions.Item label="省市区">
                {deliveryAddress.province} {deliveryAddress.city} {deliveryAddress.district}
              </Descriptions.Item>
              <Descriptions.Item label="详细地址">{deliveryAddress.address}</Descriptions.Item>
              <Descriptions.Item label="收货人">
                <UserOutlined style={{ marginRight: 4 }} />
                {deliveryAddress.contactName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <PhoneOutlined style={{ marginRight: 4 }} />
                {deliveryAddress.contactPhone}
              </Descriptions.Item>
            </Descriptions>
            <Paragraph type="secondary" style={{ marginTop: 16, marginBottom: 0 }}>
              如需修改收货地址，请联系管理员
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
