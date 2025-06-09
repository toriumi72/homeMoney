'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Plus,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  MoreHorizontal,
  Receipt,
  Coffee,
  Car,
  ShoppingCart,
  Gamepad2,
  Utensils,
  ChevronDown,
  Check
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// デモデータを使用
import { 
  getCurrentMonthData, 
  formatCurrency, 
  getMonthName, 
  periodOptions, 
  getPeriodData, 
  calculatePeriodComparison,
  generateId,
  type PeriodType 
} from '@/lib/utils'
import { demoExpenseRecords, demoIncomeRecords, demoCategories } from '@/data/demo-data'
import { ChartFinancialInteractive } from '@/components/chart-financial-interactive'

export default function DashboardPage() {
  // 期間選択状態
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('current_month')
  
  // クイック登録用状態
  const [quickAmount, setQuickAmount] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  


  // 期間データ計算
  const periodData = useMemo(() => {
    return calculatePeriodComparison(
      selectedPeriod, 
      demoExpenseRecords, 
      demoIncomeRecords
    )
  }, [selectedPeriod])

  const currentDate = new Date()
  const currentMonth = getMonthName(currentDate.getMonth())

  // 現在期間のサマリー計算
  const totalIncome = periodData.current.totals.income
  const totalExpenses = periodData.current.totals.expenses
  const balance = periodData.current.totals.balance
  const balancePercentage = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0

  // 予算計算（カテゴリごと）
  const budgetData = demoCategories
    .filter(cat => cat.monthly_budget && cat.monthly_budget > 0)
    .map(category => {
      const spent = periodData.current.expenses
        .filter((exp: any) => exp.category_id === category.id)
        .reduce((sum: number, exp: any) => sum + exp.amount, 0)
      const percentage = (spent / category.monthly_budget!) * 100
      return {
        ...category,
        spent,
        percentage,
        remaining: category.monthly_budget! - spent
      }
    })

  // カテゴリ別支出ランキング
  const categoryRanking = demoCategories
    .map(category => {
      const spent = periodData.current.expenses
        .filter((exp: any) => exp.category_id === category.id)
        .reduce((sum: number, exp: any) => sum + exp.amount, 0)
      return { ...category, spent }
    })
    .filter(cat => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  // 最近の取引（直近10件）
  const recentTransactions = [
    ...periodData.current.expenses.map((exp: any) => ({
      ...exp,
      type: 'expense' as const,
      category: demoCategories.find(cat => cat.id === exp.category_id)
    })),
    ...periodData.current.income.map((inc: any) => ({
      ...inc,
      type: 'income' as const,
      category_id: 'income',
      category: { name: inc.source, icon: 'Wallet', color: 'green' }
    }))
  ]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 8)

  // クイック登録用のよく使うカテゴリ
  const quickCategories = categoryRanking.slice(0, 3)

  // アイコンマッピング関数
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Coffee,
      Car,
      ShoppingCart,
      Gamepad2,
      Utensils,
      Receipt,
      Wallet
    }
    return iconMap[iconName] || Utensils
  }

  // クイック登録処理
  const handleQuickRegister = async (categoryId: string) => {
    if (!quickAmount || parseFloat(quickAmount) <= 0) {
      toast.error("有効な金額を入力してください")
      return
    }

    setLoading(true)
    
    try {
      // デモ実装：実際のアプリではここでAPIを呼び出します
      const amount = parseFloat(quickAmount)
      const category = demoCategories.find(cat => cat.id === categoryId)
      
      // 成功の場合
      await new Promise(resolve => setTimeout(resolve, 300)) // デモ用遅延
      
      toast.success(`支出を登録しました: ${category?.name} - ${formatCurrency(amount)}`)
      
      // フォームリセット
      setQuickAmount('')
      setSelectedCategoryId(null)
      
    } catch (error) {
      toast.error("支出の登録に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  // 金額のフォーマット処理
  const handleAmountChange = (value: string) => {
    // 数字のみ許可（カンマと円を除去）
    const numericValue = value.replace(/[^\d]/g, '')
    setQuickAmount(numericValue)
  }

  // 表示用の金額フォーマット
  const getDisplayAmount = () => {
    if (!quickAmount) return ''
    return parseInt(quickAmount).toLocaleString() + '円'
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          
          {/* ヘッダー */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
                <p className="text-sm text-gray-600">{periodData.current.period.label}の家計状況</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Select 
                  value={selectedPeriod} 
                  onValueChange={(value) => setSelectedPeriod(value as PeriodType)}
                >
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 月次サマリーカード */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* 今月の収入 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の収入</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                  </div>
                  <p className="text-xs text-gray-600">
                    前期比 {periodData.comparison.incomeChange >= 0 ? '+' : ''}{Math.abs(periodData.comparison.incomeChange) > 999 ? '999+' : periodData.comparison.incomeChange.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              {/* 今月の支出 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の支出</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpenses)}
                  </div>
                  <p className="text-xs text-gray-600">
                    前期比 {periodData.comparison.expensesChange >= 0 ? '+' : ''}{Math.abs(periodData.comparison.expensesChange) > 999 ? '999+' : periodData.comparison.expensesChange.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              {/* 収支 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今月の収支</CardTitle>
                  <Wallet className={`h-4 w-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                  </div>
                  <p className="text-xs text-gray-600">
                    前期比 {periodData.comparison.balanceChange >= 0 ? '+' : ''}{Math.abs(periodData.comparison.balanceChange) > 999 ? '999+' : periodData.comparison.balanceChange.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              {/* 予算達成率 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">予算達成率</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {budgetData.length > 0 ? 
                      Math.round(budgetData.reduce((sum, b) => sum + b.percentage, 0) / budgetData.length) : 0
                    }%
                  </div>
                  <p className="text-xs text-gray-600">
                    平均予算使用率
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* クイック登録 */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  クイック登録
                </CardTitle>
                <CardDescription>
                  よく使うカテゴリで簡単に支出を登録
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input 
                        type="text" 
                        placeholder="金額を入力" 
                        className="text-lg"
                        value={getDisplayAmount()}
                        onChange={(e) => handleAmountChange(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="sm:w-auto w-full"
                      onClick={() => window.location.href = '/expenses/new'}
                    >
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      詳細登録
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickCategories.map((category) => {
                      const IconComponent = getIconComponent(category.icon)
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategoryId === category.id ? "default" : "outline"}
                          className="flex items-center gap-2 p-4 h-auto flex-col sm:flex-row"
                          onClick={() => handleQuickRegister(category.id)}
                          disabled={loading || !quickAmount || parseFloat(quickAmount) <= 0}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm">{category.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                  
                  {quickAmount && parseFloat(quickAmount) > 0 && (
                    <div className="text-center text-sm text-gray-600">
                      {formatCurrency(parseFloat(quickAmount))}を登録します
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 予算アラート */}
          {budgetData.some(b => b.percentage > 80) && (
            <div className="px-4 lg:px-6">
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    予算アラート
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {budgetData
                      .filter(b => b.percentage > 80)
                      .map((budget) => (
                        <div key={budget.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${budget.color}-100`}>
                              <Utensils className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-orange-800">{budget.name}</p>
                              <p className="text-sm text-orange-600">
                                {formatCurrency(budget.spent)} / {formatCurrency(budget.monthly_budget!)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={budget.percentage > 100 ? "destructive" : "secondary"}>
                            {budget.percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 収支推移チャート */}
          <div className="px-4 lg:px-6">
            <ChartFinancialInteractive />
          </div>

          {/* メインエリア（2カラム） */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              
              {/* カテゴリ別支出ランキング */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">支出ランキング</CardTitle>
                  <CardDescription>今月のカテゴリ別支出Top5</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryRanking.map((category, index) => {
                      const percentage = totalExpenses > 0 ? (category.spent / totalExpenses) * 100 : 0
                      return (
                        <div key={category.id} className="flex items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${category.color}-100`}>
                              <Utensils className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-gray-600">
                                {percentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {formatCurrency(category.spent)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 予算進捗 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">予算進捗</CardTitle>
                  <CardDescription>各カテゴリの予算使用状況</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetData.slice(0, 5).map((budget) => (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-${budget.color}-100`}>
                              <Utensils className="h-3 w-3" />
                            </div>
                            <span className="font-medium">{budget.name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.monthly_budget!)}
                          </div>
                        </div>
                        <Progress 
                          value={Math.min(budget.percentage, 100)} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{budget.percentage.toFixed(0)}% 使用</span>
                          <span className={budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                            残り {formatCurrency(Math.abs(budget.remaining))}
                            {budget.remaining < 0 ? ' オーバー' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 最近の取引 */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  最近の取引
                  <Button variant="outline" size="sm">
                    すべて見る
                  </Button>
                </CardTitle>
                <CardDescription>直近の収支記録</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <div key={`${transaction.type}-${transaction.id}`} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {transaction.category?.name || '未分類'}
                          </p>
                          <p className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <p>{transaction.memo || 'メモなし'}</p>
                          <p>{new Date(transaction.transaction_date).toLocaleDateString('ja-JP')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
