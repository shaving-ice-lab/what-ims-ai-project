"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { loginSuccess } from "@/store/slices/authSlice";
import { http } from "@/utils/request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as z from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await http.post<{
        accessToken: string;
        refreshToken: string;
        user: { id: number; username: string; role: string; name: string; phone?: string };
        availableRoles?: { role: string; roleId?: number; name: string }[];
      }>("/auth/login", values);

      dispatch(
        loginSuccess({
          user: {
            ...res.user,
            role: res.user.role as "admin" | "sub_admin" | "supplier" | "store",
            phone: res.user.phone ?? "",
          },
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          availableRoles: res.availableRoles,
        })
      );

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      showToast.success("登录成功");

      if (res.availableRoles && res.availableRoles.length > 1) {
        router.push("/select-role");
      } else {
        const role = res.user.role;
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
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      showToast.error(err.message || "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-lg font-bold text-primary-foreground">
                IMS
              </span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              供应链订货系统
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              IMS - Inventory Management System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="请输入用户名"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="请输入密码"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  登录
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 供应链订货系统. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
