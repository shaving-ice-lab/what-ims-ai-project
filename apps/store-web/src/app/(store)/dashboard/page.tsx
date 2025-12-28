"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, SimpleLineChart, SimplePieChart } from "@/components/ui/chart";
import { 
  ShoppingCart, 
  DollarSign,
  Package,
  Truck,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "本月订货金额",
    value: "¥45,231",
    icon: DollarSign,
    description: "较上月 +12.5%",
    trend: "up",
  },
  {
    title: "本月订单数",
    value: "12",
    icon: Package,
    description: "较上月 +3单",
    trend: "up",
  },
  {
    title: "待收货订单",
    value: "3",
    icon: Truck,
    description: "配送中",
    trend: null,
  },
  {
    title: "可用供应商",
    value: "8",
    icon: ShoppingCart,
    description: "活跃供应商",
    trend: null,
  },
];

const orderTrendData = [
  { name: "12/01", value: 1200 },
  { name: "12/05", value: 2100 },
  { name: "12/10", value: 1800 },
  { name: "12/15", value: 3200 },
  { name: "12/20", value: 2800 },
  { name: "12/25", value: 4100 },
  { name: "12/28", value: 3500 },
];

const supplierPieData = [
  { name: "新鲜果蔬", value: 15230 },
  { name: "优质肉类", value: 12500 },
  { name: "饮品原料", value: 8900 },
  { name: "进口食材", value: 5200 },
  { name: "其他", value: 3401 },
];

const topMaterials = [
  { name: "有机胡萝卜", category: "蔬菜", amount: 3250, count: 25 },
  { name: "进口牛腱", category: "肉类", amount: 2800, count: 8 },
  { name: "鲜榨橙汁", category: "饮品", amount: 2100, count: 42 },
  { name: "澳洲牛排", category: "肉类", amount: 1980, count: 6 },
  { name: "新鲜西兰花", category: "蔬菜", amount: 1650, count: 33 },
];

const recentOrders = [
  { orderNo: "20240115143025123456", supplierName: "新鲜果蔬", amount: 1234.50, status: "delivering", statusText: "配送中" },
  { orderNo: "20240115142015654321", supplierName: "优质肉类", amount: 2567.80, status: "completed", statusText: "已完成" },
  { orderNo: "20240115140005789012", supplierName: "饮品原料", amount: 892.30, status: "completed", statusText: "已完成" },
];

const suppliers = [
  { id: 1, name: "新鲜果蔬", minOrder: 100, deliveryDays: "周一、三、五" },
  { id: 2, name: "优质肉类", minOrder: 200, deliveryDays: "周二、四、六" },
  { id: 3, name: "饮品原料", minOrder: 150, deliveryDays: "工作日" },
  { id: 4, name: "进口食材", minOrder: 500, deliveryDays: "周三、五" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作台</h1>
          <p className="text-muted-foreground">欢迎回来，星巴克-中山路店</p>
        </div>
        <Button asChild>
          <Link href="/order">
            <Package className="mr-2 h-4 w-4" />
            开始订货
          </Link>
        </Button>
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
                <span className={stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : ""}>
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 订货趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle>订货趋势</CardTitle>
            <CardDescription>近30天订货金额趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px]">
              <SimpleLineChart data={orderTrendData} />
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 供应商订货占比 */}
        <Card>
          <CardHeader>
            <CardTitle>供应商订货占比</CardTitle>
            <CardDescription>本月各供应商订货金额分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px]">
              <SimplePieChart data={supplierPieData} showLabel={false} innerRadius={40} outerRadius={80} />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 常购物料TOP10 */}
      <Card>
        <CardHeader>
          <CardTitle>常购物料TOP5</CardTitle>
          <CardDescription>您最常订购的物料</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topMaterials.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">¥{item.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">订购 {item.count} 次</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 最近订单 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近订单</CardTitle>
              <CardDescription>您最近的订货记录</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/orders">
                查看全部
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.orderNo} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{order.supplierName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.orderNo.slice(-8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{order.amount.toFixed(2)}</p>
                    <p className={`text-sm ${order.status === 'delivering' ? 'text-blue-500' : 'text-green-500'}`}>
                      {order.statusText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 供应商列表 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>可选供应商</CardTitle>
              <CardDescription>点击开始订货</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <Link 
                  key={supplier.id} 
                  href={`/order?supplier=${supplier.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-muted-foreground">
                      起送 ¥{supplier.minOrder} · {supplier.deliveryDays}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
