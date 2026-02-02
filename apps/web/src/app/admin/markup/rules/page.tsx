"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { showToast } from "@/lib/toast";
import {
    Download,
    Edit,
    ListChecks,
    MoreHorizontal,
    Plus,
    Power,
    PowerOff,
    Search,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface MarkupRule {
  id: number;
  name: string;
  storeId: number | null;
  storeName: string | null;
  supplierId: number | null;
  supplierName: string | null;
  materialId: number | null;
  materialName: string | null;
  markupType: "fixed" | "percentage";
  markupValue: number;
  minMarkup: number | null;
  maxMarkup: number | null;
  priority: number;
  enabled: boolean;
  createdAt: string;
}

export default function MarkupRulesPage() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [batchDeleteOpen, setBatchDeleteOpen] = React.useState(false);

  // Filters
  const [searchName, setSearchName] = React.useState("");
  const [filterStore, setFilterStore] = React.useState<string>("all");
  const [filterSupplier, setFilterSupplier] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const [rulesData, setRulesData] = React.useState<MarkupRule[]>([
    {
      id: 1,
      name: "默认加价规则",
      storeId: null,
      storeName: null,
      supplierId: null,
      supplierName: null,
      materialId: null,
      materialName: null,
      markupType: "percentage",
      markupValue: 3,
      minMarkup: 1,
      maxMarkup: 50,
      priority: 1,
      enabled: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "生鲜供应商A固定加价",
      storeId: null,
      storeName: null,
      supplierId: 1,
      supplierName: "生鲜供应商A",
      materialId: null,
      materialName: null,
      markupType: "fixed",
      markupValue: 2,
      minMarkup: null,
      maxMarkup: null,
      priority: 2,
      enabled: true,
      createdAt: "2024-01-16",
    },
    {
      id: 3,
      name: "门店A专属规则",
      storeId: 1,
      storeName: "门店A - 朝阳店",
      supplierId: null,
      supplierName: null,
      materialId: null,
      materialName: null,
      markupType: "percentage",
      markupValue: 2.5,
      minMarkup: 0.5,
      maxMarkup: 30,
      priority: 3,
      enabled: true,
      createdAt: "2024-01-17",
    },
    {
      id: 4,
      name: "特定商品加价",
      storeId: null,
      storeName: null,
      supplierId: 2,
      supplierName: "粮油供应商B",
      materialId: 101,
      materialName: "金龙鱼大豆油5L",
      markupType: "fixed",
      markupValue: 5,
      minMarkup: null,
      maxMarkup: null,
      priority: 4,
      enabled: false,
      createdAt: "2024-01-18",
    },
  ]);

  const storeOptions = [
    { value: "1", label: "门店A - 朝阳店" },
    { value: "2", label: "门店B - 海淀店" },
    { value: "3", label: "门店C - 西城店" },
  ];

  const supplierOptions = [
    { value: "1", label: "生鲜供应商A" },
    { value: "2", label: "粮油供应商B" },
    { value: "3", label: "调味品供应商C" },
  ];

  const handleStatusChange = (id: number, enabled: boolean) => {
    setRulesData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
    showToast.success(`规则已${enabled ? "启用" : "禁用"}`);
  };

  const handleDelete = (id: number) => {
    setRulesData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("规则已删除");
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleBatchEnable = () => {
    setRulesData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, enabled: true } : item
      )
    );
    setSelectedRows([]);
    showToast.success("已批量启用选中规则");
  };

  const handleBatchDisable = () => {
    setRulesData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, enabled: false } : item
      )
    );
    setSelectedRows([]);
    showToast.success("已批量禁用选中规则");
  };

  const handleBatchDelete = () => {
    setRulesData((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
    showToast.success("已批量删除选中规则");
    setBatchDeleteOpen(false);
  };

  const filteredData = rulesData.filter((item) => {
    if (searchName && !item.name.includes(searchName)) return false;
    if (filterStore !== "all" && item.storeId?.toString() !== filterStore) return false;
    if (filterSupplier !== "all" && item.supplierId?.toString() !== filterSupplier) return false;
    if (filterStatus !== "all") {
      const statusMatch = filterStatus === "enabled" ? item.enabled : !item.enabled;
      if (!statusMatch) return false;
    }
    return true;
  });

  const stats = {
    total: rulesData.length,
    enabled: rulesData.filter((item) => item.enabled).length,
    disabled: rulesData.filter((item) => !item.enabled).length,
    storeSpecific: rulesData.filter((item) => item.storeId).length,
    supplierSpecific: rulesData.filter((item) => item.supplierId).length,
    materialSpecific: rulesData.filter((item) => item.materialId).length,
  };

  const allSelected =
    filteredData.length > 0 && selectedRows.length === filteredData.length;

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
    <AdminLayout>
      <WorkbenchShell
        badge="加价规则"
        title="加价规则管理"
        description="支持按门店、供应商、商品维度设置差异化加价策略"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              导出规则
            </Button>
            <Button size="sm" onClick={() => router.push("/admin/markup/rules/create")}>
              <Plus className="mr-2 h-4 w-4" />
              新建规则
            </Button>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索规则名称"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <Button variant="outline" size="sm">
              同步策略
            </Button>
          </div>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">过滤条件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">门店</span>
                  <Select value={filterStore} onValueChange={setFilterStore}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择门店" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部门店</SelectItem>
                      {storeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">供应商</span>
                  <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择供应商" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部供应商</SelectItem>
                      {supplierOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">状态</span>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="enabled">已启用</SelectItem>
                      <SelectItem value="disabled">已禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">规则概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">规则总数</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">已启用</span>
                  <span className="font-semibold text-emerald-500">
                    {stats.enabled}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">已禁用</span>
                  <span className="font-semibold text-muted-foreground">
                    {stats.disabled}
                  </span>
                </div>
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">门店规则</span>
                    <span className="font-semibold">{stats.storeSpecific}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">供应商规则</span>
                    <span className="font-semibold">{stats.supplierSpecific}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">商品规则</span>
                    <span className="font-semibold">{stats.materialSpecific}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        }
        results={
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b border-border/50">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">规则结果</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {filteredData.length} 条
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ListChecks className="h-3.5 w-3.5" />
                <span>按优先级执行</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {selectedRows.length > 0 && (
                <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border-b border-primary/10">
                  <span className="text-sm font-medium">
                    已选择 <span className="text-primary">{selectedRows.length}</span> 项
                  </span>
                  <div className="flex-1" />
                  <Button variant="outline" size="sm" onClick={handleBatchEnable}>
                    <Power className="mr-1 h-4 w-4" />
                    批量启用
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBatchDisable}>
                    <PowerOff className="mr-1 h-4 w-4" />
                    批量禁用
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setBatchDeleteOpen(true)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    批量删除
                  </Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead>规则名称</TableHead>
                    <TableHead>门店</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead>加价方式</TableHead>
                    <TableHead className="text-right">加价值</TableHead>
                    <TableHead className="text-center">优先级</TableHead>
                    <TableHead className="text-center">状态</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((rule) => (
                    <TableRow key={rule.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(rule.id)}
                          onCheckedChange={() => toggleSelect(rule.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        {rule.storeName || (
                          <Badge variant="secondary" className="text-xs">全部</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.supplierName || (
                          <Badge variant="secondary" className="text-xs">全部</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.materialName || (
                          <Badge variant="secondary" className="text-xs">全部</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rule.markupType === "fixed" ? "info" : "success"}
                          className="text-xs"
                        >
                          {rule.markupType === "fixed" ? "固定金额" : "百分比"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {rule.markupType === "fixed"
                          ? `¥${rule.markupValue}`
                          : `${rule.markupValue}%`}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium">
                          {rule.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => handleStatusChange(rule.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/markup/rules/${rule.id}/edit`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setDeleteId(rule.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 text-sm text-muted-foreground">
                <span>
                  共 <span className="font-medium text-foreground">{filteredData.length}</span> 条规则
                </span>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/20 border-b border-border/50">
            <CardTitle className="text-sm font-medium">规则洞察</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <StatGrid columns={3}>
              <StatCard title="规则总数" value={stats.total} icon={ListChecks} />
              <StatCard
                title="已启用"
                value={stats.enabled}
                icon={Power}
                valueClassName="text-emerald-500"
              />
              <StatCard
                title="已禁用"
                value={stats.disabled}
                icon={PowerOff}
                valueClassName="text-muted-foreground"
              />
            </StatGrid>
          </CardContent>
        </Card>
      </WorkbenchShell>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除这条规则吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Batch Delete Dialog */}
        <AlertDialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认批量删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除选中的 {selectedRows.length} 条规则吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBatchDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </AdminLayout>
  );
}
