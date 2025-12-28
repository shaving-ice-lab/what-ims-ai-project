"use client";

import { useState } from "react";
import { 
  Search, 
  Plus,
  MoreHorizontal,
  Package,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const categories = [
  { id: "all", name: "全部分类" },
  { id: "1", name: "蔬菜" },
  { id: "2", name: "水果" },
  { id: "3", name: "肉类" },
  { id: "4", name: "乳制品" },
  { id: "5", name: "饮品原料" },
];

interface Material {
  id: number;
  materialNo: string;
  name: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  description: string;
  skuCount: number;
  supplierCount: number;
  status: number;
  createdAt: string;
}

const mockMaterials: Material[] = [
  { id: 1, materialNo: "MAT001", name: "西兰花", categoryId: 1, categoryName: "蔬菜", unit: "袋", description: "新鲜有机西兰花", skuCount: 3, supplierCount: 4, status: 1, createdAt: "2024-01-01" },
  { id: 2, materialNo: "MAT002", name: "胡萝卜", categoryId: 1, categoryName: "蔬菜", unit: "袋", description: "新鲜有机胡萝卜", skuCount: 2, supplierCount: 3, status: 1, createdAt: "2024-01-02" },
  { id: 3, materialNo: "MAT003", name: "番茄", categoryId: 1, categoryName: "蔬菜", unit: "盒", description: "有机番茄", skuCount: 2, supplierCount: 2, status: 1, createdAt: "2024-01-03" },
  { id: 4, materialNo: "MAT004", name: "苹果", categoryId: 2, categoryName: "水果", unit: "箱", description: "进口苹果", skuCount: 4, supplierCount: 5, status: 1, createdAt: "2024-01-04" },
  { id: 5, materialNo: "MAT005", name: "芒果", categoryId: 2, categoryName: "水果", unit: "箱", description: "进口芒果", skuCount: 2, supplierCount: 3, status: 1, createdAt: "2024-01-05" },
  { id: 6, materialNo: "MAT006", name: "牛腩", categoryId: 3, categoryName: "肉类", unit: "份", description: "新鲜牛腩", skuCount: 3, supplierCount: 2, status: 1, createdAt: "2024-01-06" },
  { id: 7, materialNo: "MAT007", name: "五花肉", categoryId: 3, categoryName: "肉类", unit: "份", description: "土猪五花肉", skuCount: 2, supplierCount: 3, status: 1, createdAt: "2024-01-07" },
  { id: 8, materialNo: "MAT008", name: "纯牛奶", categoryId: 4, categoryName: "乳制品", unit: "箱", description: "常温纯牛奶", skuCount: 5, supplierCount: 4, status: 1, createdAt: "2024-01-08" },
  { id: 9, materialNo: "MAT009", name: "酸奶", categoryId: 4, categoryName: "乳制品", unit: "箱", description: "低脂酸奶", skuCount: 3, supplierCount: 2, status: 0, createdAt: "2024-01-09" },
  { id: 10, materialNo: "MAT010", name: "橙汁", categoryId: 5, categoryName: "饮品原料", unit: "瓶", description: "鲜榨橙汁", skuCount: 2, supplierCount: 2, status: 1, createdAt: "2024-01-10" },
];

export default function MaterialsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = searchText === "" || 
      m.name.includes(searchText) || 
      m.materialNo.includes(searchText);
    const matchesCategory = categoryFilter === "all" || m.categoryId.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleStatus = (id: number) => {
    setMaterials(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 1 ? 0 : 1 } : m
    ));
    toast.success("状态已更新");
  };

  const totalCount = materials.length;
  const activeCount = materials.filter(m => m.status === 1).length;
  const totalSku = materials.reduce((sum, m) => sum + m.skuCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">物料管理</h1>
          <p className="text-muted-foreground">管理系统中的所有物料</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            批量导入
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加物料
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>添加物料</DialogTitle>
                <DialogDescription>填写物料基本信息</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">物料名称</Label>
                    <Input id="name" placeholder="请输入物料名称" />
                  </div>
                  <div className="space-y-2">
                    <Label>所属分类</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.id !== "all").map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">计量单位</Label>
                  <Input id="unit" placeholder="如：袋、箱、份" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">物料描述</Label>
                  <Textarea id="description" placeholder="请输入物料描述（可选）" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button onClick={() => { setDialogOpen(false); toast.success("物料已创建"); }}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">物料总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已启用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SKU总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSku}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="搜索物料名称、编号..." 
            className="pl-8" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>
      </div>

      {/* 物料表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>物料信息</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>单位</TableHead>
              <TableHead className="text-right">SKU数</TableHead>
              <TableHead className="text-right">供应商数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-muted-foreground">{material.materialNo}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{material.categoryName}</Badge>
                </TableCell>
                <TableCell>{material.unit}</TableCell>
                <TableCell className="text-right">{material.skuCount}</TableCell>
                <TableCell className="text-right">{material.supplierCount}</TableCell>
                <TableCell>
                  <Badge variant={material.status === 1 ? "default" : "secondary"}>
                    {material.status === 1 ? "启用" : "禁用"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{material.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑信息
                      </DropdownMenuItem>
                      <DropdownMenuItem>管理SKU</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toggleStatus(material.id)}>
                        {material.status === 1 ? "禁用物料" : "启用物料"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">暂无物料</h3>
            <p className="text-muted-foreground">当前筛选条件下没有物料</p>
          </div>
        )}
      </div>
    </div>
  );
}
