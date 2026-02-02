"use client";

/**
 * PermissionMenu - 权限菜单组件
 * 根据用户权限动态生成侧边栏菜单
 */

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    ChevronDown,
    ClipboardList,
    DollarSign,
    Image,
    LayoutDashboard,
    Package,
    Settings,
    Store,
    User,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface MenuConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permission?: string;
  children?: MenuConfig[];
  roles?: ("admin" | "sub_admin" | "supplier" | "store")[];
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  orders: <ClipboardList className="h-4 w-4" />,
  suppliers: <Users className="h-4 w-4" />,
  stores: <Store className="h-4 w-4" />,
  materials: <Package className="h-4 w-4" />,
  media: <Image className="h-4 w-4" />,
  markup: <DollarSign className="h-4 w-4" />,
  reports: <BarChart3 className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  home: <LayoutDashboard className="h-4 w-4" />,
  cart: <Package className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
  prices: <DollarSign className="h-4 w-4" />,
};

// Admin menu config
const adminMenuConfig: MenuConfig[] = [
  {
    key: "dashboard",
    label: "数据看板",
    path: "/admin/dashboard",
  },
  {
    key: "orders",
    label: "订单管理",
    path: "/admin/orders",
    permission: "order",
  },
  {
    key: "suppliers",
    label: "供应商管理",
    path: "/admin/suppliers",
    permission: "supplier",
  },
  {
    key: "stores",
    label: "门店管理",
    path: "/admin/stores",
    permission: "store",
  },
  {
    key: "materials",
    label: "物料管理",
    path: "/admin/materials",
    permission: "material",
  },
  {
    key: "media",
    label: "素材库",
    path: "/admin/media",
    permission: "media",
  },
  {
    key: "markup",
    label: "加价管理",
    path: "/admin/markup",
    permission: "markup",
  },
  {
    key: "reports",
    label: "数据报表",
    path: "/admin/reports",
    permission: "report",
  },
  {
    key: "system",
    label: "系统设置",
    permission: "system_config",
    children: [
      {
        key: "admins",
        label: "管理员管理",
        path: "/admin/system/admins",
        permission: "admin_manage",
      },
      {
        key: "config",
        label: "系统配置",
        path: "/admin/system/config",
        permission: "system_config",
      },
    ],
  },
];

// Supplier menu config
const supplierMenuConfig: MenuConfig[] = [
  {
    key: "dashboard",
    label: "数据概览",
    path: "/supplier/dashboard",
  },
  {
    key: "orders",
    label: "订单管理",
    path: "/supplier/orders",
  },
  {
    key: "materials",
    label: "商品管理",
    path: "/supplier/materials",
  },
  {
    key: "prices",
    label: "价格管理",
    path: "/supplier/prices",
  },
  {
    key: "settings",
    label: "配送设置",
    path: "/supplier/settings",
  },
];

// Store menu config
const storeMenuConfig: MenuConfig[] = [
  {
    key: "home",
    label: "首页",
    path: "/store/home",
  },
  {
    key: "suppliers",
    label: "供应商列表",
    path: "/store/suppliers",
  },
  {
    key: "cart",
    label: "购物车",
    path: "/store/cart",
  },
  {
    key: "orders",
    label: "我的订单",
    path: "/store/orders",
  },
  {
    key: "profile",
    label: "个人中心",
    path: "/store/profile",
  },
];

export interface PermissionMenuProps {
  role: "admin" | "sub_admin" | "supplier" | "store";
  permissions?: string[];
  isPrimary?: boolean;
  collapsed?: boolean;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

const PermissionMenu: React.FC<PermissionMenuProps> = ({
  role,
  permissions = [],
  isPrimary = false,
  collapsed = false,
  selectedKey,
  onSelect,
}) => {
  const router = useRouter();
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  // Get menu config based on role
  const getMenuConfig = (): MenuConfig[] => {
    switch (role) {
      case "admin":
      case "sub_admin":
        return adminMenuConfig;
      case "supplier":
        return supplierMenuConfig;
      case "store":
        return storeMenuConfig;
      default:
        return [];
    }
  };

  // Check permission
  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;
    if (isPrimary) return true;
    return permissions.includes(permission);
  };

  // Filter menu items
  const filterMenuItems = (items: MenuConfig[]): MenuConfig[] => {
    return items.filter((item) => {
      if (!hasPermission(item.permission)) {
        return false;
      }

      if (item.roles && !item.roles.includes(role)) {
        return false;
      }

      if (item.children) {
        item.children = filterMenuItems(item.children);
        if (item.children.length === 0) {
          return false;
        }
      }

      return true;
    });
  };

  // Build path map
  const buildPathMap = (
    items: MenuConfig[],
    map: Record<string, string> = {}
  ): Record<string, string> => {
    items.forEach((item) => {
      if (item.path) {
        map[item.key] = item.path;
      }
      if (item.children) {
        buildPathMap(item.children, map);
      }
    });
    return map;
  };

  const menuConfig = React.useMemo(
    () => filterMenuItems(getMenuConfig()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role, permissions, isPrimary]
  );
  const pathMap = React.useMemo(() => buildPathMap(menuConfig), [menuConfig]);

  const handleClick = (key: string) => {
    const path = pathMap[key];
    if (path) {
      router.push(path);
    }
    onSelect?.(key);
  };

  const renderMenuItem = (item: MenuConfig) => {
    const icon = iconMap[item.key] || iconMap.dashboard;
    const isSelected = selectedKey === item.key;

    if (item.children && item.children.length > 0) {
      const isOpen = openKeys.includes(item.key);

      return (
        <Collapsible
          key={item.key}
          open={isOpen}
          onOpenChange={(open) =>
            setOpenKeys(
              open
                ? [...openKeys, item.key]
                : openKeys.filter((k) => k !== item.key)
            )
          }
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-3",
                collapsed && "justify-center px-2"
              )}
            >
              {icon}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent className="pl-6 space-y-1">
              {item.children.map((child) => renderMenuItem(child))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.key}
        variant={isSelected ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 px-3",
          collapsed && "justify-center px-2",
          isSelected && "bg-accent"
        )}
        onClick={() => handleClick(item.key)}
      >
        {icon}
        {!collapsed && <span>{item.label}</span>}
      </Button>
    );
  };

  return (
    <nav className="space-y-1">
      {menuConfig.map((item) => renderMenuItem(item))}
    </nav>
  );
};

export default PermissionMenu;
