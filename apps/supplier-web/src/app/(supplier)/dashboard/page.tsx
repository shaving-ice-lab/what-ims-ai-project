import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Truck as TruckIcon,
} from "lucide-react";

const stats = [
  {
    title: "今日新订单",
    value: "23",
    change: "+5",
    icon: ShoppingCart,
    description: "较昨日",
  },
  {
    title: "今日销售额",
    value: "¥8,456",
    change: "+12%",
    icon: DollarSign,
    description: "较昨日",
  },
  {
    title: "待处理订单",
    value: "8",
    icon: Clock,
    description: "需要确认",
  },
  {
    title: "在售商品",
    value: "156",
    change: "+3",
    icon: Package,
    description: "本周新增",
  },
];

const pendingOrders = [
  { orderNo: "20240115143025123456", storeName: "星巴克-中山路店", amount: 1234.50, itemCount: 5, createdAt: "10分钟前" },
  { orderNo: "20240115142015654321", storeName: "瑞幸咖啡-人民路店", amount: 2567.80, itemCount: 8, createdAt: "25分钟前" },
  { orderNo: "20240115140005789012", storeName: "喜茶-万达广场店", amount: 892.30, itemCount: 3, createdAt: "1小时前" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">工作台</h1>
        <p className="text-muted-foreground">欢迎回来，新鲜果蔬供应商</p>
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
              {stat.change && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stat.change}</span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              )}
              {!stat.change && (
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 待处理订单 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              待处理订单
            </CardTitle>
            <CardDescription>需要确认的新订单</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.orderNo} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{order.storeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.itemCount}件商品 · {order.createdAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{order.amount.toFixed(2)}</p>
                    <button className="text-sm text-primary hover:underline">确认</button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 今日订单状态 */}
        <Card>
          <CardHeader>
            <CardTitle>今日订单状态</CardTitle>
            <CardDescription>订单处理进度概览</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">待确认</p>
                  <p className="text-sm text-muted-foreground">8 个订单等待处理</p>
                </div>
                <span className="text-2xl font-bold">8</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">配送中</p>
                  <p className="text-sm text-muted-foreground">5 个订单正在配送</p>
                </div>
                <span className="text-2xl font-bold">5</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">已完成</p>
                  <p className="text-sm text-muted-foreground">今日已完成配送</p>
                </div>
                <span className="text-2xl font-bold">15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
