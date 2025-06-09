"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { 
  generateDailyChartData, 
  generateMonthlyChartData, 
  generateYearlyChartData,
  formatCurrency 
} from "@/lib/utils"

const chartConfig = {
  income: {
    label: "収入",
    color: "#22c55e", // green-500
  },
  expense: {
    label: "支出", 
    color: "#ef4444", // red-500
  },
  net: {
    label: "収支",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig

type TimeRange = 'daily' | 'monthly' | 'yearly'
type DataPeriod = '7d' | '30d' | '3m' | '6m' | '1y' | '3y'

export function ChartFinancialInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<TimeRange>("monthly")
  const [dataPeriod, setDataPeriod] = React.useState<DataPeriod>("6m")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("daily")
      setDataPeriod("30d")
    }
  }, [isMobile])

  // データ期間に応じてデータを生成
  const chartData = React.useMemo(() => {
    switch (timeRange) {
      case 'daily':
        const days = dataPeriod === '7d' ? 7 : dataPeriod === '30d' ? 30 : 30
        return generateDailyChartData(days)
      case 'monthly':
        const months = dataPeriod === '3m' ? 3 : dataPeriod === '6m' ? 6 : dataPeriod === '1y' ? 12 : 6
        return generateMonthlyChartData(months)
      case 'yearly':
        const years = dataPeriod === '3y' ? 3 : 3
        return generateYearlyChartData(years)
      default:
        return generateMonthlyChartData(6)
    }
  }, [timeRange, dataPeriod])

  // 期間選択オプション
  const getPeriodOptions = () => {
    switch (timeRange) {
      case 'daily':
        return [
          { value: '7d' as DataPeriod, label: '過去7日' },
          { value: '30d' as DataPeriod, label: '過去30日' },
        ]
      case 'monthly':
        return [
          { value: '3m' as DataPeriod, label: '過去3ヶ月' },
          { value: '6m' as DataPeriod, label: '過去6ヶ月' },
          { value: '1y' as DataPeriod, label: '過去1年' },
        ]
      case 'yearly':
        return [
          { value: '3y' as DataPeriod, label: '過去3年' },
        ]
      default:
        return []
    }
  }

  const periodOptions = getPeriodOptions()
  
  // 期間変更時にデータ期間もリセット
  React.useEffect(() => {
    if (timeRange === 'daily') {
      setDataPeriod(isMobile ? '7d' : '30d')
    } else if (timeRange === 'monthly') {
      setDataPeriod('6m')
    } else if (timeRange === 'yearly') {
      setDataPeriod('3y')
    }
  }, [timeRange, isMobile])

  // 日付フォーマッター
  const formatXAxisLabel = (value: string) => {
    switch (timeRange) {
      case 'daily':
        const date = new Date(value)
        return date.toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric'
        })
      case 'monthly':
        const [year, month] = value.split('-')
        return `${year}年${parseInt(month)}月`
      case 'yearly':
        return `${value}年`
      default:
        return value
    }
  }

  // ツールチップラベルフォーマッター
  const formatTooltipLabel = (value: string) => {
    switch (timeRange) {
      case 'daily':
        const date = new Date(value)
        return date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'monthly':
        const [year, month] = value.split('-')
        return `${year}年${parseInt(month)}月`
      case 'yearly':
        return `${value}年`
      default:
        return value
    }
  }

  // チャートタイトルとサブタイトル
  const getChartInfo = () => {
    switch (timeRange) {
      case 'daily':
        return {
          title: "日別収支グラフ",
          description: "日ごとの収入・支出・収支の推移"
        }
      case 'monthly':
        return {
          title: "月別収支グラフ", 
          description: "月ごとの収入・支出・収支の推移"
        }
      case 'yearly':
        return {
          title: "年別収支グラフ",
          description: "年ごとの収入・支出・収支の推移"
        }
    }
  }

  const chartInfo = getChartInfo()

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 {chartInfo.title}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {chartInfo.description}
          </span>
          <span className="@[540px]/card:hidden">収支推移</span>
        </CardDescription>
        <CardAction>
          {/* 期間タイプ選択 */}
          <div className="flex flex-col gap-2 @[767px]/card:flex-row @[767px]/card:items-center @[767px]/card:gap-4">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => value && setTimeRange(value as TimeRange)}
              variant="outline"
              className="hidden @[767px]/card:flex"
            >
              <ToggleGroupItem value="daily">日別</ToggleGroupItem>
              <ToggleGroupItem value="monthly">月別</ToggleGroupItem>
              <ToggleGroupItem value="yearly">年別</ToggleGroupItem>
            </ToggleGroup>
            
            {/* データ期間選択 */}
            <ToggleGroup
              type="single"
              value={dataPeriod}
              onValueChange={(value) => value && setDataPeriod(value as DataPeriod)}
              variant="outline"
              className="hidden @[767px]/card:flex"
            >
              {periodOptions.map(option => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* モバイル用セレクト */}
          <div className="flex gap-2 @[767px]/card:hidden">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="flex-1" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">日別</SelectItem>
                <SelectItem value="monthly">月別</SelectItem>
                <SelectItem value="yearly">年別</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dataPeriod} onValueChange={(value) => setDataPeriod(value as DataPeriod)}>
              <SelectTrigger className="flex-1" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-net)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-net)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatXAxisLabel}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value).replace('¥', '¥')}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatTooltipLabel(value)}
                  formatter={(value, name) => [
                    formatCurrency(value as number),
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              strokeWidth={2}
            />
            <Area
              dataKey="expense"
              type="monotone"
              fill="url(#fillExpense)"
              stroke="var(--color-expense)"
              strokeWidth={2}
            />
            <Area
              dataKey="net"
              type="monotone"
              fill="url(#fillNet)"
              stroke="var(--color-net)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        
        {/* チャート下部の凡例・統計 */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.income.color }} />
              <span className="text-sm font-medium">収入</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.income, 0))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.expense.color }} />
              <span className="text-sm font-medium">支出</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.expense, 0))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.net.color }} />
              <span className="text-sm font-medium">収支</span>
            </div>
            <div className={`text-sm font-medium ${
              chartData.reduce((sum, item) => sum + item.net, 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(chartData.reduce((sum, item) => sum + item.net, 0))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 