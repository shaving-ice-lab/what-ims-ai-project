"use client";

/**
 * PriceDisplay - 价格显示组件
 * 显示原价/现价、加价金额高亮、划线价
 */

import { cn } from "@/lib/utils";
import Decimal from "decimal.js";
import { TrendingUp } from "lucide-react";
import * as React from "react";

export interface PriceDisplayProps {
  /** 当前价格 */
  price: number | string;
  /** 原价（用于显示划线价） */
  originalPrice?: number | string;
  /** 加价金额 */
  markupAmount?: number | string;
  /** 是否显示加价标识 */
  showMarkupIcon?: boolean;
  /** 价格单位 */
  unit?: string;
  /** 尺寸 */
  size?: "small" | "default" | "large";
  /** 是否显示货币符号 */
  showCurrency?: boolean;
  /** 货币符号 */
  currency?: string;
  /** 额外类名 */
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  markupAmount,
  showMarkupIcon = true,
  unit,
  size = "default",
  showCurrency = true,
  currency = "¥",
  className,
}) => {
  const formatPrice = (value: number | string) => {
    const num = new Decimal(value).toFixed(2);
    return showCurrency ? `${currency}${num}` : num;
  };

  const hasMarkup = markupAmount && new Decimal(markupAmount).greaterThan(0);
  const hasOriginalPrice =
    originalPrice && new Decimal(originalPrice).greaterThan(new Decimal(price));

  const sizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-xl",
  };

  const smallerSizeClasses = {
    small: "text-xs",
    default: "text-sm",
    large: "text-base",
  };

  return (
    <div className={cn("flex items-baseline gap-1 flex-wrap", className)}>
      {/* 当前价格 */}
      <span
        className={cn(
          "font-semibold text-[hsl(var(--error))]",
          sizeClasses[size]
        )}
      >
        {formatPrice(price)}
      </span>

      {/* 单位 */}
      {unit && (
        <span
          className={cn("text-muted-foreground", smallerSizeClasses[size])}
        >
          /{unit}
        </span>
      )}

      {/* 加价标识 */}
      {hasMarkup && showMarkupIcon && (
        <span
          className={cn(
            "text-[hsl(var(--success))] flex items-center gap-0.5",
            smallerSizeClasses[size]
          )}
        >
          <TrendingUp className="h-3 w-3" />
          {formatPrice(markupAmount)}
        </span>
      )}

      {/* 划线价（原价） */}
      {hasOriginalPrice && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            smallerSizeClasses[size]
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
