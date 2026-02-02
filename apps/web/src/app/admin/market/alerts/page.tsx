"use client";

import { LineChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    AlertTriangle,
    Clock,
    Search,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import * as React from "react";

interface PriceAlertItem {
  id: number;
  productName: string;
  brand: string;
  supplierName: string;
  currentPrice: number;
  previousPrice: number;
  changeRate: number;
  alertType: "high" | "low" | "anomaly";
  alertTime: string;
}

interface ExclusiveItem {
  id: number;
  productName: string;
  brand: string;
  spec: string;
  supplierName: string;
  price: number;
  duration: number;
}

export default function PriceAlertsPage() {
  const [searchText, setSearchText] = React.useState("");
  const alertData: PriceAlertItem[] = [
    {
      id: 1,
      productName: "金龙鱼大豆油5L",
      brand: "金龙鱼",
      supplierName: "粮油供应商C",
      currentPrice: 72.0,
      previousPrice: 58.0,
      changeRate: 24.1,
      alertType: "high",
      alertTime: "2024-01-29 10:30",
    },
    {
      id: 2,
      productName: "海天酱油500ml",
      brand: "海天",
      supplierName: "调味品供应商B",
      currentPrice: 8.0,
      previousPrice: 12.5,
      changeRate: -36.0,
      alertType: "low",
      alertTime: "2024-01-29 09:15",
    },
    {
      id: 3,
      productName: "福临门花生油5L",
      brand: "福临门",
      supplierName: "粮油供应商E",
      currentPrice: 95.0,
      previousPrice: 68.0,
      changeRate: 39.7,
      alertType: "anomaly",
      alertTime: "2024-01-28 16:45",
    },
  ];

  const exclusiveData: ExclusiveItem[] = [
    {
      id: 1,
      productName: "特供有机大米",
      brand: "中粮",
      spec: "10kg/袋",
      supplierName: "粮油供应商A",
      price: 89.0,
      duration: 30,
    },
    {
      id: 2,
      productName: "进口橄榄油",
      brand: "贝蒂斯",
      spec: "500ml/瓶",
      supplierName: "进口食品供应商",
      price: 68.0,
      duration: 45,
    },
    {
      id: 3,
      productName: "高端矿泉水",
      brand: "依云",
      spec: "500ml*24",
      supplierName: "饮料供应商A",
      price: 120.0,
      duration: 60,
    },
  ];

  const trendData = [
    { name: "01-01", 粮油: 55, 调味品: 12 },
    { name: "01-05", 粮油: 56, 调味品: 12.5 },
    { name: "01-10", 粮油: 58, 调味品: 13 },
    { name: "01-15", 粮油: 57, 调味品: 12.8 },
    { name: "01-20", 粮油: 59, 调味品: 13.2 },
    { name: "01-25", 粮油: 60, 调味品: 13.5 },
    { name: "01-29", 粮油: 58, 调味品: 13 },
  ];

  const alertTypeConfig: Record<
    string,
    { label: string; variant: "error" | "warning" | "secondary" }
  > = {
    high: { label: "价格过高", variant: "error" },
    low: { label: "价格过低", variant: "warning" },
    anomaly: { label: "异常波动", variant: "secondary" },
  };

  const alertStats = {
    high: alertData.filter((a) => a.alertType === "high").length,
    low: alertData.filter((a) => a.alertType === "low").length,
    anomaly: alertData.filter((a) => a.alertType === "anomaly").length,
    exclusive: exclusiveData.length,
  };

  const filteredAlerts = alertData.filter((item) => {
    if (!searchText) return true;
    return (
      item.productName.includes(searchText) ||
      item.brand.includes(searchText) ||
      item.supplierName.includes(searchText)
    );
  });

  const filteredExclusive = exclusiveData.filter((item) => {
    if (!searchText) return true;
    return (
      item.productName.includes(searchText) ||
      item.brand.includes(searchText) ||
      item.supplierName.includes(searchText)
    );
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="行情预警"
        title="价格预警管理"
        description="监控价格异常波动和独家供应产品，及时发现市场风险"
        actions={
          <>
            <Button variant="outline" size="sm">
              导出预警
            </Button>
            <Button size="sm">刷新监控</Button>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索产品 / 品牌 / 供应商"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              应用筛选
            </Button>
          </div>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">预警规则</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">高价阈值</span>
                  <span className="font-semibold text-[hsl(var(--error))]">+20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">低价阈值</span>
                  <span className="font-semibold text-[hsl(var(--warning))]">-15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">异常波动</span>
                  <span className="font-semibold text-purple-400">+30%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">预警概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">过高预警</span>
                  <span className="font-semibold text-[hsl(var(--error))]">
                    {alertStats.high}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">过低预警</span>
                  <span className="font-semibold text-[hsl(var(--warning))]">
                    {alertStats.low}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">异常波动</span>
                  <span className="font-semibold text-purple-400">
                    {alertStats.anomaly}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">独家供应</span>
                  <span className="font-semibold">{alertStats.exclusive}</span>
                </div>
              </CardContent>
            </Card>
          </>
        }
        results={
          <Card className="overflow-hidden">
            <Tabs defaultValue="alerts">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="alerts" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    价格异常预警
                    <Badge variant="error">{filteredAlerts.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="exclusive" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    独家供应产品
                    <Badge variant="warning">{filteredExclusive.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="alerts" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>产品</TableHead>
                          <TableHead>品牌</TableHead>
                          <TableHead>供应商</TableHead>
                          <TableHead className="text-right">当前价格</TableHead>
                          <TableHead className="text-right">原价格</TableHead>
                          <TableHead className="text-right">变动率</TableHead>
                          <TableHead>预警类型</TableHead>
                          <TableHead>预警时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell className="font-medium">
                              {alert.productName}
                            </TableCell>
                            <TableCell>{alert.brand}</TableCell>
                            <TableCell>{alert.supplierName}</TableCell>
                            <TableCell className="text-right">
                              ¥{alert.currentPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              ¥{alert.previousPrice.toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                alert.changeRate > 0
                                  ? "text-[hsl(var(--error))]"
                                  : "text-[hsl(var(--success))]"
                              )}
                            >
                              {alert.changeRate > 0 ? "+" : ""}
                              {alert.changeRate.toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              <Badge variant={alertTypeConfig[alert.alertType]?.variant}>
                                {alertTypeConfig[alert.alertType]?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {alert.alertTime}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="exclusive" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>产品名称</TableHead>
                          <TableHead>品牌</TableHead>
                          <TableHead>规格</TableHead>
                          <TableHead>供应商</TableHead>
                          <TableHead className="text-right">价格</TableHead>
                          <TableHead>独家供应天数</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExclusive.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.productName}
                            </TableCell>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.spec}</TableCell>
                            <TableCell>{item.supplierName}</TableCell>
                            <TableCell className="text-right">
                              ¥{item.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.duration > 30 ? "warning" : "secondary"}
                                className="flex items-center gap-1 w-fit"
                              >
                                <Clock className="h-3 w-3" />
                                {item.duration}天
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        }
      >
        <Card>
          <CardHeader className="bg-muted/20 border-b border-border/50">
            <CardTitle className="text-sm font-medium">预警概览</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <StatGrid columns={4}>
              <StatCard
                title="价格过高预警"
                value={alertStats.high.toString()}
                icon={TrendingUp}
                valueClassName="text-[hsl(var(--error))]"
              />
              <StatCard
                title="价格过低预警"
                value={alertStats.low.toString()}
                icon={TrendingDown}
                valueClassName="text-[hsl(var(--warning))]"
              />
              <StatCard
                title="异常波动"
                value={alertStats.anomaly.toString()}
                icon={AlertTriangle}
                valueClassName="text-purple-500"
              />
              <StatCard
                title="独家供应产品"
                value={alertStats.exclusive.toString()}
                icon={AlertCircle}
                valueClassName="text-[hsl(var(--warning))]"
              />
            </StatGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">分类价格趋势（近30天）</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={trendData}
              xKey="name"
              yKeys={[
                { key: "粮油", name: "粮油", color: "hsl(var(--chart-1))" },
                { key: "调味品", name: "调味品", color: "hsl(var(--chart-2))" },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
