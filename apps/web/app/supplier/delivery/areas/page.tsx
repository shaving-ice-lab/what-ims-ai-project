'use client';

import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Cascader,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

interface AreaItem {
  key: string;
  id: number;
  province: string;
  city: string;
  district: string;
}

export default function DeliveryAreasPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string[][]>([]);

  // 模拟区域数据
  const [areasData, setAreasData] = useState<AreaItem[]>([
    { key: '1', id: 1, province: '北京市', city: '北京市', district: '朝阳区' },
    { key: '2', id: 2, province: '北京市', city: '北京市', district: '海淀区' },
    { key: '3', id: 3, province: '北京市', city: '北京市', district: '西城区' },
    { key: '4', id: 4, province: '北京市', city: '北京市', district: '东城区' },
  ]);

  // 省市区选项（简化版）
  const areaOptions = [
    {
      value: '北京市',
      label: '北京市',
      children: [
        {
          value: '北京市',
          label: '北京市',
          children: [
            { value: '朝阳区', label: '朝阳区' },
            { value: '海淀区', label: '海淀区' },
            { value: '西城区', label: '西城区' },
            { value: '东城区', label: '东城区' },
            { value: '丰台区', label: '丰台区' },
            { value: '通州区', label: '通州区' },
          ],
        },
      ],
    },
    {
      value: '上海市',
      label: '上海市',
      children: [
        {
          value: '上海市',
          label: '上海市',
          children: [
            { value: '浦东新区', label: '浦东新区' },
            { value: '黄浦区', label: '黄浦区' },
            { value: '徐汇区', label: '徐汇区' },
          ],
        },
      ],
    },
  ];

  // 删除区域
  const handleDelete = (id: number) => {
    setAreasData((prev) => prev.filter((item) => item.id !== id));
    message.success('配送区域已删除');
  };

  // 添加区域
  const handleAddAreas = () => {
    if (selectedArea.length === 0) {
      message.warning('请选择配送区域');
      return;
    }

    const newAreas: AreaItem[] = selectedArea.map((area, index) => ({
      key: String(Date.now() + index),
      id: Date.now() + index,
      province: area[0] || '',
      city: area[1] || '',
      district: area[2] || '',
    }));

    // 过滤已存在的区域
    const existingKeys = areasData.map((a) => `${a.province}-${a.city}-${a.district}`);
    const filteredNewAreas = newAreas.filter(
      (a) => !existingKeys.includes(`${a.province}-${a.city}-${a.district}`)
    );

    if (filteredNewAreas.length === 0) {
      message.warning('所选区域已存在');
      return;
    }

    setAreasData((prev) => [...prev, ...filteredNewAreas]);
    setSelectedArea([]);
    setModalVisible(false);
    message.success(`已添加 ${filteredNewAreas.length} 个配送区域`);
  };

  // 提交审核
  const handleSubmit = () => {
    message.success('配送区域设置已提交审核');
  };

  // 表格列定义
  const columns: ColumnsType<AreaItem> = [
    { title: '省份', dataIndex: 'province', key: 'province' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '区/县', dataIndex: 'district', key: 'district' },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="green">已生效</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="删除配送区域"
          description="确定要删除此配送区域吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>配送区域管理</Title>
      <Paragraph type="secondary">
        设置您的配送范围，门店所在区域需在您的配送范围内才能下单
      </Paragraph>

      <Alert
        message="区域匹配说明"
        description="系统会根据门店的收货地址自动匹配配送区域，请确保覆盖您服务的所有区域"
        type="info"
        style={{ marginBottom: 24 }}
      />

      <Card
        title={`配送区域列表 (${areasData.length})`}
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              添加区域
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSubmit}>
              提交审核
            </Button>
          </Space>
        }
      >
        <Table dataSource={areasData} columns={columns} pagination={false} />
      </Card>

      {/* 添加区域弹窗 */}
      <Modal
        title="添加配送区域"
        open={modalVisible}
        onOk={handleAddAreas}
        onCancel={() => {
          setModalVisible(false);
          setSelectedArea([]);
        }}
        okText="添加"
        cancelText="取消"
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          选择要添加的配送区域，支持多选
        </Paragraph>
        <Cascader
          options={areaOptions}
          onChange={(value) => setSelectedArea(value as string[][])}
          multiple
          style={{ width: '100%' }}
          placeholder="请选择省市区"
          showSearch
        />
      </Modal>
    </div>
  );
}
