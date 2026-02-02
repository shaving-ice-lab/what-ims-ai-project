"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
    Minus,
    Package,
    RefreshCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import * as React from "react";

interface MarketItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  myPrice: number;
  marketLowest: number;
  priceDiff: number;
  status: "lowest" | "higher" | "equal";
}

export default function SupplierMarketPage() {
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [lastUpdated] = React.useState("2024-01-29 14:30:00");

  const categoryOptions = [
    { value: "粮油", label: "粮油" },
    { value: "调味品", label: "调味品" },
  ];

  const marketData: MarketItem[] = [
    {
      id: 1,
      name: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      myPrice: 56.0,
      marketLowest: 56.0,
      priceDiff: 0,
      status: "lowest",
    },
    {
      id: 2,
      name: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      myPrice: 68.0,
      marketLowest: 65.0,
      priceDiff: 4.6,
      status: "higher",
    },
    {
      id: 3,
      name: "中粮大米",
      brand: "中粮",
      spec: "10kg/袋",
      myPrice: 45.0,
      marketLowest: 45.0,
      priceDiff: 0,
      status: "equal",
    },
    {
      id: 4,
      name: "海天酱油",
      brand: "海天",
      spec: "500ml/瓶",
      myPrice: 12.5,
      marketLowest: 12.0,
      priceDiff: 4.2,
      status: "higher",
    },
    {
      id: 5,
      name: "太太乐鸡精",
      brand: "太太乐",
      spec: "200g/袋",
      myPrice: 8.8,
      marketLowest: 9.0,
      priceDiff: -2.2,
      status: "lowest",
    },
  ];

  const lowestCount = marketData.filter((m) => m.status === "lowest").length;
  const higherCount = marketData.filter((m) => m.status === "higher").length;
  const equalCount = marketData.filter((m) => m.status === "equal").length;

  const handleRefresh = () => {
    showToast.success("数据已刷新");
  };

  const handleQuickAdjust = (_id: number, newPrice: number) => {
    showToast.success(`已将价格调整为 ¥${newPrice.toFixed(2)}`);
  };

  const statusConfig: Record<
    string,
    { label: string; variant: "success" | "error" | "secondary" }
  > = {
    lowest: { label: "最低价", variant: "success" },
    higher: { label: "价格偏高", variant: "error" },
    equal: { label: "价格持平", variant: "secondary" },
  };

  const filteredData = marketData.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="市场行情"
        title="市场行情"
        description="了解您的产品在市场中的价格竞争力"
        actions={
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
        }
        meta={
          <span className="text-xs text-muted-foreground">更新时间：{lastUpdated}</span>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="价格状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="lowest">价格最低</SelectItem>
                <SelectItem value="higher">价格偏高</SelectItem>
                <SelectItem value="equal">价格持平</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <StatGrid columns={4}>
              <StatCard
                title="在售产品"
                value={marketData.length.toString()}
                icon={Package}
              />
              <StatCard
                title="价格最低"
                value={lowestCount.toString()}
                icon={TrendingDown}
                valueClassName="text-[hsl(var(--success))]"
              />
              <StatCard
                title="价格偏高"
                value={higherCount.toString()}
                icon={TrendingUp}
                valueClassName="text-[hsl(var(--error))]"
              />
              <StatCard
                title="价格持平"
                value={equalCount.toString()}
                icon={Minus}
              />
            </StatGrid>

            <Card>
              <CardContent className="pt-6">
                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>产品名称</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead className="text-right">您的报价</TableHead>
                        <TableHead className="text-right">市场最低价</TableHead>
                        <TableHead className="text-right">价差</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="w-[100px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.spec}</TableCell>
                          <TableCell className="text-right">
                            ¥{item.myPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-[hsl(var(--success))]">
                            ¥{item.marketLowest.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right",
                              item.priceDiff > 0
                                ? "text-[hsl(var(--error))]"
                                : item.priceDiff < 0
                                ? "text-[hsl(var(--success))]"
                                : ""
                            )}
                          >
                            {item.priceDiff > 0 ? "+" : ""}
                            {item.priceDiff.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[item.status]?.variant}>
                              {statusConfig[item.status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.status === "higher" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary"
                                onClick={() =>
                                  handleQuickAdjust(item.id, item.marketLowest)
                                }
                              >
                                调至最低价
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>共 {filteredData.length} 个产品</span>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </SupplierLayout>
  );
}
