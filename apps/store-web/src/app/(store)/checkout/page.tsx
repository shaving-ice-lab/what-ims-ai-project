"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  Calendar,
  CreditCard,
  QrCode,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Mock checkout data
const mockCheckoutData = {
  address: {
    contactName: "张经理",
    contactPhone: "138****8888",
    province: "上海市",
    city: "浦东新区",
    district: "陆家嘴街道",
    address: "中山路100号星巴克门店",
  },
  suppliers: [
    {
      supplierId: 1,
      supplierName: "新鲜果蔬",
      deliveryDays: "周一、三、五",
      nextDeliveryDate: "2024-12-30 (周一)",
      items: [
        { id: 1, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", price: 12.5, quantity: 10 },
        { id: 2, name: "有机胡萝卜", brand: "绿源", spec: "1kg/袋", unit: "袋", price: 8.5, quantity: 8 },
        { id: 3, name: "进口苹果", brand: "美国红蛇果", spec: "5kg/箱", unit: "箱", price: 89.0, quantity: 2 },
      ],
    },
    {
      supplierId: 2,
      supplierName: "优质肉类",
      deliveryDays: "周二、四、六",
      nextDeliveryDate: "2024-12-31 (周二)",
      items: [
        { id: 4, name: "新鲜牛腩", brand: "草原鲜", spec: "2kg/份", unit: "份", price: 68.0, quantity: 3 },
        { id: 5, name: "猪五花肉", brand: "土猪", spec: "1kg/份", unit: "份", price: 42.0, quantity: 2 },
      ],
    },
  ],
};

export default function CheckoutPage() {
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Calculate totals
  const getSupplierSubtotal = (items: typeof mockCheckoutData.suppliers[0]["items"]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const totalGoodsAmount = mockCheckoutData.suppliers.reduce(
    (sum, supplier) => sum + getSupplierSubtotal(supplier.items),
    0
  );
  const serviceFee = totalGoodsAmount * 0.003;
  const totalAmount = totalGoodsAmount + serviceFee;
  const totalItems = mockCheckoutData.suppliers.reduce(
    (sum, supplier) => sum + supplier.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );

  // Submit order
  const handleSubmitOrder = async () => {
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setOrderSubmitted(true);
    setPaymentDialogOpen(true);
  };

  // Handle payment
  const handlePayment = async () => {
    toast.success("支付成功", {
      description: "订单已提交，请等待供应商确认",
    });
    setPaymentDialogOpen(false);
    // Redirect to orders page
    window.location.href = "/orders";
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">确认订单</h1>
          <p className="text-muted-foreground">
            {mockCheckoutData.suppliers.length} 个供应商 · {totalItems} 件商品
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            收货地址
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{mockCheckoutData.address.contactName}</span>
              <span className="text-muted-foreground">{mockCheckoutData.address.contactPhone}</span>
            </div>
            <p className="text-muted-foreground">
              {mockCheckoutData.address.province}
              {mockCheckoutData.address.city}
              {mockCheckoutData.address.district}
              {mockCheckoutData.address.address}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Orders by Supplier */}
      <div className="space-y-4">
        {mockCheckoutData.suppliers.map((supplier) => {
          const subtotal = getSupplierSubtotal(supplier.items);
          
          return (
            <Card key={supplier.supplierId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{supplier.supplierName}</CardTitle>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    预计送达: {supplier.nextDeliveryDate}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Truck className="h-3 w-3" />
                  配送日: {supplier.deliveryDays}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {supplier.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.brand} · {item.spec}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ¥{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Remark */}
                <div>
                  <label className="text-sm text-muted-foreground">备注</label>
                  <Textarea
                    placeholder="请输入订单备注（选填）"
                    className="mt-2"
                    value={remarks[supplier.supplierId] || ""}
                    onChange={(e) => setRemarks({ ...remarks, [supplier.supplierId]: e.target.value })}
                  />
                </div>

                {/* Subtotal */}
                <div className="flex justify-end">
                  <p className="text-muted-foreground">
                    小计: <span className="text-foreground font-semibold ml-2">¥{subtotal.toFixed(2)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Amount Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">订单金额</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">商品金额</span>
            <span>¥{totalGoodsAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">服务费 (3‰)</span>
            <span>¥{serviceFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>应付总额</span>
            <span className="text-primary">¥{totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              共 {mockCheckoutData.suppliers.length} 个订单 · {totalItems} 件商品
            </p>
            <p className="text-2xl font-bold text-primary">
              ¥{totalAmount.toFixed(2)}
            </p>
          </div>
          <Button size="lg" onClick={handleSubmitOrder} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                提交订单
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {orderSubmitted ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  订单提交成功
                </>
              ) : (
                "选择支付方式"
              )}
            </DialogTitle>
            <DialogDescription>
              请选择支付方式完成付款
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Payment Amount */}
            <div className="text-center py-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">支付金额</p>
              <p className="text-3xl font-bold text-primary mt-1">
                ¥{totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === "wechat" ? "default" : "outline"}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setPaymentMethod("wechat")}
              >
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">微</span>
                </div>
                <span>微信支付</span>
              </Button>
              <Button
                variant={paymentMethod === "alipay" ? "default" : "outline"}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setPaymentMethod("alipay")}
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">支</span>
                </div>
                <span>支付宝</span>
              </Button>
            </div>

            {/* QR Code Placeholder */}
            <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
              <div className="h-40 w-40 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="h-20 w-20 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                请使用{paymentMethod === "wechat" ? "微信" : "支付宝"}扫码支付
              </p>
              <p className="text-xs text-muted-foreground">
                二维码有效期: 14:59
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setPaymentDialogOpen(false)}>
                稍后支付
              </Button>
              <Button className="flex-1" onClick={handlePayment}>
                我已完成支付
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
