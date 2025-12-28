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
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const supplierInfo = {
  id: "SUP001",
  name: "新鲜果蔬供应商",
  displayName: "新鲜果蔬",
  logo: "/supplier-logo.png",
  status: "active",
  createdAt: "2024-01-15",
  managementMode: "self",
};

const contactInfo = {
  name: "王总",
  phone: "139****9999",
  email: "wang@supplier.com",
};

const deliverySettings = {
  minOrder: 100,
  deliveryDays: [1, 3, 5],
  deliveryMode: "self_delivery",
  areasCount: 4,
};

const accountInfo = {
  username: "supplier_xinxian",
  lastLogin: "2024-12-28 08:30:00",
  lastLoginIp: "192.168.1.***",
};

const weekDays = [
  { id: 1, name: "周一" },
  { id: 2, name: "周二" },
  { id: 3, name: "周三" },
  { id: 4, name: "周四" },
  { id: 5, name: "周五" },
  { id: 6, name: "周六" },
  { id: 0, name: "周日" },
];

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

  const getDeliveryDaysText = () => {
    return deliverySettings.deliveryDays
      .sort((a, b) => a - b)
      .map(d => weekDays.find(w => w.id === d)?.name)
      .join("、");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">账户设置</h1>
        <p className="text-muted-foreground">查看供应商信息和账户设置</p>
      </div>

      {/* 供应商信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            供应商信息
          </CardTitle>
          <CardDescription>由管理员维护，如需修改请联系管理员</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={supplierInfo.logo} alt={supplierInfo.name} />
              <AvatarFallback className="text-lg">{supplierInfo.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{supplierInfo.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">编号: {supplierInfo.id}</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  正常营业
                </Badge>
                <Badge variant="outline">
                  {supplierInfo.managementMode === "self" ? "自主管理" : "平台代管"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">供应商名称</Label>
              <p className="font-medium">{supplierInfo.name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">显示名称</Label>
              <p className="font-medium">{supplierInfo.displayName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">供应商编号</Label>
              <p className="font-medium">{supplierInfo.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">入驻时间</Label>
              <p className="font-medium">{supplierInfo.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系人信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            联系人信息
          </CardTitle>
          <CardDescription>供应商联系人信息</CardDescription>
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

      {/* 当前配送设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            当前配送设置
          </CardTitle>
          <CardDescription>配送相关设置概览，点击配送设置页面可修改</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">起送价</span>
              </div>
              <p className="text-2xl font-bold">¥{deliverySettings.minOrder}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">配送日</span>
              </div>
              <p className="font-medium">{getDeliveryDaysText()}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Truck className="h-4 w-4" />
                <span className="text-sm">配送模式</span>
              </div>
              <p className="font-medium">
                {deliverySettings.deliveryMode === "self_delivery" ? "自有配送" : "快递配送"}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">配送区域</span>
              </div>
              <p className="text-2xl font-bold">{deliverySettings.areasCount} 个</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账户安全 */}
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
                <Clock className="h-5 w-5 text-muted-foreground" />
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

      {/* 帮助 */}
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
