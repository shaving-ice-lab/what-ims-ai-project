"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
    Crown,
    Edit,
    KeyRound,
    MoreHorizontal,
    Plus,
    Search,
    UserCheck,
    UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface AdminItem {
  id: number;
  name: string;
  username: string;
  phone: string | null;
  isMaster: boolean;
  permissions: string[];
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string | null;
}

const permissionLabels: Record<string, string> = {
  all: "全部权限",
  order: "订单管理",
  store: "门店管理",
  supplier: "供应商管理",
  material: "物料管理",
  markup: "加价管理",
  report: "报表统计",
  setting: "系统设置",
};

export default function AdminListPage() {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    type: "status" | "reset";
    admin: AdminItem | null;
  }>({ open: false, type: "status", admin: null });

  const [adminsData, setAdminsData] = React.useState<AdminItem[]>([
    {
      id: 1,
      name: "主管理员",
      username: "admin",
      phone: "138****8888",
      isMaster: true,
      permissions: ["all"],
      status: "active",
      createdAt: "2024-01-01",
      lastLogin: "2024-01-29 14:30:00",
    },
    {
      id: 2,
      name: "运营管理员",
      username: "operator",
      phone: "139****9999",
      isMaster: false,
      permissions: ["order", "store", "supplier"],
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-29 10:15:00",
    },
    {
      id: 3,
      name: "财务管理员",
      username: "finance",
      phone: "137****7777",
      isMaster: false,
      permissions: ["order", "report", "markup"],
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-28 16:20:00",
    },
    {
      id: 4,
      name: "客服管理员",
      username: "support",
      phone: null,
      isMaster: false,
      permissions: ["order", "store"],
      status: "inactive",
      createdAt: "2024-01-20",
      lastLogin: null,
    },
  ]);

  const handleToggleStatus = (admin: AdminItem) => {
    const newStatus = admin.status === "active" ? "inactive" : "active";
    setAdminsData((prev) =>
      prev.map((item) =>
        item.id === admin.id ? { ...item, status: newStatus } : item
      )
    );
    showToast.success(`管理员已${newStatus === "active" ? "启用" : "禁用"}`);
    setConfirmDialog({ open: false, type: "status", admin: null });
  };

  const handleResetPassword = () => {
    showToast.success("密码已重置为默认密码：123456");
    setConfirmDialog({ open: false, type: "reset", admin: null });
  };

  const filteredData = adminsData.filter(
    (item) =>
      item.name.includes(searchText) || item.username.includes(searchText)
  );
  const activeCount = adminsData.filter((item) => item.status === "active").length;
  const inactiveCount = adminsData.length - activeCount;

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="管理员管理"
        title="管理员管理"
        description="管理系统管理员账号，仅主管理员可访问此页面"
        actions={
          <Button onClick={() => router.push("/admin/admins/create")}>
            <Plus className="mr-2 h-4 w-4" />
            创建子管理员
          </Button>
        }
        meta={
          <>
            <Badge variant="outline" className="text-[11px]">
              共 {adminsData.length} 位
            </Badge>
            <Badge variant="success" className="text-[11px]">
              启用 {activeCount}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              禁用 {inactiveCount}
            </Badge>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索管理员名称或用户名"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
          </div>
        }
        results={
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">管理员列表</CardTitle>
                <Badge variant="outline" className="text-xs">
                  当前 {filteredData.length} 位
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>管理员</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>权限</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((admin) => (
                    <TableRow key={admin.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-0">
                            <AvatarFallback
                              className={cn(
                                admin.isMaster
                                  ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              {admin.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{admin.name}</span>
                              {admin.isMaster && (
                                <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white">
                                  <Crown className="h-3 w-3" />
                                  主管理员
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              @{admin.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {admin.phone || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.slice(0, 3).map((p) => (
                            <Badge
                              key={p}
                              variant={p === "all" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {permissionLabels[p] || p}
                            </Badge>
                          ))}
                          {admin.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{admin.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {admin.createdAt}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            admin.status === "active" ? "success" : "secondary"
                          }
                        >
                          {admin.status === "active" ? "启用" : "禁用"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {admin.lastLogin || "从未登录"}
                      </TableCell>
                      <TableCell>
                        {admin.isMaster ? (
                          <span className="text-xs text-muted-foreground">
                            不可操作
                          </span>
                        ) : (
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
                                  router.push(`/admin/admins/${admin.id}/edit`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    type: "reset",
                                    admin,
                                  })
                                }
                              >
                                <KeyRound className="mr-2 h-4 w-4" />
                                重置密码
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    type: "status",
                                    admin,
                                  })
                                }
                                className={
                                  admin.status === "active"
                                    ? "text-destructive focus:text-destructive"
                                    : ""
                                }
                              >
                                {admin.status === "active" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    禁用
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    启用
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        }
      />

      {/* Confirm Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "reset"
                ? "重置密码"
                : confirmDialog.admin?.status === "active"
                ? "禁用管理员"
                : "启用管理员"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "reset"
                ? `确定要重置 ${confirmDialog.admin?.name} 的密码吗？密码将被重置为默认密码。`
                : `确定要${
                    confirmDialog.admin?.status === "active" ? "禁用" : "启用"
                  } ${confirmDialog.admin?.name} 吗？`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog.type === "reset") {
                  handleResetPassword();
                } else if (confirmDialog.admin) {
                  handleToggleStatus(confirmDialog.admin);
                }
              }}
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
