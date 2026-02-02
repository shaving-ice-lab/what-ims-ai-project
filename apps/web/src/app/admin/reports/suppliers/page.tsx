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
import { Building2, Calculator, DollarSign, Download, Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface SupplierReportItem {
  id: number;
  supplierName: string;
  orderCount: number;
  salesAmount: number;
  avgOrderAmount: number;
  topMaterials: string[];
}

export default function SupplierReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const supplierData: SupplierReportItem[] = [
    {
      id: 1,
      supplierName: "生鲜供应商A",
      orderCount: 234,
      salesAmount: 68900,
      avgOrderAmount: 294,
      topMaterials: ["新鲜蔬菜", "水果拼盘", "肉类"],
    },
    {
      id: 2,
      supplierName: "粮油供应商B",
      orderCount: 156,
      salesAmount: 45600,
      avgOrderAmount: 292,
      topMaterials: ["金龙鱼大豆油", "福临门花生油", "中粮大米"],
    },
    {
      id: 3,
      supplierName: "调味品供应商C",
      orderCount: 89,
      salesAmount: 23400,
      avgOrderAmount: 263,
      topMaterials: ["海天酱油", "太太乐鸡精", "老干妈辣酱"],
    },
    {
      id: 4,
      supplierName: "冷冻食品供应商D",
      orderCount: 67,
      salesAmount: 19800,
      avgOrderAmount: 296,
      topMaterials: ["速冻水饺", "冷冻鸡翅", "速冻汤圆"],
    },
    {
      id: 5,
      supplierName: "饮料供应商E",
      orderCount: 45,
      salesAmount: 12300,
      avgOrderAmount: 273,
      topMaterials: ["可口可乐", "农夫山泉", "王老吉"],
    },
  ];

  const totalStats = {
    totalSuppliers: supplierData.length,
    totalOrders: supplierData.reduce((sum, s) => sum + s.orderCount, 0),
    totalAmount: supplierData.reduce((sum, s) => sum + s.salesAmount, 0),
    avgOrderAmount: Math.round(
      supplierData.reduce((sum, s) => sum + s.salesAmount, 0) /
        supplierData.reduce((sum, s) => sum + s.orderCount, 0)
    ),
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="供应商报表"
        title="按供应商汇总"
        description="按供应商维度查看销售数据汇总"
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
                <span className="text-muted-foreground">供应商数量</span>
                <span className="font-semibold">{totalStats.totalSuppliers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总订单数</span>
                <span className="font-semibold">{totalStats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总销售金额</span>
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
              <CardTitle className="text-sm font-medium">供应商销售列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>供应商名称</TableHead>
                      <TableHead className="text-right">订单数</TableHead>
                      <TableHead className="text-right">销售金额</TableHead>
                      <TableHead className="text-right">平均订单金额</TableHead>
                      <TableHead>热销物料</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierData.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">
                          {supplier.supplierName}
                        </TableCell>
                        <TableCell className="text-right">
                          {supplier.orderCount}
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{supplier.salesAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{supplier.avgOrderAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {supplier.topMaterials.slice(0, 3).join("、")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/reports/suppliers/${supplier.id}`)
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
                <span>共 {supplierData.length} 家供应商</span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <StatGrid columns={4}>
          <StatCard
            title="供应商数量"
            value={totalStats.totalSuppliers.toString()}
            icon={Building2}
          />
          <StatCard
            title="总订单数"
            value={totalStats.totalOrders.toString()}
            icon={ShoppingCart}
          />
          <StatCard
            title="总销售金额"
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
