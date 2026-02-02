"use client";

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
import { Input } from "@/components/ui/input";
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
import { Download, Eye, Search } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface LogItem {
  id: number;
  operateTime: string;
  userName: string;
  userType: "admin" | "supplier" | "store";
  module: string;
  operateType: string;
  description: string;
  ipAddress: string;
  beforeData: string | null;
  afterData: string | null;
}

export default function OperationLogsPage() {
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<LogItem | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Filters
  const [searchUser, setSearchUser] = React.useState("");
  const [filterModule, setFilterModule] = React.useState<string>("all");
  const [filterType, setFilterType] = React.useState<string>("all");

  const logsData: LogItem[] = [
    {
      id: 1,
      operateTime: "2024-01-29 14:30:25",
      userName: "管理员A",
      userType: "admin",
      module: "加价管理",
      operateType: "新增",
      description: "新建加价规则：默认加价规则",
      ipAddress: "192.168.1.100",
      beforeData: null,
      afterData: JSON.stringify(
        { name: "默认加价规则", markupType: "percentage", markupValue: 3 },
        null,
        2
      ),
    },
    {
      id: 2,
      operateTime: "2024-01-29 14:25:10",
      userName: "管理员A",
      userType: "admin",
      module: "系统设置",
      operateType: "修改",
      description: "修改系统参数：支付超时时间",
      ipAddress: "192.168.1.100",
      beforeData: JSON.stringify({ payment_timeout: 30 }, null, 2),
      afterData: JSON.stringify({ payment_timeout: 45 }, null, 2),
    },
    {
      id: 3,
      operateTime: "2024-01-29 13:45:00",
      userName: "生鲜供应商A",
      userType: "supplier",
      module: "物料价格",
      operateType: "修改",
      description: "修改物料价格：金龙鱼大豆油5L",
      ipAddress: "10.0.0.50",
      beforeData: JSON.stringify({ price: 56.0 }, null, 2),
      afterData: JSON.stringify({ price: 58.0 }, null, 2),
    },
    {
      id: 4,
      operateTime: "2024-01-29 12:30:15",
      userName: "门店A",
      userType: "store",
      module: "订单管理",
      operateType: "新增",
      description: "创建订单：ORD202401290001",
      ipAddress: "10.0.1.20",
      beforeData: null,
      afterData: JSON.stringify(
        { orderNo: "ORD202401290001", amount: 358.0 },
        null,
        2
      ),
    },
    {
      id: 5,
      operateTime: "2024-01-29 11:20:00",
      userName: "管理员B",
      userType: "admin",
      module: "用户管理",
      operateType: "删除",
      description: "禁用供应商账号：测试供应商",
      ipAddress: "192.168.1.101",
      beforeData: JSON.stringify({ status: "active" }, null, 2),
      afterData: JSON.stringify({ status: "inactive" }, null, 2),
    },
  ];

  const moduleOptions = [
    { value: "加价管理", label: "加价管理" },
    { value: "系统设置", label: "系统设置" },
    { value: "物料价格", label: "物料价格" },
    { value: "订单管理", label: "订单管理" },
    { value: "用户管理", label: "用户管理" },
  ];

  const typeOptions = [
    { value: "新增", label: "新增" },
    { value: "修改", label: "修改" },
    { value: "删除", label: "删除" },
    { value: "查询", label: "查询" },
    { value: "登录", label: "登录" },
    { value: "登出", label: "登出" },
  ];

  const userTypeConfig: Record<
    string,
    { label: string; variant: "default" | "success" | "warning" }
  > = {
    admin: { label: "管理员", variant: "default" },
    supplier: { label: "供应商", variant: "success" },
    store: { label: "门店", variant: "warning" },
  };

  const operateTypeConfig: Record<
    string,
    { variant: "success" | "default" | "error" | "secondary" }
  > = {
    新增: { variant: "success" },
    修改: { variant: "default" },
    删除: { variant: "error" },
    查询: { variant: "secondary" },
    登录: { variant: "default" },
    登出: { variant: "secondary" },
  };

  const filteredData = logsData.filter((item) => {
    if (searchUser && !item.userName.includes(searchUser)) return false;
    if (filterModule !== "all" && item.module !== filterModule) return false;
    if (filterType !== "all" && item.operateType !== filterType) return false;
    return true;
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="操作日志"
        title="操作日志"
        description="查看系统操作日志，追踪用户行为和数据变更记录"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出日志
          </Button>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">筛选条件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索用户"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue placeholder="模块" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部模块</SelectItem>
                  {moduleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="操作类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {typeOptions.map((opt) => (
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
              <CardTitle className="text-sm font-medium">日志列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>操作时间</TableHead>
                      <TableHead>操作用户</TableHead>
                      <TableHead>用户类型</TableHead>
                      <TableHead>模块名称</TableHead>
                      <TableHead>操作类型</TableHead>
                      <TableHead>操作描述</TableHead>
                      <TableHead>IP地址</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground">
                          {log.operateTime}
                        </TableCell>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>
                          <Badge variant={userTypeConfig[log.userType]?.variant}>
                            {userTypeConfig[log.userType]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell>
                          <Badge variant={operateTypeConfig[log.operateType]?.variant}>
                            {log.operateType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.description}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ipAddress}
                        </TableCell>
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
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>共 {filteredData.length} 条记录</span>
              </div>
            </CardContent>
          </Card>
        }
      />

      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>操作详情</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">操作时间</span>
                  <p>{selectedLog.operateTime}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">操作用户</span>
                  <p>{selectedLog.userName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">用户类型</span>
                  <Badge variant={userTypeConfig[selectedLog.userType]?.variant}>
                    {userTypeConfig[selectedLog.userType]?.label}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">IP地址</span>
                  <p className="font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">模块名称</span>
                  <p>{selectedLog.module}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">操作类型</span>
                  <Badge variant={operateTypeConfig[selectedLog.operateType]?.variant}>
                    {selectedLog.operateType}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <span className="text-muted-foreground">操作描述</span>
                <p>{selectedLog.description}</p>
              </div>

              {(selectedLog.beforeData || selectedLog.afterData) && (
                <>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedLog.beforeData && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">
                            操作前数据
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <pre className="text-xs p-3 bg-destructive/10 rounded-b-md overflow-auto">
                            {selectedLog.beforeData}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                    {selectedLog.afterData && (
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">
                            操作后数据
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <pre className="text-xs p-3 bg-[hsl(var(--success))]/10 rounded-b-md overflow-auto">
                            {selectedLog.afterData}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
