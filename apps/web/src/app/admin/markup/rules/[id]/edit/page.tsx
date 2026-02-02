"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "请输入规则名称").max(50, "规则名称不能超过50个字符"),
  storeId: z.string().optional(),
  supplierId: z.string().optional(),
  materialId: z.string().optional(),
  markupType: z.enum(["fixed", "percentage"]),
  markupValue: z.string().min(1, "请输入加价值").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "加价值不能为负数"
  ),
  minMarkup: z.string().optional(),
  maxMarkup: z.string().optional(),
  enabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditMarkupRulePage() {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      storeId: "",
      supplierId: "",
      materialId: "",
      markupType: "percentage",
      markupValue: "",
      minMarkup: "",
      maxMarkup: "",
      enabled: true,
    },
  });

  const markupType = form.watch("markupType");
  const storeId = form.watch("storeId");
  const supplierId = form.watch("supplierId");
  const materialId = form.watch("materialId");

  const storeOptions = [
    { value: "1", label: "门店A - 朝阳店" },
    { value: "2", label: "门店B - 海淀店" },
    { value: "3", label: "门店C - 西城店" },
    { value: "4", label: "门店D - 东城店" },
    { value: "5", label: "门店E - 丰台店" },
  ];

  const supplierOptions = [
    { value: "1", label: "生鲜供应商A" },
    { value: "2", label: "粮油供应商B" },
    { value: "3", label: "调味品供应商C" },
    { value: "4", label: "冷冻食品供应商D" },
    { value: "5", label: "饮料供应商E" },
  ];

  const materialOptions = [
    { value: "101", label: "金龙鱼大豆油5L" },
    { value: "102", label: "福临门花生油5L" },
    { value: "103", label: "海天酱油500ml" },
    { value: "104", label: "太太乐鸡精200g" },
    { value: "105", label: "中粮大米10kg" },
  ];

  const storeLabel =
    storeOptions.find((opt) => opt.value === storeId)?.label || "全部门店";
  const supplierLabel =
    supplierOptions.find((opt) => opt.value === supplierId)?.label || "全部供应商";
  const materialLabel =
    materialOptions.find((opt) => opt.value === materialId)?.label || "全部物料";

  React.useEffect(() => {
    const loadRuleData = async () => {
      setInitialLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData: Record<string, FormValues> = {
          "1": {
            name: "默认加价规则",
            storeId: "",
            supplierId: "",
            materialId: "",
            markupType: "percentage",
            markupValue: "3",
            minMarkup: "1",
            maxMarkup: "50",
            enabled: true,
          },
          "2": {
            name: "生鲜供应商A固定加价",
            storeId: "",
            supplierId: "1",
            materialId: "",
            markupType: "fixed",
            markupValue: "2",
            minMarkup: "",
            maxMarkup: "",
            enabled: true,
          },
          "3": {
            name: "门店A专属规则",
            storeId: "1",
            supplierId: "",
            materialId: "",
            markupType: "percentage",
            markupValue: "2.5",
            minMarkup: "0.5",
            maxMarkup: "30",
            enabled: true,
          },
        };

        const data = mockData[ruleId] ?? mockData["1"];
        if (data) {
          form.reset(data);
        }
      } catch {
        showToast.error("加载规则数据失败");
      } finally {
        setInitialLoading(false);
      }
    };

    loadRuleData();
  }, [ruleId, form]);

  const getPriorityDescription = () => {
    let priority = 1;
    const factors: string[] = [];

    if (storeId) {
      priority += 1;
      factors.push("指定门店");
    }
    if (supplierId) {
      priority += 1;
      factors.push("指定供应商");
    }
    if (materialId) {
      priority += 1;
      factors.push("指定物料");
    }

    if (factors.length === 0) {
      return `优先级: ${priority} (全局默认规则)`;
    }
    return `优先级: ${priority} (${factors.join(" + ")})`;
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updated values:", values);
      showToast.success("加价规则更新成功");
      router.push("/admin/markup/rules");
    } catch {
      showToast.error("更新失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <WorkbenchShell
          badge="编辑规则"
          title="编辑加价规则"
          description={`修改加价规则配置，规则ID: ${ruleId}`}
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </WorkbenchShell>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="编辑规则"
        title="编辑加价规则"
        description={`修改加价规则配置，规则ID: ${ruleId}`}
        actions={
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            返回列表
          </Button>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">规则范围</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">门店</span>
                  <span className="font-medium">{storeLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">供应商</span>
                  <span className="font-medium">{supplierLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">物料</span>
                  <span className="font-medium">{materialLabel}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">优先级</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Badge variant="secondary">{getPriorityDescription()}</Badge>
                <p className="text-muted-foreground">
                  规则越具体优先级越高，优先级高的规则会覆盖低优先级规则。
                </p>
              </CardContent>
            </Card>
          </>
        }
      >
        <Card>
          <CardHeader className="bg-muted/20 border-b border-border/50">
            <CardTitle className="text-base">规则配置</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>规则名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入规则名称" maxLength={50} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>门店</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择门店（可选，不选则对全部门店生效）" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">全部门店</SelectItem>
                          {storeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>不选择则对所有门店生效</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>供应商</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择供应商（可选，不选则对全部供应商生效）" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">全部供应商</SelectItem>
                          {supplierOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>不选择则对所有供应商生效</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>物料</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择物料（可选，不选则对全部物料生效）" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">全部物料</SelectItem>
                          {materialOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>不选择则对所有物料生效</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="markupType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>加价方式</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <label htmlFor="fixed">固定金额</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id="percentage" />
                            <label htmlFor="percentage">百分比</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="markupValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {markupType === "fixed" ? "加价金额（元）" : "加价比例（%）"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            step={markupType === "fixed" ? "0.01" : "0.1"}
                            min="0"
                            placeholder={
                              markupType === "fixed"
                                ? "请输入加价金额"
                                : "请输入加价比例"
                            }
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {markupType === "fixed" ? "元" : "%"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {markupType === "percentage" && (
                  <>
                    <FormField
                      control={form.control}
                      name="minMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最低加价金额（元）</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="请输入最低加价金额（可选）"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                元
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            百分比加价时，加价金额的最低值
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最高加价金额（元）</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="请输入最高加价金额（可选）"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                元
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            百分比加价时，加价金额的最高值
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>启用状态</FormLabel>
                        <FormDescription>启用或禁用此加价规则</FormDescription>
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

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>优先级说明</AlertTitle>
                  <AlertDescription>
                    <p className="font-medium">{getPriorityDescription()}</p>
                    <p className="text-muted-foreground mt-1">
                      规则越具体（指定门店+供应商+物料）优先级越高，优先级高的规则会覆盖低优先级规则
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    保存
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
