"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface LineChartProps {
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
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function LineChart({
  data,
  xKey,
  yKeys,
  title,
  loading = false,
  height = 300,
  className,
  showGrid = true,
  showLegend = true,
  formatXAxis,
  formatYAxis,
  formatTooltip,
}: LineChartProps) {
  if (loading) {
    return (
      <Card className={cn(className)}>
        {title && (
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
        )}
        <CardContent>
          <div className="relative" style={{ height }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-full h-3/4 animate-pulse" 
                viewBox="0 0 400 200" 
                fill="none"
              >
                <path
                  d="M 0 150 Q 50 120 100 140 T 200 100 T 300 130 T 400 80"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatXAxis}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
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
          <Line
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.name}
            stroke={yKey.color || defaultColors[index % defaultColors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
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
