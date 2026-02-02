"use client";

import { SupplierLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Phone, Store, Truck, User } from "lucide-react";

export default function SupplierAccountPage() {
  const supplierInfo = {
    name: "粮油供应商B",
    code: "SUP20240001",
    contactName: "王经理",
    contactPhone: "138****8888",
    status: "active",
    createdAt: "2024-01-01",
  };

  const deliverySettings = {
    minOrderAmount: 100,
    deliveryDays: ["周一", "周三", "周五"],
    deliveryMode: "自配送",
    deliveryAreas: ["北京市朝阳区", "北京市海淀区", "北京市西城区", "北京市东城区"],
  };

  return (
    <SupplierLayout>
      <WorkbenchShell
        badge="供应商端"
        title="账户信息"
        description="查看您的供应商账户信息"
        results={
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {/* Basic Info */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-4 w-4 text-primary" />
                  </div>
                  供应商基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">供应商名称</span>
                    <span className="font-medium">{supplierInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">供应商编号</span>
                    <span className="font-mono text-sm bg-muted/50 px-2 py-0.5 rounded">
                      {supplierInfo.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">联系人</span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {supplierInfo.contactName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">联系电话</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {supplierInfo.contactPhone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">账户状态</span>
                    <Badge variant={supplierInfo.status === "active" ? "success" : "error"}>
                      {supplierInfo.status === "active" ? "正常" : "已禁用"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">注册时间</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {supplierInfo.createdAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  当前配送设置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">起送价</span>
                    <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      ¥{deliverySettings.minOrderAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-start px-6 py-4">
                    <span className="text-sm text-muted-foreground">配送日</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {deliverySettings.deliveryDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">配送模式</span>
                    <Badge>{deliverySettings.deliveryMode}</Badge>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">配送区域</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {deliverySettings.deliveryAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </SupplierLayout>
  );
}
