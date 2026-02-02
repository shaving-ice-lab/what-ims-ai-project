"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    FileCheck,
    FileText,
    Image,
    LayoutDashboard,
    Package,
    Printer,
    Settings,
    ShoppingCart,
    Store,
    TrendingUp,
    Truck,
    User,
    Users,
    Webhook,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: NavItem[];
}

interface AppSidebarProps {
  role: "admin" | "store" | "supplier";
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const adminNavItems: NavItem[] = [
  {
    title: "数据看板",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "订单管理",
    icon: ShoppingCart,
    children: [
      { title: "订单列表", href: "/admin/orders", icon: ShoppingCart },
      { title: "配送审核", href: "/admin/delivery-audit", icon: FileCheck },
    ],
  },
  {
    title: "用户管理",
    icon: Users,
    children: [
      { title: "供应商管理", href: "/admin/suppliers", icon: Users },
      { title: "门店管理", href: "/admin/stores", icon: Store },
      { title: "管理员管理", href: "/admin/admins", icon: User },
    ],
  },
  {
    title: "物料管理",
    href: "/admin/materials",
    icon: Package,
  },
  {
    title: "加价管理",
    icon: DollarSign,
    children: [
      { title: "加价规则", href: "/admin/markup/rules", icon: DollarSign },
      { title: "加价开关", href: "/admin/markup/switches", icon: Settings },
      { title: "价格模拟", href: "/admin/markup/simulate", icon: TrendingUp },
      { title: "批量导入", href: "/admin/markup/import", icon: FileText },
      { title: "加价统计", href: "/admin/markup/statistics", icon: FileText },
    ],
  },
  {
    title: "行情管理",
    icon: TrendingUp,
    children: [
      { title: "行情价格", href: "/admin/market", icon: TrendingUp },
      { title: "预警设置", href: "/admin/market/alerts", icon: Settings },
    ],
  },
  {
    title: "媒资管理",
    icon: Image,
    children: [
      { title: "媒资库", href: "/admin/media", icon: Image },
      { title: "匹配规则", href: "/admin/media/match-rules", icon: Settings },
    ],
  },
  {
    title: "商品审核",
    href: "/admin/product-audit",
    icon: FileCheck,
  },
  {
    title: "报表统计",
    icon: FileText,
    children: [
      { title: "数据分析", href: "/admin/reports/analysis", icon: FileText },
      { title: "物料报表", href: "/admin/reports/materials", icon: FileText },
      { title: "供应商报表", href: "/admin/reports/suppliers", icon: FileText },
      { title: "门店报表", href: "/admin/reports/stores", icon: FileText },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    children: [
      { title: "参数配置", href: "/admin/settings/params", icon: Settings },
      { title: "支付配置", href: "/admin/settings/payment", icon: DollarSign },
      { title: "打印模板", href: "/admin/settings/print-templates", icon: Printer },
      { title: "API配置", href: "/admin/settings/api", icon: Webhook },
      { title: "操作日志", href: "/admin/settings/logs", icon: FileText },
    ],
  },
  {
    title: "Webhook日志",
    href: "/admin/webhook-logs",
    icon: Webhook,
  },
];

const storeNavItems: NavItem[] = [
  {
    title: "数据看板",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    title: "账户信息",
    href: "/store/account",
    icon: User,
  },
];

const supplierNavItems: NavItem[] = [
  {
    title: "数据看板",
    href: "/supplier",
    icon: LayoutDashboard,
  },
  {
    title: "价格管理",
    href: "/supplier/materials",
    icon: DollarSign,
  },
  {
    title: "库存管理",
    href: "/supplier/materials/stock",
    icon: Package,
  },
  {
    title: "行情对比",
    href: "/supplier/market",
    icon: TrendingUp,
  },
  {
    title: "配送设置",
    icon: Truck,
    children: [
      { title: "基本设置", href: "/supplier/delivery", icon: Settings },
      { title: "配送区域", href: "/supplier/delivery/areas", icon: Truck },
    ],
  },
  {
    title: "配送单打印",
    href: "/supplier/print",
    icon: Printer,
  },
  {
    title: "账户信息",
    href: "/supplier/account",
    icon: User,
  },
];

function NavItemComponent({
  item,
  collapsed,
  pathname,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  depth?: number;
}) {
  const [open, setOpen] = React.useState(() => {
    if (item.children) {
      return item.children.some(
        (child) => child.href && pathname.startsWith(child.href)
      );
    }
    return false;
  });

  const isActive = item.href
    ? pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))
    : false;

  const hasActiveChild = item.children?.some((c) => c.href && pathname.startsWith(c.href));

  const Icon = item.icon;

  if (item.children) {
    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-lg transition-all duration-200",
                hasActiveChild
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]"
              )}
            >
              <Icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 p-2 min-w-[160px]">
            <span className="font-medium text-sm mb-1">{item.title}</span>
            <Separator className="my-1" />
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href || "#"}
                className={cn(
                  "text-sm px-2 py-1.5 rounded-md transition-colors",
                  child.href && pathname.startsWith(child.href)
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {child.title}
              </Link>
            ))}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between px-3 h-10 rounded-lg transition-all duration-200",
              hasActiveChild
                ? "text-foreground bg-[hsl(var(--sidebar-accent))]/50"
                : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", hasActiveChild && "text-primary")} />
              <span className="text-sm font-medium">{item.title}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1 space-y-0.5 animate-fade-in">
          {item.children.map((child) => (
            <NavItemComponent
              key={child.href}
              item={child}
              collapsed={collapsed}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const content = (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative group",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--sidebar-accent))]",
        collapsed && "justify-center px-0",
        depth > 0 && !isActive && "text-muted-foreground/80"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function AppSidebar({ role, collapsed, onCollapsedChange }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = React.useMemo(() => {
    switch (role) {
      case "admin":
        return adminNavItems;
      case "store":
        return storeNavItems;
      case "supplier":
        return supplierNavItems;
      default:
        return [];
    }
  }, [role]);

  const roleLabel = React.useMemo(() => {
    switch (role) {
      case "admin":
        return "管理后台";
      case "store":
        return "门店端";
      case "supplier":
        return "供应商端";
      default:
        return "";
    }
  }, [role]);

  const roleColor = React.useMemo(() => {
    switch (role) {
      case "admin":
        return "from-primary to-primary/80";
      case "store":
        return "from-amber-500 to-amber-600";
      case "supplier":
        return "from-emerald-500 to-emerald-600";
      default:
        return "from-primary to-primary/80";
    }
  }, [role]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/60 bg-[hsl(var(--sidebar-background))]/80 backdrop-blur-xl transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-[hsl(var(--sidebar-border))] px-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {collapsed ? (
            <div className={cn("h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg shadow-primary/20", roleColor)}>
              <span className="text-xs font-bold text-white">IMS</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className={cn("h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg shadow-primary/20", roleColor)}>
                  <span className="text-xs font-bold text-white">
                    IMS
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight">供应链订货</span>
                  <span className="text-[11px] text-muted-foreground">
                    {roleLabel}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
            {navItems.map((item, index) => (
              <NavItemComponent
                key={item.href || item.title + index}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="border-t border-[hsl(var(--sidebar-border))] p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              "w-full text-muted-foreground hover:text-foreground",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">收起侧栏</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
