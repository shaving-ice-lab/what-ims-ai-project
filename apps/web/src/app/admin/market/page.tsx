"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    ChevronDown,
    Download,
    Package,
    Search,
    TrendingUp,
    Users,
} from "lucide-react";
import * as React from "react";

interface PriceCompareItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  region: "beijing" | "shanghai" | "guangzhou";
  category: "grain" | "seasoning" | "fresh";
  supplierCount: number;
  minPrice: number;
  maxPrice: number;
  priceDiffRate: number;
  avgMarkupRate: number;
  isExclusive: boolean;
  suppliers: {
    id: number;
    name: string;
    price: number;
    isLowest: boolean;
  }[];
}

export default function MarketMonitorPage() {
  const [searchText, setSearchText] = React.useState("");
  const [filterRegion, setFilterRegion] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [onlyAnomaly, setOnlyAnomaly] = React.useState(false);
  const [onlyExclusive, setOnlyExclusive] = React.useState(false);

  const priceData: PriceCompareItem[] = [
    {
      id: 1,
      name: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      region: "beijing",
      category: "grain",
      supplierCount: 3,
      minPrice: 56.0,
      maxPrice: 62.0,
      priceDiffRate: 10.7,
      avgMarkupRate: 3.2,
      isExclusive: false,
      suppliers: [
        { id: 1, name: "粮油供应商A", price: 56.0, isLowest: true },
        { id: 2, name: "粮油供应商B", price: 58.0, isLowest: false },
        { id: 3, name: "粮油供应商C", price: 62.0, isLowest: false },
      ],
    },
    {
      id: 2,
      name: "海天酱油",
      brand: "海天",
      spec: "500ml/瓶",
      region: "shanghai",
      category: "seasoning",
      supplierCount: 2,
      minPrice: 12.0,
      maxPrice: 13.5,
      priceDiffRate: 12.5,
      avgMarkupRate: 2.8,
      isExclusive: false,
      suppliers: [
        { id: 3, name: "调味品供应商A", price: 12.0, isLowest: true },
        { id: 4, name: "调味品供应商B", price: 13.5, isLowest: false },
      ],
    },
    {
      id: 3,
      name: "特供有机大米",
      brand: "中粮",
      spec: "10kg/袋",
      region: "guangzhou",
      category: "grain",
      supplierCount: 1,
      minPrice: 89.0,
      maxPrice: 89.0,
      priceDiffRate: 0,
      avgMarkupRate: 4.5,
      isExclusive: true,
      suppliers: [{ id: 5, name: "粮油供应商A", price: 89.0, isLowest: true }],
    },
    {
      id: 4,
      name: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      region: "beijing",
      category: "grain",
      supplierCount: 4,
      minPrice: 65.0,
      maxPrice: 78.0,
      priceDiffRate: 20.0,
      avgMarkupRate: 3.5,
      isExclusive: false,
      suppliers: [
        { id: 1, name: "粮油供应商A", price: 65.0, isLowest: true },
        { id: 2, name: "粮油供应商B", price: 68.0, isLowest: false },
        { id: 6, name: "粮油供应商D", price: 72.0, isLowest: false },
        { id: 7, name: "粮油供应商E", price: 78.0, isLowest: false },
      ],
    },
  ];

  const supplierIds = new Set<number>();
  priceData.forEach((item) => item.suppliers.forEach((supplier) => supplierIds.add(supplier.id)));

  const statsData = {
    totalProducts: priceData.length,
    activeSuppliers: supplierIds.size,
    priceAnomalyCount: priceData.filter((item) => item.priceDiffRate >= 10).length,
    exclusiveCount: priceData.filter((item) => item.isExclusive).length,
    avgMarkupRate:
      Math.round(
        (priceData.reduce((sum, item) => sum + item.avgMarkupRate, 0) /
          priceData.length) *
          10
      ) / 10,
    todayPriceChanges: 23,
  };

  const filteredData = priceData.filter((item) => {
    if (searchText && !item.name.includes(searchText) && !item.brand.includes(searchText)) {
      return false;
    }
    if (filterRegion !== "all" && item.region !== filterRegion) {
      return false;
    }
    if (filterCategory !== "all" && item.category !== filterCategory) {
      return false;
    }
    if (onlyAnomaly && item.priceDiffRate < 10) {
      return false;
    }
    if (onlyExclusive && !item.isExclusive) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="市场监控"
        title="市场行情监控"
        description="监控全平台产品价格，分析供应商报价差异和市场行情"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              导出数据
            </Button>
            <Button size="sm">刷新数据</Button>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索产品或品牌"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              运行监控
            </Button>
          </div>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">过滤器</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">区域</span>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择区域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部区域</SelectItem>
                      <SelectItem value="beijing">北京</SelectItem>
                      <SelectItem value="shanghai">上海</SelectItem>
                      <SelectItem value="guangzhou">广州</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">分类</span>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="grain">粮油</SelectItem>
                      <SelectItem value="seasoning">调味品</SelectItem>
                      <SelectItem value="fresh">生鲜</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 bg-muted/20">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">仅看异常</div>
                    <div className="text-xs text-muted-foreground">价差率 ≥ 10%</div>
                  </div>
                  <Switch checked={onlyAnomaly} onCheckedChange={setOnlyAnomaly} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 bg-muted/20">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">仅看独家</div>
                    <div className="text-xs text-muted-foreground">专属供应商品</div>
                  </div>
                  <Switch checked={onlyExclusive} onCheckedChange={setOnlyExclusive} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">快速指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">在售产品</span>
                  <span className="font-semibold">{statsData.totalProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">活跃供应商</span>
                  <span className="font-semibold">{statsData.activeSuppliers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">价格异常</span>
                  <span className="font-semibold text-destructive">
                    {statsData.priceAnomalyCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">独家供应</span>
                  <span className="font-semibold">{statsData.exclusiveCount}</span>
                </div>
              </CardContent>
            </Card>
          </>
        }
        results={
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b border-border/50">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">价格对比结果</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {filteredData.length} 条
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">对比维度：价格 / 供应商</span>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10"></TableHead>
                    <TableHead>产品名称</TableHead>
                    <TableHead>品牌</TableHead>
                    <TableHead>规格</TableHead>
                    <TableHead className="text-center">供应商数</TableHead>
                    <TableHead className="text-right">最低价</TableHead>
                    <TableHead className="text-right">最高价</TableHead>
                    <TableHead className="text-right">价差率</TableHead>
                    <TableHead className="text-right">平均加价率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-primary/5"
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                      >
                        <TableCell>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200 text-muted-foreground",
                              expandedId === item.id && "rotate-180 text-primary"
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            {item.isExclusive && (
                              <Badge variant="warning" className="text-xs">独家</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.brand}</TableCell>
                        <TableCell>
                          <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">
                            {item.spec}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={item.supplierCount === 1 ? "warning" : "success"}
                            className="text-xs"
                          >
                            {item.supplierCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                          ¥{item.minPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          ¥{item.maxPrice.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium tabular-nums",
                            item.priceDiffRate > 15
                              ? "text-red-600 dark:text-red-400"
                              : item.priceDiffRate > 10
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {item.priceDiffRate.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {item.avgMarkupRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      {expandedId === item.id && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={9} className="bg-muted/20 p-4">
                            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="hover:bg-transparent bg-muted/30">
                                    <TableHead>供应商</TableHead>
                                    <TableHead className="text-right">报价</TableHead>
                                    <TableHead className="text-right">与最低价差</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {item.suppliers.map((supplier) => {
                                    const diff =
                                      ((supplier.price - item.minPrice) /
                                        item.minPrice) *
                                      100;
                                    return (
                                      <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.name}</TableCell>
                                        <TableCell className="text-right">
                                          <span
                                            className={cn(
                                              "font-semibold tabular-nums",
                                              supplier.isLowest &&
                                                "text-emerald-600 dark:text-emerald-400"
                                            )}
                                          >
                                            ¥{supplier.price.toFixed(2)}
                                          </span>
                                          {supplier.isLowest && (
                                            <Badge
                                              variant="success"
                                              className="ml-2 text-xs"
                                            >
                                              最低
                                            </Badge>
                                          )}
                                          {!supplier.isLowest &&
                                            supplier.price > item.minPrice * 1.15 && (
                                              <Badge
                                                variant="error"
                                                className="ml-2 text-xs"
                                              >
                                                偏高
                                              </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                          {diff === 0 ? (
                                            <span className="text-muted-foreground">-</span>
                                          ) : (
                                            <span
                                              className={cn(
                                                "font-medium",
                                                diff > 10
                                                  ? "text-red-600 dark:text-red-400"
                                                  : "text-amber-600 dark:text-amber-400"
                                              )}
                                            >
                                              +{diff.toFixed(1)}%
                                            </span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 text-sm text-muted-foreground">
                <span>
                  共 <span className="font-medium text-foreground">{filteredData.length}</span> 个产品
                </span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/20 border-b border-border/50">
            <CardTitle className="text-sm font-medium">监控概览</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <StatGrid columns={3}>
              <StatCard
                title="在售产品"
                value={statsData.totalProducts.toLocaleString()}
                icon={Package}
              />
              <StatCard
                title="活跃供应商"
                value={statsData.activeSuppliers.toString()}
                icon={Users}
              />
              <StatCard
                title="价格异常"
                value={statsData.priceAnomalyCount.toString()}
                icon={AlertTriangle}
                valueClassName="text-destructive"
              />
            </StatGrid>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="group hover:shadow-lg hover:shadow-amber-500/5 transition-all">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">独家供应</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {statsData.exclusiveCount}
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">平均加价率</div>
                  <div className="text-2xl font-bold">{statsData.avgMarkupRate}%</div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">今日价格变动</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">{statsData.todayPriceChanges}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
