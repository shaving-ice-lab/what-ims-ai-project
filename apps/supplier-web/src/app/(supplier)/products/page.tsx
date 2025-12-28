"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Package,
  Edit,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { id: "all", name: "全部分类" },
  { id: "vegetables", name: "蔬菜" },
  { id: "fruits", name: "水果" },
  { id: "meat", name: "肉类" },
  { id: "dairy", name: "乳制品" },
];

interface Product {
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  category: string;
  categoryName: string;
  price: number;
  marketLowest: number;
  minQty: number;
  inStock: boolean;
}

const mockProducts: Product[] = [
  { id: 1, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", category: "vegetables", categoryName: "蔬菜", price: 12.5, marketLowest: 12.5, minQty: 5, inStock: true },
  { id: 2, name: "有机胡萝卜", brand: "绿源", spec: "1kg/袋", unit: "袋", category: "vegetables", categoryName: "蔬菜", price: 8.5, marketLowest: 7.8, minQty: 10, inStock: true },
  { id: 3, name: "有机番茄", brand: "绿源", spec: "500g/盒", unit: "盒", category: "vegetables", categoryName: "蔬菜", price: 12.0, marketLowest: 11.5, minQty: 8, inStock: true },
  { id: 4, name: "有机生菜", brand: "绿源", spec: "200g/袋", unit: "袋", category: "vegetables", categoryName: "蔬菜", price: 6.0, marketLowest: 6.0, minQty: 15, inStock: true },
  { id: 5, name: "青椒", brand: "本地", spec: "500g/袋", unit: "袋", category: "vegetables", categoryName: "蔬菜", price: 6.0, marketLowest: 5.5, minQty: 10, inStock: false },
  { id: 6, name: "芒果", brand: "进口", spec: "5kg/箱", unit: "箱", category: "fruits", categoryName: "水果", price: 120.0, marketLowest: 115.0, minQty: 2, inStock: true },
  { id: 7, name: "草莓", brand: "丹东", spec: "500g/盒", unit: "盒", category: "fruits", categoryName: "水果", price: 45.0, marketLowest: 45.0, minQty: 5, inStock: true },
  { id: 8, name: "进口苹果", brand: "美国红蛇果", spec: "5kg/箱", unit: "箱", category: "fruits", categoryName: "水果", price: 89.0, marketLowest: 85.0, minQty: 2, inStock: true },
  { id: 9, name: "柠檬", brand: "进口", spec: "500g/袋", unit: "袋", category: "fruits", categoryName: "水果", price: 18.0, marketLowest: 18.0, minQty: 6, inStock: true },
  { id: 10, name: "葡萄", brand: "新疆", spec: "2kg/箱", unit: "箱", category: "fruits", categoryName: "水果", price: 50.0, marketLowest: 48.0, minQty: 3, inStock: false },
];

export default function ProductsPage() {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editMinQty, setEditMinQty] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchText === "" || 
      product.name.includes(searchText) ||
      product.brand.includes(searchText);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "in_stock" && product.inStock) ||
      (stockFilter === "out_of_stock" && !product.inStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setEditPrice(product.price.toString());
    setEditMinQty(product.minQty.toString());
    setEditDialogOpen(true);
  };

  const handleSavePrice = () => {
    if (!editingProduct) return;
    const newPrice = parseFloat(editPrice);
    const newMinQty = parseInt(editMinQty);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error("请输入有效的价格");
      return;
    }
    if (isNaN(newMinQty) || newMinQty < 1) {
      toast.error("请输入有效的最小起订量");
      return;
    }
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id ? { ...p, price: newPrice, minQty: newMinQty } : p
    ));
    toast.success("价格已更新");
    setEditDialogOpen(false);
  };

  const toggleStock = (productId: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(product.inStock ? "已设为缺货" : "已设为有货");
    }
  };

  const getPriceStatus = (product: Product) => {
    const diff = product.price - product.marketLowest;
    const percent = (diff / product.marketLowest) * 100;
    if (diff === 0) return { status: "equal", text: "持平", color: "text-gray-500" };
    if (diff < 0) return { status: "lowest", text: "最低", color: "text-green-500" };
    return { status: "higher", text: `+${percent.toFixed(1)}%`, color: "text-orange-500" };
  };

  const lowestCount = products.filter(p => p.price <= p.marketLowest).length;
  const higherCount = products.filter(p => p.price > p.marketLowest).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">商品管理</h1>
          <p className="text-muted-foreground">管理商品价格和库存状态</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            下载模板
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            导入价格
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">在售商品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              价格最低
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lowestCount}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              价格偏高
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{higherCount}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              缺货商品
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商品名称或品牌..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="库存状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="in_stock">有货</SelectItem>
                <SelectItem value="out_of_stock">缺货</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 商品表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名称</TableHead>
                <TableHead>品牌</TableHead>
                <TableHead>规格</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>您的报价</TableHead>
                <TableHead>市场最低</TableHead>
                <TableHead>价格状态</TableHead>
                <TableHead>起订量</TableHead>
                <TableHead>库存状态</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const priceStatus = getPriceStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.spec}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.categoryName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">¥{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">¥{product.marketLowest.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${priceStatus.color}`}>
                        {priceStatus.text}
                      </span>
                    </TableCell>
                    <TableCell>{product.minQty} {product.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.inStock}
                          onCheckedChange={() => toggleStock(product.id)}
                        />
                        <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                          {product.inStock ? "有货" : "缺货"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无商品</h3>
              <p className="text-muted-foreground">当前筛选条件下没有商品</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑价格弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          {editingProduct && (
            <>
              <DialogHeader>
                <DialogTitle>编辑价格</DialogTitle>
                <DialogDescription>
                  {editingProduct.name} - {editingProduct.brand} {editingProduct.spec}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="price">销售价格 (元/{editingProduct.unit})</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    市场最低价: ¥{editingProduct.marketLowest.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minQty">最小起订量 ({editingProduct.unit})</Label>
                  <Input
                    id="minQty"
                    type="number"
                    min="1"
                    value={editMinQty}
                    onChange={(e) => setEditMinQty(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSavePrice}>
                  保存
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
