"use client";

import { useState } from "react";
import { 
  Search, 
  Plus,
  MoreHorizontal,
  MapPin,
  Phone,
  Store as StoreIcon,
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

const mockStores = [
  {
    id: 1,
    storeNo: "S001",
    name: "星巴克-中山路店",
    logo: "",
    contactName: "张经理",
    contactPhone: "13800138001",
    province: "浙江省",
    city: "杭州市",
    district: "西湖区",
    address: "中山路100号",
    orderCount: 156,
    totalAmount: 45231.50,
    status: 1,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    storeNo: "S002",
    name: "瑞幸咖啡-人民路店",
    logo: "",
    contactName: "李店长",
    contactPhone: "13800138002",
    province: "浙江省",
    city: "杭州市",
    district: "上城区",
    address: "人民路200号",
    orderCount: 89,
    totalAmount: 23456.80,
    status: 1,
    createdAt: "2024-01-05",
  },
  {
    id: 3,
    storeNo: "S003",
    name: "喜茶-万达广场店",
    logo: "",
    contactName: "王经理",
    contactPhone: "13800138003",
    province: "浙江省",
    city: "杭州市",
    district: "江干区",
    address: "万达广场B1层",
    orderCount: 234,
    totalAmount: 67890.30,
    status: 1,
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    storeNo: "S004",
    name: "蜜雪冰城-步行街店",
    logo: "",
    contactName: "赵店长",
    contactPhone: "13800138004",
    province: "浙江省",
    city: "杭州市",
    district: "下城区",
    address: "步行街50号",
    orderCount: 45,
    totalAmount: 12345.00,
    status: 0,
    createdAt: "2024-01-15",
  },
];

export default function StoresPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">门店管理</h1>
          <p className="text-muted-foreground">管理所有门店信息</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加门店
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加门店</DialogTitle>
              <DialogDescription>填写门店基本信息，创建新门店账号</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">门店名称</Label>
                  <Input id="name" placeholder="请输入门店名称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">登录账号</Label>
                  <Input id="username" placeholder="请输入登录账号" />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>省份</Label>
                  <Input placeholder="省份" />
                </div>
                <div className="space-y-2">
                  <Label>城市</Label>
                  <Input placeholder="城市" />
                </div>
                <div className="space-y-2">
                  <Label>区县</Label>
                  <Input placeholder="区县" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">详细地址</Label>
                <Input id="address" placeholder="请输入详细地址" />
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
          <Input placeholder="搜索门店名称、编号、联系人..." className="pl-8" />
        </div>
      </div>

      {/* 门店表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>门店信息</TableHead>
              <TableHead>联系方式</TableHead>
              <TableHead>地址</TableHead>
              <TableHead className="text-right">订单数</TableHead>
              <TableHead className="text-right">累计金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={store.logo} />
                      <AvatarFallback>
                        <StoreIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.storeNo}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{store.contactName}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      {store.contactPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{store.province}{store.city}{store.district}{store.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{store.orderCount}</TableCell>
                <TableCell className="text-right font-medium">
                  ¥{store.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={store.status === 1 ? "default" : "secondary"}>
                    {store.status === 1 ? "启用" : "禁用"}
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
                      <DropdownMenuItem>重置密码</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        {store.status === 1 ? "禁用门店" : "启用门店"}
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
