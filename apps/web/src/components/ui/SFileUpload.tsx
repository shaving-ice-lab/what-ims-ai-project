"use client";

/**
 * SFileUpload - 文件上传组件
 * 基于 shadcn/ui 封装
 * 支持拖拽上传、文件类型限制、大小限制
 */

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { File, Inbox, Loader2, Upload, X } from "lucide-react";
import * as React from "react";

export interface UploadFile {
  uid: string;
  name: string;
  size?: number;
  type?: string;
  status?: "uploading" | "done" | "error";
  percent?: number;
  url?: string;
  originFileObj?: File;
}

export interface SFileUploadProps {
  /** 是否启用拖拽上传 */
  dragger?: boolean;
  /** 最大文件数量 */
  maxCount?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 允许的文件类型 */
  acceptTypes?: string[];
  /** 文件列表 */
  value?: UploadFile[];
  /** 文件变化回调 */
  onChange?: (fileList: UploadFile[]) => void;
  /** 上传函数 */
  customUpload?: (file: File) => Promise<string>;
  /** 按钮文字 */
  buttonText?: string;
  /** 拖拽区域提示文字 */
  draggerText?: string;
  /** 拖拽区域提示说明 */
  draggerHint?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外类名 */
  className?: string;
}

const SFileUpload: React.FC<SFileUploadProps> = ({
  dragger = false,
  maxCount = 10,
  maxSize = 10,
  acceptTypes,
  value = [],
  onChange,
  customUpload,
  buttonText = "点击上传",
  draggerText = "点击或将文件拖拽到此区域上传",
  draggerHint = "支持单个或批量上传",
  disabled = false,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const validateFile = (file: File): boolean => {
    if (acceptTypes && acceptTypes.length > 0) {
      const isValidType = acceptTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
      });
      if (!isValidType) {
        showToast.error(`只支持 ${acceptTypes.join(", ")} 格式的文件`);
        return false;
      }
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      showToast.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentCount = value.length;
    const remainingSlots = maxCount - currentCount;

    if (remainingSlots <= 0) {
      showToast.error(`最多只能上传 ${maxCount} 个文件`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newFiles: UploadFile[] = [];

    for (const file of filesToUpload) {
      if (!validateFile(file)) continue;

      const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const uploadFile: UploadFile = {
        uid,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        percent: 0,
        originFileObj: file,
      };

      newFiles.push(uploadFile);

      if (customUpload) {
        try {
          const url = await customUpload(file);
          uploadFile.status = "done";
          uploadFile.url = url;
        } catch {
          uploadFile.status = "error";
        }
      } else {
        // If no customUpload, just mark as done
        uploadFile.status = "done";
      }
    }

    onChange?.([...value, ...newFiles]);
  };

  const handleRemove = (uid: string) => {
    onChange?.(value.filter((f) => f.uid !== uid));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={maxCount > 1}
        accept={acceptTypes?.join(",")}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {dragger ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-50",
            !isDragging && !disabled && "hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-sm font-medium">{draggerText}</p>
          <p className="text-xs text-muted-foreground mt-1">{draggerHint}</p>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={disabled || value.length >= maxCount}
        >
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}

      {/* File list */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.uid}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
            >
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-sm truncate">{file.name}</span>
              {file.status === "uploading" && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {file.status === "error" && (
                <span className="text-xs text-destructive">上传失败</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemove(file.uid)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SFileUpload;
