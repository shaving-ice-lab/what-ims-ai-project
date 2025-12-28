"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  MoreHorizontal,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending_payment: { label: "待付款", variant: "outline" },
  pending_confirm: { label: "待确认", variant: "secondary" },
  confirmed: { label: "已确认", variant: "default" },
  delivering: { label: "配送中", variant: "default" },
  completed: { label: "已完成", variant: "default" },
  cancelled: { label: "已取消", variant: "destructive" },
};

const mockOrders = [
  {
    id: 1,
    orderNo: "20240115143025123456",
    storeName: "星巴克-中山路店",
    supplierName: "新鲜果蔬",
    totalAmount: 1234.50,
    status: "pending_confirm",
    itemCount: 5,
    createdAt: "2024-01-15 14:30:25",
  },
  {
    id: 2,
    orderNo: "20240115142015654321",
    storeName: "瑞幸咖啡-人民路店",
    supplierName: "优质肉类",
    totalAmount: 2567.80,
    status: "confirmed",
    itemCount: 8,
    createdAt: "2024-01-15 14:20:15",
  },
  {
    id: 3,
    orderNo: "20240115140005789012",
    storeName: "喜茶-万达广场店",
    supplierName: "新鲜果蔬",
    totalAmount: 892.30,
    status: "delivering",
    itemCount: 3,
    createdAt: "2024-01-15 14:00:05",
  },
  {
    id: 4,
    orderNo: "20240115135055345678",
    storeName: "蜜雪冰城-步行街店",
    supplierName: "饮品原料",
    totalAmount: 456.00,
    status: "completed",
    itemCount: 2,
    createdAt: "2024-01-15 13:50:55",
  },
  {
    id: 5,
    orderNo: "20240115130025901234",
    storeName: "奈雪的茶-银泰店",
    supplierName: "新鲜果蔬",
    totalAmount: 1890.60,
    status: "cancelled",
    itemCount: 6,
    createdAt: "2024-01-15 13:00:25",
  },
];

export default function OrdersPage() {
  const [status, setStatus] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
          <p className="text-muted-foreground">管理和查看所有订单</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: "全部订单", value: 1256, status: "all" },
          { label: "待确认", value: 23, status: "pending_confirm" },
          { label: "已确认", value: 45, status: "confirmed" },
          { label: "配送中", value: 12, status: "delivering" },
          { label: "已完成", value: 1156, status: "completed" },
        ].map((item) => (
          <Card 
            key={item.status} 
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${status === item.status ? 'border-primary' : ''}`}
            onClick={() => setStatus(item.status)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索订单号、门店名称..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="供应商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部供应商</SelectItem>
              <SelectItem value="1">新鲜果蔬</SelectItem>
              <SelectItem value="2">优质肉类</SelectItem>
              <SelectItem value="3">饮品原料</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            更多筛选
          </Button>
        </div>
      </div>

      {/* 订单表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单编号</TableHead>
              <TableHead>门店</TableHead>
              <TableHead>供应商</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead>商品数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>下单时间</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                <TableCell>{order.storeName}</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell className="text-right font-medium">
                  ¥{order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>{order.itemCount}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[order.status]?.variant || "default"}>
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
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
                      <DropdownMenuItem>确认订单</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">取消订单</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
