"use client";

import { BarChart, LineChart, PieChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DollarSign,
    Home,
    ShoppingCart,
    Store,
} from "lucide-react";
import * as React from "react";

export default function AdminDashboard() {
  // 模拟数据
  const statsData = [
    {
      title: "总门店数",
      value: "128",
      icon: Home,
      trend: { value: 12, label: "较上月" },
    },
    {
      title: "总供应商数",
      value: "56",
      icon: Store,
      trend: { value: 8, label: "较上月" },
    },
    {
      title: "今日订单数",
      value: "234",
      icon: ShoppingCart,
      trend: { value: -5, label: "较昨日" },
    },
    {
      title: "今日交易额",
      value: "¥568,900",
      icon: DollarSign,
      trend: { value: 15, label: "较昨日" },
    },
  ];

  // 订单趋势数据
  const orderTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    amount: Math.floor(Math.random() * 100000) + 50000,
    orders: Math.floor(Math.random() * 300) + 150,
  }));

  // 供应商销售排行
  const supplierRankData = [
    { name: "生鲜A", sales: 238900 },
    { name: "粮油B", sales: 198700 },
    { name: "调味C", sales: 156200 },
    { name: "冷冻D", sales: 134500 },
    { name: "饮料E", sales: 112300 },
  ];

  // 分类销售占比
  const categorySalesData = [
    { name: "生鲜", value: 35 },
    { name: "粮油", value: 25 },
    { name: "调味品", value: 18 },
    { name: "冷冻食品", value: 12 },
    { name: "饮料", value: 10 },
  ];

  // 最新订单数据
  const recentOrders = [
    {
      orderNo: "ORD202401290001",
      store: "门店A",
      supplier: "生鲜供应商A",
      amount: 3580,
      status: "pending",
    },
    {
      orderNo: "ORD202401290002",
      store: "门店B",
      supplier: "粮油供应商B",
      amount: 2460,
      status: "shipping",
    },
    {
      orderNo: "ORD202401290003",
      store: "门店C",
      supplier: "调味品供应商C",
      amount: 1890,
      status: "completed",
    },
    {
      orderNo: "ORD202401290004",
      store: "门店D",
      supplier: "冷冻食品供应商D",
      amount: 4520,
      status: "pending",
    },
    {
      orderNo: "ORD202401290005",
      store: "门店E",
      supplier: "饮料供应商E",
      amount: 980,
      status: "shipping",
    },
  ];

  const statusConfig: Record<
    string,
    { label: string; variant: "warning" | "info" | "success" }
  > = {
    pending: { label: "待确认", variant: "warning" },
    shipping: { label: "配送中", variant: "info" },
    completed: { label: "已完成", variant: "success" },
  };
  const updatedAt = "今日 09:10";

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="管理后台"
        title="数据看板"
        description="欢迎回来，这是今日的数据概览"
        meta={
          <>
            <Badge variant="outline" className="text-[11px]">
              今日
            </Badge>
            <span>更新于 {updatedAt}</span>
          </>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            {/* 统计卡片 */}
            <StatGrid columns={4}>
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  className="stagger-1"
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </StatGrid>

            {/* 图表区域 */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LineChart
                  title="订单趋势（近30天）"
                  data={orderTrendData}
                  xKey="date"
                  yKeys={[
                    { key: "amount", name: "交易额", color: "hsl(var(--primary))" },
                  ]}
                  height={300}
                  formatYAxis={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  formatTooltip={(value) => `¥${value.toLocaleString()}`}
                />
              </div>
              <div>
                <PieChart
                  title="分类销售占比"
                  data={categorySalesData}
                  height={300}
                  innerRadius={50}
                  outerRadius={80}
                />
              </div>
            </div>

            {/* 供应商排行和最新订单 */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BarChart
                title="供应商销售排行TOP5"
                data={supplierRankData}
                xKey="name"
                yKeys={[
                  { key: "sales", name: "销售额", color: "hsl(var(--primary))" },
                ]}
                height={300}
                formatYAxis={(value) => `¥${(value / 1000).toFixed(0)}k`}
                formatTooltip={(value) => `¥${value.toLocaleString()}`}
              />

              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-sm font-medium">最新订单</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>订单号</TableHead>
                        <TableHead>门店</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.orderNo} className="cursor-pointer">
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {order.orderNo}
                          </TableCell>
                          <TableCell className="font-medium">{order.store}</TableCell>
                          <TableCell className="font-semibold">¥{order.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[order.status]?.variant}>
                              {statusConfig[order.status]?.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        }
      />
    </AdminLayout>
  );
}
