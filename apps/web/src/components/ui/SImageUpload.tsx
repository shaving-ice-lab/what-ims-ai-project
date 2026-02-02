"use client";

/**
 * SImageUpload - 图片上传组件
 * 基于 shadcn/ui 封装
 * 支持多图上传、预览
 */

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Eye, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export interface ImageFile {
  uid: string;
  name: string;
  status?: "uploading" | "done" | "error";
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
}

export interface SImageUploadProps {
  /** 最大文件数量 */
  maxCount?: number;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 允许的图片格式 */
  acceptFormats?: string[];
  /** 文件列表 */
  value?: ImageFile[];
  /** 文件变化回调 */
  onChange?: (fileList: ImageFile[]) => void;
  /** 上传函数 */
  customUpload?: (file: File) => Promise<string>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外类名 */
  className?: string;
}

const SImageUpload: React.FC<SImageUploadProps> = ({
  maxCount = 5,
  maxSize = 5,
  acceptFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  value = [],
  onChange,
  customUpload,
  disabled = false,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const validateFile = (file: File): boolean => {
    const isValidFormat = acceptFormats.includes(file.type);
    if (!isValidFormat) {
      showToast.error(`只支持 ${acceptFormats.join(", ")} 格式的图片`);
      return false;
    }

    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      showToast.error(`图片大小不能超过 ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentCount = value.length;
    const remainingSlots = maxCount - currentCount;

    if (remainingSlots <= 0) {
      showToast.error(`最多只能上传 ${maxCount} 张图片`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newFiles: ImageFile[] = [];

    for (const file of filesToUpload) {
      if (!validateFile(file)) continue;

      const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const thumbUrl = await getBase64(file);
      const imageFile: ImageFile = {
        uid,
        name: file.name,
        status: "uploading",
        thumbUrl,
        originFileObj: file,
      };

      newFiles.push(imageFile);

      if (customUpload) {
        try {
          const url = await customUpload(file);
          imageFile.status = "done";
          imageFile.url = url;
        } catch {
          imageFile.status = "error";
        }
      } else {
        imageFile.status = "done";
        imageFile.url = thumbUrl;
      }
    }

    onChange?.([...value, ...newFiles]);
  };

  const handlePreview = (file: ImageFile) => {
    setPreviewImage(file.url || file.thumbUrl || "");
    setPreviewTitle(file.name);
    setPreviewOpen(true);
  };

  const handleRemove = (uid: string) => {
    onChange?.(value.filter((f) => f.uid !== uid));
  };

  const handleClick = () => {
    if (!disabled && value.length < maxCount) {
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={cn("flex flex-wrap gap-2", className)}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={maxCount > 1}
          accept={acceptFormats.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
        />

        {/* Image list */}
        {value.map((file) => (
          <div
            key={file.uid}
            className="relative w-24 h-24 rounded-lg border overflow-hidden group"
          >
            {file.thumbUrl || file.url ? (
              <Image
                src={file.thumbUrl || file.url || ""}
                alt={file.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                onClick={() => handlePreview(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                onClick={() => handleRemove(file.uid)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Status */}
            {file.status === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {file.status === "error" && (
              <div className="absolute bottom-0 left-0 right-0 bg-destructive text-destructive-foreground text-xs text-center py-1">
                上传失败
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
        {value.length < maxCount && (
          <div
            className={cn(
              "w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:border-primary/50"
            )}
            onClick={handleClick}
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">上传</span>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="relative w-full h-[400px]">
              <Image
                src={previewImage}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SImageUpload;
