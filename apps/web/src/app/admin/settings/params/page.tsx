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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, Loader2, Lock, Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const systemParamsSchema = z.object({
  order_cancel_threshold: z.number().min(1).max(1440),
  order_cancel_request_timeout: z.number().min(1).max(72),
  payment_timeout: z.number().min(1).max(60),
  payment_polling_interval: z.number().min(1).max(10),
  unpaid_order_cancel_timeout: z.number().min(5).max(1440),
  service_fee_rate: z.number().min(0).max(5),
  service_fee_enabled: z.boolean(),
  webhook_retry_times: z.number().min(0).max(10),
  webhook_retry_interval: z.number().min(1).max(60),
  webhook_timeout: z.number().min(1).max(30),
  markup_global_enabled: z.boolean(),
  cart_expire_days: z.number().min(1).max(30),
  order_no_prefix: z.string().min(1).max(10),
});

type SystemParamsValues = z.infer<typeof systemParamsSchema>;

const initialValues: SystemParamsValues = {
  order_cancel_threshold: 60,
  order_cancel_request_timeout: 24,
  payment_timeout: 30,
  payment_polling_interval: 3,
  unpaid_order_cancel_timeout: 30,
  service_fee_rate: 0.6,
  service_fee_enabled: true,
  webhook_retry_times: 3,
  webhook_retry_interval: 5,
  webhook_timeout: 10,
  markup_global_enabled: true,
  cart_expire_days: 7,
  order_no_prefix: "ORD",
};

export default function SystemParamsPage() {
  const [loading, setLoading] = React.useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [pendingValues, setPendingValues] = React.useState<SystemParamsValues | null>(null);
  const [password, setPassword] = React.useState("");

  const form = useForm<SystemParamsValues>({
    resolver: zodResolver(systemParamsSchema),
    defaultValues: initialValues,
  });

  const checkSensitiveChanges = (values: SystemParamsValues): boolean => {
    return (
      values.service_fee_rate !== initialValues.service_fee_rate ||
      values.service_fee_enabled !== initialValues.service_fee_enabled ||
      values.markup_global_enabled !== initialValues.markup_global_enabled
    );
  };

  const saveConfig = async (values: SystemParamsValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving config:", values);
      showToast.success("系统参数保存成功");
    } catch {
      showToast.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: SystemParamsValues) => {
    if (checkSensitiveChanges(values)) {
      setPendingValues(values);
      setPasswordDialogOpen(true);
      return;
    }
    await saveConfig(values);
  };

  const handlePasswordConfirm = async () => {
    if (password !== "admin123") {
      showToast.error("密码错误");
      return;
    }
    setPasswordDialogOpen(false);
    setPassword("");
    if (pendingValues) {
      await saveConfig(pendingValues);
      setPendingValues(null);
    }
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="系统参数"
        title="系统参数配置"
        description="配置系统运行的各项参数，修改敏感配置需要密码确认"
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">修改提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>敏感配置修改需要管理员密码确认。</p>
              <p>建议在业务低峰期进行配置调整。</p>
              <p>保存后请通知相关业务负责人。</p>
            </CardContent>
          </Card>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">订单相关配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="order_cancel_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>门店自主取消时限</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            门店在下单后多长时间内可以自主取消订单
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">分钟</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order_cancel_request_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>取消申请超时提醒</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            取消申请超过该时间未处理时发送提醒
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">小时</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">支付相关配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="payment_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>支付超时时间</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            用户发起支付后的等待超时时间
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">分钟</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unpaid_order_cancel_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>未支付订单自动取消时间</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            订单未支付超过该时间后自动取消
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">分钟</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">费率相关配置</CardTitle>
                  <Lock className="h-4 w-4 text-[hsl(var(--warning))]" />
                  <Badge variant="warning">敏感配置</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="service_fee_rate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>支付手续费费率</FormLabel>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            支付时收取的手续费比例
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="service_fee_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>手续费转嫁开关</FormLabel>
                        <FormDescription>
                          开启后手续费将转嫁给门店
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Webhook推送配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="webhook_retry_times"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>推送重试次数</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">次</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webhook_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>推送超时时间</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">秒</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">加价相关配置</CardTitle>
                  <Lock className="h-4 w-4 text-[hsl(var(--warning))]" />
                  <Badge variant="warning">敏感配置</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="markup_global_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>全局加价总开关</FormLabel>
                        <FormDescription>
                          关闭后所有加价规则将不生效
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他系统参数</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cart_expire_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>购物车过期时间</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">天</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order_no_prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>订单编号前缀</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-32" maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              保存配置
            </Button>
          </form>
        </Form>
      </WorkbenchShell>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>敏感配置修改确认</DialogTitle>
            <DialogDescription>
              您正在修改敏感配置，请输入管理员密码确认
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPasswordDialogOpen(false);
                setPassword("");
              }}
            >
              取消
            </Button>
            <Button onClick={handlePasswordConfirm}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
