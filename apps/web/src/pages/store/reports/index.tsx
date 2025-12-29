import MainLayout from '@/components/layouts/MainLayout';
import {
    BarChartOutlined,
    CalendarOutlined,
    DownloadOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { Column, Line, Pie } from '@ant-design/plots';
import { Button, Card, Col, DatePicker, Empty, message, Row, Select, Space, Table, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styles from './reports.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface TimeStatData {
  date: string;
  amount: number;
  count: number;
}

interface CategoryStatData {
  category: string;
  amount: number;
  percentage: number;
}

interface SupplierStatData {
  supplier: string;
  amount: number;
  orderCount: number;
  percentage: number;
}

const StoreReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [timeUnit, setTimeUnit] = useState<'day' | 'week' | 'month'>('day');
  const [activeTab, setActiveTab] = useState('time');
  
  // 模拟数据
  const [timeData, setTimeData] = useState<TimeStatData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStatData[]>([]);
  const [supplierData, setSupplierData] = useState<SupplierStatData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatData();
  }, [timeRange, timeUnit]);

  const fetchStatData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 时间统计数据
      const mockTimeData: TimeStatData[] = [];
      const days = timeRange[1].diff(timeRange[0], 'day');
      for (let i = 0; i <= days; i++) {
        mockTimeData.push({
          date: timeRange[0].add(i, 'day').format('YYYY-MM-DD'),
          amount: Math.floor(Math.random() * 5000) + 3000,
          count: Math.floor(Math.random() * 20) + 10,
        });
      }
      setTimeData(mockTimeData);

      // 分类统计数据
      const mockCategoryData: CategoryStatData[] = [
        { category: '蔬菜类', amount: 45680, percentage: 32.5 },
        { category: '肉类', amount: 38900, percentage: 27.6 },
        { category: '水产类', amount: 24500, percentage: 17.4 },
        { category: '粮油类', amount: 18200, percentage: 12.9 },
        { category: '调味品', amount: 13520, percentage: 9.6 },
      ];
      setCategoryData(mockCategoryData);

      // 供应商统计数据
      const mockSupplierData: SupplierStatData[] = [
        { supplier: '优质生鲜供应', amount: 68900, orderCount: 156, percentage: 45.2 },
        { supplier: '上海食品供应商', amount: 45200, orderCount: 98, percentage: 29.6 },
        { supplier: '新鲜蔬菜直供', amount: 28900, orderCount: 67, percentage: 18.9 },
        { supplier: '河北农产品直供', amount: 9600, orderCount: 23, percentage: 6.3 },
      ];
      setSupplierData(mockSupplierData);

      setLoading(false);
    }, 500);
  };

  const handleExport = (type: string) => {
    message.success(`正在导出${type}报表...`);
  };

  // 时间趋势图配置
  const lineConfig = {
    data: timeData.map(item => ({
      date: item.date,
      value: item.amount,
      type: '订货金额',
    })).concat(timeData.map(item => ({
      date: item.date,
      value: item.count * 100, // 放大显示
      type: '订单数量',
    }))),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: datum.type === '订单数量' ? `${datum.value / 100} 单` : `¥${datum.value}`,
        };
      },
    },
  };

  // 分类占比图配置
  const pieConfig = {
    data: categoryData,
    angleField: 'amount',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer' as const,
      content: '{name} {percentage}',
    },
    interactions: [
      { type: 'element-active' },
    ],
  };

  // 供应商排行图配置
  const columnConfig = {
    data: supplierData,
    xField: 'supplier',
    yField: 'amount',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      amount: {
        alias: '订货金额',
        formatter: (v: number) => `¥${v}`,
      },
    },
  };

  // 时间统计表格列
  const timeColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '订货金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: TimeStatData, b: TimeStatData) => a.amount - b.amount,
    },
    {
      title: '订单数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: TimeStatData, b: TimeStatData) => a.count - b.count,
    },
    {
      title: '平均订单金额',
      key: 'average',
      render: (_: any, record: TimeStatData) => 
        `¥${(record.amount / record.count).toFixed(2)}`,
    },
  ];

  // 分类统计表格列
  const categoryColumns = [
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '订货金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: CategoryStatData, b: CategoryStatData) => a.amount - b.amount,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Tag color="blue">{percentage.toFixed(1)}%</Tag>
      ),
      sorter: (a: CategoryStatData, b: CategoryStatData) => a.percentage - b.percentage,
    },
  ];

  // 供应商统计表格列
  const supplierColumns = [
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '订货金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: SupplierStatData, b: SupplierStatData) => a.amount - b.amount,
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a: SupplierStatData, b: SupplierStatData) => a.orderCount - b.orderCount,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Tag color="green">{percentage.toFixed(1)}%</Tag>
      ),
      sorter: (a: SupplierStatData, b: SupplierStatData) => a.percentage - b.percentage,
    },
    {
      title: '平均订单金额',
      key: 'average',
      render: (_: any, record: SupplierStatData) => 
        `¥${(record.amount / record.orderCount).toFixed(2)}`,
    },
  ];

  // 计算总计
  const getTotalStats = () => {
    const totalAmount = timeData.reduce((sum, item) => sum + item.amount, 0);
    const totalCount = timeData.reduce((sum, item) => sum + item.count, 0);
    const avgDailyAmount = totalAmount / (timeData.length || 1);
    const avgDailyCount = totalCount / (timeData.length || 1);
    
    return {
      totalAmount,
      totalCount,
      avgDailyAmount,
      avgDailyCount,
    };
  };

  const stats = getTotalStats();

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <div className={styles.statTitle}>总订货金额</div>
              <div className={styles.statValue}>¥{stats.totalAmount.toFixed(2)}</div>
              <div className={styles.statLabel}>选定时间范围内</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <div className={styles.statTitle}>总订单数量</div>
              <div className={styles.statValue}>{stats.totalCount}</div>
              <div className={styles.statLabel}>选定时间范围内</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <div className={styles.statTitle}>日均订货金额</div>
              <div className={styles.statValue}>¥{stats.avgDailyAmount.toFixed(2)}</div>
              <div className={styles.statLabel}>日均值</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard}>
              <div className={styles.statTitle}>日均订单数</div>
              <div className={styles.statValue}>{stats.avgDailyCount.toFixed(1)}</div>
              <div className={styles.statLabel}>日均值</div>
            </Card>
          </Col>
        </Row>

        {/* 筛选条件 */}
        <Card className={styles.filterCard}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <Space>
                <CalendarOutlined />
                <RangePicker
                  value={timeRange}
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      setTimeRange([dates[0], dates[1]]);
                    }
                  }}
                />
              </Space>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Select
                value={timeUnit}
                onChange={setTimeUnit}
                style={{ width: 120 }}
              >
                <Option value="day">按天</Option>
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} lg={8}>
              <Space>
                <Button onClick={() => fetchStatData()}>刷新数据</Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport(activeTab)}
                >
                  导出报表
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 报表内容 */}
        <Card loading={loading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={<span><LineChartOutlined /> 时间统计</span>}
              key="time"
            >
              <div className={styles.chartSection}>
                <h3>订货趋势图</h3>
                {timeData.length > 0 ? (
                  <Line {...lineConfig} />
                ) : (
                  <Empty description="暂无数据" />
                )}
              </div>
              
              <div className={styles.tableSection}>
                <h3>数据明细</h3>
                <Table
                  dataSource={timeData}
                  columns={timeColumns}
                  rowKey="date"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                />
              </div>
            </TabPane>

            <TabPane 
              tab={<span><PieChartOutlined /> 分类统计</span>}
              key="category"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <div className={styles.chartSection}>
                    <h3>分类占比图</h3>
                    {categoryData.length > 0 ? (
                      <Pie {...pieConfig} />
                    ) : (
                      <Empty description="暂无数据" />
                    )}
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div className={styles.tableSection}>
                    <h3>分类排行榜</h3>
                    <Table
                      dataSource={categoryData}
                      columns={categoryColumns}
                      rowKey="category"
                      pagination={false}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>

            <TabPane 
              tab={<span><BarChartOutlined /> 供应商统计</span>}
              key="supplier"
            >
              <div className={styles.chartSection}>
                <h3>供应商订货金额排行</h3>
                {supplierData.length > 0 ? (
                  <Column {...columnConfig} />
                ) : (
                  <Empty description="暂无数据" />
                )}
              </div>
              
              <div className={styles.tableSection}>
                <h3>供应商明细</h3>
                <Table
                  dataSource={supplierData}
                  columns={supplierColumns}
                  rowKey="supplier"
                  pagination={false}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StoreReports;
