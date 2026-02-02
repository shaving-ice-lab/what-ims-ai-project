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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, CheckCircle, Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface SimulateResult {
  matchedRule: {
    id: number;
    name: string;
    priority: number;
    markupType: "fixed" | "percentage";
    markupValue: number;
    minMarkup: number | null;
    maxMarkup: number | null;
  };
  originalPrice: number;
  markupAmount: number;
  finalPrice: number;
  markupRate: number;
  applyReason: string;
}

const formSchema = z.object({
  storeId: z.string().min(1, "请选择门店"),
  supplierId: z.string().min(1, "请选择供应商"),
  materialId: z.string().min(1, "请选择商品"),
  originalPrice: z.string().min(1, "请输入原价").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "原价必须大于0"
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function MarkupSimulatePage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<SimulateResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeId: "",
      supplierId: "",
      materialId: "",
      originalPrice: "",
    },
  });

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
    { value: "101", label: "金龙鱼大豆油5L - ¥58.00" },
    { value: "102", label: "福临门花生油5L - ¥68.00" },
    { value: "103", label: "海天酱油500ml - ¥12.50" },
    { value: "104", label: "太太乐鸡精200g - ¥8.80" },
    { value: "105", label: "中粮大米10kg - ¥45.00" },
  ];

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const originalPrice = Number(values.originalPrice);
      const storeId = values.storeId;
      const supplierId = values.supplierId;

      let mockResult: SimulateResult;

      if (storeId === "1" && supplierId === "1") {
        mockResult = {
          matchedRule: {
            id: 5,
            name: "门店A-生鲜供应商A专属规则",
            priority: 4,
            markupType: "percentage",
            markupValue: 2,
            minMarkup: 0.5,
            maxMarkup: 20,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.02, 0.5), 20),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.02, 0.5), 20),
          markupRate: 2,
          applyReason: "匹配门店A + 生鲜供应商A的专属规则（优先级最高）",
        };
      } else if (storeId === "1") {
        mockResult = {
          matchedRule: {
            id: 3,
            name: "门店A专属规则",
            priority: 3,
            markupType: "percentage",
            markupValue: 2.5,
            minMarkup: 0.5,
            maxMarkup: 30,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.025, 0.5), 30),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.025, 0.5), 30),
          markupRate: 2.5,
          applyReason: "匹配门店A的专属规则",
        };
      } else if (supplierId === "1") {
        mockResult = {
          matchedRule: {
            id: 2,
            name: "生鲜供应商A固定加价",
            priority: 2,
            markupType: "fixed",
            markupValue: 2,
            minMarkup: null,
            maxMarkup: null,
          },
          originalPrice,
          markupAmount: 2,
          finalPrice: originalPrice + 2,
          markupRate: (2 / originalPrice) * 100,
          applyReason: "匹配生鲜供应商A的固定加价规则",
        };
      } else {
        mockResult = {
          matchedRule: {
            id: 1,
            name: "默认加价规则",
            priority: 1,
            markupType: "percentage",
            markupValue: 3,
            minMarkup: 1,
            maxMarkup: 50,
          },
          originalPrice,
          markupAmount: Math.min(Math.max(originalPrice * 0.03, 1), 50),
          finalPrice: originalPrice + Math.min(Math.max(originalPrice * 0.03, 1), 50),
          markupRate: 3,
          applyReason: "没有匹配到特定规则，应用全局默认规则",
        };
      }

      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setResult(null);
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="加价模拟"
        title="加价模拟计算"
        description="模拟特定场景下的加价金额，验证加价规则配置是否正确"
        actions={
          <Button variant="outline" size="sm" onClick={handleReset}>
            清空参数
          </Button>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">模拟说明</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>优先级：门店 + 供应商 + 物料的规则优先。</p>
                <p>百分比规则会受最低/最高加价限制。</p>
                <p>结果仅用于验证规则配置。</p>
              </CardContent>
            </Card>
            {result && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">命中规则</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{result.matchedRule.name}</p>
                  <Badge variant="secondary">优先级 {result.matchedRule.priority}</Badge>
                  <p className="text-muted-foreground">{result.applyReason}</p>
                </CardContent>
              </Card>
            )}
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">模拟参数</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>门店</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择门店" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {storeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>供应商</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择供应商" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supplierOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materialId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择商品" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {materialOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>原价（元）</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              ¥
                            </span>
                            <Input
                              {...field}
                              placeholder="请输入商品原价"
                              className="pl-7"
                              type="number"
                              step="0.01"
                              min="0.01"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Calculator className="mr-2 h-4 w-4" />
                      计算加价
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset}>
                      重置
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">计算结果</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                    <AlertTitle className="flex items-center gap-2">
                      匹配规则：{result.matchedRule.name}
                    </AlertTitle>
                    <AlertDescription>{result.applyReason}</AlertDescription>
                  </Alert>

                  <div className="rounded-lg border p-4 space-y-3">
                    <h4 className="font-medium text-sm">规则详情</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">规则ID</span>
                        <span>{result.matchedRule.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">优先级</span>
                        <Badge variant="secondary">{result.matchedRule.priority}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">加价方式</span>
                        <Badge
                          variant={
                            result.matchedRule.markupType === "fixed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {result.matchedRule.markupType === "fixed"
                            ? "固定金额"
                            : "百分比"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">加价值</span>
                        <span>
                          {result.matchedRule.markupType === "fixed"
                            ? `¥${result.matchedRule.markupValue}`
                            : `${result.matchedRule.markupValue}%`}
                        </span>
                      </div>
                      {result.matchedRule.markupType === "percentage" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">最低加价</span>
                            <span>
                              {result.matchedRule.minMarkup
                                ? `¥${result.matchedRule.minMarkup}`
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">最高加价</span>
                            <span>
                              {result.matchedRule.maxMarkup
                                ? `¥${result.matchedRule.maxMarkup}`
                                : "-"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">原价</p>
                      <p className="text-xl font-semibold">
                        ¥{result.originalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">加价金额</p>
                      <p className="text-xl font-semibold text-[hsl(var(--warning))]">
                        +{result.markupAmount.toFixed(2)}元
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">最终价格</p>
                      <p className="text-xl font-semibold text-[hsl(var(--success))]">
                        ¥{result.finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    实际加价率：{result.markupRate.toFixed(2)}%
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Calculator className="h-12 w-12 mb-4" />
                  <p>请选择参数并点击"计算加价"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </WorkbenchShell>
    </AdminLayout>
  );
}
