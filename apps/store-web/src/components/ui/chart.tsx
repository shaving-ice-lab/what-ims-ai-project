"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={cn("w-full h-[300px]", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

interface LineChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface SimpleLineChartProps {
  data: LineChartData[];
  dataKey?: string;
  xAxisKey?: string;
  strokeColor?: string;
  showGrid?: boolean;
}

export function SimpleLineChart({
  data,
  dataKey = "value",
  xAxisKey = "name",
  strokeColor = "hsl(var(--primary))",
  showGrid = true,
}: SimpleLineChartProps) {
  return (
    <LineChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
      <XAxis
        dataKey={xAxisKey}
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        className="text-muted-foreground"
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        className="text-muted-foreground"
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
        }}
      />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={strokeColor}
        strokeWidth={2}
        dot={{ fill: strokeColor, strokeWidth: 2 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  );
}

interface PieChartData {
  name: string;
  value: number;
}

interface SimplePieChartProps {
  data: PieChartData[];
  colors?: string[];
  showLabel?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export function SimplePieChart({
  data,
  colors = COLORS,
  showLabel = true,
  innerRadius = 0,
  outerRadius = 80,
}: SimplePieChartProps) {
  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={showLabel}
        label={showLabel ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
        }}
        formatter={(value: number) => [`¥${value.toLocaleString()}`, "金额"]}
      />
      <Legend />
    </PieChart>
  );
}

interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  dataKey?: string;
  xAxisKey?: string;
  fillColor?: string;
  showGrid?: boolean;
}

export function SimpleBarChart({
  data,
  dataKey = "value",
  xAxisKey = "name",
  fillColor = "hsl(var(--primary))",
  showGrid = true,
}: SimpleBarChartProps) {
  return (
    <BarChart data={data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
      <XAxis
        dataKey={xAxisKey}
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
        }}
      />
      <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}

export { COLORS };
