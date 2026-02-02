"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
    Building2,
    Calendar,
    ChevronRight,
    DollarSign,
    Info,
    Layers,
    Percent,
    Store,
} from "lucide-react";
import * as React from "react";

interface SupplierSwitchItem {
  id: number;
  name: string;
  enabled: boolean;
  markupIncome: number;
  orderCount: number;
}

interface StoreSwitchItem {
  id: number;
  name: string;
  enabled: boolean;
  isNewStore: boolean;
  markupIncome: number;
}

interface CategoryItem {
  id: string;
  name: string;
  enabled: boolean;
  children?: CategoryItem[];
}

export default function MarkupSwitchesPage() {
  const [globalEnabled, setGlobalEnabled] = React.useState(true);

  const [supplierData, setSupplierData] = React.useState<SupplierSwitchItem[]>([
    { id: 1, name: "生鲜供应商A", enabled: true, markupIncome: 12580, orderCount: 156 },
    { id: 2, name: "粮油供应商B", enabled: true, markupIncome: 8960, orderCount: 89 },
    { id: 3, name: "调味品供应商C", enabled: false, markupIncome: 0, orderCount: 45 },
    { id: 4, name: "冷冻食品供应商D", enabled: true, markupIncome: 5670, orderCount: 67 },
    { id: 5, name: "饮料供应商E", enabled: true, markupIncome: 3420, orderCount: 34 },
  ]);

  const [storeData, setStoreData] = React.useState<StoreSwitchItem[]>([
    { id: 1, name: "门店A - 朝阳店", enabled: true, isNewStore: false, markupIncome: 4580 },
    { id: 2, name: "门店B - 海淀店", enabled: true, isNewStore: true, markupIncome: 0 },
    { id: 3, name: "门店C - 西城店", enabled: true, isNewStore: false, markupIncome: 3260 },
    { id: 4, name: "门店D - 东城店", enabled: false, isNewStore: false, markupIncome: 0 },
    { id: 5, name: "门店E - 丰台店", enabled: true, isNewStore: true, markupIncome: 0 },
  ]);

  const [categoryData, setCategoryData] = React.useState<CategoryItem[]>([
    {
      id: "cat-1",
      name: "生鲜类",
      enabled: true,
      children: [
        { id: "cat-1-1", name: "蔬菜", enabled: true },
        { id: "cat-1-2", name: "水果", enabled: true },
        { id: "cat-1-3", name: "肉禽蛋", enabled: true },
      ],
    },
    {
      id: "cat-2",
      name: "粮油调味",
      enabled: true,
      children: [
        { id: "cat-2-1", name: "米面", enabled: true },
        { id: "cat-2-2", name: "食用油", enabled: true },
        { id: "cat-2-3", name: "调味品 (低毛利)", enabled: false },
      ],
    },
    {
      id: "cat-3",
      name: "饮料酒水",
      enabled: true,
      children: [
        { id: "cat-3-1", name: "饮料", enabled: true },
        { id: "cat-3-2", name: "酒水", enabled: true },
      ],
    },
  ]);

  const statsData = {
    todayIncome: 15680,
    monthIncome: 368900,
    avgMarkupRate: 3.5,
  };

  const handleGlobalSwitch = (checked: boolean) => {
    setGlobalEnabled(checked);
    showToast.success(`全局加价已${checked ? "开启" : "关闭"}`);
  };

  const handleSupplierSwitch = (id: number, checked: boolean) => {
    setSupplierData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
    );
    showToast.success(`供应商加价开关已${checked ? "开启" : "关闭"}`);
  };

  const handleStoreSwitch = (id: number, checked: boolean) => {
    setStoreData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
    );
    showToast.success(`门店加价开关已${checked ? "开启" : "关闭"}`);
  };

  const handleBatchSupplierSwitch = (enabled: boolean) => {
    setSupplierData((prev) => prev.map((item) => ({ ...item, enabled })));
    showToast.success(`已批量${enabled ? "开启" : "关闭"}所有供应商加价`);
  };

  const handleBatchStoreSwitch = (enabled: boolean) => {
    setStoreData((prev) => prev.map((item) => ({ ...item, enabled })));
    showToast.success(`已批量${enabled ? "开启" : "关闭"}所有门店加价`);
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setCategoryData((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            enabled: checked,
            children: cat.children?.map((c) => ({ ...c, enabled: checked })),
          };
        }
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map((c) =>
              c.id === categoryId ? { ...c, enabled: checked } : c
            ),
          };
        }
        return cat;
      })
    );
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="加价开关"
        title="加价开关管理"
        description="按供应商、门店、分类维度控制加价是否生效"
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">全局开关</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <Switch checked={globalEnabled} onCheckedChange={handleGlobalSwitch} />
                  <span
                    className={cn(
                      "text-sm",
                      globalEnabled ? "text-[hsl(var(--success))]" : "text-muted-foreground"
                    )}
                  >
                    {globalEnabled ? "加价功能已全局开启" : "加价功能已全局关闭"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      关闭全局开关后，所有加价规则将暂停生效
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">收入概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">今日加价收入</span>
                  <span className="font-semibold text-[hsl(var(--success))]">
                    ¥{statsData.todayIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">本月加价收入</span>
                  <span className="font-semibold">¥{statsData.monthIncome.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">平均加价率</span>
                  <span className="font-semibold">{statsData.avgMarkupRate}%</span>
                </div>
              </CardContent>
            </Card>
          </>
        }
      >
        <StatGrid columns={3}>
          <StatCard
            title="今日加价收入"
            value={`¥${statsData.todayIncome.toLocaleString()}`}
            icon={DollarSign}
            valueClassName="text-[hsl(var(--success))]"
          />
          <StatCard
            title="本月加价收入"
            value={`¥${statsData.monthIncome.toLocaleString()}`}
            icon={Calendar}
            valueClassName="text-primary"
          />
          <StatCard
            title="平均加价率"
            value={`${statsData.avgMarkupRate}%`}
            icon={Percent}
            valueClassName="text-[hsl(var(--warning))]"
          />
        </StatGrid>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                供应商级开关
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchSupplierSwitch(true)}
                >
                  全部开启
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchSupplierSwitch(false)}
                >
                  全部关闭
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>供应商名称</TableHead>
                    <TableHead className="text-center">加价开关</TableHead>
                    <TableHead className="text-right">本月收入</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierData.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={supplier.enabled}
                          onCheckedChange={(checked) =>
                            handleSupplierSwitch(supplier.id, checked)
                          }
                          disabled={!globalEnabled}
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right",
                          supplier.markupIncome > 0
                            ? "text-[hsl(var(--success))]"
                            : "text-muted-foreground"
                        )}
                      >
                        ¥{supplier.markupIncome.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{supplier.orderCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-4 w-4" />
                门店级开关
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchStoreSwitch(true)}
                >
                  全部开启
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchStoreSwitch(false)}
                >
                  全部关闭
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店名称</TableHead>
                    <TableHead className="text-center">加价开关</TableHead>
                    <TableHead className="text-right">本月收入</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeData.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {store.name}
                          {store.isNewStore && (
                            <Badge variant="secondary">新店扶持</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={store.enabled}
                          onCheckedChange={(checked) =>
                            handleStoreSwitch(store.id, checked)
                          }
                          disabled={!globalEnabled || store.isNewStore}
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right",
                          store.isNewStore
                            ? "text-muted-foreground"
                            : store.markupIncome > 0
                            ? "text-[hsl(var(--success))]"
                            : "text-muted-foreground"
                        )}
                      >
                        {store.isNewStore
                          ? "免加价"
                          : `¥${store.markupIncome.toLocaleString()}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              分类级开关
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  勾选的分类将启用加价，取消勾选则该分类下的商品不参与加价
                </p>
                {categoryData.map((category) => (
                  <Collapsible key={category.id} defaultOpen>
                    <div className="flex items-center gap-2 py-1">
                      <CollapsibleTrigger className="flex items-center gap-1 hover:text-primary">
                        <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <Checkbox
                        checked={category.enabled}
                        onCheckedChange={(checked) =>
                          handleCategoryToggle(category.id, !!checked)
                        }
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <CollapsibleContent>
                      <div className="ml-8 space-y-1">
                        {category.children?.map((child) => (
                          <div key={child.id} className="flex items-center gap-2 py-1">
                            <Checkbox
                              checked={child.enabled}
                              onCheckedChange={(checked) =>
                                handleCategoryToggle(child.id, !!checked)
                              }
                            />
                            <span className="text-sm">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="font-medium mb-2">说明：</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>标记为"低毛利"的分类建议不开启加价</li>
                    <li>新店扶持期间自动免加价</li>
                    <li>分类开关优先级高于商品级规则</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
