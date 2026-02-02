"use client";

import { SupplierLayout } from "@/components/layouts/app-layout";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Edit, Loader2, Plus, Search, Upload } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MaterialItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

const materialSchema = z.object({
  name: z.string().min(1, "请输入物料名称"),
  brand: z.string().min(1, "请输入品牌"),
  spec: z.string().min(1, "请输入规格"),
  unit: z.string().min(1, "请输入单位"),
  category: z.string().min(1, "请选择分类"),
  price: z.number().min(0, "价格不能为负数"),
  stock: z.number().min(0, "库存不能为负数").optional(),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

const categoryOptions = [
  { value: "粮油", label: "粮油" },
  { value: "调味品", label: "调味品" },
  { value: "生鲜", label: "生鲜" },
  { value: "饮料", label: "饮料" },
];

export default function SupplierMaterialsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MaterialItem | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [statusChangeItem, setStatusChangeItem] = React.useState<MaterialItem | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Filters
  const [searchText, setSearchText] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      brand: "",
      spec: "",
      unit: "",
      category: "",
      price: 0,
      stock: 0,
    },
  });

  const [materialsData, setMaterialsData] = React.useState<MaterialItem[]>([
    {
      id: 1,
      name: "金龙鱼大豆油",
      brand: "金龙鱼",
      spec: "5L/桶",
      unit: "桶",
      category: "粮油",
      price: 58.0,
      stock: 500,
      status: "active",
    },
    {
      id: 2,
      name: "福临门花生油",
      brand: "福临门",
      spec: "5L/桶",
      unit: "桶",
      category: "粮油",
      price: 68.0,
      stock: 300,
      status: "active",
    },
    {
      id: 3,
      name: "中粮大米",
      brand: "中粮",
      spec: "10kg/袋",
      unit: "袋",
      category: "粮油",
      price: 45.0,
      stock: 200,
      status: "active",
    },
    {
      id: 4,
      name: "海天酱油",
      brand: "海天",
      spec: "500ml/瓶",
      unit: "瓶",
      category: "调味品",
      price: 12.5,
      stock: 0,
      status: "inactive",
    },
  ]);

  const handleOpenModal = (item?: MaterialItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        brand: item.brand,
        spec: item.spec,
        unit: item.unit,
        category: item.category,
        price: item.price,
        stock: item.stock,
      });
    } else {
      setEditingItem(null);
      form.reset();
    }
    setModalOpen(true);
  };

  const handleToggleStatus = (item: MaterialItem) => {
    setStatusChangeItem(item);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (!statusChangeItem) return;
    const newStatus = statusChangeItem.status === "active" ? "inactive" : "active";
    setMaterialsData((prev) =>
      prev.map((item) =>
        item.id === statusChangeItem.id ? { ...item, status: newStatus } : item
      )
    );
    showToast.success(`物料已${newStatus === "active" ? "上架" : "下架"}`);
    setStatusDialogOpen(false);
    setStatusChangeItem(null);
  };

  const onSubmit = async (values: MaterialFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (editingItem) {
        setMaterialsData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...item, ...values, stock: values.stock ?? item.stock }
              : item
          )
        );
        showToast.success("物料信息已更新");
      } else {
        const newItem: MaterialItem = {
          id: Date.now(),
          ...values,
          stock: values.stock ?? 0,
          status: "active",
        };
        setMaterialsData((prev) => [...prev, newItem]);
        showToast.success("物料已添加");
      }
      setModalOpen(false);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  const filteredData = materialsData.filter((item) => {
    if (searchText && !item.name.includes(searchText) && !item.brand.includes(searchText)) {
      return false;
    }
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="物料管理"
        title="物料价格管理"
        description="管理您的物料信息和价格，支持批量导入导出"
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索物料名称或品牌"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              下载模板
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              批量导入
            </Button>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" />
              添加物料
            </Button>
          </div>
        }
        results={
          <Card className="overflow-hidden animate-fade-in">
            <CardContent className="p-0">
              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>物料名称</TableHead>
                    <TableHead>品牌</TableHead>
                    <TableHead>规格</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className="text-right">单价</TableHead>
                    <TableHead className="text-right">库存</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-[140px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.brand}</TableCell>
                      <TableCell>
                        <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">
                          {item.spec}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        ¥{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          item.stock === 0 && "text-destructive font-medium"
                        )}
                      >
                        {item.stock}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "active" ? "success" : "secondary"}
                        >
                          {item.status === "active" ? "上架" : "下架"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => handleOpenModal(item)}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8",
                              item.status === "active" && "text-destructive hover:text-destructive"
                            )}
                            onClick={() => handleToggleStatus(item)}
                          >
                            {item.status === "active" ? "下架" : "上架"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 text-sm text-muted-foreground">
                <span>
                  共 <span className="font-medium text-foreground">{filteredData.length}</span> 个物料
                </span>
              </div>
            </CardContent>
          </Card>
        }
      >

        {/* Add/Edit Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "编辑物料" : "添加物料"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>物料名称</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入物料名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>品牌</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入品牌" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分类</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="请选择分类" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
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
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>单位</FormLabel>
                        <FormControl>
                          <Input placeholder="如：桶、瓶、袋" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spec"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>规格</FormLabel>
                        <FormControl>
                          <Input placeholder="如：5L/桶" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>单价 (¥)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="请输入单价"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>库存</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="请输入库存数量"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                  >
                    取消
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingItem ? "保存" : "添加"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Status Change Dialog */}
        <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {statusChangeItem?.status === "active" ? "下架物料" : "上架物料"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                确定要{statusChangeItem?.status === "active" ? "下架" : "上架"}此物料吗？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmStatusChange}>
                确定
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </WorkbenchShell>
    </SupplierLayout>
  );
}
