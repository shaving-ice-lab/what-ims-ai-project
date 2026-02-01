'use client';

import {
  AppstoreOutlined,
  DollarOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Tree,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import React, { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Text, Paragraph } = Typography;

interface SupplierSwitchItem {
  key: string;
  id: number;
  name: string;
  enabled: boolean;
  markupIncome: number;
  orderCount: number;
}

interface StoreSwitchItem {
  key: string;
  id: number;
  name: string;
  enabled: boolean;
  isNewStore: boolean;
  markupIncome: number;
}

export default function MarkupSwitchesPage() {
  // 全局总开关状态
  const [globalEnabled, setGlobalEnabled] = useState(true);

  // 供应商开关数据
  const [supplierData, setSupplierData] = useState<SupplierSwitchItem[]>([
    { key: '1', id: 1, name: '生鲜供应商A', enabled: true, markupIncome: 12580, orderCount: 156 },
    { key: '2', id: 2, name: '粮油供应商B', enabled: true, markupIncome: 8960, orderCount: 89 },
    { key: '3', id: 3, name: '调味品供应商C', enabled: false, markupIncome: 0, orderCount: 45 },
    { key: '4', id: 4, name: '冷冻食品供应商D', enabled: true, markupIncome: 5670, orderCount: 67 },
    { key: '5', id: 5, name: '饮料供应商E', enabled: true, markupIncome: 3420, orderCount: 34 },
  ]);

  // 门店开关数据
  const [storeData, setStoreData] = useState<StoreSwitchItem[]>([
    {
      key: '1',
      id: 1,
      name: '门店A - 朝阳店',
      enabled: true,
      isNewStore: false,
      markupIncome: 4580,
    },
    { key: '2', id: 2, name: '门店B - 海淀店', enabled: true, isNewStore: true, markupIncome: 0 },
    {
      key: '3',
      id: 3,
      name: '门店C - 西城店',
      enabled: true,
      isNewStore: false,
      markupIncome: 3260,
    },
    { key: '4', id: 4, name: '门店D - 东城店', enabled: false, isNewStore: false, markupIncome: 0 },
    { key: '5', id: 5, name: '门店E - 丰台店', enabled: true, isNewStore: true, markupIncome: 0 },
  ]);

  // 分类开关数据
  const [categoryTreeData] = useState<DataNode[]>([
    {
      title: '生鲜类',
      key: 'cat-1',
      children: [
        { title: '蔬菜', key: 'cat-1-1' },
        { title: '水果', key: 'cat-1-2' },
        { title: '肉禽蛋', key: 'cat-1-3' },
      ],
    },
    {
      title: '粮油调味',
      key: 'cat-2',
      children: [
        { title: '米面', key: 'cat-2-1' },
        { title: '食用油', key: 'cat-2-2' },
        { title: '调味品 (低毛利)', key: 'cat-2-3' },
      ],
    },
    {
      title: '饮料酒水',
      key: 'cat-3',
      children: [
        { title: '饮料', key: 'cat-3-1' },
        { title: '酒水', key: 'cat-3-2' },
      ],
    },
  ]);

  const [checkedCategoryKeys, setCheckedCategoryKeys] = useState<React.Key[]>([
    'cat-1',
    'cat-1-1',
    'cat-1-2',
    'cat-1-3',
    'cat-2',
    'cat-2-1',
    'cat-2-2',
    'cat-3',
    'cat-3-1',
    'cat-3-2',
  ]);

  // 统计数据
  const statsData = {
    todayIncome: 15680,
    monthIncome: 368900,
    avgMarkupRate: 3.5,
  };

  // 全局开关切换
  const handleGlobalSwitch = (checked: boolean) => {
    setGlobalEnabled(checked);
    message.success(`全局加价已${checked ? '开启' : '关闭'}`);
  };

  // 供应商开关切换
  const handleSupplierSwitch = (id: number, checked: boolean) => {
    setSupplierData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
    );
    message.success(`供应商加价开关已${checked ? '开启' : '关闭'}`);
  };

  // 门店开关切换
  const handleStoreSwitch = (id: number, checked: boolean) => {
    setStoreData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
    );
    message.success(`门店加价开关已${checked ? '开启' : '关闭'}`);
  };

  // 批量操作
  const handleBatchSupplierSwitch = (enabled: boolean) => {
    setSupplierData((prev) => prev.map((item) => ({ ...item, enabled })));
    message.success(`已批量${enabled ? '开启' : '关闭'}所有供应商加价`);
  };

  const handleBatchStoreSwitch = (enabled: boolean) => {
    setStoreData((prev) => prev.map((item) => ({ ...item, enabled })));
    message.success(`已批量${enabled ? '开启' : '关闭'}所有门店加价`);
  };

  // 供应商表格列
  const supplierColumns: ColumnsType<SupplierSwitchItem> = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '加价开关',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleSupplierSwitch(record.id, checked)}
          disabled={!globalEnabled}
        />
      ),
    },
    {
      title: '本月加价收入',
      dataIndex: 'markupIncome',
      key: 'markupIncome',
      render: (value: number) => (
        <span style={{ color: value > 0 ? '#52c41a' : '#999' }}>¥{value.toLocaleString()}</span>
      ),
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
  ];

  // 门店表格列
  const storeColumns: ColumnsType<StoreSwitchItem> = [
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          {name}
          {record.isNewStore && <Tag color="blue">新店扶持</Tag>}
        </Space>
      ),
    },
    {
      title: '加价开关',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStoreSwitch(record.id, checked)}
          disabled={!globalEnabled || record.isNewStore}
        />
      ),
    },
    {
      title: '本月加价收入',
      dataIndex: 'markupIncome',
      key: 'markupIncome',
      render: (value: number, record) => (
        <span style={{ color: record.isNewStore ? '#999' : value > 0 ? '#52c41a' : '#999' }}>
          {record.isNewStore ? '免加价' : `¥${value.toLocaleString()}`}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Title level={3}>加价开关管理</Title>
        <Paragraph type="secondary">
          管理平台加价功能的开关状态，可按供应商、门店、分类维度控制加价是否生效
        </Paragraph>

        {/* 加价收入统计概览 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="今日加价收入"
                value={statsData.todayIncome}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="本月加价收入"
                value={statsData.monthIncome}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="平均加价率"
                value={statsData.avgMarkupRate}
                suffix="%"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 全局总开关 */}
        <Card
          title={
            <Space>
              <DollarOutlined />
              全局加价总开关
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row align="middle" gutter={16}>
            <Col>
              <Switch
                checked={globalEnabled}
                onChange={handleGlobalSwitch}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
            </Col>
            <Col>
              <Text type={globalEnabled ? 'success' : 'secondary'}>
                {globalEnabled ? '加价功能已全局开启' : '加价功能已全局关闭'}
              </Text>
            </Col>
            <Col>
              <Tooltip title="关闭全局开关后，所有加价规则将暂停生效">
                <InfoCircleOutlined style={{ color: '#999' }} />
              </Tooltip>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          {/* 供应商级开关 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <ShopOutlined />
                  供应商级开关
                </Space>
              }
              extra={
                <Space>
                  <Button size="small" onClick={() => handleBatchSupplierSwitch(true)}>
                    全部开启
                  </Button>
                  <Button size="small" onClick={() => handleBatchSupplierSwitch(false)}>
                    全部关闭
                  </Button>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Table
                dataSource={supplierData}
                columns={supplierColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>

          {/* 门店级开关 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <HomeOutlined />
                  门店级开关
                </Space>
              }
              extra={
                <Space>
                  <Button size="small" onClick={() => handleBatchStoreSwitch(true)}>
                    全部开启
                  </Button>
                  <Button size="small" onClick={() => handleBatchStoreSwitch(false)}>
                    全部关闭
                  </Button>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Table
                dataSource={storeData}
                columns={storeColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 分类级开关 */}
        <Card
          title={
            <Space>
              <AppstoreOutlined />
              分类级开关
            </Space>
          }
        >
          <Row>
            <Col span={12}>
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                勾选的分类将启用加价，取消勾选则该分类下的商品不参与加价
              </Text>
              <Tree
                checkable
                defaultExpandAll
                checkedKeys={checkedCategoryKeys}
                onCheck={(keys) => setCheckedCategoryKeys(keys as React.Key[])}
                treeData={categoryTreeData}
              />
            </Col>
            <Col span={12}>
              <Card size="small" style={{ background: '#fafafa' }}>
                <Text strong>说明：</Text>
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>标记为"低毛利"的分类建议不开启加价</li>
                  <li>新店扶持期间自动免加价</li>
                  <li>分类开关优先级高于商品级规则</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </AdminLayout>
  );
}
