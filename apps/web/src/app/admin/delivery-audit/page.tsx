"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface AuditItem {
  id: number;
  supplierId: number;
  supplierName: string;
  changeType: "min_order" | "delivery_days" | "delivery_area";
  oldValue: string;
  newValue: string;
  submitTime: string;
  status: "pending" | "approved" | "rejected";
  auditTime?: string;
  auditBy?: string;
  rejectReason?: string;
}

const rejectSchema = z.object({
  reason: z.string().min(1, "请输入驳回原因"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

export default function DeliveryAuditPage() {
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [rejectVisible, setRejectVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<AuditItem | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const rejectForm = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  const [auditData, setAuditData] = React.useState<AuditItem[]>([
    {
      id: 1,
      supplierId: 1,
      supplierName: "生鲜供应商A",
      changeType: "min_order",
      oldValue: "100元",
      newValue: "150元",
      submitTime: "2024-01-29 10:30:00",
      status: "pending",
    },
    {
      id: 2,
      supplierId: 2,
      supplierName: "粮油供应商B",
      changeType: "delivery_days",
      oldValue: "周一、周三、周五",
      newValue: "周一、周二、周三、周四、周五",
      submitTime: "2024-01-29 09:15:00",
      status: "pending",
    },
    {
      id: 3,
      supplierId: 3,
      supplierName: "调味品供应商C",
      changeType: "delivery_area",
      oldValue: "北京市朝阳区、海淀区",
      newValue: "北京市朝阳区、海淀区、西城区、东城区",
      submitTime: "2024-01-28 16:20:00",
      status: "approved",
      auditTime: "2024-01-28 17:00:00",
      auditBy: "管理员A",
    },
    {
      id: 4,
      supplierId: 4,
      supplierName: "冷冻食品供应商D",
      changeType: "min_order",
      oldValue: "200元",
      newValue: "50元",
      submitTime: "2024-01-28 14:10:00",
      status: "rejected",
      auditTime: "2024-01-28 15:30:00",
      auditBy: "管理员A",
      rejectReason: "起送价过低，不符合运营要求",
    },
  ]);

  const changeTypeLabels: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
    min_order: { label: "起送价", variant: "default" },
    delivery_days: { label: "配送日", variant: "success" },
    delivery_area: { label: "配送区域", variant: "warning" },
  };

  const statusLabels: Record<string, { label: string; variant: "warning" | "success" | "error" }> = {
    pending: { label: "待审核", variant: "warning" },
    approved: { label: "已通过", variant: "success" },
    rejected: { label: "已驳回", variant: "error" },
  };

  const pendingCount = auditData.filter((item) => item.status === "pending").length;

  const handleApprove = (id: number) => {
    setAuditData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "approved" as const,
              auditTime: new Date().toISOString().replace("T", " ").substring(0, 19),
              auditBy: "当前管理员",
            }
          : item
      )
    );
    showToast.success("审核已通过");
    setDetailVisible(false);
  };

  const handleReject = (values: RejectFormValues) => {
    if (!selectedItem) return;

    setAuditData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: "rejected" as const,
              auditTime: new Date().toISOString().replace("T", " ").substring(0, 19),
              auditBy: "当前管理员",
              rejectReason: values.reason,
            }
          : item
      )
    );
    showToast.success("已驳回");
    setRejectVisible(false);
    setDetailVisible(false);
    rejectForm.reset();
  };

  const filteredData = auditData.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="配送审核"
        title="配送设置审核"
        description="审核供应商提交的配送设置变更申请"
        meta={
          <>
            <Badge variant="outline" className="text-[11px]">
              共 {auditData.length} 条
            </Badge>
            <Badge variant="warning" className="text-[11px]">
              待审核 {pendingCount}
            </Badge>
          </>
        }
        toolbar={
          <div className="flex flex-wrap gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        results={
          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">审核记录</CardTitle>
                <Badge variant="outline" className="text-xs">
                  当前 {filteredData.length} 条
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>供应商名称</TableHead>
                    <TableHead>变更类型</TableHead>
                    <TableHead>原值</TableHead>
                    <TableHead>新值</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-[200px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.supplierName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={changeTypeLabels[item.changeType]?.variant}>
                          {changeTypeLabels[item.changeType]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {item.oldValue}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {item.newValue}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.submitTime}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusLabels[item.status]?.variant}>
                          {statusLabels[item.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setDetailVisible(true);
                            }}
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
                                onClick={() => {
                                  setSelectedItem(item);
                                  setRejectVisible(true);
                                }}
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
            </CardContent>
          </Card>
        }
      />

      {/* Detail Dialog */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>审核详情</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">供应商：</span>
                  <span className="ml-2 font-medium">{selectedItem.supplierName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">变更类型：</span>
                  <Badge className="ml-2" variant={changeTypeLabels[selectedItem.changeType]?.variant}>
                    {changeTypeLabels[selectedItem.changeType]?.label}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">提交时间：</span>
                  <span className="ml-2">{selectedItem.submitTime}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">状态：</span>
                  <Badge className="ml-2" variant={statusLabels[selectedItem.status]?.variant}>
                    {statusLabels[selectedItem.status]?.label}
                  </Badge>
                </div>
              </div>

              {/* Change Compare */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">变更对比</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">原值：</div>
                      <div className="p-3 rounded-md bg-destructive/10 text-sm">
                        {selectedItem.oldValue}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">新值：</div>
                      <div className="p-3 rounded-md bg-[hsl(var(--success))]/10 text-sm">
                        {selectedItem.newValue}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit History */}
              {selectedItem.status !== "pending" && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">审核记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                        <div>
                          <div className="text-sm">
                            {selectedItem.submitTime} 供应商提交变更申请
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full mt-2",
                            selectedItem.status === "approved"
                              ? "bg-[hsl(var(--success))]"
                              : "bg-[hsl(var(--error))]"
                          )}
                        />
                        <div>
                          <div className="text-sm">
                            {selectedItem.auditTime} {selectedItem.auditBy}{" "}
                            {selectedItem.status === "approved" ? "审核通过" : "审核驳回"}
                          </div>
                          {selectedItem.rejectReason && (
                            <div className="text-sm text-destructive mt-1">
                              驳回原因：{selectedItem.rejectReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {selectedItem?.status === "pending" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailVisible(false)}>
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectVisible(true);
                }}
              >
                驳回
              </Button>
              <Button onClick={() => handleApprove(selectedItem.id)}>
                通过
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectVisible} onOpenChange={setRejectVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回申请</DialogTitle>
            <DialogDescription>请输入驳回原因</DialogDescription>
          </DialogHeader>
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)} className="space-y-4">
              <FormField
                control={rejectForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>驳回原因</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入驳回原因" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRejectVisible(false);
                    rejectForm.reset();
                  }}
                >
                  取消
                </Button>
                <Button type="submit" variant="destructive">
                  确认驳回
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
