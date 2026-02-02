"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
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
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createAdminSchema = z
  .object({
    name: z.string().min(1, "请输入姓名"),
    username: z
      .string()
      .min(4, "账号长度至少4位")
      .max(20, "账号长度最多20位")
      .regex(/^[a-zA-Z0-9_]+$/, "账号只能包含字母、数字和下划线"),
    password: z.string().min(6, "密码长度至少6位"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    permissions: z.array(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

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

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      permissions: [],
    },
  });

  const onSubmit = async (values: CreateAdminFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating admin:", values);
      showToast.success("子管理员创建成功");
      router.push("/admin/admins");
    } catch {
      showToast.error("创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="管理员管理"
        title="创建子管理员"
        description="创建新的子管理员账号，并分配相应权限"
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
                            <Input placeholder="请输入管理员姓名" {...field} />
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
                            <Input placeholder="请输入登录账号" {...field} />
                          </FormControl>
                          <FormDescription>
                            账号只能包含字母、数字和下划线，长度4-20
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>登录密码</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="请输入登录密码"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>确认密码</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="请再次输入密码"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>手机号（可选）</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入手机号" {...field} />
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
                            <div key={group.title} className="space-y-3">
                              <h4 className="font-medium text-sm">{group.title}</h4>
                              <div className="ml-4 space-y-2">
                                {group.permissions.map((perm) => (
                                  <FormField
                                    key={perm.value}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => {
                                      return (
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                perm.value
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      perm.value,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== perm.value
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-0.5">
                                            <FormLabel className="font-normal cursor-pointer">
                                              {perm.label}
                                            </FormLabel>
                                            <FormDescription className="text-xs">
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

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    创建管理员
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
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
