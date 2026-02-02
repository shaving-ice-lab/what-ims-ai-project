"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import {
    Bell,
    LogOut,
    Moon,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

interface AppHeaderProps {
  collapsed: boolean;
  role: "admin" | "store" | "supplier";
}

export function AppHeader({ collapsed, role }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const roleLabel = React.useMemo(() => {
    switch (role) {
      case "admin":
        return "管理后台";
      case "store":
        return "门店端";
      case "supplier":
        return "供应商端";
      default:
        return "系统";
    }
  }, [role]);

  const routePath = React.useMemo(() => {
    if (!pathname || pathname === "/") return "/home";
    return pathname;
  }, [pathname]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    showToast.success("已退出登录");
    router.push("/login");
  };

  const handleThemeToggle = React.useCallback(() => {
    const effectiveTheme = theme === "system" ? resolvedTheme : theme;
    const nextTheme = (effectiveTheme ?? "light") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme, theme]);

  const userInitials = React.useMemo(() => {
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "U";
  }, [user]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 px-4 transition-all duration-300 ease-in-out",
          collapsed ? "left-16" : "left-64"
        )}
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {roleLabel}
          </Badge>
          <span className="hidden text-xs text-muted-foreground/60 md:inline">/</span>
          <span className="hidden max-w-[240px] truncate font-mono text-xs text-foreground/70 md:inline">
            {routePath}
          </span>
        </div>

        {/* Search */}
        <Button
          variant="outline"
          className="relative h-9 w-full max-w-sm justify-start text-sm text-muted-foreground bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-border"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="text-muted-foreground/70">搜索功能...</span>
          <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded-md border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-muted/50"
            onClick={handleThemeToggle}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">切换主题</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative rounded-lg hover:bg-muted/50">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] font-medium text-destructive-foreground">
              0
            </span>
          </Button>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-2" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 px-2 rounded-lg hover:bg-muted/50 gap-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium">
                  {user?.name || user?.username || "用户"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || user?.username || "用户"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role === "admin"
                      ? "管理员"
                      : user?.role === "store"
                      ? "门店"
                      : user?.role === "supplier"
                      ? "供应商"
                      : "用户"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                个人信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="搜索功能..." />
        <CommandList>
          <CommandEmpty>未找到相关结果</CommandEmpty>
          <CommandGroup heading="快捷导航">
            <CommandItem
              onSelect={() => {
                router.push("/admin");
                setCommandOpen(false);
              }}
            >
              数据看板
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/admin/orders");
                setCommandOpen(false);
              }}
            >
              订单管理
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/admin/materials");
                setCommandOpen(false);
              }}
            >
              物料管理
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
