"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import {
  Store,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const storeInfo = {
  id: "S001",
  name: "星巴克-中山路店",
  logo: "/store-logo.png",
  status: "active",
  createdAt: "2024-01-15",
};

const contactInfo = {
  name: "张经理",
  phone: "138****8888",
  email: "zhang@store.com",
};

const addressInfo = {
  province: "上海市",
  city: "浦东新区",
  district: "陆家嘴街道",
  address: "中山路100号",
  fullAddress: "上海市浦东新区陆家嘴街道中山路100号",
};

const accountInfo = {
  username: "store_zhongshan",
  lastLogin: "2024-12-28 09:30:00",
  lastLoginIp: "192.168.1.***",
};

export default function SettingsPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("请填写完整密码信息");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的新密码不一致");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("新密码长度不能少于8位");
      return;
    }
    
    toast.success("密码修改成功", {
      description: "请使用新密码重新登录",
    });
    setPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">账户设置</h1>
        <p className="text-muted-foreground">查看门店信息和账户设置</p>
      </div>

      {/* Store Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            门店信息
          </CardTitle>
          <CardDescription>由管理员维护，如需修改请联系管理员</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={storeInfo.logo} alt={storeInfo.name} />
              <AvatarFallback className="text-lg">{storeInfo.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{storeInfo.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">门店编号: {storeInfo.id}</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  正常营业
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">门店名称</Label>
              <p className="font-medium">{storeInfo.name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">门店编号</Label>
              <p className="font-medium">{storeInfo.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">入驻时间</Label>
              <p className="font-medium">{storeInfo.createdAt}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">门店状态</Label>
              <p className="font-medium">正常营业</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            联系人信息
          </CardTitle>
          <CardDescription>门店联系人信息，用于订单联络</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">联系人</p>
                <p className="font-medium">{contactInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">联系电话</p>
                <p className="font-medium">{contactInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">邮箱</p>
                <p className="font-medium">{contactInfo.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            收货地址
          </CardTitle>
          <CardDescription>订单配送地址，由管理员维护</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{addressInfo.fullAddress}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{addressInfo.province}</Badge>
                  <Badge variant="outline">{addressInfo.city}</Badge>
                  <Badge variant="outline">{addressInfo.district}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            账户安全
          </CardTitle>
          <CardDescription>管理您的账户安全设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">登录账号</p>
                <p className="text-sm text-muted-foreground">{accountInfo.username}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">登录密码</p>
                <p className="text-sm text-muted-foreground">定期更换密码可以提高账户安全性</p>
              </div>
            </div>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">修改密码</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>修改密码</DialogTitle>
                  <DialogDescription>
                    请输入当前密码和新密码
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>当前密码</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="请输入当前密码"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>新密码</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="请输入新密码（至少8位）"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>确认新密码</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handlePasswordChange}>
                    确认修改
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">最近登录</p>
                <p className="text-sm text-muted-foreground">
                  {accountInfo.lastLogin} · IP: {accountInfo.lastLoginIp}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle>需要帮助？</CardTitle>
          <CardDescription>如有问题请联系管理员</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">客服热线</p>
              <p className="text-lg font-bold text-primary">400-888-8888</p>
              <p className="text-sm text-muted-foreground">工作日 9:00-18:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
