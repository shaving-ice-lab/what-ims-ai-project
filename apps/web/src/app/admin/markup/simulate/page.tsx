'use client';

import { CalculatorOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const { Title, Paragraph, Text } = Typography;

interface SimulateResult {
  matchedRule: {
    id: number;
    name: string;
    priority: number;
    markupType: 'fixed' | 'percentage';
    markupValue: number;
    minMarkup: number | null;
    maxMarkup: number | null;
  };
  originalPrice: number;
  markupAmount: number;
  finalPrice: number;
  markupRate: number;
  applyReason: string;
}

export default function MarkupSimulatePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulateResult | null>(null);

  // 门店选项
  const storeOptions = [
    { value: 1, label: '门店A - 朝阳店' },
    { value: 2, label: '门店B - 海淀店' },
    { value: 3, label: '门店C - 西城店' },
    { value: 4, label: '门店D - 东城店' },
    { value: 5, label: '门店E - 丰台店' },
  ];

  // 供应商选项
  const supplierOptions = [
    { value: 1, label: '生鲜供应商A' },
    { value: 2, label: '粮油供应商B' },
    { value: 3, label: '调味品供应商C' },
    { value: 4, label: '冷冻食品供应商D' },
    { value: 5, label: '饮料供应商E' },
  ];

  // 物料选项
  const materialOptions = [
    { value: 101, label: '金龙鱼大豆油5L - ¥58.00' },
    { value: 102, label: '福临门花生油5L - ¥68.00' },
    { value: 103, label: '海天酱油500ml - ¥12.50' },
    { value: 104, label: '太太乐鸡精200g - ¥8.80' },
    { value: 105, label: '中粮大米10kg - ¥45.00' },
  ];

  // 模拟计算
  const handleCalculate = async (values: {
    storeId: number;
    supplierId: number;
    materialId: number;
    originalPrice: number;
  }) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 模拟匹配规则和计算结果
      const { originalPrice, storeId, supplierId } = values;

      // 模拟不同场景的规则匹配
      let mockResult: SimulateResult;

      if (storeId === 1 && supplierId === 1) {
        // 特定门店+特定供应商：匹配最具体的规则
        mockResult = {
          matchedRule: {
            id: 5,
            name: '门店A-生鲜供应商A专属规则',
            priority: 4,
            markupType: 'percentage',
            markupValue: 2,
            minMarkup: 0.5,
            maxMarkup: 20,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.02, 0.5), 20),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.02, 0.5), 20),
          markupRate: 2,
          applyReason: '匹配门店A + 生鲜供应商A的专属规则（优先级最高）',
        };
      } else if (storeId === 1) {
        // 特定门店：匹配门店级规则
        mockResult = {
          matchedRule: {
            id: 3,
            name: '门店A专属规则',
            priority: 3,
            markupType: 'percentage',
            markupValue: 2.5,
            minMarkup: 0.5,
            maxMarkup: 30,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.025, 0.5), 30),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.025, 0.5), 30),
          markupRate: 2.5,
          applyReason: '匹配门店A的专属规则',
        };
      } else if (supplierId === 1) {
        // 特定供应商：匹配供应商级规则
        mockResult = {
          matchedRule: {
            id: 2,
            name: '生鲜供应商A固定加价',
            priority: 2,
            markupType: 'fixed',
            markupValue: 2,
            minMarkup: null,
            maxMarkup: null,
          },
          originalPrice,
          markupAmount: 2,
          finalPrice: originalPrice + 2,
          markupRate: (2 / originalPrice) * 100,
          applyReason: '匹配生鲜供应商A的固定加价规则',
        };
      } else {
        // 默认规则
        mockResult = {
          matchedRule: {
            id: 1,
            name: '默认加价规则',
            priority: 1,
            markupType: 'percentage',
            markupValue: 3,
            minMarkup: 1,
            maxMarkup: 50,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.03, 1), 50),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.03, 1), 50),
          markupRate: 3,
          applyReason: '没有匹配到特定规则，应用全局默认规则',
        };
      }

      setResult(mockResult);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setResult(null);
  };

  return (
    <AdminLayout>
      <div>
        <Title level={3}>加价模拟计算</Title>
        <Paragraph type="secondary">
          模拟计算特定场景下的加价金额，帮助验证加价规则配置是否正确
        </Paragraph>

        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Card title="模拟参数">
              <Form form={form} layout="vertical" onFinish={handleCalculate}>
                <Form.Item
                  name="storeId"
                  label="门店"
                  rules={[{ required: true, message: '请选择门店' }]}
                >
                  <Select
                    placeholder="请选择门店"
                    options={storeOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="supplierId"
                  label="供应商"
                  rules={[{ required: true, message: '请选择供应商' }]}
                >
                  <Select
                    placeholder="请选择供应商"
                    options={supplierOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="materialId"
                  label="商品"
                  rules={[{ required: true, message: '请选择商品' }]}
                >
                  <Select
                    placeholder="请选择商品"
                    options={materialOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="originalPrice"
                  label="原价（元）"
                  rules={[
                    { required: true, message: '请输入原价' },
                    { type: 'number', min: 0.01, message: '原价必须大于0' },
                  ]}
                >
                  <InputNumber
                    placeholder="请输入商品原价"
                    style={{ width: '100%' }}
                    min={0.01}
                    precision={2}
                    addonBefore="¥"
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<CalculatorOutlined />}
                      loading={loading}
                    >
                      计算加价
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="计算结果">
              {result ? (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {/* 匹配的规则信息 */}
                  <Alert
                    message={
                      <Space>
                        <CheckCircleOutlined />
                        匹配规则：{result.matchedRule.name}
                      </Space>
                    }
                    description={result.applyReason}
                    type="success"
                  />

                  {/* 规则详情 */}
                  <Descriptions title="规则详情" column={2} size="small" bordered>
                    <Descriptions.Item label="规则ID">{result.matchedRule.id}</Descriptions.Item>
                    <Descriptions.Item label="优先级">
                      <Tag color="blue">{result.matchedRule.priority}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="加价方式">
                      <Tag color={result.matchedRule.markupType === 'fixed' ? 'purple' : 'cyan'}>
                        {result.matchedRule.markupType === 'fixed' ? '固定金额' : '百分比'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="加价值">
                      {result.matchedRule.markupType === 'fixed'
                        ? `¥${result.matchedRule.markupValue}`
                        : `${result.matchedRule.markupValue}%`}
                    </Descriptions.Item>
                    {result.matchedRule.markupType === 'percentage' && (
                      <>
                        <Descriptions.Item label="最低加价">
                          {result.matchedRule.minMarkup ? `¥${result.matchedRule.minMarkup}` : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="最高加价">
                          {result.matchedRule.maxMarkup ? `¥${result.matchedRule.maxMarkup}` : '-'}
                        </Descriptions.Item>
                      </>
                    )}
                  </Descriptions>

                  <Divider />

                  {/* 价格计算结果 */}
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="原价"
                        value={result.originalPrice}
                        prefix="¥"
                        precision={2}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="加价金额"
                        value={result.markupAmount}
                        prefix="+"
                        suffix="元"
                        precision={2}
                        valueStyle={{ color: '#fa8c16' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="最终价格"
                        value={result.finalPrice}
                        prefix="¥"
                        precision={2}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>

                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary">实际加价率：{result.markupRate.toFixed(2)}%</Text>
                  </div>
                </Space>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                  <CalculatorOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div>请选择参数并点击"计算加价"</div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
