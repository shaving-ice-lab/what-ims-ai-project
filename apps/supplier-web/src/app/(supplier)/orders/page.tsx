"use client";

import * as React from "react";
import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Truck,
  Package,
  Printer,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Phone,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const orderStatuses = [
  { value: "all", label: "全部订单" },
  { value: "pending_confirm", label: "待确认" },
  { value: "confirmed", label: "已确认" },
  { value: "delivering", label: "配送中" },
  { value: "completed", label: "已完成" },
];

const stores = [
  { id: "all", name: "全部门店" },
  { id: "1", name: "星巴克-中山路店" },
  { id: "2", name: "瑞幸咖啡-人民路店" },
  { id: "3", name: "喜茶-万达广场店" },
  { id: "4", name: "奈雪的茶-银泰店" },
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
  storeId: number;
  storeName: string;
  status: string;
  statusText: string;
  amount: number;
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
    storeId: 1,
    storeName: "星巴克-中山路店",
    status: "pending_confirm",
    statusText: "待确认",
    amount: 371.0,
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
    orderNo: "20241228102015654321",
    storeId: 2,
    storeName: "瑞幸咖啡-人民路店",
    status: "pending_confirm",
    statusText: "待确认",
    amount: 456.0,
    itemCount: 4,
    createdAt: "2024-12-28 10:20:15",
    expectedDelivery: "2024-12-30",
    items: [
      { id: 4, name: "有机番茄", brand: "绿源", spec: "500g/盒", unit: "盒", price: 12.0, quantity: 15, subtotal: 180.0 },
      { id: 5, name: "有机生菜", brand: "绿源", spec: "200g/袋", unit: "袋", price: 6.0, quantity: 20, subtotal: 120.0 },
      { id: 6, name: "青椒", brand: "本地", spec: "500g/袋", unit: "袋", price: 6.0, quantity: 10, subtotal: 60.0 },
      { id: 7, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", price: 12.0, quantity: 8, subtotal: 96.0 },
    ],
    deliveryAddress: "上海市浦东新区人民路200号瑞幸咖啡",
    contactName: "李店长",
    contactPhone: "139****9999",
    remark: "请在上午10点前送达",
  },
  {
    id: 3,
    orderNo: "20241227150030456789",
    storeId: 3,
    storeName: "喜茶-万达广场店",
    status: "confirmed",
    statusText: "已确认",
    amount: 892.0,
    itemCount: 5,
    createdAt: "2024-12-27 15:00:30",
    expectedDelivery: "2024-12-28",
    items: [
      { id: 8, name: "芒果", brand: "进口", spec: "5kg/箱", unit: "箱", price: 120.0, quantity: 3, subtotal: 360.0 },
      { id: 9, name: "草莓", brand: "丹东", spec: "500g/盒", unit: "盒", price: 45.0, quantity: 8, subtotal: 360.0 },
      { id: 10, name: "柠檬", brand: "进口", spec: "500g/袋", unit: "袋", price: 18.0, quantity: 6, subtotal: 108.0 },
      { id: 11, name: "百香果", brand: "云南", spec: "500g/盒", unit: "盒", price: 16.0, quantity: 4, subtotal: 64.0 },
    ],
    deliveryAddress: "上海市浦东新区万达广场B1层喜茶",
    contactName: "王店长",
    contactPhone: "137****7777",
  },
  {
    id: 4,
    orderNo: "20241227090005789012",
    storeId: 1,
    storeName: "星巴克-中山路店",
    status: "delivering",
    statusText: "配送中",
    amount: 523.5,
    itemCount: 4,
    createdAt: "2024-12-27 09:00:05",
    expectedDelivery: "2024-12-28",
    items: [
      { id: 12, name: "有机西兰花", brand: "绿源", spec: "500g/袋", unit: "袋", price: 12.5, quantity: 15, subtotal: 187.5 },
      { id: 13, name: "有机胡萝卜", brand: "绿源", spec: "1kg/袋", unit: "袋", price: 8.5, quantity: 12, subtotal: 102.0 },
      { id: 14, name: "有机番茄", brand: "绿源", spec: "500g/盒", unit: "盒", price: 12.0, quantity: 10, subtotal: 120.0 },
      { id: 15, name: "有机生菜", brand: "绿源", spec: "200g/袋", unit: "袋", price: 6.0, quantity: 19, subtotal: 114.0 },
    ],
    deliveryAddress: "上海市浦东新区中山路100号星巴克门店",
    contactName: "张经理",
    contactPhone: "138****8888",
  },
  {
    id: 5,
    orderNo: "20241226110025987654",
    storeId: 4,
    storeName: "奈雪的茶-银泰店",
    status: "completed",
    statusText: "已完成",
    amount: 680.0,
    itemCount: 3,
    createdAt: "2024-12-26 11:00:25",
    expectedDelivery: "2024-12-27",
    items: [
      { id: 16, name: "芒果", brand: "进口", spec: "5kg/箱", unit: "箱", price: 120.0, quantity: 4, subtotal: 480.0 },
      { id: 17, name: "葡萄", brand: "新疆", spec: "2kg/箱", unit: "箱", price: 50.0, quantity: 4, subtotal: 200.0 },
    ],
    deliveryAddress: "上海市浦东新区银泰百货3楼奈雪的茶",
    contactName: "赵店长",
    contactPhone: "136****6666",
  },
];

const getStatusBadge = (status: string, statusText: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
    pending_confirm: { variant: "outline", className: "text-yellow-600 border-yellow-600" },
    confirmed: { variant: "secondary", className: "text-blue-600" },
    delivering: { variant: "default", className: "bg-purple-500" },
    completed: { variant: "secondary", className: "text-green-600" },
    cancelled: { variant: "destructive", className: "" },
  };
  const { variant, className } = variants[status] || { variant: "outline" as const, className: "" };
  return <Badge variant={variant} className={className}>{statusText}</Badge>;
};

export default function OrdersPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchText === "" || 
      order.orderNo.includes(searchText) ||
      order.storeName.includes(searchText);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesStore = storeFilter === "all" || order.storeId.toString() === storeFilter;
    return matchesSearch && matchesStatus && matchesStore;
  });

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleConfirmOrder = (order: Order) => {
    setOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: "confirmed", statusText: "已确认" } : o
    ));
    toast.success("订单已确认", { description: `订单 ${order.orderNo.slice(-8)} 已确认` });
    setDetailDialogOpen(false);
  };

  const handleStartDelivery = (order: Order) => {
    setOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: "delivering", statusText: "配送中" } : o
    ));
    toast.success("已开始配送", { description: `订单 ${order.orderNo.slice(-8)} 开始配送` });
    setDetailDialogOpen(false);
  };

  const handleCompleteOrder = (order: Order) => {
    setOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: "completed", statusText: "已完成" } : o
    ));
    toast.success("订单已完成", { description: `订单 ${order.orderNo.slice(-8)} 已送达` });
    setDetailDialogOpen(false);
  };

  const handlePrint = (order: Order) => {
    toast.info("正在打印送货单", { description: `订单 ${order.orderNo.slice(-8)}` });
  };

  const pendingCount = orders.filter(o => o.status === "pending_confirm").length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;
  const deliveringCount = orders.filter(o => o.status === "delivering").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
          <p className="text-muted-foreground">管理和处理门店订单</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出Excel
        </Button>
      </div>

      {/* 快捷统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">待确认</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已确认待配送</p>
              <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">配送中</p>
              <p className="text-2xl font-bold text-purple-600">{deliveringCount}</p>
            </div>
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
                placeholder="搜索订单号或门店..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="选择门店" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 状态Tab */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          {orderStatuses.map((status) => (
            <TabsTrigger key={status.value} value={status.value}>
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {/* 订单表格 */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单编号</TableHead>
                    <TableHead>门店</TableHead>
                    <TableHead>商品数</TableHead>
                    <TableHead>订单金额</TableHead>
                    <TableHead>期望配送</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>下单时间</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.orderNo.slice(-12)}</TableCell>
                      <TableCell>{order.storeName}</TableCell>
                      <TableCell>{order.itemCount} 种</TableCell>
                      <TableCell className="font-medium">¥{order.amount.toFixed(2)}</TableCell>
                      <TableCell>{order.expectedDelivery}</TableCell>
                      <TableCell>{getStatusBadge(order.status, order.statusText)}</TableCell>
                      <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
                      <TableCell>
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
                            {order.status === "pending_confirm" && (
                              <DropdownMenuItem onClick={() => handleConfirmOrder(order)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                确认订单
                              </DropdownMenuItem>
                            )}
                            {order.status === "confirmed" && (
                              <DropdownMenuItem onClick={() => handleStartDelivery(order)}>
                                <Truck className="h-4 w-4 mr-2" />
                                开始配送
                              </DropdownMenuItem>
                            )}
                            {order.status === "delivering" && (
                              <DropdownMenuItem onClick={() => handleCompleteOrder(order)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                确认送达
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handlePrint(order)}>
                              <Printer className="h-4 w-4 mr-2" />
                              打印送货单
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">暂无订单</h3>
                  <p className="text-muted-foreground">当前筛选条件下没有订单</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 订单详情弹窗 */}
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
                {/* 订单信息 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">门店</p>
                    <p className="font-medium">{selectedOrder.storeName}</p>
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

                {/* 收货信息 */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    收货信息
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedOrder.contactName}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {selectedOrder.contactPhone}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                {selectedOrder.remark && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800">门店备注</p>
                    <p className="text-sm text-yellow-700">{selectedOrder.remark}</p>
                  </div>
                )}

                <Separator />

                {/* 商品明细 */}
                <div>
                  <h4 className="font-medium mb-3">商品明细</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
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

                {/* 金额汇总 */}
                <div className="flex justify-between font-medium text-lg">
                  <span>订单金额</span>
                  <span className="text-primary">¥{selectedOrder.amount.toFixed(2)}</span>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handlePrint(selectedOrder)}>
                    <Printer className="h-4 w-4 mr-2" />
                    打印送货单
                  </Button>
                  {selectedOrder.status === "pending_confirm" && (
                    <Button className="flex-1" onClick={() => handleConfirmOrder(selectedOrder)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      确认订单
                    </Button>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <Button className="flex-1" onClick={() => handleStartDelivery(selectedOrder)}>
                      <Truck className="h-4 w-4 mr-2" />
                      开始配送
                    </Button>
                  )}
                  {selectedOrder.status === "delivering" && (
                    <Button className="flex-1" onClick={() => handleCompleteOrder(selectedOrder)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      确认送达
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
