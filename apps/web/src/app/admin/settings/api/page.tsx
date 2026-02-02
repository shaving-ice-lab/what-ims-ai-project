"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Copy, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ApiKeyItem {
  id: number;
  name: string;
  apiKey: string;
  supplierId: number | null;
  supplierName: string | null;
  webhookUrl: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed: string | null;
}

const formSchema = z.object({
  name: z.string().min(1, "请输入名称"),
  webhookUrl: z.string().min(1, "请输入Webhook地址").url("请输入有效的URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApiConfigPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ApiKeyItem | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      webhookUrl: "",
    },
  });

  const [apiKeyData, setApiKeyData] = React.useState<ApiKeyItem[]>([
    {
      id: 1,
      name: "全局API密钥",
      apiKey: "sk_live_xxxxxxxxxxxxxxxxxxxx",
      supplierId: null,
      supplierName: null,
      webhookUrl: "https://api.example.com/webhook",
      status: "active",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-29",
    },
    {
      id: 2,
      name: "生鲜供应商A专用",
      apiKey: "sk_live_yyyyyyyyyyyyyyyyyyyy",
      supplierId: 1,
      supplierName: "生鲜供应商A",
      webhookUrl: "https://supplier-a.com/api/callback",
      status: "active",
      createdAt: "2024-01-15",
      lastUsed: "2024-01-28",
    },
    {
      id: 3,
      name: "粮油供应商B专用",
      apiKey: "sk_live_zzzzzzzzzzzzzzzzzzzz",
      supplierId: 2,
      supplierName: "粮油供应商B",
      webhookUrl: "https://supplier-b.com/webhook",
      status: "inactive",
      createdAt: "2024-01-18",
      lastUsed: null,
    },
  ]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast.success("API密钥已复制到剪贴板");
  };

  const handleRegenerateKey = (id: number) => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 22)}`;
    setApiKeyData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, apiKey: newKey } : item))
    );
    showToast.success("API密钥已重新生成");
  };

  const handleDelete = (id: number) => {
    setApiKeyData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("API密钥已删除");
  };

  const handleOpenModal = (item?: ApiKeyItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        webhookUrl: item.webhookUrl,
      });
    } else {
      setEditingItem(null);
      form.reset({ name: "", webhookUrl: "" });
    }
    setModalOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    if (editingItem) {
      setApiKeyData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...values } : item
        )
      );
      showToast.success("API配置已更新");
    } else {
      const newItem: ApiKeyItem = {
        id: Date.now(),
        name: values.name,
        apiKey: `sk_live_${Math.random().toString(36).substring(2, 22)}`,
        supplierId: null,
        supplierName: null,
        webhookUrl: values.webhookUrl,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0] ?? "",
        lastUsed: null,
      };
      setApiKeyData((prev) => [...prev, newItem]);
      showToast.success("API密钥已创建");
    }
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="API配置"
        title="API配置"
        description="管理系统API密钥和Webhook推送配置，仅主管理员可访问"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            新建密钥
          </Button>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">密钥概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">密钥总数</span>
                <span className="font-semibold">{apiKeyData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">启用中</span>
                <span className="font-semibold text-[hsl(var(--success))]">
                  {apiKeyData.filter((item) => item.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">已禁用</span>
                <span className="font-semibold">
                  {apiKeyData.filter((item) => item.status === "inactive").length}
                </span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">API密钥管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>API密钥</TableHead>
                      <TableHead>关联供应商</TableHead>
                      <TableHead>Webhook地址</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最后使用</TableHead>
                      <TableHead className="w-[200px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeyData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {item.apiKey.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyKey(item.apiKey)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.supplierName || (
                            <Badge variant="secondary">全局</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.webhookUrl}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "active" ? "success" : "secondary"}
                          >
                            {item.status === "active" ? "启用" : "禁用"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.lastUsed || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(item)}
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              编辑
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <RefreshCw className="mr-1 h-4 w-4" />
                                  重新生成
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>重新生成密钥</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要重新生成此API密钥吗？原密钥将立即失效
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRegenerateKey(item.id)}
                                  >
                                    确定
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                                  <AlertDialogTitle>删除密钥</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    确定要删除此API密钥吗？
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "编辑API配置" : "新建API密钥"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入API密钥名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook推送地址</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/webhook"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
