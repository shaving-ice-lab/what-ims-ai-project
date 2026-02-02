"use client";

import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Printer } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface OrderItem {
  id: number;
  orderNo: string;
  storeName: string;
  storeAddress: string;
  contactName: string;
  contactPhone: string;
  orderTime: string;
  totalAmount: number;
  items: { name: string; spec: string; quantity: number; price: number }[];
  status: string;
}

export default function SupplierPrintPage() {
  const [selectedOrders, setSelectedOrders] = React.useState<number[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [previewOrder, setPreviewOrder] = React.useState<OrderItem | null>(null);

  const ordersData: OrderItem[] = [
    {
      id: 1,
      orderNo: "ORD202401290001",
      storeName: "门店A - 朝阳店",
      storeAddress: "北京市朝阳区XX路XX号",
      contactName: "张三",
      contactPhone: "138****8888",
      orderTime: "2024-01-29 10:30",
      totalAmount: 358.0,
      items: [
        { name: "金龙鱼大豆油", spec: "5L/桶", quantity: 2, price: 58.0 },
        { name: "海天酱油", spec: "500ml/瓶", quantity: 5, price: 12.5 },
        { name: "中粮大米", spec: "10kg/袋", quantity: 2, price: 45.0 },
      ],
      status: "confirmed",
    },
    {
      id: 2,
      orderNo: "ORD202401290002",
      storeName: "门店B - 海淀店",
      storeAddress: "北京市海淀区YY路YY号",
      contactName: "李四",
      contactPhone: "139****9999",
      orderTime: "2024-01-29 09:15",
      totalAmount: 256.0,
      items: [
        { name: "福临门花生油", spec: "5L/桶", quantity: 2, price: 68.0 },
        { name: "太太乐鸡精", spec: "200g/袋", quantity: 10, price: 8.8 },
      ],
      status: "confirmed",
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const toggleSelectOrder = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const allSelected =
    ordersData.length > 0 && selectedOrders.length === ordersData.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(ordersData.map((o) => o.id));
    }
  };

  const filteredData = ordersData.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="打印中心"
        title="送货单打印"
        description="选择订单并打印送货单"
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="confirmed">已确认</SelectItem>
                <SelectItem value="shipped">配送中</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            {selectedOrders.length > 0 && (
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                批量打印 ({selectedOrders.length})
              </Button>
            )}
          </div>
        }
        results={
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] animate-fade-in">
            {/* Order List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">订单列表</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>订单号</TableHead>
                        <TableHead>门店名称</TableHead>
                        <TableHead>下单时间</TableHead>
                        <TableHead className="text-right">订单金额</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={() => toggleSelectOrder(order.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.orderNo}
                          </TableCell>
                          <TableCell>{order.storeName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.orderTime}
                          </TableCell>
                          <TableCell className="text-right">
                            ¥{order.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewOrder(order)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              预览
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">送货单预览</CardTitle>
                {previewOrder && (
                  <Button size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    打印
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {previewOrder ? (
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-center mb-4">
                      <span className="font-bold text-base">【送货单】</span>
                    </div>
                    <div>订单号：{previewOrder.orderNo}</div>
                    <div>下单时间：{previewOrder.orderTime}</div>
                    <Separator className="my-3" />
                    <div>门店：{previewOrder.storeName}</div>
                    <div>地址：{previewOrder.storeAddress}</div>
                    <div>联系人：{previewOrder.contactName}</div>
                    <div>电话：{previewOrder.contactPhone}</div>
                    <Separator className="my-3" />
                    <div>商品明细：</div>
                    {previewOrder.items.map((item, i) => (
                      <div key={i} className="pl-4">
                        {item.name} {item.spec} x{item.quantity} ¥
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                    <Separator className="my-3" />
                    <div className="font-bold">
                      合计金额：¥{previewOrder.totalAmount.toFixed(2)}
                    </div>
                    <Separator className="my-3" />
                    <div>配送员签名：____________</div>
                    <div>门店签收：____________</div>
                    <div>日期：____________</div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    请选择订单预览送货单
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        }
      />
    </SupplierLayout>
  );
}
