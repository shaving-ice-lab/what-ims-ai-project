"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    Bar,
    CartesianGrid,
    Legend,
    BarChart as RechartsBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: {
    key: string;
    name: string;
    color?: string;
  }[];
  title?: string;
  loading?: boolean;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: "vertical" | "horizontal";
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
  barSize?: number;
  stacked?: boolean;
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function BarChart({
  data,
  xKey,
  yKeys,
  title,
  loading = false,
  height = 300,
  className,
  showGrid = true,
  showLegend = true,
  layout = "horizontal",
  formatXAxis,
  formatYAxis,
  formatTooltip,
  barSize,
  stacked = false,
}: BarChartProps) {
  if (loading) {
    return (
      <Card className={cn(className)}>
        {title && (
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-end gap-2 justify-center" style={{ height }}>
            {[60, 80, 45, 90, 55, 75, 40].map((h, i) => (
              <Skeleton 
                key={i} 
                className="w-8 rounded-t-md animate-pulse" 
                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={layout === "vertical"}
            horizontal={layout === "horizontal"}
          />
        )}
        <XAxis
          dataKey={layout === "horizontal" ? xKey : undefined}
          type={layout === "horizontal" ? "category" : "number"}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={layout === "horizontal" ? formatXAxis : formatYAxis}
        />
        <YAxis
          dataKey={layout === "vertical" ? xKey : undefined}
          type={layout === "vertical" ? "category" : "number"}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={layout === "vertical" ? formatXAxis : formatYAxis}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          cursor={{ fill: "hsl(var(--muted))" }}
          formatter={(value) =>
            value !== undefined && formatTooltip ? formatTooltip(value as number) : value
          }
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) => (
              <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
            )}
          />
        )}
        {yKeys.map((yKey, index) => (
          <Bar
            key={yKey.key}
            dataKey={yKey.key}
            name={yKey.name}
            fill={yKey.color || defaultColors[index % defaultColors.length]}
            radius={[4, 4, 0, 0]}
            barSize={barSize}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  if (title) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}
