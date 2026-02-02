"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import { CheckCircle, Package, PackageX, Search, XCircle } from "lucide-react";
import * as React from "react";

interface StockItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  category: string;
  inStock: boolean;
  lastUpdated: string;
}

export default function SupplierStockPage() {
  const [searchText, setSearchText] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const [stockData, setStockData] = React.useState<StockItem[]>([
    {
      id: 1,
      name: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      category: "粮油",
      inStock: true,
      lastUpdated: "2024-01-29 10:00",
    },
    {
      id: 2,
      name: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      category: "粮油",
      inStock: true,
      lastUpdated: "2024-01-29 09:30",
    },
    {
      id: 3,
      name: "中粮大米",
      brand: "中粮",
      spec: "10kg/袋",
      category: "粮油",
      inStock: true,
      lastUpdated: "2024-01-28 16:00",
    },
    {
      id: 4,
      name: "海天酱油",
      brand: "海天",
      spec: "500ml/瓶",
      category: "调味品",
      inStock: false,
      lastUpdated: "2024-01-28 14:00",
    },
    {
      id: 5,
      name: "太太乐鸡精",
      brand: "太太乐",
      spec: "200g/袋",
      category: "调味品",
      inStock: true,
      lastUpdated: "2024-01-27 11:00",
    },
  ]);

  const inStockCount = stockData.filter((s) => s.inStock).length;
  const outOfStockCount = stockData.filter((s) => !s.inStock).length;

  const handleToggleStock = (id: number, inStock: boolean) => {
    setStockData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, inStock, lastUpdated: new Date().toLocaleString("zh-CN") }
          : item
      )
    );
    showToast.success(`已设置为${inStock ? "有货" : "缺货"}`);
  };

  const handleBatchInStock = () => {
    setStockData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, inStock: true, lastUpdated: new Date().toLocaleString("zh-CN") }
          : item
      )
    );
    setSelectedRows([]);
    showToast.success(`已批量设置 ${selectedRows.length} 个物料为有货`);
  };

  const handleBatchOutOfStock = () => {
    setStockData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id)
          ? { ...item, inStock: false, lastUpdated: new Date().toLocaleString("zh-CN") }
          : item
      )
    );
    setSelectedRows([]);
    showToast.success(`已批量设置 ${selectedRows.length} 个物料为缺货`);
  };

  const filteredData = stockData.filter(
    (item) => item.name.includes(searchText) || item.brand.includes(searchText)
  );

  const allSelected =
    filteredData.length > 0 &&
    selectedRows.length === filteredData.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((item) => item.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="库存管理"
        title="库存管理"
        description="快速管理物料库存状态"
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索物料"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex-1" />
            {selectedRows.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={handleBatchInStock}>
                  批量设为有货 ({selectedRows.length})
                </Button>
                <Button variant="destructive" onClick={handleBatchOutOfStock}>
                  批量设为缺货 ({selectedRows.length})
                </Button>
              </div>
            )}
          </div>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            {/* Stats */}
            <StatGrid columns={3}>
              <StatCard
                title="有货物料"
                value={inStockCount.toString()}
                icon={Package}
                valueClassName="text-[hsl(var(--success))]"
              />
              <StatCard
                title="缺货物料"
                value={outOfStockCount.toString()}
                icon={PackageX}
                valueClassName="text-[hsl(var(--error))]"
              />
              <StatCard
                title="总物料数"
                value={stockData.length.toString()}
                icon={Package}
              />
            </StatGrid>

            <Card className="overflow-hidden">
              <CardContent className="pt-6">
                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>物料名称</TableHead>
                        <TableHead>品牌</TableHead>
                        <TableHead>规格</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>库存状态</TableHead>
                        <TableHead>最后更新</TableHead>
                        <TableHead className="w-[100px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(item.id)}
                              onCheckedChange={() => toggleSelect(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.spec}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={item.inStock ? "success" : "error"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {item.inStock ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {item.inStock ? "有货" : "缺货"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.lastUpdated}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={item.inStock}
                              onCheckedChange={(checked) =>
                                handleToggleStock(item.id, checked)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>共 {filteredData.length} 个物料</span>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </SupplierLayout>
  );
}
