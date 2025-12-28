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
  Truck,
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
    title: "订货总金额",
    value: "¥125,680",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "订单总数",
    value: "86",
    change: "+8单",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "采购物料种类",
    value: "42",
    change: "+5种",
    trend: "up",
    icon: Package,
  },
  {
    title: "合作供应商",
    value: "6",
    change: "持平",
    trend: "neutral",
    icon: Truck,
  },
];

const trendData = [
  { name: "12/01", value: 3200 },
  { name: "12/05", value: 4100 },
  { name: "12/10", value: 3800 },
  { name: "12/15", value: 5200 },
  { name: "12/20", value: 4800 },
  { name: "12/25", value: 6100 },
  { name: "12/28", value: 5500 },
];

const categoryData = [
  { name: "蔬菜", value: 35680 },
  { name: "肉类", value: 28500 },
  { name: "水果", value: 22100 },
  { name: "乳制品", value: 18900 },
  { name: "饮品", value: 12500 },
  { name: "其他", value: 8000 },
];

const supplierData = [
  { name: "新鲜果蔬", value: 42300 },
  { name: "优质肉类", value: 35200 },
  { name: "饮品原料", value: 22100 },
  { name: "进口食材", value: 18080 },
  { name: "调味品", value: 8000 },
];

const categoryTableData = [
  { name: "蔬菜", orders: 32, amount: 35680, percent: 28.4 },
  { name: "肉类", orders: 18, amount: 28500, percent: 22.7 },
  { name: "水果", orders: 15, amount: 22100, percent: 17.6 },
  { name: "乳制品", orders: 12, amount: 18900, percent: 15.0 },
  { name: "饮品", orders: 6, amount: 12500, percent: 9.9 },
  { name: "其他", orders: 3, amount: 8000, percent: 6.4 },
];

const supplierTableData = [
  { name: "新鲜果蔬", orders: 35, amount: 42300, percent: 33.6, avgOrder: 1208.57 },
  { name: "优质肉类", orders: 22, amount: 35200, percent: 28.0, avgOrder: 1600.00 },
  { name: "饮品原料", orders: 15, amount: 22100, percent: 17.6, avgOrder: 1473.33 },
  { name: "进口食材", orders: 10, amount: 18080, percent: 14.4, avgOrder: 1808.00 },
  { name: "调味品", orders: 4, amount: 8000, percent: 6.4, avgOrder: 2000.00 },
];

const topMaterials = [
  { rank: 1, name: "有机西兰花", category: "蔬菜", quantity: 156, amount: 1950.00 },
  { rank: 2, name: "新鲜牛腩", category: "肉类", quantity: 45, amount: 3060.00 },
  { rank: 3, name: "有机胡萝卜", category: "蔬菜", quantity: 128, amount: 1088.00 },
  { rank: 4, name: "纯牛奶", category: "乳制品", quantity: 32, amount: 1856.00 },
  { rank: 5, name: "进口苹果", category: "水果", quantity: 18, amount: 1602.00 },
  { rank: 6, name: "猪五花肉", category: "肉类", quantity: 38, amount: 1596.00 },
  { rank: 7, name: "青椒", category: "蔬菜", quantity: 95, amount: 570.00 },
  { rank: 8, name: "鲜榨橙汁", category: "饮品", quantity: 24, amount: 600.00 },
  { rank: 9, name: "澳洲牛排", category: "肉类", quantity: 12, amount: 1536.00 },
  { rank: 10, name: "有机番茄", category: "蔬菜", quantity: 68, amount: 816.00 },
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
          <h1 className="text-2xl font-bold tracking-tight">订货报表</h1>
          <p className="text-muted-foreground">查看订货统计和数据分析</p>
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

      {/* Stats Cards */}
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
                <span className={stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : ""}>
                  {stat.change}
                </span>
                <span className="ml-1">较上期</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="category">按分类</TabsTrigger>
          <TabsTrigger value="supplier">按供应商</TabsTrigger>
          <TabsTrigger value="materials">物料排行</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>订货趋势</CardTitle>
                <CardDescription>订货金额变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimpleLineChart data={trendData} />
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>分类占比</CardTitle>
                <CardDescription>各分类订货金额分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <SimplePieChart data={categoryData} showLabel={false} innerRadius={50} outerRadius={100} />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>供应商订货排行</CardTitle>
              <CardDescription>各供应商订货金额对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimpleBarChart data={supplierData} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>分类统计明细</CardTitle>
              <CardDescription>各分类订货金额和占比</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>分类名称</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">订货金额</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryTableData.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">¥{row.amount.toLocaleString()}</TableCell>
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
              <CardTitle>分类金额分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimplePieChart data={categoryData} showLabel={false} innerRadius={60} outerRadius={100} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>供应商统计明细</CardTitle>
              <CardDescription>各供应商订货金额和占比</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>供应商名称</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">订货金额</TableHead>
                    <TableHead className="text-right">平均单价</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierTableData.map((row) => (
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
              <CardTitle>供应商金额对比</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                <SimpleBarChart data={supplierData} />
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>常购物料TOP10</CardTitle>
              <CardDescription>订购数量最多的物料</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">排名</TableHead>
                    <TableHead>物料名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className="text-right">订购数量</TableHead>
                    <TableHead className="text-right">订购金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topMaterials.map((row) => (
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
