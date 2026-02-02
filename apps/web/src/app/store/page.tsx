"use client";

import { LineChart, PieChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { StoreLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    ShoppingCart,
    Store,
    Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function StoreDashboard() {
  const router = useRouter();
  const updatedAt = "今日 09:30";

  const statsData = [
    {
      title: "本月订货金额",
      value: "¥268,900",
      icon: DollarSign,
      trend: { value: 12, label: "较上月" },
    },
    {
      title: "本月订单数",
      value: "156",
      icon: ShoppingCart,
      trend: { value: 8, label: "较上月" },
    },
    {
      title: "待收货订单",
      value: "12",
      icon: Truck,
    },
    {
      title: "可用供应商",
      value: "24",
      icon: Store,
    },
  ];

  const orderTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    amount: Math.floor(Math.random() * 10000) + 5000,
  }));

  const supplierData = [
    { name: "生鲜供应商A", value: 35 },
    { name: "粮油供应商B", value: 25 },
    { name: "调味品供应商C", value: 18 },
    { name: "冷冻食品供应商D", value: 12 },
    { name: "其他", value: 10 },
  ];

  const frequentMaterials = [
    { name: "新鲜西红柿", count: 45, amount: 8900 },
    { name: "黄瓜", count: 42, amount: 6300 },
    { name: "土豆", count: 38, amount: 4560 },
    { name: "生菜", count: 35, amount: 5250 },
    { name: "胡萝卜", count: 32, amount: 3200 },
    { name: "大米", count: 28, amount: 8400 },
    { name: "食用油", count: 25, amount: 12500 },
    { name: "生抽", count: 24, amount: 2880 },
    { name: "鸡蛋", count: 22, amount: 4400 },
    { name: "猪肉", count: 20, amount: 16000 },
  ];

  const pendingOrders = [
    {
      orderNo: "ORD202401290001",
      supplier: "生鲜供应商A",
      amount: 3580,
      status: "delivering",
      deliveryTime: "今日 14:00",
    },
    {
      orderNo: "ORD202401290002",
      supplier: "粮油供应商B",
      amount: 2460,
      status: "confirmed",
      deliveryTime: "今日 16:00",
    },
    {
      orderNo: "ORD202401290003",
      supplier: "调味品供应商C",
      amount: 1890,
      status: "delivering",
      deliveryTime: "明日 09:00",
    },
  ];

  const statusConfig: Record<string, { label: string; variant: "success" | "info"; icon: React.ComponentType<{ className?: string }> }> = {
    confirmed: { label: "已确认", variant: "info", icon: CheckCircle },
    delivering: { label: "配送中", variant: "success", icon: Truck },
  };

  return (
    <StoreLayout>
      <WorkbenchShell
        badge="门店端"
        title="门店数据看板"
        description="查看门店订货数据概览"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/store/account")}
          >
            账户信息
          </Button>
        }
        meta={
          <>
            <Badge variant="outline" className="text-[11px]">
              本月
            </Badge>
            <span>更新于 {updatedAt}</span>
          </>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <StatGrid columns={4}>
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </StatGrid>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LineChart
                  title="订货趋势（近30天）"
                  data={orderTrendData}
                  xKey="date"
                  yKeys={[{ key: "amount", name: "订货金额" }]}
                  height={250}
                  formatYAxis={(v) => `¥${(v / 1000).toFixed(0)}k`}
                  formatTooltip={(v) => `¥${v.toLocaleString()}`}
                />
              </div>
              <PieChart
                title="供应商订货占比"
                data={supplierData}
                height={250}
                innerRadius={40}
                outerRadius={70}
              />
            </div>

            {/* Lists */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                  <CardTitle className="text-sm font-medium">常购物料TOP10</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    查看全部 <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {frequentMaterials.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index < 3
                                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            {item.count}次
                          </span>
                          <span className="font-semibold tabular-nums">
                            ¥{item.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                  <CardTitle className="text-sm font-medium">待收货订单</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    查看全部 <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>订单号</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>送达</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status]?.icon;
                        return (
                          <TableRow key={order.orderNo} className="cursor-pointer">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {order.orderNo}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ¥{order.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={statusConfig[order.status]?.variant}
                                className="gap-1"
                              >
                                {StatusIcon && <StatusIcon className="h-3 w-3" />}
                                {statusConfig[order.status]?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <span className="flex items-center gap-1.5 text-xs">
                                <Clock className="h-3 w-3" />
                                {order.deliveryTime}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="flex justify-center gap-3 p-4 border-t border-border/50">
                    <Button className="flex-1">立即订货</Button>
                    <Button variant="outline" className="flex-1">
                      查看购物车
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-sm font-medium">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button size="lg" className="h-auto flex-col gap-2 py-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <span>在线订货</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <span>市场行情</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <span>历史订单</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <span>供应商列表</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </StoreLayout>
  );
}
