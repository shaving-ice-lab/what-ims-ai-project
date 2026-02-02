"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { showToast } from "@/lib/toast";
import { Check, Eye, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface ProductAuditItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  price: number;
  supplierId: number;
  supplierName: string;
  image: string;
  submitTime: string;
  status: "pending" | "approved" | "rejected";
  isNewBrand: boolean;
}

export default function ProductAuditPage() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Filters
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterSupplier, setFilterSupplier] = React.useState<string>("all");

  const supplierOptions = [
    { value: "1", label: "生鲜供应商A" },
    { value: "2", label: "粮油供应商B" },
    { value: "3", label: "调味品供应商C" },
  ];

  const [productData, setProductData] = React.useState<ProductAuditItem[]>([
    {
      id: 1,
      name: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      price: 58.0,
      supplierId: 2,
      supplierName: "粮油供应商B",
      image: "https://via.placeholder.com/80",
      submitTime: "2024-01-29 10:30:00",
      status: "pending",
      isNewBrand: false,
    },
    {
      id: 2,
      name: "新品牌酱油",
      brand: "新品牌",
      spec: "500ml/瓶",
      price: 15.0,
      supplierId: 3,
      supplierName: "调味品供应商C",
      image: "https://via.placeholder.com/80",
      submitTime: "2024-01-29 09:15:00",
      status: "pending",
      isNewBrand: true,
    },
    {
      id: 3,
      name: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      price: 68.0,
      supplierId: 2,
      supplierName: "粮油供应商B",
      image: "https://via.placeholder.com/80",
      submitTime: "2024-01-28 16:20:00",
      status: "approved",
      isNewBrand: false,
    },
    {
      id: 4,
      name: "测试产品",
      brand: "未知品牌",
      spec: "规格不明",
      price: 999.0,
      supplierId: 1,
      supplierName: "生鲜供应商A",
      image: "https://via.placeholder.com/80",
      submitTime: "2024-01-28 14:10:00",
      status: "rejected",
      isNewBrand: true,
    },
  ]);

  const pendingCount = productData.filter((item) => item.status === "pending").length;

  const handleBatchApprove = () => {
    setProductData((prev) =>
      prev.map((item) =>
        selectedRows.includes(item.id) ? { ...item, status: "approved" as const } : item
      )
    );
    showToast.success(`已批量通过 ${selectedRows.length} 个产品`);
    setSelectedRows([]);
  };

  const handleApprove = (id: number) => {
    setProductData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" as const } : item
      )
    );
    showToast.success("审核已通过");
  };

  const handleReject = (id: number) => {
    setProductData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" as const } : item
      )
    );
    showToast.success("已驳回");
  };

  const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "error" }> = {
    pending: { label: "待审核", variant: "warning" },
    approved: { label: "已通过", variant: "success" },
    rejected: { label: "已驳回", variant: "error" },
  };

  const filteredData = productData.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterSupplier !== "all" && item.supplierId.toString() !== filterSupplier) return false;
    return true;
  });

  const pendingItems = filteredData.filter((item) => item.status === "pending");
  const allPendingSelected =
    pendingItems.length > 0 &&
    pendingItems.every((item) => selectedRows.includes(item.id));

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(pendingItems.map((item) => item.id));
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
        badge="产品审核"
        title="产品审核"
        description="审核供应商提交的新产品信息"
        actions={
          selectedRows.length > 0 ? (
            <Button onClick={handleBatchApprove}>
              批量通过 ({selectedRows.length})
            </Button>
          ) : undefined
        }
        toolbar={
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>待审核 {pendingCount} 项</span>
            {pendingCount > 0 && <Badge variant="destructive">{pendingCount}</Badge>}
          </div>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">筛选条件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="rejected">已驳回</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="供应商筛选" />
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
              <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-medium">审核列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allPendingSelected}
                          onCheckedChange={toggleSelectAll}
                          disabled={pendingItems.length === 0}
                        />
                      </TableHead>
                      <TableHead>产品图片</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead className="text-right">价格</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="w-[180px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(item.id)}
                            onCheckedChange={() => toggleSelect(item.id)}
                            disabled={item.status !== "pending"}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.brand}
                            {item.isNewBrand && (
                              <Badge variant="secondary">新品牌</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.spec}</TableCell>
                        <TableCell className="text-right">
                          ¥{item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{item.supplierName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.submitTime}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[item.status]?.variant}>
                            {statusConfig[item.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/product-audit/${item.id}`)
                              }
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              详情
                            </Button>
                            {item.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[hsl(var(--success))]"
                                  onClick={() => handleApprove(item.id)}
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  通过
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => handleReject(item.id)}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  驳回
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>共 {filteredData.length} 条记录</span>
              </div>
            </CardContent>
          </Card>
        }
      />
    </AdminLayout>
  );
}
