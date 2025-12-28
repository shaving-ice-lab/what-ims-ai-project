"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Package,
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
    title: "销售总额",
    value: "¥86,520",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "订单总数",
    value: "128",
    change: "+12单",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "客单价",
    value: "¥676",
    change: "+8.5%",
    trend: "up",
    icon: Package,
  },
  {
    title: "服务门店",
    value: "18",
    change: "+2家",
    trend: "up",
    icon: Store,
  },
];

const trendData = [
  { name: "12/01", value: 2800 },
  { name: "12/05", value: 3500 },
  { name: "12/10", value: 3200 },
  { name: "12/15", value: 4800 },
  { name: "12/20", value: 4200 },
  { name: "12/25", value: 5600 },
  { name: "12/28", value: 4800 },
];

const categoryData = [
  { name: "蔬菜", value: 32500 },
  { name: "水果", value: 28000 },
  { name: "肉类", value: 15200 },
  { name: "乳制品", value: 8820 },
  { name: "其他", value: 2000 },
];

const storeData = [
  { name: "星巴克-中山路", value: 18500 },
  { name: "瑞幸-人民路", value: 15200 },
  { name: "喜茶-万达", value: 12800 },
  { name: "奈雪-银泰", value: 10200 },
  { name: "其他", value: 29820 },
];

const storeTableData = [
  { name: "星巴克-中山路店", orders: 35, amount: 18500, percent: 21.4, avgOrder: 528.57 },
  { name: "瑞幸咖啡-人民路店", orders: 28, amount: 15200, percent: 17.6, avgOrder: 542.86 },
  { name: "喜茶-万达广场店", orders: 22, amount: 12800, percent: 14.8, avgOrder: 581.82 },
  { name: "奈雪的茶-银泰店", orders: 18, amount: 10200, percent: 11.8, avgOrder: 566.67 },
  { name: "Costa-陆家嘴店", orders: 15, amount: 9800, percent: 11.3, avgOrder: 653.33 },
  { name: "Manner-静安寺店", orders: 10, amount: 8020, percent: 9.3, avgOrder: 802.00 },
];

const topProducts = [
  { rank: 1, name: "有机西兰花", category: "蔬菜", quantity: 256, amount: 3200.00 },
  { rank: 2, name: "进口苹果", category: "水果", quantity: 45, amount: 4005.00 },
  { rank: 3, name: "有机胡萝卜", category: "蔬菜", quantity: 188, amount: 1598.00 },
  { rank: 4, name: "芒果", category: "水果", quantity: 32, amount: 3840.00 },
  { rank: 5, name: "有机番茄", category: "蔬菜", quantity: 145, amount: 1740.00 },
  { rank: 6, name: "草莓", category: "水果", quantity: 68, amount: 3060.00 },
  { rank: 7, name: "青椒", category: "蔬菜", quantity: 195, amount: 1170.00 },
  { rank: 8, name: "有机生菜", category: "蔬菜", quantity: 220, amount: 1320.00 },
  { rank: 9, name: "葡萄", category: "水果", quantity: 38, amount: 1900.00 },
  { rank: 10, name: "柠檬", category: "水果", quantity: 85, amount: 1530.00 },
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
          <h1 className="text-2xl font-bold tracking-tight">销售报表</h1>
          <p className="text-muted-foreground">查看销售数据和统计分析</p>
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
          <TabsTrigger value="stores">按门店</TabsTrigger>
          <TabsTrigger value="products">商品排行</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 销售趋势图 */}
            <Card>
              <CardHeader>
                <CardTitle>销售趋势</CardTitle>
                <CardDescription>销售金额变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimpleLineChart data={trendData} />
                </ChartContainer>
              </CardContent>
            </Card>

            {/* 分类占比饼图 */}
            <Card>
              <CardHeader>
                <CardTitle>分类销售占比</CardTitle>
                <CardDescription>各分类销售金额分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimplePieChart data={categoryData} showLabel={false} innerRadius={50} outerRadius={100} />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* 门店销售柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>门店销售排行</CardTitle>
              <CardDescription>各门店销售金额对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimpleBarChart data={storeData} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>门店销售明细</CardTitle>
              <CardDescription>各门店销售数据统计</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店名称</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">销售金额</TableHead>
                    <TableHead className="text-right">平均单价</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeTableData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">¥{row.avgOrder.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{row.percent}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>门店销售分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimplePieChart data={storeData} showLabel={false} innerRadius={60} outerRadius={100} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>热销商品TOP10</CardTitle>
              <CardDescription>销量最高的商品排行</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">排名</TableHead>
                    <TableHead>商品名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className="text-right">销售数量</TableHead>
                    <TableHead className="text-right">销售金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((row) => (
                    <TableRow key={row.rank}>
                      <TableCell>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                          row.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {row.rank}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{row.quantity}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
