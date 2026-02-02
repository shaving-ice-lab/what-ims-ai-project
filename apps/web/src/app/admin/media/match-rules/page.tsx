"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MatchRule {
  id: number;
  name: string;
  ruleType: "name" | "brand" | "sku" | "keyword";
  matchPattern: string;
  threshold: number;
  priority: number;
  enabled: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "请输入规则名称"),
  ruleType: z.enum(["name", "brand", "sku", "keyword"]),
  matchPattern: z.string().min(1, "请选择匹配模式"),
  threshold: z.string().min(1, "请输入相似度阈值"),
  priority: z.string().min(1, "请输入优先级"),
  enabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MatchRulesPage() {
  const [autoMatchEnabled, setAutoMatchEnabled] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MatchRule | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ruleType: "name",
      matchPattern: "exact",
      threshold: "80",
      priority: "1",
      enabled: true,
    },
  });

  const [rulesData, setRulesData] = React.useState<MatchRule[]>([
    { id: 1, name: "品牌名称精确匹配", ruleType: "brand", matchPattern: "exact", threshold: 100, priority: 1, enabled: true },
    { id: 2, name: "SKU编码匹配", ruleType: "sku", matchPattern: "exact", threshold: 100, priority: 2, enabled: true },
    { id: 3, name: "产品名称模糊匹配", ruleType: "name", matchPattern: "fuzzy", threshold: 80, priority: 3, enabled: true },
    { id: 4, name: "关键词匹配", ruleType: "keyword", matchPattern: "contains", threshold: 70, priority: 4, enabled: false },
  ]);

  const ruleTypeOptions = [
    { value: "name", label: "产品名称" },
    { value: "brand", label: "品牌" },
    { value: "sku", label: "SKU编码" },
    { value: "keyword", label: "关键词" },
  ];

  const matchPatternOptions = [
    { value: "exact", label: "精确匹配" },
    { value: "fuzzy", label: "模糊匹配" },
    { value: "contains", label: "包含匹配" },
    { value: "regex", label: "正则匹配" },
  ];

  const ruleTypeColors: Record<string, "default" | "secondary" | "success" | "warning" | "error"> = {
    name: "default",
    brand: "success",
    sku: "secondary",
    keyword: "warning",
  };

  const handleOpenModal = (item?: MatchRule) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        ruleType: item.ruleType,
        matchPattern: item.matchPattern,
        threshold: String(item.threshold),
        priority: String(item.priority),
        enabled: item.enabled,
      });
    } else {
      setEditingItem(null);
      form.reset({
        name: "",
        ruleType: "name",
        matchPattern: "exact",
        threshold: "80",
        priority: String(rulesData.length + 1),
        enabled: true,
      });
    }
    setModalOpen(true);
  };

  const handleToggleEnabled = (id: number, enabled: boolean) => {
    setRulesData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
    showToast.success(`规则已${enabled ? "启用" : "禁用"}`);
  };

  const handleDelete = (id: number) => {
    setRulesData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("规则已删除");
  };

  const onSubmit = (values: FormValues) => {
    const ruleData = {
      name: values.name,
      ruleType: values.ruleType,
      matchPattern: values.matchPattern,
      threshold: Number(values.threshold),
      priority: Number(values.priority),
      enabled: values.enabled,
    };

    if (editingItem) {
      setRulesData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...ruleData } : item
        )
      );
      showToast.success("规则已更新");
    } else {
      const newItem: MatchRule = {
        id: Date.now(),
        ...ruleData,
      };
      setRulesData((prev) => [...prev, newItem]);
      showToast.success("规则已创建");
    }
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="匹配规则"
        title="图片匹配规则配置"
        description="配置商品图片自动匹配规则，系统将根据规则自动为商品匹配素材库中的图片"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            新建规则
          </Button>
        }
        toolbar={
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>已配置 {rulesData.length} 条规则</span>
          </div>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">自动匹配</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <Switch
                  checked={autoMatchEnabled}
                  onCheckedChange={setAutoMatchEnabled}
                />
                <Badge variant={autoMatchEnabled ? "success" : "secondary"}>
                  {autoMatchEnabled ? "已开启" : "已关闭"}
                </Badge>
              </div>
              {!autoMatchEnabled && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    自动匹配功能已关闭，商品图片将不会自动匹配
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">匹配规则列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>规则名称</TableHead>
                      <TableHead>规则类型</TableHead>
                      <TableHead>匹配模式</TableHead>
                      <TableHead className="text-right">相似度阈值</TableHead>
                      <TableHead className="text-right">优先级</TableHead>
                      <TableHead className="text-center">启用状态</TableHead>
                      <TableHead className="w-[120px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rulesData.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <Badge variant={ruleTypeColors[rule.ruleType]}>
                            {ruleTypeOptions.find((o) => o.value === rule.ruleType)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {matchPatternOptions.find((o) => o.value === rule.matchPattern)?.label}
                        </TableCell>
                        <TableCell className="text-right">{rule.threshold}%</TableCell>
                        <TableCell className="text-right">{rule.priority}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) =>
                              handleToggleEnabled(rule.id, checked)
                            }
                            disabled={!autoMatchEnabled}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(rule)}
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              编辑
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[hsl(var(--error))]"
                                >
                                  <Trash2 className="mr-1 h-4 w-4" />
                                  删除
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>删除规则</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要删除此规则吗？
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(rule.id)}
                                  >
                                    确定
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        }
      />

        {/* Create/Edit Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "编辑规则" : "新建规则"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>规则名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入规则名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ruleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>规则类型</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择规则类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ruleTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matchPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>匹配模式</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择匹配模式" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {matchPatternOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>相似度阈值</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        匹配相似度达到该阈值时才会匹配成功
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>优先级</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={100} {...field} />
                      </FormControl>
                      <FormDescription>数字越小优先级越高</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>启用状态</FormLabel>
                        <FormDescription>启用或禁用此规则</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingItem ? "保存" : "创建"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </AdminLayout>
  );
}
