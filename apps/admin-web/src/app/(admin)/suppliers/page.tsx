"use client";

import { useState } from "react";
import { 
  Search, 
  Plus,
  MoreHorizontal,
  Phone,
  Truck,
  Calendar,
  DollarSign,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const mockSuppliers = [
  {
    id: 1,
    supplierNo: "SUP001",
    name: "新鲜果蔬供应商",
    displayName: "新鲜果蔬",
    logo: "",
    contactName: "陈老板",
    contactPhone: "13900139001",
    minOrderAmount: 100,
    deliveryDays: [1, 3, 5],
    deliveryMode: "self_delivery",
    managementMode: "self",
    productCount: 156,
    orderCount: 1234,
    status: 1,
  },
  {
    id: 2,
    supplierNo: "SUP002",
    name: "优质肉类批发",
    displayName: "优质肉类",
    logo: "",
    contactName: "刘经理",
    contactPhone: "13900139002",
    minOrderAmount: 200,
    deliveryDays: [2, 4, 6],
    deliveryMode: "self_delivery",
    managementMode: "self",
    productCount: 89,
    orderCount: 567,
    status: 1,
  },
  {
    id: 3,
    supplierNo: "SUP003",
    name: "饮品原料供应",
    displayName: "饮品原料",
    logo: "",
    contactName: "吴总",
    contactPhone: "13900139003",
    minOrderAmount: 150,
    deliveryDays: [1, 2, 3, 4, 5],
    deliveryMode: "express_delivery",
    managementMode: "webhook",
    productCount: 45,
    orderCount: 890,
    status: 1,
  },
  {
    id: 4,
    supplierNo: "SUP004",
    name: "进口食材",
    displayName: "进口食材",
    logo: "",
    contactName: "黄经理",
    contactPhone: "13900139004",
    minOrderAmount: 500,
    deliveryDays: [3, 5],
    deliveryMode: "self_delivery",
    managementMode: "managed",
    productCount: 234,
    orderCount: 123,
    status: 0,
  },
];

const managementModeText: Record<string, string> = {
  self: "自主管理",
  managed: "平台托管",
  webhook: "Webhook通知",
  api: "API对接",
};

const deliveryModeText: Record<string, string> = {
  self_delivery: "自配送",
  express_delivery: "快递配送",
};

export default function SuppliersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">供应商管理</h1>
          <p className="text-muted-foreground">管理所有供应商信息</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加供应商
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加供应商</DialogTitle>
              <DialogDescription>填写供应商基本信息</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">供应商名称</Label>
                  <Input id="name" placeholder="请输入供应商名称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">显示名称</Label>
                  <Input id="displayName" placeholder="门店端显示的名称" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">登录账号</Label>
                  <Input id="username" placeholder="请输入登录账号" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">起送价（元）</Label>
                  <Input id="minOrderAmount" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">联系人</Label>
                  <Input id="contactName" placeholder="请输入联系人姓名" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input id="contactPhone" placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>配送模式</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择配送模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_delivery">自配送</SelectItem>
                      <SelectItem value="express_delivery">快递配送</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>管理模式</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择管理模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">自主管理</SelectItem>
                      <SelectItem value="managed">平台托管</SelectItem>
                      <SelectItem value="webhook">Webhook通知</SelectItem>
                      <SelectItem value="api">API对接</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={() => setDialogOpen(false)}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索供应商名称、编号、联系人..." className="pl-8" />
        </div>
      </div>

      {/* 供应商表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>供应商信息</TableHead>
              <TableHead>联系方式</TableHead>
              <TableHead>配送设置</TableHead>
              <TableHead>管理模式</TableHead>
              <TableHead className="text-right">商品数</TableHead>
              <TableHead className="text-right">订单数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={supplier.logo} />
                      <AvatarFallback>
                        <Truck className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.supplierNo}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{supplier.contactName}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      {supplier.contactPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>起送价 ¥{supplier.minOrderAmount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{supplier.deliveryDays.map(d => weekdays[d - 1]).join("、")}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <Badge variant="outline">{deliveryModeText[supplier.deliveryMode]}</Badge>
                    <div className="text-muted-foreground">{managementModeText[supplier.managementMode]}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{supplier.productCount}</TableCell>
                <TableCell className="text-right">{supplier.orderCount}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === 1 ? "default" : "secondary"}>
                    {supplier.status === 1 ? "启用" : "禁用"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>查看详情</DropdownMenuItem>
                      <DropdownMenuItem>编辑信息</DropdownMenuItem>
                      <DropdownMenuItem>配送区域设置</DropdownMenuItem>
                      <DropdownMenuItem>重置密码</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        {supplier.status === 1 ? "禁用供应商" : "启用供应商"}
                      </DropdownMenuItem>
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
