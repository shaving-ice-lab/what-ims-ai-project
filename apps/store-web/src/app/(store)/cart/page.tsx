"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Truck,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

// Mock cart data grouped by supplier
const mockCartData = [
  {
    supplierId: 1,
    supplierName: "新鲜果蔬",
    minOrder: 100,
    deliveryDays: "周一、三、五",
    items: [
      { id: 1, materialId: 1, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", price: 12.5, quantity: 10 },
      { id: 2, materialId: 3, name: "有机胡萝卜", brand: "绿源", spec: "1kg/袋", unit: "袋", price: 8.5, quantity: 8 },
      { id: 3, materialId: 8, name: "进口苹果", brand: "美国红蛇果", spec: "5kg/箱", unit: "箱", price: 89.0, quantity: 2 },
    ],
  },
  {
    supplierId: 2,
    supplierName: "优质肉类",
    minOrder: 200,
    deliveryDays: "周二、四、六",
    items: [
      { id: 4, materialId: 2, name: "新鲜牛腩", brand: "草原鲜", spec: "2kg/份", unit: "份", price: 68.0, quantity: 3 },
      { id: 5, materialId: 7, name: "猪五花肉", brand: "土猪", spec: "1kg/份", unit: "份", price: 42.0, quantity: 2 },
    ],
  },
  {
    supplierId: 3,
    supplierName: "饮品原料",
    minOrder: 150,
    deliveryDays: "工作日",
    items: [
      { id: 6, materialId: 4, name: "纯牛奶", brand: "蒙牛", spec: "250ml*24盒/箱", unit: "箱", price: 58.0, quantity: 1 },
    ],
  },
];

interface CartItem {
  id: number;
  materialId: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  price: number;
  quantity: number;
}

interface SupplierCart {
  supplierId: number;
  supplierName: string;
  minOrder: number;
  deliveryDays: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cartData, setCartData] = useState<SupplierCart[]>(mockCartData);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>(
    mockCartData.map(s => s.supplierId)
  );

  // Calculate supplier subtotal
  const getSupplierSubtotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Check if supplier meets min order
  const meetsMinOrder = (supplier: SupplierCart) => {
    return getSupplierSubtotal(supplier.items) >= supplier.minOrder;
  };

  // Update item quantity
  const updateQuantity = (supplierId: number, itemId: number, delta: number) => {
    setCartData(prev => prev.map(supplier => {
      if (supplier.supplierId !== supplierId) return supplier;
      return {
        ...supplier,
        items: supplier.items.map(item => {
          if (item.id !== itemId) return item;
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }),
      };
    }));
  };

  // Remove item from cart
  const removeItem = (supplierId: number, itemId: number) => {
    setCartData(prev => prev.map(supplier => {
      if (supplier.supplierId !== supplierId) return supplier;
      return {
        ...supplier,
        items: supplier.items.filter(item => item.id !== itemId),
      };
    }).filter(supplier => supplier.items.length > 0));
    
    toast.success("已移除商品");
  };

  // Clear supplier cart
  const clearSupplierCart = (supplierId: number) => {
    setCartData(prev => prev.filter(s => s.supplierId !== supplierId));
    setSelectedSuppliers(prev => prev.filter(id => id !== supplierId));
    toast.success("已清空该供应商购物车");
  };

  // Toggle supplier selection
  const toggleSupplierSelection = (supplierId: number) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  // Get eligible suppliers for checkout
  const eligibleSuppliers = cartData.filter(
    s => selectedSuppliers.includes(s.supplierId) && meetsMinOrder(s)
  );

  // Calculate totals
  const selectedTotal = eligibleSuppliers.reduce(
    (sum, s) => sum + getSupplierSubtotal(s.items), 
    0
  );
  const serviceFee = selectedTotal * 0.003; // 3‰ service fee
  const totalAmount = selectedTotal + serviceFee;
  const totalItems = eligibleSuppliers.reduce(
    (sum, s) => sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0), 
    0
  );

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">购物车是空的</h2>
        <p className="text-muted-foreground">快去挑选心仪的商品吧</p>
        <Button asChild>
          <Link href="/order">
            <Package className="mr-2 h-4 w-4" />
            去订货
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/order">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">购物车</h1>
            <p className="text-muted-foreground">
              {cartData.length} 个供应商 · {cartData.reduce((sum, s) => sum + s.items.length, 0)} 件商品
            </p>
          </div>
        </div>
      </div>

      {/* Cart by Supplier */}
      <div className="space-y-4">
        {cartData.map((supplier) => {
          const subtotal = getSupplierSubtotal(supplier.items);
          const meets = meetsMinOrder(supplier);
          const isSelected = selectedSuppliers.includes(supplier.supplierId);
          const shortfall = supplier.minOrder - subtotal;

          return (
            <Card 
              key={supplier.supplierId}
              className={`transition-all ${
                meets && isSelected 
                  ? 'border-green-500/50 bg-green-50/30 dark:bg-green-950/10' 
                  : !meets 
                    ? 'border-orange-500/50 bg-orange-50/30 dark:bg-orange-950/10'
                    : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSupplierSelection(supplier.supplierId)}
                      disabled={!meets}
                    />
                    <div>
                      <CardTitle className="text-base">{supplier.supplierName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Truck className="h-3 w-3" />
                        起送 ¥{supplier.minOrder} · {supplier.deliveryDays}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {meets ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        已达起送
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        还差 ¥{shortfall.toFixed(2)}
                      </Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          清空
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>清空购物车</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要清空 {supplier.supplierName} 的购物车吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => clearSupplierCart(supplier.supplierId)}>
                            确定清空
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-4 py-2">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.brand} · {item.spec}
                        </p>
                        <p className="text-primary font-semibold mt-1">
                          ¥{item.price.toFixed(2)}/{item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(supplier.supplierId, item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(supplier.supplierId, item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right w-24">
                        <p className="font-semibold">¥{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(supplier.supplierId, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
                <Separator />
                <div className="flex justify-end pt-2">
                  <p className="text-muted-foreground">
                    小计: <span className="text-foreground font-semibold ml-2">¥{subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">已选 {eligibleSuppliers.length} 个供应商</p>
              <p className="text-sm text-muted-foreground">{totalItems} 件商品</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>商品金额: ¥{selectedTotal.toFixed(2)}</span>
                <span>·</span>
                <span>服务费(3‰): ¥{serviceFee.toFixed(2)}</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                合计: ¥{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button 
            size="lg" 
            disabled={eligibleSuppliers.length === 0}
            asChild
          >
            <Link href="/checkout">
              去结算 ({eligibleSuppliers.length})
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
