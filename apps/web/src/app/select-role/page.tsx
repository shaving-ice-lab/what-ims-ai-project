"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { selectRole } from "@/store/slices/authSlice";
import { http } from "@/utils/request";
import { Home, Loader2, LogOut, Settings, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  admin: Settings,
  sub_admin: Settings,
  supplier: Store,
  store: Home,
};

const roleNames: Record<string, string> = {
  admin: "主管理员",
  sub_admin: "子管理员",
  supplier: "供应商",
  store: "门店",
};

const roleColors: Record<string, string> = {
  admin: "text-primary",
  sub_admin: "text-primary",
  supplier: "text-[hsl(var(--success))]",
  store: "text-[hsl(var(--warning))]",
};

const roleBgColors: Record<string, string> = {
  admin: "bg-primary/10 hover:bg-primary/20",
  sub_admin: "bg-primary/10 hover:bg-primary/20",
  supplier: "bg-[hsl(var(--success))]/10 hover:bg-[hsl(var(--success))]/20",
  store: "bg-[hsl(var(--warning))]/10 hover:bg-[hsl(var(--warning))]/20",
};

export default function SelectRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { availableRoles } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!availableRoles || availableRoles.length <= 1) {
      router.push("/");
    }
  }, [availableRoles, router]);

  const handleSelectRole = async (role: string, roleId?: number) => {
    setLoading(true);
    setSelectedRole(`${role}-${roleId}`);
    try {
      const res = await http.post<{ token: string }>("/auth/select-role", {
        role,
        roleId,
      });

      dispatch(
        selectRole({
          role: role as "admin" | "sub_admin" | "supplier" | "store",
          roleId,
          accessToken: res.token,
        })
      );

      localStorage.setItem("token", res.token);
      showToast.success("角色切换成功");

      switch (role) {
        case "admin":
        case "sub_admin":
          router.push("/admin");
          break;
        case "supplier":
          router.push("/supplier");
          break;
        case "store":
          router.push("/store");
          break;
        default:
          router.push("/");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      showToast.error(err.message || "角色切换失败");
    } finally {
      setLoading(false);
      setSelectedRole(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!availableRoles || availableRoles.length <= 1) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-xl font-bold text-primary-foreground">
              IMS
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            选择角色
          </h1>
          <p className="text-muted-foreground mt-3 text-base">
            您有多个角色可以使用，请选择一个角色进入系统
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableRoles.map((role, index) => {
            const Icon = roleIcons[role.role] || Settings;
            const isSelected = selectedRole === `${role.role}-${role.roleId}`;

            return (
              <Card
                key={`${role.role}-${role.roleId}`}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm",
                  "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                  loading && !isSelected && "opacity-50 pointer-events-none",
                  isSelected && "border-primary/50 shadow-lg shadow-primary/10"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() =>
                  !loading && handleSelectRole(role.role, role.roleId)
                }
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                        roleBgColors[role.role],
                        isSelected && "scale-110"
                      )}
                    >
                      {isSelected ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <Icon className={cn("h-8 w-8 transition-transform", roleColors[role.role])} />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">
                      {roleNames[role.role]}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}
