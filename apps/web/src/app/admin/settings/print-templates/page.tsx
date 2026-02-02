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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface PrintTemplate {
  id: number;
  name: string;
  content: string;
  supplierIds: string[];
  supplierNames: string[];
  isDefault: boolean;
  createdAt: string;
}

const formSchema = z.object({
  name: z.string().min(1, "请输入模板名称"),
  supplierIds: z.array(z.string()).optional(),
  content: z.string().min(1, "请输入模板内容"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PrintTemplatesPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PrintTemplate | null>(null);
  const [previewContent, setPreviewContent] = React.useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      supplierIds: [],
      content: "",
    },
  });

  const supplierOptions = [
    { value: "1", label: "生鲜供应商A" },
    { value: "2", label: "粮油供应商B" },
    { value: "3", label: "调味品供应商C" },
    { value: "4", label: "冷冻食品供应商D" },
    { value: "5", label: "饮料供应商E" },
  ];

  const [templateData, setTemplateData] = React.useState<PrintTemplate[]>([
    {
      id: 1,
      name: "默认送货单模板",
      content: `【送货单】
订单号：{{order_no}}
下单时间：{{order_time}}
----------------------------------------
门店：{{store_name}}
地址：{{store_address}}
联系人：{{contact_name}}
电话：{{contact_phone}}
----------------------------------------
商品明细：
{{#items}}
{{item_name}} x{{quantity}} {{unit}}  ¥{{price}}
{{/items}}
----------------------------------------
合计金额：¥{{total_amount}}
----------------------------------------
配送员签名：____________
门店签收：____________
日期：____________`,
      supplierIds: [],
      supplierNames: [],
      isDefault: true,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      name: "生鲜供应商专用模板",
      content: `【生鲜送货单】
订单号：{{order_no}}
门店：{{store_name}}
----------------------------------------
{{#items}}
{{item_name}} {{spec}} x{{quantity}}
{{/items}}
----------------------------------------
温馨提示：请当场验收生鲜商品
签收人：____________`,
      supplierIds: ["1"],
      supplierNames: ["生鲜供应商A"],
      isDefault: false,
      createdAt: "2024-01-15",
    },
  ]);

  const availableVariables = [
    { name: "{{order_no}}", desc: "订单号" },
    { name: "{{order_time}}", desc: "下单时间" },
    { name: "{{store_name}}", desc: "门店名称" },
    { name: "{{store_address}}", desc: "门店地址" },
    { name: "{{contact_name}}", desc: "联系人" },
    { name: "{{contact_phone}}", desc: "联系电话" },
    { name: "{{total_amount}}", desc: "订单总金额" },
    { name: "{{#items}}...{{/items}}", desc: "商品列表循环" },
    { name: "{{item_name}}", desc: "商品名称" },
    { name: "{{spec}}", desc: "商品规格" },
    { name: "{{quantity}}", desc: "数量" },
    { name: "{{unit}}", desc: "单位" },
    { name: "{{price}}", desc: "单价" },
  ];

  const handleOpenModal = (item?: PrintTemplate) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        supplierIds: item.supplierIds,
        content: item.content,
      });
    } else {
      setEditingItem(null);
      form.reset({ name: "", supplierIds: [], content: "" });
    }
    setModalOpen(true);
  };

  const handlePreview = (content: string) => {
    let previewText = content
      .replace("{{order_no}}", "ORD202401290001")
      .replace("{{order_time}}", "2024-01-29 10:30:00")
      .replace("{{store_name}}", "门店A - 朝阳店")
      .replace("{{store_address}}", "北京市朝阳区XX路XX号")
      .replace("{{contact_name}}", "张三")
      .replace("{{contact_phone}}", "138****8888")
      .replace("{{total_amount}}", "358.00")
      .replace(
        /\{\{#items\}\}[\s\S]*?\{\{\/items\}\}/g,
        "金龙鱼大豆油5L x2 桶  ¥116.00\n海天酱油500ml x5 瓶  ¥62.50\n中粮大米10kg x2 袋  ¥90.00"
      );

    setPreviewContent(previewText);
    setPreviewOpen(true);
  };

  const handleDelete = (id: number) => {
    setTemplateData((prev) => prev.filter((item) => item.id !== id));
    showToast.success("模板已删除");
  };

  const onSubmit = (values: FormValues) => {
    const supplierNames =
      values.supplierIds
        ?.map((id) => supplierOptions.find((s) => s.value === id)?.label ?? "")
        .filter(Boolean) ?? [];

    if (editingItem) {
      setTemplateData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...values, supplierNames }
            : item
        )
      );
      showToast.success("模板已更新");
    } else {
      const newItem: PrintTemplate = {
        id: Date.now(),
        name: values.name,
        content: values.content,
        supplierIds: values.supplierIds || [],
        supplierNames,
        isDefault: false,
        createdAt: new Date().toISOString().split("T")[0] ?? "",
      };
      setTemplateData((prev) => [...prev, newItem]);
      showToast.success("模板已创建");
    }
    setModalOpen(false);
  };

  const copyVariable = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("已复制到剪贴板");
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="打印模板"
        title="送货单模板配置"
        description="管理送货单打印模板，可为不同供应商分配专属模板"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            创建模板
          </Button>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">模板概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">模板总数</span>
                <span className="font-semibold">{templateData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">默认模板</span>
                <span className="font-semibold">
                  {templateData.filter((item) => item.isDefault).length}
                </span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">模板列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>模板名称</TableHead>
                      <TableHead>分配供应商</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="w-[200px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateData.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {template.name}
                            {template.isDefault && (
                              <Badge variant="secondary">默认</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {template.supplierNames.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {template.supplierNames.map((n) => (
                                <Badge key={n} variant="outline">
                                  {n}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">全部供应商</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.createdAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(template.content)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              预览
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(template)}
                            >
                              <Pencil className="mr-1 h-4 w-4" />
                              编辑
                            </Button>
                            {!template.isDefault && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-[hsl(var(--error))]">
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    删除
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>删除模板</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      确定要删除此模板吗？
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(template.id)}
                                    >
                                      确定
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "编辑模板" : "创建模板"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>模板名称</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入模板名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分配供应商</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              field.value?.includes(value)
                                ? field.value.filter((v) => v !== value)
                                : [...(field.value || []), value]
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择供应商（不选则对全部生效）">
                                {field.value && field.value.length > 0
                                  ? `已选择 ${field.value.length} 个供应商`
                                  : "选择供应商（不选则对全部生效）"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {supplierOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>不选择则对所有供应商生效</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>模板内容</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={15}
                            placeholder="请输入模板内容，可使用右侧变量"
                            className="font-mono"
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
            </div>
            <div>
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">可用变量</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableVariables.map((v, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-background px-1 py-0.5 rounded">
                          {v.name}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyVariable(v.name)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>模板预览</DialogTitle>
          </DialogHeader>
          <pre className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono text-sm">
            {previewContent}
          </pre>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
