"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

const orderStatuses = [
  { value: "all", label: "全部订单" },
  { value: "pending_payment", label: "待付款" },
  { value: "pending_confirm", label: "待确认" },
  { value: "confirmed", label: "已确认" },
  { value: "delivering", label: "配送中" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const suppliers = [
  { id: "all", name: "全部供应商" },
  { id: "1", name: "新鲜果蔬" },
  { id: "2", name: "优质肉类" },
  { id: "3", name: "饮品原料" },
  { id: "4", name: "进口食材" },
];

interface OrderItem {
  id: number;
  name: string;
  brand: string;
  spec: string;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderNo: string;
  supplierId: number;
  supplierName: string;
  status: string;
  statusText: string;
  goodsAmount: number;
  serviceFee: number;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  expectedDelivery: string;
  items: OrderItem[];
  deliveryAddress: string;
  contactName: string;
  contactPhone: string;
  remark?: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: "20241228143025123456",
    supplierId: 1,
    supplierName: "新鲜果蔬",
    status: "delivering",
    statusText: "配送中",
    goodsAmount: 371.0,
    serviceFee: 1.11,
    totalAmount: 372.11,
    itemCount: 3,
    createdAt: "2024-12-28 14:30:25",
    expectedDelivery: "2024-12-30",
    items: [
      { id: 1, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", price: 12.5, quantity: 10, subtotal: 125.0 },
      { id: 2, name: "有机胡萝卜", brand: "绿源", spec: "1kg/袋", unit: "袋", price: 8.5, quantity: 8, subtotal: 68.0 },
      { id: 3, name: "进口苹果", brand: "美国红蛇果", spec: "5kg/箱", unit: "箱", price: 89.0, quantity: 2, subtotal: 178.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
  },
  {
    id: 2,
    orderNo: "20241227102015654321",
    supplierId: 2,
    supplierName: "优质肉类",
    status: "completed",
    statusText: "已完成",
    goodsAmount: 288.0,
    serviceFee: 0.86,
    totalAmount: 288.86,
    itemCount: 2,
    createdAt: "2024-12-27 10:20:15",
    expectedDelivery: "2024-12-28",
    items: [
      { id: 4, name: "新鲜牛腩", brand: "草原鲜", spec: "2kg/份", unit: "份", price: 68.0, quantity: 3, subtotal: 204.0 },
      { id: 5, name: "猪五花肉", brand: "土猪", spec: "1kg/份", unit: "份", price: 42.0, quantity: 2, subtotal: 84.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
  },
  {
    id: 3,
    orderNo: "20241226090005789012",
    supplierId: 3,
    supplierName: "饮品原料",
    status: "pending_payment",
    statusText: "待付款",
    goodsAmount: 116.0,
    serviceFee: 0.35,
    totalAmount: 116.35,
    itemCount: 1,
    createdAt: "2024-12-26 09:00:05",
    expectedDelivery: "2024-12-27",
    items: [
      { id: 6, name: "纯牛奶", brand: "蒙牛", spec: "250ml*24盒/箱", unit: "箱", price: 58.0, quantity: 2, subtotal: 116.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
  },
  {
    id: 4,
    orderNo: "20241225150030456789",
    supplierId: 4,
    supplierName: "进口食材",
    status: "cancelled",
    statusText: "已取消",
    goodsAmount: 256.0,
    serviceFee: 0.77,
    totalAmount: 256.77,
    itemCount: 2,
    createdAt: "2024-12-25 15:00:30",
    expectedDelivery: "2024-12-27",
    items: [
      { id: 7, name: "新鲜三文鱼", brand: "挪威进口", spec: "500g/份", unit: "份", price: 128.0, quantity: 2, subtotal: 256.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
    remark: "门店临时关闭",
  },
  {
    id: 5,
    orderNo: "20241224110025987654",
    supplierId: 1,
    supplierName: "新鲜果蔬",
    status: "completed",
    statusText: "已完成",
    goodsAmount: 198.0,
    serviceFee: 0.59,
    totalAmount: 198.59,
    itemCount: 2,
    createdAt: "2024-12-24 11:00:25",
    expectedDelivery: "2024-12-25",
    items: [
      { id: 8, name: "青椒", brand: "本地", spec: "500g/袋", unit: "袋", price: 6.0, quantity: 15, subtotal: 90.0 },
      { id: 9, name: "有机番茄", brand: "绿源", spec: "500g/盒", unit: "盒", price: 12.0, quantity: 9, subtotal: 108.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
  },
];

const getStatusBadge = (status: string, statusText: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
    pending_payment: { variant: "outline", icon: <CreditCard className="h-3 w-3 mr-1" /> },
    pending_confirm: { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" /> },
    confirmed: { variant: "secondary", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    delivering: { variant: "default", icon: <Truck className="h-3 w-3 mr-1" /> },
    completed: { variant: "secondary", icon: <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> },
    cancelled: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
  };

  const { variant, icon } = variants[status] || { variant: "outline" as const, icon: null };

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {statusText}
    </Badge>
  );
};

export default function OrdersPage() {
  const [searchText, setSearchText] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [supplierFilter, setSupplierFilter] = React.useState("all");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = searchText === "" || 
      order.orderNo.includes(searchText) ||
      order.supplierName.includes(searchText);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSupplier = supplierFilter === "all" || order.supplierId.toString() === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleReorder = (order: Order) => {
    toast.success("已将商品加入购物车", {
      description: `${order.itemCount} 件商品`,
    });
  };

  const handleCancelOrder = (order: Order) => {
    toast.info("取消申请已提交", {
      description: `订单 ${order.orderNo.slice(-8)} 正在等待管理员审核`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
        <p className="text-muted-foreground">查看和管理您的订单</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单号或供应商..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
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

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="w-full justify-start overflow-auto">
          {orderStatuses.map((status) => (
            <TabsTrigger key={status.value} value={status.value} className="px-4">
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">{order.supplierName}</CardTitle>
                      {getStatusBadge(order.status, order.statusText)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openOrderDetail(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReorder(order)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          再来一单
                        </DropdownMenuItem>
                        {order.status === "pending_payment" && (
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            去支付
                          </DropdownMenuItem>
                        )}
                        {(order.status === "pending_payment" || order.status === "pending_confirm") && (
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            取消订单
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>订单号: {order.orderNo.slice(-12)}</span>
                    <span>·</span>
                    <span>{order.createdAt}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{order.itemCount} 种商品</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>期望送达: {order.expectedDelivery}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">¥{order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">含服务费 ¥{order.serviceFee.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Quick preview of items */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <Badge key={item.id} variant="secondary" className="font-normal">
                        {item.name} x{item.quantity}
                      </Badge>
                    ))}
                    {order.items.length > 3 && (
                      <Badge variant="outline" className="font-normal">
                        +{order.items.length - 3} 更多
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">暂无订单</h3>
                <p className="text-muted-foreground">去订货页面选购商品吧</p>
                <Button asChild className="mt-4">
                  <Link href="/order">
                    <Package className="mr-2 h-4 w-4" />
                    开始订货
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  订单详情
                  {getStatusBadge(selectedOrder.status, selectedOrder.statusText)}
                </DialogTitle>
                <DialogDescription>
                  订单号: {selectedOrder.orderNo}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">供应商</p>
                    <p className="font-medium">{selectedOrder.supplierName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">下单时间</p>
                    <p className="font-medium">{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">期望送达</p>
                    <p className="font-medium">{selectedOrder.expectedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">商品种类</p>
                    <p className="font-medium">{selectedOrder.itemCount} 种</p>
                  </div>
                </div>

                <Separator />

                {/* Delivery Info */}
                <div>
                  <h4 className="font-medium mb-3">收货信息</h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                    <p>{selectedOrder.contactName} {selectedOrder.contactPhone}</p>
                    <p className="text-muted-foreground">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">商品明细</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.brand} · {item.spec}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">¥{item.subtotal.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            ¥{item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Amount Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">商品金额</span>
                    <span>¥{selectedOrder.goodsAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">服务费 (3‰)</span>
                    <span>¥{selectedOrder.serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>实付金额</span>
                    <span className="text-primary">¥{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Remark */}
                {selectedOrder.remark && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">备注</h4>
                      <p className="text-sm text-muted-foreground">{selectedOrder.remark}</p>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleReorder(selectedOrder)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    再来一单
                  </Button>
                  {selectedOrder.status === "pending_payment" && (
                    <Button className="flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      去支付
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
