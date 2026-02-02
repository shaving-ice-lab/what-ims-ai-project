"use client";

/**
 * ConfirmAction - 敏感操作二次确认组件
 * 支持删除、批量操作确认和密码验证
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import * as React from "react";

export interface ConfirmActionProps {
  /** 是否显示对话框 */
  open: boolean;
  /** 确认类型 */
  type?: "confirm" | "password";
  /** 标题 */
  title?: string;
  /** 确认内容 */
  content?: React.ReactNode;
  /** 操作类型标签 */
  actionLabel?: string;
  /** 危险级别 */
  danger?: boolean;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 确认回调 */
  onConfirm: (password?: string) => void | Promise<void>;
  /** 取消回调 */
  onCancel: () => void;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  type = "confirm",
  title,
  content,
  actionLabel = "此操作",
  danger = true,
  okText = "确认",
  cancelText = "取消",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = React.useState("");
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (type === "password" && !password.trim()) {
      showToast.error("请输入密码");
      return;
    }

    setConfirmLoading(true);
    try {
      await onConfirm(type === "password" ? password : undefined);
      setPassword("");
    } catch {
      // Error handling should be done in onConfirm
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    onCancel();
  };

  const defaultTitle = type === "password" ? "安全验证" : "确认操作";

  // Password confirmation dialog
  if (type === "password") {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle
                className={cn(
                  "h-5 w-5",
                  danger ? "text-[hsl(var(--error))]" : "text-[hsl(var(--warning))]"
                )}
              />
              {title || defaultTitle}
            </DialogTitle>
            <DialogDescription>
              {content || (
                <>
                  请输入您的登录密码以确认{actionLabel}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button
              variant={danger ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={loading || confirmLoading}
            >
              {(loading || confirmLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {okText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Simple confirmation dialog
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle
              className={cn(
                "h-5 w-5",
                danger ? "text-[hsl(var(--error))]" : "text-[hsl(var(--warning))]"
              )}
            />
            {title || defaultTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {content || (
              <>
                确定要执行{actionLabel}吗？
                {danger && (
                  <span className="text-[hsl(var(--error))]"> 此操作不可撤销。</span>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={danger ? "bg-destructive hover:bg-destructive/90" : ""}
            disabled={loading || confirmLoading}
          >
            {(loading || confirmLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {okText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAction;

/**
 * useConfirmAction - 敏感操作确认Hook
 */
export interface UseConfirmActionOptions {
  type?: "confirm" | "password";
  title?: string;
  content?: React.ReactNode;
  actionLabel?: string;
  danger?: boolean;
  okText?: string;
  cancelText?: string;
}

export interface UseConfirmActionReturn {
  open: boolean;
  showConfirm: (options?: UseConfirmActionOptions) => Promise<string | boolean>;
  hideConfirm: () => void;
  ConfirmModal: React.FC;
}

export function useConfirmAction(
  defaultOptions: UseConfirmActionOptions = {}
): UseConfirmActionReturn {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<UseConfirmActionOptions>(defaultOptions);
  const [resolveRef, setResolveRef] = React.useState<{
    resolve: (value: string | boolean) => void;
  } | null>(null);

  const showConfirm = (
    overrideOptions?: UseConfirmActionOptions
  ): Promise<string | boolean> => {
    return new Promise((resolve) => {
      setOptions({ ...defaultOptions, ...overrideOptions });
      setResolveRef({ resolve });
      setOpen(true);
    });
  };

  const hideConfirm = () => {
    setOpen(false);
    if (resolveRef) {
      resolveRef.resolve(false);
      setResolveRef(null);
    }
  };

  const handleConfirm = (password?: string) => {
    setOpen(false);
    if (resolveRef) {
      resolveRef.resolve(options.type === "password" ? password || "" : true);
      setResolveRef(null);
    }
  };

  const handleCancel = () => {
    hideConfirm();
  };

  const ConfirmModal: React.FC = () => (
    <ConfirmAction
      open={open}
      type={options.type}
      title={options.title}
      content={options.content}
      actionLabel={options.actionLabel}
      danger={options.danger}
      okText={options.okText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return {
    open,
    showConfirm,
    hideConfirm,
    ConfirmModal,
  };
}
