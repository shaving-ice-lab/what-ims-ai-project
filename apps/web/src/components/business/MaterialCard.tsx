"use client";

/**
 * MaterialCard - 物料卡片组件
 * 图片展示、名称/规格/价格、加入购物车交互
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export interface MaterialCardData {
  /** 物料ID */
  id: number;
  /** 物料名称 */
  name: string;
  /** 物料编号 */
  materialNo?: string;
  /** 品牌 */
  brand?: string;
  /** 规格 */
  spec?: string;
  /** 单位 */
  unit?: string;
  /** 图片URL */
  imageUrl?: string;
  /** 价格 */
  price: number;
  /** 原价（用于显示划线价） */
  originalPrice?: number;
  /** 加价金额 */
  markupAmount?: number;
  /** 起订量 */
  minQuantity?: number;
  /** 步进数量 */
  stepQuantity?: number;
  /** 库存状态 */
  stockStatus?: "in_stock" | "out_of_stock";
  /** 供应商名称 */
  supplierName?: string;
  /** 供应商ID */
  supplierId?: number;
  /** 分类名称 */
  categoryName?: string;
  /** 是否推荐 */
  isRecommended?: boolean;
}

export interface MaterialCardProps {
  /** 物料数据 */
  material: MaterialCardData;
  /** 是否显示加价标识 */
  showMarkup?: boolean;
  /** 是否显示供应商信息 */
  showSupplier?: boolean;
  /** 是否显示加入购物车按钮 */
  showAddToCart?: boolean;
  /** 加入购物车回调 */
  onAddToCart?: (material: MaterialCardData, quantity: number) => void;
  /** 点击卡片回调 */
  onClick?: (material: MaterialCardData) => void;
  /** 卡片宽度 */
  width?: number | string;
  /** 是否加载中 */
  loading?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  showMarkup = false,
  showSupplier = false,
  showAddToCart = true,
  onAddToCart,
  onClick,
  width = 240,
  loading = false,
}) => {
  const [quantity, setQuantity] = React.useState(material.minQuantity || 1);
  const [adding, setAdding] = React.useState(false);

  const isOutOfStock = material.stockStatus === "out_of_stock";
  const hasDiscount =
    material.originalPrice && material.originalPrice > material.price;

  const formatMoney = (amount: number): string => {
    return `¥${amount.toFixed(2)}`;
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const step = material.stepQuantity || 1;
    const min = material.minQuantity || 1;
    const adjustedValue = Math.max(min, Math.ceil(numValue / step) * step);
    setQuantity(adjustedValue);
  };

  const handleIncrease = () => {
    const step = material.stepQuantity || 1;
    setQuantity((prev) => prev + step);
  };

  const handleDecrease = () => {
    const step = material.stepQuantity || 1;
    const min = material.minQuantity || 1;
    setQuantity((prev) => Math.max(min, prev - step));
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      showToast.warning("该商品暂时缺货");
      return;
    }

    setAdding(true);
    try {
      await onAddToCart?.(material, quantity);
      showToast.success("已加入购物车");
    } catch {
      showToast.error("加入购物车失败");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden" style={{ width }}>
        <Skeleton className="h-[180px] w-full" />
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-7 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 group",
        onClick && "cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      )}
      style={{ width }}
      onClick={() => onClick?.(material)}
    >
      {/* Image */}
      <div className="relative h-[180px] bg-muted overflow-hidden">
        <Image
          src={material.imageUrl || "/placeholder-image.png"}
          alt={material.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="error" className="text-sm px-4 py-1.5">
              暂时缺货
            </Badge>
          </div>
        )}
        {material.isRecommended && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 border-0">
            推荐
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Name */}
        <p className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">{material.name}</p>

        {/* Brand/Spec */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {material.brand && (
            <Badge variant="secondary" className="text-xs">{material.brand}</Badge>
          )}
          {material.spec && <Badge variant="outline" className="text-xs">{material.spec}</Badge>}
        </div>

        {/* Supplier */}
        {showSupplier && material.supplierName && (
          <p className="text-xs text-muted-foreground mb-2">
            供应商：{material.supplierName}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {formatMoney(material.price)}
          </span>
          {material.unit && (
            <span className="text-xs text-muted-foreground">
              /{material.unit}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatMoney(material.originalPrice!)}
            </span>
          )}
        </div>

        {showMarkup &&
          material.markupAmount !== undefined &&
          material.markupAmount > 0 && (
            <Badge variant="warning" className="mb-2 text-xs">
              +{formatMoney(material.markupAmount)}
            </Badge>
          )}

        {/* Min quantity hint */}
        {material.minQuantity && material.minQuantity > 1 && (
          <p className="text-xs text-muted-foreground">
            起订量：{material.minQuantity}
            {material.unit}
          </p>
        )}

        {/* Add to cart */}
        {showAddToCart && (
          <div
            className="mt-4 pt-4 border-t border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quantity selector */}
            <div className="flex items-center gap-1.5 mb-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={handleDecrease}
                disabled={quantity <= (material.minQuantity || 1)}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Input
                type="number"
                min={material.minQuantity || 1}
                step={material.stepQuantity || 1}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="h-8 w-14 text-center text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={handleIncrease}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button
              className="w-full rounded-lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {adding ? "添加中..." : "加入购物车"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
