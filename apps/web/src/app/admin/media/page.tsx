"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Eye, Inbox, Search, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MediaItem {
  id: number;
  url: string;
  name: string;
  category: string;
  brand: string;
  spec: string;
  tags: string[];
  skuCodes: string[];
  size: number;
  uploadTime: string;
}

const editSchema = z.object({
  name: z.string().min(1, "请输入名称"),
  category: z.string().min(1, "请选择分类"),
  brand: z.string().optional(),
  spec: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const categoryOptions = [
  { value: "粮油", label: "粮油" },
  { value: "调味品", label: "调味品" },
  { value: "生鲜", label: "生鲜" },
  { value: "饮料", label: "饮料" },
  { value: "其他", label: "其他" },
];

const brandOptions = [
  { value: "金龙鱼", label: "金龙鱼" },
  { value: "福临门", label: "福临门" },
  { value: "海天", label: "海天" },
  { value: "太太乐", label: "太太乐" },
  { value: "中粮", label: "中粮" },
];

export default function MediaLibraryPage() {
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [editVisible, setEditVisible] = React.useState(false);
  const [uploadVisible, setUploadVisible] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MediaItem | null>(null);

  // Filters
  const [searchText, setSearchText] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [filterBrand, setFilterBrand] = React.useState<string>("all");

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: "", category: "", brand: "", spec: "" },
  });

  const [mediaData, setMediaData] = React.useState<MediaItem[]>([
    {
      id: 1,
      url: "https://via.placeholder.com/200",
      name: "金龙鱼大豆油",
      category: "粮油",
      brand: "金龙鱼",
      spec: "5L",
      tags: ["食用油", "大豆油"],
      skuCodes: ["SKU001", "SKU002"],
      size: 125000,
      uploadTime: "2024-01-20",
    },
    {
      id: 2,
      url: "https://via.placeholder.com/200",
      name: "海天酱油",
      category: "调味品",
      brand: "海天",
      spec: "500ml",
      tags: ["酱油", "调味"],
      skuCodes: ["SKU003"],
      size: 89000,
      uploadTime: "2024-01-21",
    },
    {
      id: 3,
      url: "https://via.placeholder.com/200",
      name: "福临门花生油",
      category: "粮油",
      brand: "福临门",
      spec: "5L",
      tags: ["食用油", "花生油"],
      skuCodes: ["SKU004"],
      size: 156000,
      uploadTime: "2024-01-22",
    },
    {
      id: 4,
      url: "https://via.placeholder.com/200",
      name: "太太乐鸡精",
      category: "调味品",
      brand: "太太乐",
      spec: "200g",
      tags: ["调味", "鸡精"],
      skuCodes: [],
      size: 45000,
      uploadTime: "2024-01-23",
    },
  ]);

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      category: item.category,
      brand: item.brand,
      spec: item.spec,
    });
    setEditVisible(true);
  };

  const handleSaveEdit = (values: EditFormValues) => {
    if (!editingItem) return;
    setMediaData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...values } : item
      )
    );
    showToast.success("图片信息已更新");
    setEditVisible(false);
  };

  const handleDelete = (id: number) => {
    setMediaData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("图片已删除");
  };

  const handleBatchDelete = () => {
    setMediaData((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    showToast.success(`已删除 ${selectedItems.length} 张图片`);
    setSelectedItems([]);
  };

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    }
  };

  const filteredData = mediaData.filter((item) => {
    if (
      searchText &&
      !item.name.includes(searchText) &&
      !item.tags.some((t) => t.includes(searchText))
    ) {
      return false;
    }
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (filterBrand !== "all" && item.brand !== filterBrand) return false;
    return true;
  });

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="素材库"
        title="图片素材库"
        description="管理商品图片素材，支持按分类、品牌筛选和批量操作"
        actions={
          <>
            <Button onClick={() => setUploadVisible(true)}>
              <Upload className="mr-2 h-4 w-4" />
              批量上传
            </Button>
            {selectedItems.length > 0 && (
              <Button variant="destructive" onClick={handleBatchDelete}>
                删除选中 ({selectedItems.length})
              </Button>
            )}
          </>
        }
        toolbar={
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>已筛选 {filteredData.length} 张图片</span>
            {selectedItems.length > 0 && (
              <Badge variant="secondary">已选 {selectedItems.length}</Badge>
            )}
          </div>
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
                  placeholder="搜索名称或标签"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
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
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="品牌筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品牌</SelectItem>
                  {brandOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-medium">图片列表</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Inbox className="h-12 w-12 mb-4 opacity-50" />
                  <p>暂无图片</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {filteredData.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-lg border bg-card overflow-hidden"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) =>
                            handleSelect(item.id, !!checked)
                          }
                        />
                      </div>

                      <div
                        className="relative h-28 cursor-pointer bg-muted"
                        onClick={() => setPreviewUrl(item.url)}
                      >
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrl(item.url);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {item.brand}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        }
      />

        {/* Preview Dialog */}
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>图片预览</DialogTitle>
            </DialogHeader>
            {previewUrl && (
              <div className="relative w-full h-96">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={uploadVisible} onOpenChange={setUploadVisible}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>批量上传图片</DialogTitle>
            </DialogHeader>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">点击或拖拽图片到此区域上传</p>
              <p className="text-sm text-muted-foreground mt-1">
                支持批量上传，支持 jpg、png、gif 格式
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadVisible(false)}>
                取消
              </Button>
              <Button onClick={() => setUploadVisible(false)}>确认上传</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editVisible} onOpenChange={setEditVisible}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑图片信息</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveEdit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入图片名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>品牌</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择品牌" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brandOptions.map((opt) => (
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
                  name="spec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>规格</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入规格" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditVisible(false)}
                  >
                    取消
                  </Button>
                  <Button type="submit">保存</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </AdminLayout>
  );
}
