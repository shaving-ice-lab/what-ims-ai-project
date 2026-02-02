"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DollarSign, Download, Package, ShoppingCart, Store } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface MaterialReportItem {
  id: number;
  materialName: string;
  brand: string;
  spec: string;
  salesCount: number;
  salesAmount: number;
  storeCount: number;
}

export default function MaterialReportsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [filterCategory, setFilterCategory] = React.useState<string>("all");

  const categoryOptions = [
    { value: "all", label: "全部分类" },
    { value: "粮油", label: "粮油" },
    { value: "调味品", label: "调味品" },
    { value: "生鲜", label: "生鲜" },
    { value: "饮料", label: "饮料" },
  ];

  const materialData: MaterialReportItem[] = [
    {
      id: 1,
      materialName: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      salesCount: 456,
      salesAmount: 26448,
      storeCount: 45,
    },
    {
      id: 2,
      materialName: "海天酱油",
      brand: "海天",
      spec: "500ml/瓶",
      salesCount: 892,
      salesAmount: 11150,
      storeCount: 62,
    },
    {
      id: 3,
      materialName: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      salesCount: 234,
      salesAmount: 15912,
      storeCount: 38,
    },
    {
      id: 4,
      materialName: "中粮大米",
      brand: "中粮",
      spec: "10kg/袋",
      salesCount: 567,
      salesAmount: 25515,
      storeCount: 52,
    },
    {
      id: 5,
      materialName: "太太乐鸡精",
      brand: "太太乐",
      spec: "200g/袋",
      salesCount: 723,
      salesAmount: 6362,
      storeCount: 48,
    },
  ];

  const totalStats = {
    totalMaterials: materialData.length,
    totalSalesCount: materialData.reduce((sum, m) => sum + m.salesCount, 0),
    totalSalesAmount: materialData.reduce((sum, m) => sum + m.salesAmount, 0),
    avgStoreCount: Math.round(
      materialData.reduce((sum, m) => sum + m.storeCount, 0) / materialData.length
    ),
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="物料报表"
        title="按物料汇总"
        description="按物料维度查看销售数据汇总"
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <span className="text-muted-foreground">物料种类</span>
                <span className="font-semibold">{totalStats.totalMaterials}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总销量</span>
                <span className="font-semibold">{totalStats.totalSalesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总销售额</span>
                <span className="font-semibold">¥{totalStats.totalSalesAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">平均采购门店</span>
                <span className="font-semibold">{totalStats.avgStoreCount}</span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-medium">物料销售列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>物料名称</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead className="text-right">销量</TableHead>
                      <TableHead className="text-right">销售额</TableHead>
                      <TableHead className="text-right">采购门店数</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialData.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          {material.materialName}
                        </TableCell>
                        <TableCell>{material.brand}</TableCell>
                        <TableCell>{material.spec}</TableCell>
                        <TableCell className="text-right">
                          {material.salesCount}
                        </TableCell>
                        <TableCell className="text-right">
                          ¥{material.salesAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.storeCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>共 {materialData.length} 种物料</span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <StatGrid columns={4}>
          <StatCard
            title="物料种类"
            value={totalStats.totalMaterials.toString()}
            icon={Package}
          />
          <StatCard
            title="总销量"
            value={totalStats.totalSalesCount.toLocaleString()}
            icon={ShoppingCart}
          />
          <StatCard
            title="总销售额"
            value={`¥${totalStats.totalSalesAmount.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="平均采购门店"
            value={totalStats.avgStoreCount.toString()}
            icon={Store}
          />
        </StatGrid>
      </WorkbenchShell>
    </AdminLayout>
  );
}
