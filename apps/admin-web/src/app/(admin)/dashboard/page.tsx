import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Store, 
  Truck, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle
} from "lucide-react";

const stats = [
  {
    title: "今日订单",
    value: "128",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
    description: "较昨日",
  },
  {
    title: "今日销售额",
    value: "¥45,231",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    description: "较昨日",
  },
  {
    title: "活跃门店",
    value: "256",
    change: "+3",
    trend: "up",
    icon: Store,
    description: "本月新增",
  },
  {
    title: "活跃供应商",
    value: "48",
    change: "+2",
    trend: "up",
    icon: Truck,
    description: "本月新增",
  },
];

const pendingItems = [
  { title: "待确认订单", count: 23, icon: ShoppingCart },
  { title: "待审核产品", count: 12, icon: Package },
  { title: "取消申请", count: 5, icon: AlertCircle },
  { title: "配送设置审核", count: 3, icon: Truck },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">工作台</h1>
        <p className="text-muted-foreground">欢迎回来，管理员</p>
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
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 待处理事项 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {pendingItems.map((item) => (
          <Card key={item.title} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{item.count}</div>
              <p className="text-xs text-muted-foreground">点击查看详情</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快捷操作和最近活动 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>常用功能入口</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">订单管理</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Store className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">门店管理</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Truck className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">供应商管理</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
              <Package className="h-8 w-8 mb-2 text-primary" />
              <span className="text-sm font-medium">物料管理</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>系统最近的操作记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "新订单", detail: "门店「星巴克-中山路店」下单 ¥1,234.50", time: "2分钟前" },
                { action: "订单确认", detail: "供应商「新鲜果蔬」确认订单 #20240115001", time: "5分钟前" },
                { action: "产品审核", detail: "审核通过「有机西红柿」上架申请", time: "10分钟前" },
                { action: "新门店", detail: "新门店「瑞幸咖啡-人民路店」注册", time: "30分钟前" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
