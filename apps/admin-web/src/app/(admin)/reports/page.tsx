"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, SimpleLineChart, SimplePieChart, SimpleBarChart } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Store,
} from "lucide-react";
import { toast } from "sonner";

const timeRanges = [
  { value: "7d", label: "近7天" },
  { value: "30d", label: "近30天" },
  { value: "90d", label: "近90天" },
  { value: "year", label: "今年" },
];

const stats = [
  {
    title: "总销售额",
    value: "¥1,256,800",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "总订单数",
    value: "3,568",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "加价收入",
    value: "¥45,680",
    change: "+25.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "活跃门店",
    value: "256",
    change: "+8",
    trend: "up",
    icon: Store,
  },
];

const trendData = [
  { name: "12/01", value: 42000 },
  { name: "12/05", value: 38000 },
  { name: "12/10", value: 52000 },
  { name: "12/15", value: 48000 },
  { name: "12/20", value: 58000 },
  { name: "12/25", value: 62000 },
  { name: "12/28", value: 55000 },
];

const supplierData = [
  { name: "新鲜果蔬", value: 358000 },
  { name: "优质肉类", value: 285000 },
  { name: "饮品原料", value: 198000 },
  { name: "进口食材", value: 156000 },
  { name: "调味品", value: 98000 },
  { name: "其他", value: 161800 },
];

const storeData = [
  { name: "星巴克-中山路", value: 125000 },
  { name: "瑞幸-人民路", value: 98000 },
  { name: "喜茶-万达", value: 86000 },
  { name: "奈雪-银泰", value: 75000 },
  { name: "Costa-陆家嘴", value: 68000 },
];

const supplierTableData = [
  { name: "新鲜果蔬", orders: 856, amount: 358000, markup: 12500, stores: 45 },
  { name: "优质肉类", orders: 625, amount: 285000, markup: 9800, stores: 38 },
  { name: "饮品原料", orders: 512, amount: 198000, markup: 6500, stores: 32 },
  { name: "进口食材", orders: 385, amount: 156000, markup: 8200, stores: 28 },
  { name: "调味品", orders: 268, amount: 98000, markup: 3200, stores: 22 },
];

const storeTableData = [
  { name: "星巴克-中山路店", orders: 156, amount: 125000, suppliers: 8, avgOrder: 801.28 },
  { name: "瑞幸咖啡-人民路店", orders: 128, amount: 98000, suppliers: 6, avgOrder: 765.63 },
  { name: "喜茶-万达广场店", orders: 112, amount: 86000, suppliers: 5, avgOrder: 767.86 },
  { name: "奈雪的茶-银泰店", orders: 98, amount: 75000, suppliers: 5, avgOrder: 765.31 },
  { name: "Costa-陆家嘴店", orders: 85, amount: 68000, suppliers: 4, avgOrder: 800.00 },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [activeTab, setActiveTab] = React.useState("overview");

  const handleExport = () => {
    toast.success("报表导出中", {
      description: "文件将在几秒后下载",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">数据报表</h1>
          <p className="text-muted-foreground">查看平台数据统计和分析</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">较上期</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 报表Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="suppliers">供应商分析</TabsTrigger>
          <TabsTrigger value="stores">门店分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 销售趋势图 */}
            <Card>
              <CardHeader>
                <CardTitle>销售趋势</CardTitle>
                <CardDescription>平台销售金额变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimpleLineChart data={trendData} />
                </ChartContainer>
              </CardContent>
            </Card>

            {/* 供应商销售占比饼图 */}
            <Card>
              <CardHeader>
                <CardTitle>供应商销售占比</CardTitle>
                <CardDescription>各供应商销售金额分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimplePieChart data={supplierData} showLabel={false} innerRadius={50} outerRadius={100} />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* 门店销售柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>门店销售排行TOP5</CardTitle>
              <CardDescription>销售金额最高的门店</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimpleBarChart data={storeData} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>供应商销售明细</CardTitle>
              <CardDescription>各供应商销售数据统计</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>供应商名称</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">销售金额</TableHead>
                    <TableHead className="text-right">加价收入</TableHead>
                    <TableHead className="text-right">服务门店</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierTableData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        ¥{row.markup.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{row.stores}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>供应商销售分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimplePieChart data={supplierData} showLabel={false} innerRadius={60} outerRadius={100} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>门店订货明细</CardTitle>
              <CardDescription>各门店订货数据统计</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店名称</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">订货金额</TableHead>
                    <TableHead className="text-right">平均单价</TableHead>
                    <TableHead className="text-right">合作供应商</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeTableData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">¥{row.avgOrder.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.suppliers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>门店销售排行</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimpleBarChart data={storeData} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
