"use client";

import { BarChart } from "@/components/business/charts";
import { StatCard, StatGrid } from "@/components/business/stat-card";
import { AdminLayout } from "@/components/layouts/app-layout";
import { WorkbenchShell } from "@/components/layouts/workbench-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface RankChangeItem {
  rank: number;
  name: string;
  amount: number;
  change: number;
}

export default function AnalysisPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const comparisonData = [
    { name: "1月", 本期: 125000, 上期: 110000 },
    { name: "2月", 本期: 138000, 上期: 125000 },
    { name: "3月", 本期: 145000, 上期: 138000 },
    { name: "4月", 本期: 152000, 上期: 145000 },
  ];

  const storeRankData: RankChangeItem[] = [
    { rank: 1, name: "门店A - 朝阳店", amount: 45680, change: 0 },
    { rank: 2, name: "门店C - 西城店", amount: 38500, change: 1 },
    { rank: 3, name: "门店B - 海淀店", amount: 28900, change: -1 },
    { rank: 4, name: "门店D - 东城店", amount: 21300, change: 2 },
    { rank: 5, name: "门店E - 丰台店", amount: 15600, change: -1 },
  ];

  const supplierRankData: RankChangeItem[] = [
    { rank: 1, name: "生鲜供应商A", amount: 68900, change: 0 },
    { rank: 2, name: "粮油供应商B", amount: 45600, change: 1 },
    { rank: 3, name: "调味品供应商C", amount: 23400, change: -1 },
    { rank: 4, name: "冷冻食品供应商D", amount: 19800, change: 0 },
    { rank: 5, name: "饮料供应商E", amount: 12300, change: 2 },
  ];

  const statsData = {
    currentPeriod: 560000,
    lastPeriod: 518000,
    yoyGrowth: 8.1,
    momGrowth: 5.2,
  };

  const RankChangeCell = ({ change }: { change: number }) => {
    if (change === 0) return <Badge variant="secondary">-</Badge>;
    if (change > 0) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> 上升{change}位
        </Badge>
      );
    }
    return (
      <Badge variant="error" className="flex items-center gap-1">
        <TrendingDown className="h-3 w-3" /> 下降{Math.abs(change)}位
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <WorkbenchShell
        badge="对比分析"
        title="对比分析"
        description="查看同比、环比数据分析和排名变化"
        toolbar={
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>选择时间范围</span>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
        }
        sidebar={
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">增长概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">本期销售额</span>
                <span className="font-semibold">¥{statsData.currentPeriod.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">上期销售额</span>
                <span className="font-semibold">¥{statsData.lastPeriod.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">同比增长</span>
                <span className="font-semibold text-[hsl(var(--success))]">
                  {statsData.yoyGrowth}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">环比增长</span>
                <span className="font-semibold text-[hsl(var(--success))]">
                  {statsData.momGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
        }
        results={
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">门店订货排名变化</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">排名</TableHead>
                      <TableHead>名称</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                      <TableHead className="w-32">排名变化</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeRankData.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell className="font-medium">{item.rank}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          ¥{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <RankChangeCell change={item.change} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">供应商销售排名变化</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">排名</TableHead>
                      <TableHead>名称</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                      <TableHead className="w-32">排名变化</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierRankData.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell className="font-medium">{item.rank}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          ¥{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <RankChangeCell change={item.change} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        }
      >
        <StatGrid columns={4}>
          <StatCard
            title="本期销售额"
            value={`¥${statsData.currentPeriod.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="上期销售额"
            value={`¥${statsData.lastPeriod.toLocaleString()}`}
            icon={Calendar}
          />
          <StatCard
            title="同比增长"
            value={`${statsData.yoyGrowth}%`}
            icon={TrendingUp}
            valueClassName="text-[hsl(var(--success))]"
          />
          <StatCard
            title="环比增长"
            value={`${statsData.momGrowth}%`}
            icon={TrendingUp}
            valueClassName="text-[hsl(var(--success))]"
          />
        </StatGrid>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">同比/环比分析</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={comparisonData}
              xKey="name"
              yKeys={[
                { key: "本期", name: "本期", color: "hsl(var(--chart-1))" },
                { key: "上期", name: "上期", color: "hsl(var(--chart-2))" },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </WorkbenchShell>
    </AdminLayout>
  );
}
