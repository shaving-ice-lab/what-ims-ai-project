"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const editAdminSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(20),
  username: z.string(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号").optional().or(z.literal("")),
  permissions: z.array(z.string()).min(1, "请选择至少一项权限"),
});

type EditAdminFormValues = z.infer<typeof editAdminSchema>;

const permissionGroups = [
  {
    title: "订单相关",
    permissions: [
      { value: "order", label: "订单管理", desc: "查看和处理订单" },
      { value: "order_cancel", label: "订单取消", desc: "审核取消申请" },
    ],
  },
  {
    title: "用户相关",
    permissions: [
      { value: "store", label: "门店管理", desc: "管理门店账号和信息" },
      { value: "supplier", label: "供应商管理", desc: "管理供应商账号和信息" },
    ],
  },
  {
    title: "商品相关",
    permissions: [
      { value: "material", label: "物料管理", desc: "管理物料和分类" },
      { value: "product_audit", label: "产品审核", desc: "审核供应商产品" },
    ],
  },
  {
    title: "财务相关",
    permissions: [
      { value: "markup", label: "加价管理", desc: "配置加价规则" },
      { value: "report", label: "报表统计", desc: "查看统计报表" },
    ],
  },
];

const sensitivePermissions = ["payment_config", "api_config", "admin_manage"];

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  const form = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      permissions: [],
    },
  });

  React.useEffect(() => {
    const loadAdminData = async () => {
      setInitialLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData: Record<string, EditAdminFormValues> = {
          "2": {
            name: "运营管理员",
            username: "operator",
            phone: "139****9999",
            permissions: ["order", "store", "supplier"],
          },
          "3": {
            name: "财务管理员",
            username: "finance",
            phone: "137****7777",
            permissions: ["order", "report", "markup"],
          },
          "4": {
            name: "客服管理员",
            username: "support",
            phone: "",
            permissions: ["order", "store"],
          },
        };

        const data = mockData[adminId] ?? mockData["2"];
        if (data) {
          form.reset(data);
        }
      } catch {
        showToast.error("加载数据失败");
      } finally {
        setInitialLoading(false);
      }
    };

    loadAdminData();
  }, [adminId, form]);

  const onSubmit = async (values: EditAdminFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating admin:", values);
      showToast.success("管理员信息更新成功");
      router.push("/admin/admins");
    } catch {
      showToast.error("更新失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    showToast.success("密码已重置为默认密码：123456");
  };

  const handleDisable = async () => {
    showToast.success("管理员已禁用");
    router.push("/admin/admins");
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <WorkbenchShell
          badge="管理员管理"
          title="编辑子管理员"
          description="加载管理员信息中..."
          results={
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          }
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="管理员管理"
        title="编辑子管理员"
        description={`修改管理员信息和权限配置，ID: ${adminId}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/admins")}
          >
            返回列表
          </Button>
        }
        results={
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>姓名</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入管理员姓名" maxLength={20} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>登录账号</FormLabel>
                          <FormControl>
                            <Input disabled {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>手机号</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入手机号（可选）" maxLength={11} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">权限分配</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>权限说明</AlertTitle>
                      <AlertDescription>
                        子管理员无法获得支付配置、API配置、管理员管理等敏感权限
                      </AlertDescription>
                    </Alert>

                    <FormField
                      control={form.control}
                      name="permissions"
                      render={() => (
                        <FormItem>
                          {permissionGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="space-y-3">
                              <FormLabel className="text-sm font-medium">
                                {group.title}
                              </FormLabel>
                              <div className="ml-4 space-y-2">
                                {group.permissions.map((perm) => (
                                  <FormField
                                    key={perm.value}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={perm.value}
                                          className="flex items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(perm.value)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, perm.value])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== perm.value
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-0 leading-none">
                                            <FormLabel className="font-normal cursor-pointer">
                                              {perm.label}
                                            </FormLabel>
                                            <FormDescription>
                                              {perm.desc}
                                            </FormDescription>
                                          </div>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              {groupIndex < permissionGroups.length - 1 && (
                                <Separator className="my-4" />
                              )}
                            </div>
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-sm text-muted-foreground">
                      敏感权限（不可选）：
                      {sensitivePermissions.map((p) => (
                        <span key={p} className="ml-2 line-through">
                          {p}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">账号操作</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">重置密码</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>重置密码</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要重置该管理员的密码吗？密码将被重置为默认密码。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetPassword}>
                              确定
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">禁用账号</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>禁用管理员</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要禁用该管理员吗？禁用后该账号将无法登录。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDisable}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              确定禁用
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    保存修改
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        }
      />
    </AdminLayout>
  );
}
