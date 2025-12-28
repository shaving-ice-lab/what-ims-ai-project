"use client";

import { useState } from "react";
import { 
  Search, 
  Plus,
  MoreHorizontal,
  DollarSign,
  Percent,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MarkupRule {
  id: number;
  name: string;
  type: "global" | "category" | "supplier" | "store";
  typeName: string;
  targetName: string;
  markupType: "fixed" | "percentage";
  markupValue: number;
  priority: number;
  status: number;
  createdAt: string;
}

const mockRules: MarkupRule[] = [
  { id: 1, name: "全局加价规则", type: "global", typeName: "全局", targetName: "所有商品", markupType: "percentage", markupValue: 3, priority: 1, status: 1, createdAt: "2024-01-01" },
  { id: 2, name: "蔬菜类加价", type: "category", typeName: "分类", targetName: "蔬菜", markupType: "percentage", markupValue: 5, priority: 2, status: 1, createdAt: "2024-01-02" },
  { id: 3, name: "水果类加价", type: "category", typeName: "分类", targetName: "水果", markupType: "percentage", markupValue: 4, priority: 2, status: 1, createdAt: "2024-01-03" },
  { id: 4, name: "新鲜果蔬供应商", type: "supplier", typeName: "供应商", targetName: "新鲜果蔬", markupType: "fixed", markupValue: 2, priority: 3, status: 1, createdAt: "2024-01-04" },
  { id: 5, name: "优质肉类供应商", type: "supplier", typeName: "供应商", targetName: "优质肉类", markupType: "percentage", markupValue: 3.5, priority: 3, status: 1, createdAt: "2024-01-05" },
  { id: 6, name: "星巴克门店", type: "store", typeName: "门店", targetName: "星巴克-中山路店", markupType: "percentage", markupValue: 0, priority: 4, status: 1, createdAt: "2024-01-06" },
  { id: 7, name: "肉类临时加价", type: "category", typeName: "分类", targetName: "肉类", markupType: "percentage", markupValue: 8, priority: 2, status: 0, createdAt: "2024-01-07" },
];

const typeOptions = [
  { value: "global", label: "全局" },
  { value: "category", label: "按分类" },
  { value: "supplier", label: "按供应商" },
  { value: "store", label: "按门店" },
];

export default function PriceMarkupPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rules, setRules] = useState<MarkupRule[]>(mockRules);

  const toggleStatus = (id: number) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 1 ? 0 : 1 } : r
    ));
    toast.success("状态已更新");
  };

  const deleteRule = (id: number) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success("规则已删除");
  };

  const activeRules = rules.filter(r => r.status === 1);
  const totalRules = rules.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">加价规则管理</h1>
          <p className="text-muted-foreground">管理门店端商品的加价规则</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加规则
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>添加加价规则</DialogTitle>
              <DialogDescription>设置门店端商品的加价规则</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">规则名称</Label>
                <Input id="name" placeholder="请输入规则名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>规则类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>目标对象</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>加价方式</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">按比例 (%)</SelectItem>
                      <SelectItem value="fixed">固定金额 (元)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">加价数值</Label>
                  <Input id="value" type="number" step="0.1" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">优先级 (数值越大优先级越高)</Label>
                <Input id="priority" type="number" defaultValue="1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={() => { setDialogOpen(false); toast.success("规则已创建"); }}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">规则总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRules}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">启用中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRules.length}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">本月加价收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">¥12,456.80</div>
            <p className="text-xs text-muted-foreground">较上月 +15.2%</p>
          </CardContent>
        </Card>
      </div>

      {/* 规则说明 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">加价规则说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>优先级规则</strong>：优先级数值越大，规则优先级越高。当多个规则匹配时，使用最高优先级的规则。</p>
          <p>• <strong>规则类型</strong>：全局 → 分类 → 供应商 → 门店，门店级别规则可覆盖其他规则（设置为0可取消加价）。</p>
          <p>• <strong>加价方式</strong>：按比例加价基于供应商报价计算，固定金额直接加到单价上。</p>
        </CardContent>
      </Card>

      {/* 规则表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>规则名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>目标对象</TableHead>
              <TableHead>加价方式</TableHead>
              <TableHead className="text-right">加价数值</TableHead>
              <TableHead className="text-right">优先级</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{rule.typeName}</Badge>
                </TableCell>
                <TableCell>{rule.targetName}</TableCell>
                <TableCell>
                  {rule.markupType === "percentage" ? (
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-muted-foreground" />
                      按比例
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      固定金额
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {rule.markupType === "percentage" 
                    ? `${rule.markupValue}%` 
                    : `¥${rule.markupValue.toFixed(2)}`
                  }
                </TableCell>
                <TableCell className="text-right">{rule.priority}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.status === 1}
                      onCheckedChange={() => toggleStatus(rule.id)}
                    />
                    <span className={rule.status === 1 ? "text-green-600" : "text-muted-foreground"}>
                      {rule.status === 1 ? "启用" : "禁用"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑规则
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除规则
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
