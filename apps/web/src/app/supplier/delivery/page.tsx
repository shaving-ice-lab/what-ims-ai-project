"use client";

import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, Save, XCircle } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const deliverySchema = z.object({
  minOrderAmount: z.number().min(0, "起送价不能为负数"),
  deliveryDays: z.array(z.string()).min(1, "请至少选择一个配送日"),
  deliveryMode: z.enum(["self_delivery", "express_delivery"]),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

const deliveryDayOptions = [
  { label: "周一", value: "1" },
  { label: "周二", value: "2" },
  { label: "周三", value: "3" },
  { label: "周四", value: "4" },
  { label: "周五", value: "5" },
  { label: "周六", value: "6" },
  { label: "周日", value: "0" },
];

const deliveryModeOptions = [
  {
    value: "self_delivery",
    label: "自配送",
    desc: "供应商自行安排配送，适合本地配送",
  },
  {
    value: "express_delivery",
    label: "快递配送",
    desc: "通过快递公司配送，需上传运单号",
  },
];

const initialValues: DeliveryFormValues = {
  minOrderAmount: 100,
  deliveryDays: ["1", "3", "5"],
  deliveryMode: "self_delivery",
};

export default function SupplierDeliveryPage() {
  const [loading, setLoading] = React.useState(false);
  const [auditStatus, setAuditStatus] = React.useState<
    "none" | "pending" | "approved" | "rejected"
  >("approved");
  const [rejectReason] = React.useState<string | null>(null);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: DeliveryFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving delivery settings:", values);
      setAuditStatus("pending");
      showToast.success("配送设置已提交审核");
    } catch {
      showToast.error("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="配送设置"
        title="配送设置"
        description="设置您的起送价、配送日和配送模式，修改后需要管理员审核"
        results={
          <div className="max-w-2xl space-y-6 animate-fade-in">
            {/* Audit Status Alerts */}
            {auditStatus === "pending" && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>配送设置审核中</AlertTitle>
                <AlertDescription>
                  您的配送设置变更正在等待管理员审核，审核期间将使用原有设置
                </AlertDescription>
              </Alert>
            )}

            {auditStatus === "rejected" && rejectReason && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>配送设置审核未通过</AlertTitle>
                <AlertDescription>驳回原因：{rejectReason}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Min Order Amount */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">起送价设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="minOrderAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最低起送价</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">¥</span>
                              <Input
                                type="number"
                                step="0.01"
                                className="w-40"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            门店订单金额需达到此金额才能下单
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-muted-foreground">
                      当前生效起送价：
                      <span className="font-medium text-foreground ml-1">
                        ¥{initialValues.minOrderAmount}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Days */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">配送日设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deliveryDays"
                      render={() => (
                        <FormItem>
                          <FormLabel>选择配送日</FormLabel>
                          <div className="flex flex-wrap gap-4 mt-2">
                            {deliveryDayOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="deliveryDays"
                                render={({ field }) => {
                                  return (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  option.value,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormDescription>
                            门店只能选择您设置的配送日进行下单
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      当前生效配送日：
                      {initialValues.deliveryDays.map((d) => {
                        const day = deliveryDayOptions.find((o) => o.value === d);
                        return (
                          <Badge key={d} variant="secondary" className="ml-2">
                            {day?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Mode */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">配送模式设置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="deliveryMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择配送模式</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="mt-2 space-y-3"
                            >
                              {deliveryModeOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-start space-x-3"
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                  />
                                  <div className="grid gap-0.5 leading-none">
                                    <label
                                      htmlFor={option.value}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {option.label}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {option.desc}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  提交审核
                </Button>
              </form>
            </Form>
          </div>
        }
      />
    </SupplierLayout>
  );
}
