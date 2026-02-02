"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Download,
    Info,
    Upload,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ImportPreviewItem {
  id: string;
  rowNum: number;
  name: string;
  storeName: string | null;
  supplierName: string | null;
  materialName: string | null;
  markupType: string;
  markupValue: number;
  status: "valid" | "error" | "warning";
  errorMsg: string | null;
}

type ImportStep = "upload" | "preview" | "importing" | "result";

export default function MarkupImportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<ImportStep>("upload");
  const [previewData, setPreviewData] = React.useState<ImportPreviewItem[]>([]);
  const [importProgress, setImportProgress] = React.useState(0);
  const [importResult, setImportResult] = React.useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const mockPreviewData: ImportPreviewItem[] = [
    {
      id: "1",
      rowNum: 2,
      name: "默认加价规则",
      storeName: null,
      supplierName: null,
      materialName: null,
      markupType: "百分比",
      markupValue: 3,
      status: "valid",
      errorMsg: null,
    },
    {
      id: "2",
      rowNum: 3,
      name: "生鲜供应商A固定加价",
      storeName: null,
      supplierName: "生鲜供应商A",
      materialName: null,
      markupType: "固定金额",
      markupValue: 2,
      status: "valid",
      errorMsg: null,
    },
    {
      id: "3",
      rowNum: 4,
      name: "门店A专属规则",
      storeName: "门店A - 朝阳店",
      supplierName: null,
      materialName: null,
      markupType: "百分比",
      markupValue: 2.5,
      status: "warning",
      errorMsg: "已存在同名规则，将更新",
    },
    {
      id: "4",
      rowNum: 5,
      name: "无效规则",
      storeName: "不存在的门店",
      supplierName: null,
      materialName: null,
      markupType: "百分比",
      markupValue: -1,
      status: "error",
      errorMsg: "门店不存在；加价值不能为负数",
    },
  ];

  const handleDownloadTemplate = () => {
    showToast.success("模板下载中...");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (_file: File) => {
    // Simulate file parsing
    setTimeout(() => {
      setPreviewData(mockPreviewData);
      setCurrentStep("preview");
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleConfirmImport = async () => {
    const validItems = previewData.filter((item) => item.status !== "error");
    if (validItems.length === 0) {
      showToast.error("没有可导入的有效数据");
      return;
    }

    setCurrentStep("importing");

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setImportProgress(i);
    }

    setImportResult({
      success: validItems.length,
      failed: previewData.length - validItems.length,
      total: previewData.length,
    });
    setCurrentStep("result");
  };

  const handleReset = () => {
    setCurrentStep("upload");
    setPreviewData([]);
    setImportProgress(0);
    setImportResult(null);
  };

  const validCount = previewData.filter((item) => item.status === "valid").length;
  const warningCount = previewData.filter((item) => item.status === "warning").length;
  const errorCount = previewData.filter((item) => item.status === "error").length;
  const stepLabel: Record<ImportStep, string> = {
    upload: "上传文件",
    preview: "数据预览",
    importing: "导入中",
    result: "导入结果",
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="批量导入"
        title="批量导入加价规则"
        description="通过Excel文件批量导入加价规则，请先下载模板并按格式填写"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              下载模板
            </Button>
            <Button size="sm" onClick={() => router.push("/admin/markup/rules")}>
              查看规则
            </Button>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>当前步骤：{stepLabel[currentStep]}</span>
            {currentStep === "importing" && (
              <span className="text-primary">进度 {importProgress}%</span>
            )}
          </div>
        }
        sidebar={
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">导入流程</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { key: "upload", label: "上传文件" },
                  { key: "preview", label: "数据预览" },
                  { key: "importing", label: "执行导入" },
                  { key: "result", label: "导入结果" },
                ].map((step) => (
                  <div key={step.key} className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-muted-foreground",
                        currentStep === step.key && "text-foreground font-medium"
                      )}
                    >
                      {step.label}
                    </span>
                    {currentStep === step.key && (
                      <Badge variant="secondary" className="text-xs">当前</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">导入说明</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>请按照模板格式填写数据。</p>
                <p>门店、供应商、物料列留空表示对全部生效。</p>
                <p>加价方式可填写“固定金额”或“百分比”。</p>
                <p>同名规则将被更新。</p>
              </CardContent>
            </Card>
          </>
        }
      >
        {currentStep === "upload" && (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium">点击或拖拽文件到此区域上传</p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 .xlsx、.xls 格式的Excel文件
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>导入说明</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>请按照模板格式填写数据</li>
                    <li>门店、供应商、物料列留空表示对全部生效</li>
                    <li>加价方式可填写"固定金额"或"百分比"</li>
                    <li>同名规则将被更新</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {currentStep === "preview" && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Alert variant={errorCount > 0 ? "warning" : "success"}>
                <AlertDescription className="flex items-center gap-2">
                  <span>数据校验结果：</span>
                  <Badge variant="success">有效 {validCount}</Badge>
                  <Badge variant="warning">警告 {warningCount}</Badge>
                  <Badge variant="error">错误 {errorCount}</Badge>
                </AlertDescription>
              </Alert>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">行号</TableHead>
                      <TableHead>规则名称</TableHead>
                      <TableHead>门店</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>物料</TableHead>
                      <TableHead>加价方式</TableHead>
                      <TableHead>加价值</TableHead>
                      <TableHead>校验结果</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.rowNum}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {item.storeName || (
                            <Badge variant="secondary">全部</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.supplierName || (
                            <Badge variant="secondary">全部</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.materialName || (
                            <Badge variant="secondary">全部</Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.markupType}</TableCell>
                        <TableCell>{item.markupValue}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.status === "valid" && (
                              <Badge
                                variant="success"
                                className="flex items-center gap-1 w-fit"
                              >
                                <CheckCircle className="h-3 w-3" />
                                有效
                              </Badge>
                            )}
                            {item.status === "warning" && (
                              <>
                                <Badge
                                  variant="warning"
                                  className="flex items-center gap-1 w-fit"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  警告
                                </Badge>
                                <p className="text-xs text-[hsl(var(--warning))]">
                                  {item.errorMsg}
                                </p>
                              </>
                            )}
                            {item.status === "error" && (
                              <>
                                <Badge
                                  variant="error"
                                  className="flex items-center gap-1 w-fit"
                                >
                                  <XCircle className="h-3 w-3" />
                                  错误
                                </Badge>
                                <p className="text-xs text-[hsl(var(--error))]">
                                  {item.errorMsg}
                                </p>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  重新上传
                </Button>
                <Button
                  onClick={handleConfirmImport}
                  disabled={validCount + warningCount === 0}
                >
                  确认导入 ({validCount + warningCount} 条)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "importing" && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-32 h-32 relative mb-6">
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-center mt-2 text-2xl font-semibold">
                    {importProgress}%
                  </p>
                </div>
                <p className="text-muted-foreground">正在导入数据，请稍候...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "result" && importResult && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                    importResult.failed > 0
                      ? "bg-[hsl(var(--warning))]/10"
                      : "bg-[hsl(var(--success))]/10"
                  )}
                >
                  {importResult.failed > 0 ? (
                    <AlertCircle className="h-8 w-8 text-[hsl(var(--warning))]" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-[hsl(var(--success))]" />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">导入完成</h2>
                <div className="space-y-1 text-center mb-6">
                  <p className="text-muted-foreground">
                    共处理 {importResult.total} 条数据
                  </p>
                  <p className="text-[hsl(var(--success))]">
                    成功导入 {importResult.success} 条
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-[hsl(var(--error))]">
                      失败 {importResult.failed} 条
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    继续导入
                  </Button>
                  <Button onClick={() => router.push("/admin/markup/rules")}>
                    查看规则列表
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </WorkbenchShell>
    </AdminLayout>
  );
}
