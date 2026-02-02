"use client";

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
import { Calculator, DollarSign, Download, Eye, ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface StoreReportItem {
  id: number;
  storeName: string;
  orderCount: number;
  orderAmount: number;
  avgOrderAmount: number;
  topMaterials: string[];
}

export default function StoreReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const storeData: StoreReportItem[] = [
    {
      id: 1,
      storeName: "门店A - 朝阳店",
      orderCount: 156,
      orderAmount: 45680,
      avgOrderAmount: 293,
      topMaterials: ["金龙鱼大豆油", "海天酱油", "中粮大米"],
    },
    {
      id: 2,
      storeName: "门店B - 海淀店",
      orderCount: 89,
      orderAmount: 28900,
      avgOrderAmount: 325,
      topMaterials: ["福临门花生油", "太太乐鸡精", "金龙鱼大豆油"],
    },
    {
      id: 3,
      storeName: "门店C - 西城店",
      orderCount: 124,
      orderAmount: 38500,
      avgOrderAmount: 310,
      topMaterials: ["海天酱油", "金龙鱼大豆油", "福临门花生油"],
    },
    {
      id: 4,
      storeName: "门店D - 东城店",
      orderCount: 67,
      orderAmount: 21300,
      avgOrderAmount: 318,
      topMaterials: ["中粮大米", "金龙鱼大豆油", "海天酱油"],
    },
    {
      id: 5,
      storeName: "门店E - 丰台店",
      orderCount: 45,
      orderAmount: 15600,
      avgOrderAmount: 347,
      topMaterials: ["金龙鱼大豆油", "福临门花生油", "太太乐鸡精"],
    },
  ];

  const totalStats = {
    totalStores: storeData.length,
    totalOrders: storeData.reduce((sum, s) => sum + s.orderCount, 0),
    totalAmount: storeData.reduce((sum, s) => sum + s.orderAmount, 0),
    avgOrderAmount: Math.round(
      storeData.reduce((sum, s) => sum + s.orderAmount, 0) /
        storeData.reduce((sum, s) => sum + s.orderCount, 0)
    ),
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="门店报表"
        title="按门店汇总"
        description="按门店维度查看订货数据汇总"
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
              <CardTitle className="text-sm font-medium">汇总指标</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">门店数量</span>
                <span className="font-semibold">{totalStats.totalStores}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总订单数</span>
                <span className="font-semibold">{totalStats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总订货金额</span>
                <span className="font-semibold">¥{totalStats.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">平均订单金额</span>
                <span className="font-semibold">¥{totalStats.avgOrderAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-medium">门店订货列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>门店名称</TableHead>
                      <TableHead className="text-right">订单数</TableHead>
                      <TableHead className="text-right">订货金额</TableHead>
                      <TableHead className="text-right">平均订单金额</TableHead>
                      <TableHead>常购物料</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeData.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.storeName}</TableCell>
                        <TableCell className="text-right">{store.orderCount}</TableCell>
                        <TableCell className="text-right">
                          ¥{store.orderAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{store.avgOrderAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {store.topMaterials.slice(0, 3).join("、")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/reports/stores/${store.id}`)
                            }
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>共 {storeData.length} 家门店</span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <StatGrid columns={4}>
          <StatCard
            title="门店数量"
            value={totalStats.totalStores.toString()}
            icon={Store}
          />
          <StatCard
            title="总订单数"
            value={totalStats.totalOrders.toString()}
            icon={ShoppingCart}
          />
          <StatCard
            title="总订货金额"
            value={`¥${totalStats.totalAmount.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="平均订单金额"
            value={`¥${totalStats.avgOrderAmount.toLocaleString()}`}
            icon={Calculator}
          />
        </StatGrid>
      </WorkbenchShell>
    </AdminLayout>
  );
}
