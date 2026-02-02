"use client";

import { StoreLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, Phone, Store, User } from "lucide-react";

export default function StoreAccountPage() {
  const storeInfo = {
    name: "门店A - 朝阳店",
    code: "STORE20240001",
    contactName: "张店长",
    contactPhone: "138****8888",
    status: "active",
  };

  const deliveryAddress = {
    province: "北京市",
    city: "北京市",
    district: "朝阳区",
    address: "XX路XX号XX商场B1层",
    contactName: "张三",
    contactPhone: "138****8888",
  };

  return (
    <StoreLayout>
      <WorkbenchShell
        badge="门店端"
        title="账户信息"
        description="查看您的门店账户信息"
        results={
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {/* Basic Info */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-4 w-4 text-primary" />
                  </div>
                  门店基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">门店名称</span>
                    <span className="font-medium">{storeInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">门店编号</span>
                    <span className="font-mono text-sm bg-muted/50 px-2 py-0.5 rounded">
                      {storeInfo.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">联系人</span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {storeInfo.contactName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">联系电话</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {storeInfo.contactPhone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">账户状态</span>
                    <Badge variant={storeInfo.status === "active" ? "success" : "error"}>
                      {storeInfo.status === "active" ? "正常" : "已禁用"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="overflow-hidden">
              <CardHeader className="flex-row items-center justify-between space-y-0 bg-muted/30">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  收货地址
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  由管理员维护
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">省市区</span>
                    <span>
                      {deliveryAddress.province} {deliveryAddress.city}{" "}
                      {deliveryAddress.district}
                    </span>
                  </div>
                  <div className="flex justify-between items-start px-6 py-4">
                    <span className="text-sm text-muted-foreground">详细地址</span>
                    <span className="text-right max-w-[200px]">
                      {deliveryAddress.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">收货人</span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {deliveryAddress.contactName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-muted-foreground">联系电话</span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {deliveryAddress.contactPhone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-6 py-4 bg-muted/20 border-t border-border/50">
                  <Info className="h-3.5 w-3.5" />
                  如需修改收货地址，请联系管理员
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </StoreLayout>
  );
}
