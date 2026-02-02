"use client";

import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CheckCircle,
    Clock,
    Eye,
    Percent,
    Send,
    XCircle,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface WebhookLogItem {
  id: number;
  pushTime: string;
  targetType: "store" | "supplier";
  targetName: string;
  eventType: string;
  orderId: string | null;
  status: "success" | "failed" | "pending";
  responseCode: number | null;
  duration: number;
  requestBody: string;
  responseBody: string;
  retryCount: number;
}

export default function WebhookLogsPage() {
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<WebhookLogItem | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Filters
  const [filterTargetType, setFilterTargetType] = React.useState<string>("all");
  const [filterEventType, setFilterEventType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const eventTypeOptions = [
    { value: "order_created", label: "订单创建" },
    { value: "order_paid", label: "订单支付" },
    { value: "order_confirmed", label: "订单确认" },
    { value: "order_shipped", label: "订单配送" },
    { value: "order_completed", label: "订单完成" },
    { value: "order_cancelled", label: "订单取消" },
  ];

  const logsData: WebhookLogItem[] = [
    {
      id: 1,
      pushTime: "2024-01-29 14:30:25",
      targetType: "supplier",
      targetName: "生鲜供应商A",
      eventType: "order_created",
      orderId: "ORD202401290001",
      status: "success",
      responseCode: 200,
      duration: 156,
      requestBody: JSON.stringify(
        { order_id: "ORD202401290001", event: "order_created" },
        null,
        2
      ),
      responseBody: JSON.stringify({ code: 0, message: "success" }, null, 2),
      retryCount: 0,
    },
    {
      id: 2,
      pushTime: "2024-01-29 14:25:10",
      targetType: "store",
      targetName: "门店A - 朝阳店",
      eventType: "order_confirmed",
      orderId: "ORD202401290002",
      status: "success",
      responseCode: 200,
      duration: 89,
      requestBody: JSON.stringify(
        { order_id: "ORD202401290002", event: "order_confirmed" },
        null,
        2
      ),
      responseBody: JSON.stringify({ code: 0, message: "success" }, null, 2),
      retryCount: 0,
    },
    {
      id: 3,
      pushTime: "2024-01-29 14:20:00",
      targetType: "supplier",
      targetName: "粮油供应商B",
      eventType: "order_paid",
      orderId: "ORD202401290003",
      status: "failed",
      responseCode: 500,
      duration: 3024,
      requestBody: JSON.stringify(
        { order_id: "ORD202401290003", event: "order_paid" },
        null,
        2
      ),
      responseBody: JSON.stringify({ error: "Internal Server Error" }, null, 2),
      retryCount: 3,
    },
    {
      id: 4,
      pushTime: "2024-01-29 14:15:30",
      targetType: "store",
      targetName: "门店B - 海淀店",
      eventType: "order_shipped",
      orderId: "ORD202401290004",
      status: "success",
      responseCode: 200,
      duration: 112,
      requestBody: JSON.stringify(
        { order_id: "ORD202401290004", event: "order_shipped" },
        null,
        2
      ),
      responseBody: JSON.stringify({ code: 0, message: "success" }, null, 2),
      retryCount: 0,
    },
  ];

  const statsData = {
    totalPush: logsData.length,
    successCount: logsData.filter((l) => l.status === "success").length,
    failedCount: logsData.filter((l) => l.status === "failed").length,
    successRate: (
      (logsData.filter((l) => l.status === "success").length / logsData.length) *
      100
    ).toFixed(1),
    avgDuration: Math.round(
      logsData.reduce((sum, l) => sum + l.duration, 0) / logsData.length
    ),
  };

  const statusConfig: Record<
    string,
    { label: string; variant: "success" | "error" | "warning" }
  > = {
    success: { label: "成功", variant: "success" },
    failed: { label: "失败", variant: "error" },
    pending: { label: "处理中", variant: "warning" },
  };

  const filteredData = logsData.filter((item) => {
    if (filterTargetType !== "all" && item.targetType !== filterTargetType)
      return false;
    if (filterEventType !== "all" && item.eventType !== filterEventType)
      return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="Webhook日志"
        title="Webhook推送日志"
        description="查看系统Webhook推送记录和状态"
        meta={
          <>
            <Badge variant="outline" className="text-[11px]">
              近7天
            </Badge>
            <Badge variant="success" className="text-[11px]">
              成功率 {statsData.successRate}%
            </Badge>
          </>
        }
        toolbar={
          <div className="flex flex-wrap gap-3">
            <Select value={filterTargetType} onValueChange={setFilterTargetType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="目标类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="store">门店</SelectItem>
                <SelectItem value="supplier">供应商</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEventType} onValueChange={setFilterEventType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="事件类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部事件</SelectItem>
                {eventTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="推送状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        }
        results={
          <div className="space-y-6 animate-fade-in">
            <StatGrid columns={5}>
              <StatCard
                title="总推送数"
                value={statsData.totalPush.toString()}
                icon={Send}
              />
              <StatCard
                title="成功数"
                value={statsData.successCount.toString()}
                icon={CheckCircle}
                valueClassName="text-[hsl(var(--success))]"
              />
              <StatCard
                title="失败数"
                value={statsData.failedCount.toString()}
                icon={XCircle}
                valueClassName="text-[hsl(var(--error))]"
              />
              <StatCard
                title="成功率"
                value={`${statsData.successRate}%`}
                icon={Percent}
              />
              <StatCard
                title="平均耗时"
                value={`${statsData.avgDuration}ms`}
                icon={Clock}
              />
            </StatGrid>

            <Card>
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">推送记录</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    当前 {filteredData.length} 条
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>推送时间</TableHead>
                      <TableHead>目标类型</TableHead>
                      <TableHead>目标名称</TableHead>
                      <TableHead>事件类型</TableHead>
                      <TableHead>关联订单</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>响应码</TableHead>
                      <TableHead>耗时</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground">
                          {log.pushTime}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={log.targetType === "store" ? "default" : "success"}
                          >
                            {log.targetType === "store" ? "门店" : "供应商"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{log.targetName}</TableCell>
                        <TableCell>
                          {eventTypeOptions.find((o) => o.value === log.eventType)
                            ?.label || log.eventType}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.orderId || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[log.status]?.variant}>
                            {statusConfig[log.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.responseCode || "-"}</TableCell>
                        <TableCell>{log.duration}ms</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log);
                              setDetailVisible(true);
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        }
      />

      {/* Detail Dialog */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>推送详情</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">推送时间</span>
                  <p>{selectedLog.pushTime}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">状态</span>
                  <Badge variant={statusConfig[selectedLog.status]?.variant}>
                    {statusConfig[selectedLog.status]?.label}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">目标类型</span>
                  <p>
                    {selectedLog.targetType === "store" ? "门店" : "供应商"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">目标名称</span>
                  <p>{selectedLog.targetName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">事件类型</span>
                  <p>
                    {eventTypeOptions.find(
                      (o) => o.value === selectedLog.eventType
                    )?.label || selectedLog.eventType}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">关联订单</span>
                  <p className="font-mono">{selectedLog.orderId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">响应状态码</span>
                  <p>{selectedLog.responseCode || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">耗时</span>
                  <p>{selectedLog.duration}ms</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <span className="text-muted-foreground">重试次数</span>
                <p>{selectedLog.retryCount}</p>
              </div>

              <Separator />

              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">请求内容</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="text-xs p-3 bg-muted rounded-b-md overflow-auto">
                    {selectedLog.requestBody}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">响应内容</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <pre
                    className={`text-xs p-3 rounded-b-md overflow-auto ${
                      selectedLog.status === "success"
                        ? "bg-[hsl(var(--success))]/10"
                        : "bg-destructive/10"
                    }`}
                  >
                    {selectedLog.responseBody}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
