"use client";

import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Info, Loader2, Save, Upload } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schemas
const lichuSchema = z.object({
  merchant_no: z.string().min(1, "请输入商户号"),
  terminal_id: z.string().min(1, "请输入终端号"),
  access_token: z.string().min(1, "请输入签名令牌"),
  notify_url: z.string().min(1, "请输入回调地址").url("请输入有效的URL"),
});

const wechatSchema = z.object({
  mch_id: z.string().min(1, "请输入商户号"),
  api_key: z.string().min(1, "请输入API密钥"),
});

const alipaySchema = z.object({
  app_id: z.string().min(1, "请输入应用ID"),
  public_key: z.string().min(1, "请输入公钥"),
  private_key: z.string().min(1, "请输入私钥"),
});

type LichuFormValues = z.infer<typeof lichuSchema>;
type WechatFormValues = z.infer<typeof wechatSchema>;
type AlipayFormValues = z.infer<typeof alipaySchema>;

export default function PaymentConfigPage() {
  const [loading, setLoading] = React.useState(false);
  const [testingLichu, setTestingLichu] = React.useState(false);
  const [testingWechat, setTestingWechat] = React.useState(false);
  const [testingAlipay, setTestingAlipay] = React.useState(false);

  const lichuForm = useForm<LichuFormValues>({
    resolver: zodResolver(lichuSchema),
    defaultValues: {
      merchant_no: "",
      terminal_id: "",
      access_token: "",
      notify_url: "https://api.example.com/payment/lichu/notify",
    },
  });

  const wechatForm = useForm<WechatFormValues>({
    resolver: zodResolver(wechatSchema),
    defaultValues: {
      mch_id: "",
      api_key: "",
    },
  });

  const alipayForm = useForm<AlipayFormValues>({
    resolver: zodResolver(alipaySchema),
    defaultValues: {
      app_id: "",
      public_key: "",
      private_key: "",
    },
  });

  const handleSaveLichu = async (values: LichuFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Lichu config:", values);
      showToast.success("利楚扫呗配置保存成功");
    } catch {
      showToast.error("保存失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLichu = async () => {
    setTestingLichu(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast.success("利楚扫呗连接测试成功");
    } catch {
      showToast.error("连接测试失败");
    } finally {
      setTestingLichu(false);
    }
  };

  const handleSaveWechat = async (values: WechatFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Wechat config:", values);
      showToast.success("微信支付配置保存成功");
    } catch {
      showToast.error("保存失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTestWechat = async () => {
    setTestingWechat(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast.success("微信支付连接测试成功");
    } catch {
      showToast.error("连接测试失败");
    } finally {
      setTestingWechat(false);
    }
  };

  const handleSaveAlipay = async (values: AlipayFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Alipay config:", values);
      showToast.success("支付宝配置保存成功");
    } catch {
      showToast.error("保存失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTestAlipay = async () => {
    setTestingAlipay(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast.success("支付宝连接测试成功");
    } catch {
      showToast.error("连接测试失败");
    } finally {
      setTestingAlipay(false);
    }
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="支付配置"
        title="支付配置"
        description="配置支付渠道参数，仅主管理员可访问"
        sidebar={
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>安全提示</AlertTitle>
            <AlertDescription>
              支付配置涉及资金安全，请确保所有密钥和证书妥善保管，不要泄露给他人
            </AlertDescription>
          </Alert>
        }
        results={
          <Card>
            <Tabs defaultValue="lichu">
              <CardHeader className="pb-0">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="lichu">利楚扫呗</TabsTrigger>
                  <TabsTrigger value="wechat">微信支付</TabsTrigger>
                  <TabsTrigger value="alipay">支付宝</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
              {/* Lichu Tab */}
              <TabsContent value="lichu" className="mt-0 space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    利楚扫呗是主要的支付渠道，支持微信和支付宝扫码支付
                  </AlertDescription>
                </Alert>

                <Form {...lichuForm}>
                  <form
                    onSubmit={lichuForm.handleSubmit(handleSaveLichu)}
                    className="space-y-4"
                  >
                    <FormField
                      control={lichuForm.control}
                      name="merchant_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>商户号</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入利楚扫呗商户号" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={lichuForm.control}
                      name="terminal_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>终端号</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入终端号" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={lichuForm.control}
                      name="access_token"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>签名令牌</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="请输入签名令牌（加密存储）"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={lichuForm.control}
                      name="notify_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>支付回调地址</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入支付回调地址" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        保存配置
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestLichu}
                        disabled={testingLichu}
                      >
                        {testingLichu && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <CheckCircle className="mr-2 h-4 w-4" />
                        测试连接
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* WeChat Tab */}
              <TabsContent value="wechat" className="mt-0 space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    微信支付直连模式，需要在微信商户平台申请
                  </AlertDescription>
                </Alert>

                <Form {...wechatForm}>
                  <form
                    onSubmit={wechatForm.handleSubmit(handleSaveWechat)}
                    className="space-y-4"
                  >
                    <FormField
                      control={wechatForm.control}
                      name="mch_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>商户号</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入微信支付商户号" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={wechatForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API密钥</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="请输入API密钥（加密存储）"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>证书文件</FormLabel>
                      <div className="mt-2">
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          上传证书文件
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          支持 .p12, .pem 格式
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        保存配置
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestWechat}
                        disabled={testingWechat}
                      >
                        {testingWechat && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <CheckCircle className="mr-2 h-4 w-4" />
                        测试连接
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* Alipay Tab */}
              <TabsContent value="alipay" className="mt-0 space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    支付宝当面付，需要在支付宝开放平台申请应用
                  </AlertDescription>
                </Alert>

                <Form {...alipayForm}>
                  <form
                    onSubmit={alipayForm.handleSubmit(handleSaveAlipay)}
                    className="space-y-4"
                  >
                    <FormField
                      control={alipayForm.control}
                      name="app_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>应用ID</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入支付宝应用ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={alipayForm.control}
                      name="public_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>支付宝公钥</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="请输入支付宝公钥"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={alipayForm.control}
                      name="private_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>应用私钥</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="请输入应用私钥（加密存储）"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        保存配置
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestAlipay}
                        disabled={testingAlipay}
                      >
                        {testingAlipay && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <CheckCircle className="mr-2 h-4 w-4" />
                        测试连接
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        }
      />
    </AdminLayout>
  );
}
