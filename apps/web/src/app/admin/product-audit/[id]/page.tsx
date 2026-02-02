"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
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
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle,
    X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ProductDetail {
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  price: number;
  supplierId: number;
  supplierName: string;
  image: string;
  submitTime: string;
  status: "pending" | "approved" | "rejected";
  isNewBrand: boolean;
  description: string;
  packageSpec: string;
}

interface PriceHistory {
  id: string;
  date: string;
  price: number;
  source: string;
}

interface SimilarProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  supplier: string;
}

const rejectSchema = z.object({
  reason: z.string().min(1, "请输入驳回原因"),
});

export default function ProductAuditDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState<ProductDetail | null>(null);
  const [rejectOpen, setRejectOpen] = React.useState(false);

  const rejectForm = useForm({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  const priceHistory: PriceHistory[] = [
    { id: "1", date: "2024-01-29", price: 58.0, source: "当前报价" },
    { id: "2", date: "2024-01-15", price: 56.0, source: "历史报价" },
    { id: "3", date: "2024-01-01", price: 55.0, source: "历史报价" },
  ];

  const similarProducts: SimilarProduct[] = [
    { id: "1", name: "金龙鱼大豆油", brand: "金龙鱼", price: 56.0, supplier: "粮油供应商A" },
    { id: "2", name: "金龙鱼大豆油", brand: "金龙鱼", price: 59.0, supplier: "粮油供应商C" },
  ];

  React.useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProduct({
          id: Number(productId),
          name: "金龙鱼大豆油",
          brand: "金龙鱼",
          spec: "5L/桶",
          unit: "桶",
          price: 58.0,
          supplierId: 2,
          supplierName: "粮油供应商B",
          image: "https://via.placeholder.com/200",
          submitTime: "2024-01-29 10:30:00",
          status: "pending",
          isNewBrand: false,
          description: "金龙鱼精炼一级大豆油，适合中餐烹饪",
          packageSpec: "4桶/箱",
        });
      } catch {
        showToast.error("加载产品数据失败");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleApprove = () => {
    setProduct((prev) => (prev ? { ...prev, status: "approved" } : null));
    showToast.success("审核已通过");
  };

  const handleReject = () => {
    setProduct((prev) => (prev ? { ...prev, status: "rejected" } : null));
    showToast.success("已驳回");
    setRejectOpen(false);
    rejectForm.reset();
  };

  const avgPrice =
    similarProducts.reduce((sum, p) => sum + p.price, 0) / similarProducts.length;
  const priceDeviation = product
    ? (((product.price - avgPrice) / avgPrice) * 100).toFixed(1)
    : "0";

  if (loading) {
    return (
      <AdminLayout>
        <WorkbenchShell
          badge="审核详情"
          title="产品审核详情"
          description={`产品ID: ${productId}`}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </WorkbenchShell>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <WorkbenchShell
          badge="审核详情"
          title="产品审核详情"
          description={`产品ID: ${productId}`}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">产品不存在</p>
          </div>
        </WorkbenchShell>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="审核详情"
        title="产品审核详情"
        description={`产品ID: ${productId}`}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        }
        sidebar={
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">审核操作</CardTitle>
              </CardHeader>
              <CardContent>
                {product.status === "pending" ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleApprove}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      审核通过
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      size="lg"
                      onClick={() => setRejectOpen(true)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      审核驳回
                    </Button>
                  </div>
                ) : (
                  <Alert
                    variant={
                      product.status === "approved" ? "success" : "destructive"
                    }
                  >
                    <AlertDescription>
                      {product.status === "approved"
                        ? "审核已通过"
                        : "审核已驳回"}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">审核检查清单</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                  <span className="text-sm">产品信息完整性</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                  <span className="text-sm">品牌信息真实性</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={Number(priceDeviation) > 20 ? "error" : "success"}
                    className="rounded-full p-1"
                  >
                    {Number(priceDeviation) > 20 ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <CheckCircle className="h-3 w-3" />
                    )}
                  </Badge>
                  <span className="text-sm">价格合理性</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                  <span className="text-sm">图片匹配度</span>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">产品信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <span className="text-muted-foreground">产品名称</span>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">品牌</span>
                  <p className="font-medium flex items-center gap-2">
                    {product.brand}
                    {product.isNewBrand && (
                      <Badge variant="secondary">新品牌</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">规格</span>
                  <p className="font-medium">{product.spec}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">单位</span>
                  <p className="font-medium">{product.unit}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">包装规格</span>
                  <p className="font-medium">{product.packageSpec}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">报价</span>
                  <p className="text-lg font-semibold text-primary">
                    ¥{product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">供应商</span>
                  <p className="font-medium">{product.supplierName}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">产品描述</span>
                  <p className="font-medium">{product.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {product.isNewBrand && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>新品牌提醒</AlertTitle>
            <AlertDescription>
              这是一个新品牌，请仔细核实品牌信息的真实性和合规性
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">价格合理性检查</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">当前报价</p>
                <p className="text-2xl font-semibold">
                  ¥{product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">市场均价</p>
                <p className="text-2xl font-semibold">
                  ¥{avgPrice.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">价格偏差</p>
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    Number(priceDeviation) > 10
                      ? "text-[hsl(var(--error))]"
                      : Number(priceDeviation) < -10
                      ? "text-[hsl(var(--success))]"
                      : ""
                  )}
                >
                  {priceDeviation}%
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">历史价格对比</p>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead className="text-right">价格</TableHead>
                      <TableHead>来源</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="text-right">
                          ¥{item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{item.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                同品牌同规格对比
              </p>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品名称</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead className="text-right">价格</TableHead>
                      <TableHead>供应商</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {similarProducts.map((item) => {
                      const isLowest =
                        item.price <=
                        Math.min(...similarProducts.map((p) => p.price));
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                isLowest && "text-[hsl(var(--success))]"
                              )}
                            >
                              ¥{item.price.toFixed(2)}
                              {isLowest && (
                                <Badge variant="success" className="ml-2">
                                  最低
                                </Badge>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>{item.supplier}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </WorkbenchShell>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回产品</DialogTitle>
          </DialogHeader>
          <Form {...rejectForm}>
            <form
              onSubmit={rejectForm.handleSubmit(handleReject)}
              className="space-y-4"
            >
              <FormField
                control={rejectForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>驳回原因</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="请输入驳回原因"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="destructive">
                  确认驳回
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRejectOpen(false)}
                >
                  取消
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
