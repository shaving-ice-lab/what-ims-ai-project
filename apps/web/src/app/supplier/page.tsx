"use client";

import { BarChart, LineChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { SupplierLayout } from "@/components/layouts/app-layout";
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
    AlertCircle,
    CheckCircle,
    DollarSign,
    Eye,
    Printer,
    ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function SupplierDashboard() {
  const router = useRouter();
  const updatedAt = "今日 09:20";
  const statsData = [
    {
      title: "待处理订单",
      value: "8",
      icon: AlertCircle,
      valueClassName: "text-[hsl(var(--error))]",
    },
    {
      title: "今日订单数",
      value: "42",
      icon: ShoppingCart,
    },
    {
      title: "今日销售额",
      value: "¥58,900",
      icon: DollarSign,
    },
    {
      title: "本月销售额",
      value: "¥1,258,900",
      icon: DollarSign,
    },
  ];

  const pendingOrders = [
    {
      orderNo: "ORD202401290001",
      store: "星光超市",
      items: 15,
      amount: 3580,
      expectedDelivery: "2024-01-30",
      orderTime: "2024-01-29 08:30",
    },
    {
      orderNo: "ORD202401290002",
      store: "便民生活超市",
      items: 8,
      amount: 2460,
      expectedDelivery: "2024-01-30",
      orderTime: "2024-01-29 09:15",
    },
    {
      orderNo: "ORD202401290003",
      store: "社区便利店",
      items: 12,
      amount: 1890,
      expectedDelivery: "2024-01-31",
      orderTime: "2024-01-29 10:00",
    },
  ];

  const salesTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
      sales: Math.floor(Math.random() * 50000) + 30000,
    };
  });

  const hotProducts = [
    { name: "新鲜西红柿", amount: 3480 },
    { name: "黄瓜", amount: 2100 },
    { name: "土豆", amount: 1400 },
    { name: "生菜", amount: 1960 },
    { name: "胡萝卜", amount: 1040 },
  ];

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="供应商端"
        title="订单概览"
        description="查看今日订单和销售数据"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/supplier/materials")}
            >
              物料管理
            </Button>
            <Button size="sm" onClick={() => router.push("/supplier/delivery")}>
              配送设置
            </Button>
          </>
        }
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
            {/* Stats */}
            <StatGrid columns={4}>
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  valueClassName={stat.valueClassName}
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </StatGrid>

            {/* Pending Orders */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-sm font-medium">待处理订单</CardTitle>
                  <Badge variant="destructive" className="rounded-full px-2.5">
                    {pendingOrders.length}
                  </Badge>
                </div>
                <Button>批量确认</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>订单编号</TableHead>
                      <TableHead>门店名称</TableHead>
                      <TableHead>商品数</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>期望配送</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order) => (
                      <TableRow key={order.orderNo} className="group">
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {order.orderNo}
                        </TableCell>
                        <TableCell className="font-medium">{order.store}</TableCell>
                        <TableCell>
                          <span className="bg-muted/50 px-2 py-0.5 rounded-full text-xs">
                            {order.items}件
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ¥{order.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{order.expectedDelivery}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" className="h-8">
                              <CheckCircle className="mr-1 h-3.5 w-3.5" />
                              确认
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              详情
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                              <Printer className="mr-1 h-3.5 w-3.5" />
                              打印
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <LineChart
                title="近7天销售趋势"
                data={salesTrendData}
                xKey="date"
                yKeys={[{ key: "sales", name: "销售额" }]}
                height={250}
                formatYAxis={(v) => `¥${(v / 1000).toFixed(0)}k`}
                formatTooltip={(v) => `¥${v.toLocaleString()}`}
              />
              <BarChart
                title="热销商品TOP5"
                data={hotProducts}
                xKey="name"
                yKeys={[{ key: "amount", name: "销售额" }]}
                height={250}
                formatYAxis={(v) => `¥${v}`}
                formatTooltip={(v) => `¥${v.toLocaleString()}`}
              />
            </div>
          </div>
        }
      />
    </SupplierLayout>
  );
}
