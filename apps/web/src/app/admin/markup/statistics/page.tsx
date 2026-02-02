"use client";

import { LineChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Download, Percent, ShoppingCart, TrendingUp } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface StoreStatItem {
  id: number;
  name: string;
  orderCount: number;
  orderAmount: number;
  markupIncome: number;
  avgMarkupRate: number;
}

interface SupplierStatItem {
  id: number;
  name: string;
  orderCount: number;
  orderAmount: number;
  markupIncome: number;
  avgMarkupRate: number;
}

interface MaterialStatItem {
  id: number;
  name: string;
  brand: string;
  salesCount: number;
  salesAmount: number;
  markupIncome: number;
}

export default function MarkupStatisticsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Generate trend data
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    name: `01-${String(i + 1).padStart(2, "0")}`,
    收入: Math.floor(Math.random() * 5000) + 1000,
  }));

  const storeData: StoreStatItem[] = [
    { id: 1, name: "门店A - 朝阳店", orderCount: 156, orderAmount: 45680, markupIncome: 1580, avgMarkupRate: 3.46 },
    { id: 2, name: "门店B - 海淀店", orderCount: 89, orderAmount: 28900, markupIncome: 960, avgMarkupRate: 3.32 },
    { id: 3, name: "门店C - 西城店", orderCount: 124, orderAmount: 38500, markupIncome: 1290, avgMarkupRate: 3.35 },
    { id: 4, name: "门店D - 东城店", orderCount: 67, orderAmount: 21300, markupIncome: 720, avgMarkupRate: 3.38 },
    { id: 5, name: "门店E - 丰台店", orderCount: 45, orderAmount: 15600, markupIncome: 480, avgMarkupRate: 3.08 },
  ];

  const supplierData: SupplierStatItem[] = [
    { id: 1, name: "生鲜供应商A", orderCount: 234, orderAmount: 68900, markupIncome: 2380, avgMarkupRate: 3.45 },
    { id: 2, name: "粮油供应商B", orderCount: 156, orderAmount: 45600, markupIncome: 1520, avgMarkupRate: 3.33 },
    { id: 3, name: "调味品供应商C", orderCount: 89, orderAmount: 23400, markupIncome: 780, avgMarkupRate: 3.33 },
    { id: 4, name: "冷冻食品供应商D", orderCount: 67, orderAmount: 19800, markupIncome: 660, avgMarkupRate: 3.33 },
    { id: 5, name: "饮料供应商E", orderCount: 45, orderAmount: 12300, markupIncome: 410, avgMarkupRate: 3.33 },
  ];

  const materialData: MaterialStatItem[] = [
    { id: 101, name: "金龙鱼大豆油5L", brand: "金龙鱼", salesCount: 156, salesAmount: 9048, markupIncome: 312 },
    { id: 102, name: "福临门花生油5L", brand: "福临门", salesCount: 89, salesAmount: 6052, markupIncome: 178 },
    { id: 103, name: "海天酱油500ml", brand: "海天", salesCount: 234, salesAmount: 2925, markupIncome: 117 },
    { id: 104, name: "太太乐鸡精200g", brand: "太太乐", salesCount: 178, salesAmount: 1566, markupIncome: 89 },
    { id: 105, name: "中粮大米10kg", brand: "中粮", salesCount: 67, salesAmount: 3015, markupIncome: 134 },
  ];

  const totalStats = {
    totalIncome: 5750,
    totalOrders: 481,
    avgMarkupRate: 3.38,
    growthRate: 12.5,
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="加价统计"
        title="加价收入统计"
        description="查看平台加价收入的详细统计数据"
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
        }
        toolbar={
          <div className="flex items-center gap-3">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            <Button variant="outline" size="sm">更新统计</Button>
          </div>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">统计概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">加价收入</span>
                <span className="font-semibold text-[hsl(var(--success))]">
                  ¥{totalStats.totalIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">订单数</span>
                <span className="font-semibold">{totalStats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">平均加价率</span>
                <span className="font-semibold">{totalStats.avgMarkupRate.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">环比增长</span>
                <span className="font-semibold text-[hsl(var(--success))]">
                  {totalStats.growthRate}%
                </span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader>
              <CardTitle className="text-base">分维度统计</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="store">
                <TabsList>
                  <TabsTrigger value="store">按门店</TabsTrigger>
                  <TabsTrigger value="supplier">按供应商</TabsTrigger>
                  <TabsTrigger value="material">按商品</TabsTrigger>
                </TabsList>
                <TabsContent value="store" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>门店名称</TableHead>
                          <TableHead className="text-right">订单数</TableHead>
                          <TableHead className="text-right">订单金额</TableHead>
                          <TableHead className="text-right">加价收入</TableHead>
                          <TableHead className="text-right">平均加价率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {storeData.map((store) => (
                          <TableRow key={store.id}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell className="text-right">{store.orderCount}</TableCell>
                            <TableCell className="text-right">
                              ¥{store.orderAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-[hsl(var(--success))]">
                              ¥{store.markupIncome.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {store.avgMarkupRate.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="supplier" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>供应商名称</TableHead>
                          <TableHead className="text-right">订单数</TableHead>
                          <TableHead className="text-right">订单金额</TableHead>
                          <TableHead className="text-right">加价收入</TableHead>
                          <TableHead className="text-right">平均加价率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplierData.map((supplier) => (
                          <TableRow key={supplier.id}>
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            <TableCell className="text-right">{supplier.orderCount}</TableCell>
                            <TableCell className="text-right">
                              ¥{supplier.orderAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-[hsl(var(--success))]">
                              ¥{supplier.markupIncome.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {supplier.avgMarkupRate.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="material" className="mt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>商品名称</TableHead>
                          <TableHead>品牌</TableHead>
                          <TableHead className="text-right">销量</TableHead>
                          <TableHead className="text-right">销售额</TableHead>
                          <TableHead className="text-right">加价收入</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materialData.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.name}</TableCell>
                            <TableCell>{material.brand}</TableCell>
                            <TableCell className="text-right">{material.salesCount}</TableCell>
                            <TableCell className="text-right">
                              ¥{material.salesAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-[hsl(var(--success))]">
                              ¥{material.markupIncome.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        }
      >
        <StatGrid columns={4}>
          <StatCard
            title="本期加价收入"
            value={`¥${totalStats.totalIncome.toLocaleString()}`}
            icon={DollarSign}
            valueClassName="text-[hsl(var(--success))]"
          />
          <StatCard
            title="订单数"
            value={`${totalStats.totalOrders}单`}
            icon={ShoppingCart}
          />
          <StatCard
            title="平均加价率"
            value={`${totalStats.avgMarkupRate.toFixed(2)}%`}
            icon={Percent}
          />
          <StatCard
            title="环比增长"
            value={`${totalStats.growthRate}%`}
            icon={TrendingUp}
            valueClassName="text-[hsl(var(--success))]"
          />
        </StatGrid>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">加价收入趋势（近30天）</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={trendData}
              xKey="name"
              yKeys={[{ key: "收入", name: "收入", color: "hsl(var(--success))" }]}
              height={300}
            />
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
