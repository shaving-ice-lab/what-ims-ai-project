"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  AlertCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";

const weekDays = [
  { id: 1, name: "周一", short: "一" },
  { id: 2, name: "周二", short: "二" },
  { id: 3, name: "周三", short: "三" },
  { id: 4, name: "周四", short: "四" },
  { id: 5, name: "周五", short: "五" },
  { id: 6, name: "周六", short: "六" },
  { id: 0, name: "周日", short: "日" },
];

const provinces = [
  { id: "shanghai", name: "上海市" },
  { id: "jiangsu", name: "江苏省" },
  { id: "zhejiang", name: "浙江省" },
];

const cities: Record<string, { id: string; name: string }[]> = {
  shanghai: [{ id: "shanghai", name: "上海市" }],
  jiangsu: [
    { id: "nanjing", name: "南京市" },
    { id: "suzhou", name: "苏州市" },
    { id: "wuxi", name: "无锡市" },
  ],
  zhejiang: [
    { id: "hangzhou", name: "杭州市" },
    { id: "ningbo", name: "宁波市" },
    { id: "wenzhou", name: "温州市" },
  ],
};

interface DeliveryArea {
  id: number;
  province: string;
  provinceName: string;
  city: string;
  cityName: string;
  district?: string;
}

const initialAreas: DeliveryArea[] = [
  { id: 1, province: "shanghai", provinceName: "上海市", city: "shanghai", cityName: "上海市", district: "浦东新区" },
  { id: 2, province: "shanghai", provinceName: "上海市", city: "shanghai", cityName: "上海市", district: "黄浦区" },
  { id: 3, province: "shanghai", provinceName: "上海市", city: "shanghai", cityName: "上海市", district: "静安区" },
  { id: 4, province: "jiangsu", provinceName: "江苏省", city: "suzhou", cityName: "苏州市" },
];

export default function DeliveryPage() {
  const [minOrderAmount, setMinOrderAmount] = React.useState("100");
  const [selectedDays, setSelectedDays] = React.useState<number[]>([1, 3, 5]);
  const [deliveryAreas, setDeliveryAreas] = React.useState<DeliveryArea[]>(initialAreas);
  const [newProvince, setNewProvince] = React.useState("");
  const [newCity, setNewCity] = React.useState("");
  const [newDistrict, setNewDistrict] = React.useState("");
  const [auditStatus, setAuditStatus] = React.useState<"none" | "pending" | "approved" | "rejected">("approved");
  const [hasChanges, setHasChanges] = React.useState(false);

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
    setHasChanges(true);
  };

  const handleMinOrderChange = (value: string) => {
    setMinOrderAmount(value);
    setHasChanges(true);
  };

  const addDeliveryArea = () => {
    if (!newProvince || !newCity) {
      toast.error("请选择省市");
      return;
    }

    const provinceName = provinces.find(p => p.id === newProvince)?.name || "";
    const cityName = cities[newProvince]?.find(c => c.id === newCity)?.name || "";

    const newArea: DeliveryArea = {
      id: Date.now(),
      province: newProvince,
      provinceName,
      city: newCity,
      cityName,
      district: newDistrict || undefined,
    };

    setDeliveryAreas(prev => [...prev, newArea]);
    setNewProvince("");
    setNewCity("");
    setNewDistrict("");
    setHasChanges(true);
    toast.success("已添加配送区域");
  };

  const removeDeliveryArea = (areaId: number) => {
    setDeliveryAreas(prev => prev.filter(a => a.id !== areaId));
    setHasChanges(true);
    toast.success("已删除配送区域");
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) {
      toast.error("请至少选择一个配送日");
      return;
    }
    if (!minOrderAmount || parseFloat(minOrderAmount) < 0) {
      toast.error("请输入有效的起送价");
      return;
    }

    setAuditStatus("pending");
    setHasChanges(false);
    toast.success("配送设置已提交审核", {
      description: "管理员审核通过后将生效",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">配送设置</h1>
          <p className="text-muted-foreground">管理配送日、起送价和配送区域</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            提交审核
          </Button>
        )}
      </div>

      {/* 审核状态提示 */}
      {auditStatus === "pending" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">配送设置变更待审核</p>
              <p className="text-sm text-yellow-700">您提交的配送设置变更正在等待管理员审核</p>
            </div>
          </CardContent>
        </Card>
      )}

      {auditStatus === "rejected" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">配送设置变更被驳回</p>
              <p className="text-sm text-red-700">驳回原因：配送区域设置不合理，请重新调整</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 起送价设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              起送价设置
            </CardTitle>
            <CardDescription>设置订单最低金额</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>起送金额 (元)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">¥</span>
                  <Input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => handleMinOrderChange(e.target.value)}
                    className="max-w-[200px]"
                    placeholder="请输入起送金额"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  门店订单金额低于此值将无法提交
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 配送日设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              配送日设置
            </CardTitle>
            <CardDescription>选择每周可配送的日期</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {weekDays.map((day) => (
                <div
                  key={day.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedDays.includes(day.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => toggleDay(day.id)}
                >
                  <Checkbox checked={selectedDays.includes(day.id)} />
                  <span className="font-medium">{day.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              当前配送日：{selectedDays.length > 0 
                ? selectedDays.sort((a, b) => a - b).map(d => weekDays.find(w => w.id === d)?.name).join("、")
                : "未设置"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 配送区域管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            配送区域管理
          </CardTitle>
          <CardDescription>设置可配送的省市区域</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 添加新区域 */}
          <div className="flex flex-wrap gap-4 items-end p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>省份</Label>
              <Select value={newProvince} onValueChange={(v) => { setNewProvince(v); setNewCity(""); }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择省份" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>城市</Label>
              <Select value={newCity} onValueChange={setNewCity} disabled={!newProvince}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
                <SelectContent>
                  {newProvince && cities[newProvince]?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>区县 (可选)</Label>
              <Input
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                placeholder="输入区县"
                className="w-[150px]"
              />
            </div>
            <Button onClick={addDeliveryArea}>
              <Plus className="mr-2 h-4 w-4" />
              添加区域
            </Button>
          </div>

          <Separator />

          {/* 区域列表 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>省份</TableHead>
                <TableHead>城市</TableHead>
                <TableHead>区县</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell>{area.provinceName}</TableCell>
                  <TableCell>{area.cityName}</TableCell>
                  <TableCell>{area.district || <span className="text-muted-foreground">全市</span>}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除 {area.provinceName} {area.cityName} {area.district || ""} 这个配送区域吗？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeDeliveryArea(area.id)}>
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {deliveryAreas.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无配送区域</h3>
              <p className="text-muted-foreground">请添加可配送的区域</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 当前设置概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            当前配送设置概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">起送价</p>
              <p className="text-2xl font-bold">¥{minOrderAmount || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">配送日</p>
              <p className="text-lg font-medium">
                {selectedDays.length > 0 
                  ? `每周${selectedDays.sort((a, b) => a - b).map(d => weekDays.find(w => w.id === d)?.short).join("、")}`
                  : "未设置"
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">配送区域</p>
              <p className="text-lg font-medium">{deliveryAreas.length} 个区域</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
