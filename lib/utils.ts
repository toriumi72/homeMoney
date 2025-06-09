import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { demoExpenseRecords, demoIncomeRecords } from '@/data/demo-data'
import type { ExpenseRecord, IncomeRecord } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ID生成用ユーティリティ
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 日付フォーマット用ユーティリティ
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 金額フォーマット用ユーティリティ
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

// 月の表示名取得（月番号から）
export function getMonthName(monthIndex: number): string {
  const date = new Date()
  date.setMonth(monthIndex)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  })
}

// 月の表示名取得（YYYY-MM形式から）
export function getMonthDisplayName(month: string): string {
  const [year, monthNum] = month.split('-')
  const date = new Date(parseInt(year), parseInt(monthNum) - 1)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  })
}

// 現在月のデータを取得
export function getCurrentMonthData(): {
  expenses: ExpenseRecord[]
  income: IncomeRecord[]
} {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
  // YYYY-MM 形式で現在月を作成
  const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
  
  // 現在月の支出を抽出
  const expenses = demoExpenseRecords.filter(expense => 
    expense.transaction_date.startsWith(currentMonthStr)
  )
  
  // 現在月の収入を抽出  
  const income = demoIncomeRecords.filter(record => 
    record.transaction_date.startsWith(currentMonthStr)
  )
  
  return {
    expenses,
    income
  }
}

// チャート用データ生成

// 日別チャートデータ生成
export function generateDailyChartData(days: number = 30): Array<{
  date: string
  income: number
  expense: number
  net: number
}> {
  const data = []
  const endDate = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayExpenses = demoExpenseRecords
      .filter(record => record.transaction_date === dateStr)
      .reduce((sum, record) => sum + record.amount, 0)
    
    const dayIncome = demoIncomeRecords
      .filter(record => record.transaction_date === dateStr)
      .reduce((sum, record) => sum + record.amount, 0)
    
    data.push({
      date: dateStr,
      income: dayIncome,
      expense: dayExpenses,
      net: dayIncome - dayExpenses
    })
  }
  
  return data
}

// 月別チャートデータ生成
export function generateMonthlyChartData(months: number = 12): Array<{
  date: string
  income: number
  expense: number
  net: number
}> {
  const data = []
  const endDate = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    
    const monthExpenses = demoExpenseRecords
      .filter(record => record.transaction_date.startsWith(monthStr))
      .reduce((sum, record) => sum + record.amount, 0)
    
    const monthIncome = demoIncomeRecords
      .filter(record => record.transaction_date.startsWith(monthStr))
      .reduce((sum, record) => sum + record.amount, 0)
    
    data.push({
      date: monthStr,
      income: monthIncome,
      expense: monthExpenses,
      net: monthIncome - monthExpenses
    })
  }
  
  return data
}

// 年別チャートデータ生成  
export function generateYearlyChartData(years: number = 3): Array<{
  date: string
  income: number
  expense: number
  net: number
}> {
  const data = []
  const currentYear = new Date().getFullYear()
  
  for (let i = years - 1; i >= 0; i--) {
    const year = currentYear - i
    const yearStr = year.toString()
    
    const yearExpenses = demoExpenseRecords
      .filter(record => record.transaction_date.startsWith(yearStr))
      .reduce((sum, record) => sum + record.amount, 0)
    
    const yearIncome = demoIncomeRecords
      .filter(record => record.transaction_date.startsWith(yearStr))
      .reduce((sum, record) => sum + record.amount, 0)
    
    data.push({
      date: yearStr,
      income: yearIncome,
      expense: yearExpenses,
      net: yearIncome - yearExpenses
    })
  }
  
  return data
}

// 期間タイプの定義
export type PeriodType = 'current_month' | 'last_month' | 'current_year' | 'last_year'

// 期間オプション
export const periodOptions = [
  { value: 'current_month', label: '今月' },
  { value: 'last_month', label: '先月' },
  { value: 'current_year', label: '今年' },
  { value: 'last_year', label: '昨年' },
] as const

// 期間に基づくデータ取得
export function getDataByPeriod(periodType: PeriodType) {
  const now = new Date()
  let startDate: Date
  let endDate: Date

  switch (periodType) {
    case 'current_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    case 'last_month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      break
    case 'current_year':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      break
    case 'last_year':
      startDate = new Date(now.getFullYear() - 1, 0, 1)
      endDate = new Date(now.getFullYear() - 1, 11, 31)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  return { startDate, endDate }
}

// 期間データ取得（支出・収入）
export function getPeriodData(
  periodType: PeriodType, 
  allExpenses: any[],
  allIncome: any[]
) {
  const { startDate, endDate } = getDataByPeriod(periodType)
  
  const filteredExpenses = allExpenses.filter(expense => {
    const expenseDate = new Date(expense.transaction_date)
    return expenseDate >= startDate && expenseDate <= endDate
  })

  const filteredIncome = allIncome.filter(income => {
    const incomeDate = new Date(income.transaction_date)
    return incomeDate >= startDate && incomeDate <= endDate
  })

  return {
    expenses: filteredExpenses,
    income: filteredIncome,
    period: {
      startDate,
      endDate,
      label: getPeriodLabel(periodType, startDate, endDate)
    }
  }
}

// 期間ラベル生成
export function getPeriodLabel(periodType: PeriodType, startDate: Date, endDate: Date): string {
  switch (periodType) {
    case 'current_month':
      return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月`
    case 'last_month':
      return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月`
    case 'current_year':
      return `${startDate.getFullYear()}年`
    case 'last_year':
      return `${startDate.getFullYear()}年`
    default:
      return '期間不明'
  }
}

// 前期間との比較計算
export function calculatePeriodComparison(
  currentPeriodType: PeriodType,
  allExpenses: any[],
  allIncome: any[]
) {
  const currentData = getPeriodData(currentPeriodType, allExpenses, allIncome)
  
  // 前期間の計算
  let prevPeriodType: PeriodType

  switch (currentPeriodType) {
    case 'current_month':
      prevPeriodType = 'last_month'
      break
    case 'last_month':
      // 2ヶ月前は current_year で近似
      prevPeriodType = 'current_year'
      break
    case 'current_year':
      prevPeriodType = 'last_year'
      break
    case 'last_year':
      // 2年前は last_year で近似
      prevPeriodType = 'last_year'
      break
    default:
      prevPeriodType = 'last_month'
  }

  const prevData = getPeriodData(prevPeriodType, allExpenses, allIncome)

  // 比較計算
  const currentIncome = currentData.income.reduce((sum, record) => sum + record.amount, 0)
  const currentExpenses = currentData.expenses.reduce((sum, record) => sum + record.amount, 0)
  const currentBalance = currentIncome - currentExpenses

  const prevIncome = prevData.income.reduce((sum, record) => sum + record.amount, 0)
  const prevExpenses = prevData.expenses.reduce((sum, record) => sum + record.amount, 0)
  const prevBalance = prevIncome - prevExpenses

  return {
    current: {
      ...currentData,
      totals: { income: currentIncome, expenses: currentExpenses, balance: currentBalance }
    },
    previous: {
      ...prevData,
      totals: { income: prevIncome, expenses: prevExpenses, balance: prevBalance }
    },
    comparison: {
      incomeChange: prevIncome === 0 ? (currentIncome > 0 ? 100 : 0) : ((currentIncome - prevIncome) / prevIncome) * 100,
      expensesChange: prevExpenses === 0 ? (currentExpenses > 0 ? 100 : 0) : ((currentExpenses - prevExpenses) / prevExpenses) * 100,
      balanceChange: prevBalance === 0 ? (currentBalance !== 0 ? (currentBalance > 0 ? 100 : -100) : 0) : ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100,
    }
  }
}

// 月別データの取得（チャート用）
export function getMonthlyData(allExpenses: any[], allIncome: any[], yearCount: number = 12) {
  const months = []
  const now = new Date()
  
  for (let i = yearCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const filteredExpenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.transaction_date)
      return expenseDate >= startDate && expenseDate <= endDate
    })

    const filteredIncome = allIncome.filter(income => {
      const incomeDate = new Date(income.transaction_date)
      return incomeDate >= startDate && incomeDate <= endDate
    })
    
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      income: filteredIncome.reduce((sum, record) => sum + record.amount, 0),
      expenses: filteredExpenses.reduce((sum, record) => sum + record.amount, 0),
      balance: filteredIncome.reduce((sum, record) => sum + record.amount, 0) - 
               filteredExpenses.reduce((sum, record) => sum + record.amount, 0)
    })
  }
  
  return months
}
