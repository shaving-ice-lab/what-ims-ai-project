"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * ErrorFallback - 错误降级UI组件
 * 在发生错误时显示用户友好的错误页面
 */
export default function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-10">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">页面出错了</h2>
            <p className="text-muted-foreground mb-4">
              {process.env.NODE_ENV === "development"
                ? error?.message || "发生了未知错误"
                : "抱歉，页面遇到了一些问题，请刷新重试"}
            </p>
            {process.env.NODE_ENV === "development" && error?.stack && (
              <div className="w-full mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-h-[200px]">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重新加载
          </Button>
          <Button variant="outline" onClick={handleGoHome}>
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
