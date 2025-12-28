"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  Truck,
  Package,
  Image,
  DollarSign,
  Settings,
  FileText,
  Bell,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "订单管理",
    icon: ShoppingCart,
    href: "/orders",
    children: [
      { title: "订单列表", href: "/orders" },
      { title: "取消申请", href: "/orders/cancel-requests" },
    ],
  },
  {
    title: "门店管理",
    icon: Store,
    href: "/stores",
  },
  {
    title: "供应商管理",
    icon: Truck,
    href: "/suppliers",
    children: [
      { title: "供应商列表", href: "/suppliers" },
      { title: "配送设置审核", href: "/suppliers/delivery-audit" },
    ],
  },
  {
    title: "物料管理",
    icon: Package,
    href: "/materials",
    children: [
      { title: "分类管理", href: "/materials/categories" },
      { title: "物料列表", href: "/materials" },
      { title: "产品审核", href: "/materials/audit" },
    ],
  },
  {
    title: "素材库",
    icon: Image,
    href: "/media",
  },
  {
    title: "加价管理",
    icon: DollarSign,
    href: "/price-markup",
  },
  {
    title: "数据报表",
    icon: FileText,
    href: "/reports",
    children: [
      { title: "销售报表", href: "/reports/sales" },
      { title: "订单统计", href: "/reports/orders" },
      { title: "供应商报表", href: "/reports/suppliers" },
    ],
  },
  {
    title: "通知配置",
    icon: Bell,
    href: "/notifications",
    children: [
      { title: "Webhook配置", href: "/notifications/webhook" },
      { title: "推送日志", href: "/notifications/logs" },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    href: "/settings",
    children: [
      { title: "基础配置", href: "/settings" },
      { title: "管理员管理", href: "/settings/admins" },
      { title: "支付配置", href: "/settings/payment" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg">供应链管理</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>菜单</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.children ? (
                  <Collapsible key={item.href} defaultOpen={isActive(item.href)}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === child.href}
                              >
                                <Link href={child.href}>{child.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.png" alt="管理员" />
            <AvatarFallback>管</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">管理员</p>
            <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
