"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import * as React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  loading?: boolean;
  className?: string;
  valueClassName?: string;
  style?: React.CSSProperties;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  className,
  valueClassName,
  style,
}: StatCardProps) {
  const TrendIcon = React.useMemo(() => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  }, [trend]);

  const trendColor = React.useMemo(() => {
    if (!trend) return "";
    if (trend.value > 0) return "text-emerald-500";
    if (trend.value < 0) return "text-red-500";
    return "text-muted-foreground";
  }, [trend]);

  const trendBgColor = React.useMemo(() => {
    if (!trend) return "";
    if (trend.value > 0) return "bg-emerald-500/10";
    if (trend.value < 0) return "bg-red-500/10";
    return "bg-muted";
  }, [trend]);

  if (loading) {
    return (
      <Card className={cn("relative overflow-hidden", className)} style={style}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden group transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        className
      )}
      style={style}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-bold tracking-tight transition-transform group-hover:translate-x-0.5",
            valueClassName
          )}
        >
          {value}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {trend && TrendIcon && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              trendColor,
              trendBgColor
            )}>
              <TrendIcon className="h-3 w-3" />
              <span>
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-muted-foreground ml-0.5">{trend.label}</span>
              )}
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
      {/* Decorative gradient - enhanced */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-50 transition-opacity" />
    </Card>
  );
}

// Grid wrapper for multiple stat cards
interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function StatGrid({ children, columns = 4, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className
      )}
    >
      {children}
    </div>
  );
}
