"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Package,
  Truck,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for categories
const categories = [
  { id: "all", name: "全部" },
  { id: "vegetables", name: "蔬菜" },
  { id: "fruits", name: "水果" },
  { id: "meat", name: "肉类" },
  { id: "seafood", name: "海鲜" },
  { id: "dairy", name: "乳制品" },
  { id: "drinks", name: "饮品原料" },
  { id: "condiments", name: "调味品" },
];

// Mock data for suppliers
const suppliers = [
  { id: "all", name: "全部供应商" },
  { id: "1", name: "新鲜果蔬" },
  { id: "2", name: "优质肉类" },
  { id: "3", name: "饮品原料" },
  { id: "4", name: "进口食材" },
];

// Mock data for materials
const mockMaterials = [
  {
    id: 1,
    name: "有机西兰花",
    category: "vegetables",
    image: "/placeholder.svg",
    specs: [
      { id: 1, brand: "绿源", spec: "500g/袋", unit: "袋" },
      { id: 2, brand: "农夫", spec: "1kg/袋", unit: "袋" },
    ],
    supplierPrices: [
      { supplierId: 1, supplierName: "新鲜果蔬", price: 12.5, minQty: 5, minOrder: 100, deliveryDays: "周一、三、五", stock: "in_stock" },
      { supplierId: 4, supplierName: "进口食材", price: 15.0, minQty: 3, minOrder: 500, deliveryDays: "周三、五", stock: "in_stock" },
    ],
  },
  {
    id: 2,
    name: "新鲜牛腩",
    category: "meat",
    image: "/placeholder.svg",
    specs: [
      { id: 3, brand: "草原鲜", spec: "2kg/份", unit: "份" },
    ],
    supplierPrices: [
      { supplierId: 2, supplierName: "优质肉类", price: 68.0, minQty: 2, minOrder: 200, deliveryDays: "周二、四、六", stock: "in_stock" },
    ],
  },
  {
    id: 3,
    name: "有机胡萝卜",
    category: "vegetables",
    image: "/placeholder.svg",
    specs: [
      { id: 4, brand: "绿源", spec: "1kg/袋", unit: "袋" },
    ],
    supplierPrices: [
      { supplierId: 1, supplierName: "新鲜果蔬", price: 8.5, minQty: 10, minOrder: 100, deliveryDays: "周一、三、五", stock: "in_stock" },
      { supplierId: 4, supplierName: "进口食材", price: 12.0, minQty: 5, minOrder: 500, deliveryDays: "周三、五", stock: "out_of_stock" },
    ],
  },
  {
    id: 4,
    name: "纯牛奶",
    category: "dairy",
    image: "/placeholder.svg",
    specs: [
      { id: 5, brand: "蒙牛", spec: "250ml*24盒/箱", unit: "箱" },
      { id: 6, brand: "伊利", spec: "250ml*24盒/箱", unit: "箱" },
    ],
    supplierPrices: [
      { supplierId: 3, supplierName: "饮品原料", price: 58.0, minQty: 2, minOrder: 150, deliveryDays: "工作日", stock: "in_stock" },
    ],
  },
  {
    id: 5,
    name: "新鲜三文鱼",
    category: "seafood",
    image: "/placeholder.svg",
    specs: [
      { id: 7, brand: "挪威进口", spec: "500g/份", unit: "份" },
    ],
    supplierPrices: [
      { supplierId: 4, supplierName: "进口食材", price: 128.0, minQty: 1, minOrder: 500, deliveryDays: "周三、五", stock: "in_stock" },
    ],
  },
  {
    id: 6,
    name: "青椒",
    category: "vegetables",
    image: "/placeholder.svg",
    specs: [
      { id: 8, brand: "本地", spec: "500g/袋", unit: "袋" },
    ],
    supplierPrices: [
      { supplierId: 1, supplierName: "新鲜果蔬", price: 6.0, minQty: 10, minOrder: 100, deliveryDays: "周一、三、五", stock: "in_stock" },
    ],
  },
  {
    id: 7,
    name: "猪五花肉",
    category: "meat",
    image: "/placeholder.svg",
    specs: [
      { id: 9, brand: "土猪", spec: "1kg/份", unit: "份" },
    ],
    supplierPrices: [
      { supplierId: 2, supplierName: "优质肉类", price: 42.0, minQty: 3, minOrder: 200, deliveryDays: "周二、四、六", stock: "in_stock" },
    ],
  },
  {
    id: 8,
    name: "进口苹果",
    category: "fruits",
    image: "/placeholder.svg",
    specs: [
      { id: 10, brand: "美国红蛇果", spec: "5kg/箱", unit: "箱" },
    ],
    supplierPrices: [
      { supplierId: 1, supplierName: "新鲜果蔬", price: 89.0, minQty: 1, minOrder: 100, deliveryDays: "周一、三、五", stock: "in_stock" },
      { supplierId: 4, supplierName: "进口食材", price: 85.0, minQty: 2, minOrder: 500, deliveryDays: "周三、五", stock: "in_stock" },
    ],
  },
];

interface CartItem {
  materialId: number;
  materialName: string;
  specId: number;
  brand: string;
  spec: string;
  unit: string;
  supplierId: number;
  supplierName: string;
  price: number;
  quantity: number;
}

export default function OrderPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState<typeof mockMaterials[0] | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);
  const [selectedSupplierPrice, setSelectedSupplierPrice] = useState<typeof mockMaterials[0]["supplierPrices"][0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter materials
  const filteredMaterials = mockMaterials.filter((material) => {
    const matchesSearch = searchText === "" || 
      material.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      material.category === selectedCategory;
    const matchesSupplier = selectedSupplier === "all" || 
      material.supplierPrices.some(sp => sp.supplierId.toString() === selectedSupplier);
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  // Get lowest price for display
  const getLowestPrice = (material: typeof mockMaterials[0]) => {
    const availablePrices = material.supplierPrices.filter(sp => sp.stock === "in_stock");
    if (availablePrices.length === 0) return null;
    return Math.min(...availablePrices.map(sp => sp.price));
  };

  // Open material detail dialog
  const openMaterialDetail = (material: typeof mockMaterials[0]) => {
    setSelectedMaterial(material);
    setSelectedSpec(material.specs[0]?.id || null);
    const availableSupplier = material.supplierPrices.find(sp => sp.stock === "in_stock");
    setSelectedSupplierPrice(availableSupplier || null);
    setQuantity(availableSupplier?.minQty || 1);
    setDialogOpen(true);
  };

  // Add to cart
  const addToCart = () => {
    if (!selectedMaterial || !selectedSpec || !selectedSupplierPrice) return;
    
    const spec = selectedMaterial.specs.find(s => s.id === selectedSpec);
    if (!spec) return;

    const existingIndex = cart.findIndex(
      item => item.materialId === selectedMaterial.id && 
              item.specId === selectedSpec && 
              item.supplierId === selectedSupplierPrice.supplierId
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, {
        materialId: selectedMaterial.id,
        materialName: selectedMaterial.name,
        specId: selectedSpec,
        brand: spec.brand,
        spec: spec.spec,
        unit: spec.unit,
        supplierId: selectedSupplierPrice.supplierId,
        supplierName: selectedSupplierPrice.supplierName,
        price: selectedSupplierPrice.price,
        quantity,
      }]);
    }

    toast.success("已加入购物车", {
      description: `${selectedMaterial.name} x${quantity}`,
    });
    setDialogOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">在线订货</h1>
          <p className="text-muted-foreground">选择物料加入购物车</p>
        </div>
        <Button variant="outline" className="relative" onClick={() => window.location.href = "/cart"}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          购物车
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {cartCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索物料名称..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="选择供应商" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="px-4">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          {/* Materials Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMaterials.map((material) => {
              const lowestPrice = getLowestPrice(material);
              const hasStock = material.supplierPrices.some(sp => sp.stock === "in_stock");
              const supplierCount = material.supplierPrices.filter(sp => sp.stock === "in_stock").length;

              return (
                <Card 
                  key={material.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${!hasStock ? 'opacity-60' : ''}`}
                  onClick={() => hasStock && openMaterialDetail(material)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square relative bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      {!hasStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                          <Badge variant="secondary">暂无供应</Badge>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium truncate">{material.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {material.specs.map(s => s.brand).join("/")} · {material.specs[0]?.spec}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        {lowestPrice ? (
                          <>
                            <span className="text-lg font-bold text-primary">¥{lowestPrice.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground ml-1">起</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">暂无报价</span>
                        )}
                      </div>
                      {supplierCount > 0 && (
                        <Badge variant="outline">{supplierCount}家供应商</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">未找到物料</h3>
              <p className="text-muted-foreground">请尝试其他搜索条件</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Material Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMaterial && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMaterial.name}</DialogTitle>
                <DialogDescription>选择规格和供应商</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Spec Selection */}
                <div>
                  <h4 className="text-sm font-medium mb-3">选择规格</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaterial.specs.map((spec) => (
                      <Button
                        key={spec.id}
                        variant={selectedSpec === spec.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSpec(spec.id)}
                      >
                        {spec.brand} · {spec.spec}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Supplier Prices */}
                <div>
                  <h4 className="text-sm font-medium mb-3">供应商报价</h4>
                  <div className="space-y-2">
                    {selectedMaterial.supplierPrices.map((sp) => {
                      const isSelected = selectedSupplierPrice?.supplierId === sp.supplierId;
                      const isOutOfStock = sp.stock === "out_of_stock";
                      
                      return (
                        <div
                          key={sp.supplierId}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isOutOfStock 
                              ? 'opacity-50 cursor-not-allowed border-muted' 
                              : isSelected 
                                ? 'border-primary bg-primary/5 cursor-pointer' 
                                : 'border-border hover:border-primary/50 cursor-pointer'
                          }`}
                          onClick={() => !isOutOfStock && (
                            setSelectedSupplierPrice(sp),
                            setQuantity(sp.minQty)
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {isSelected && !isOutOfStock && (
                                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{sp.supplierName}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    起订{sp.minQty}件
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    起送¥{sp.minOrder}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {sp.deliveryDays}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">¥{sp.price.toFixed(2)}</p>
                              {isOutOfStock && (
                                <Badge variant="secondary" className="mt-1">缺货</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selection */}
                {selectedSupplierPrice && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">数量</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        最小起订量: {selectedSupplierPrice.minQty}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(selectedSupplierPrice.minQty, quantity - 1))}
                        disabled={quantity <= selectedSupplierPrice.minQty}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">小计</p>
                    <p className="text-2xl font-bold text-primary">
                      ¥{selectedSupplierPrice ? (selectedSupplierPrice.price * quantity).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={addToCart}
                    disabled={!selectedSupplierPrice}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    加入购物车
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-medium">{cartCount} 件商品</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <span className="font-bold text-primary">¥{cartTotal.toFixed(2)}</span>
          <Button size="sm" onClick={() => window.location.href = "/cart"}>
            去结算
          </Button>
        </div>
      )}
    </div>
  );
}
