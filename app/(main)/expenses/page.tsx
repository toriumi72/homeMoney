'use client'

import React, { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Edit,
  Trash2,
  Copy,
  Utensils,
} from 'lucide-react'
import { Label } from '@/components/ui/label'

// デモデータとユーティリティをインポート
import { demoExpenseRecords, demoCategories } from '@/data/demo-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import type { ExpenseRecord } from '@/types'

// モーダルコンポーネント
import { ExpenseAddModal } from '@/components/modals/ExpenseAddModal'

// フィルター条件の型
interface ExpenseFilters {
  keyword: string
  categoryId: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

// ソート条件の型
type SortField = 'transaction_date' | 'amount' | 'category_id'
type SortOrder = 'asc' | 'desc'

export default function ExpensesPage() {
  // フィルター状態
  const [filters, setFilters] = useState<ExpenseFilters>({
    keyword: '',
    categoryId: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  })

  // 日付選択用の状態
  const [dateFromPicker, setDateFromPicker] = useState<Date>()
  const [dateToPicker, setDateToPicker] = useState<Date>()

  // ソート状態
  const [sortField, setSortField] = useState<SortField>('transaction_date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // フィルター展開状態
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  
  // モーダル状態
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // フィルター適用されたデータ
  const filteredExpenses = useMemo(() => {
    let result = [...demoExpenseRecords]

    // キーワード検索（メモで）
    if (filters.keyword) {
      result = result.filter(expense => 
        expense.memo && expense.memo.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    }

    // カテゴリフィルター
    if (filters.categoryId) {
      result = result.filter(expense => expense.category_id === filters.categoryId)
    }

    // 日付範囲フィルター
    if (filters.dateFrom) {
      result = result.filter(expense => expense.transaction_date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter(expense => expense.transaction_date <= filters.dateTo)
    }

    // 金額範囲フィルター
    if (filters.amountMin) {
      result = result.filter(expense => expense.amount >= parseInt(filters.amountMin))
    }
    if (filters.amountMax) {
      result = result.filter(expense => expense.amount <= parseInt(filters.amountMax))
    }

    // ソート適用
    result.sort((a, b) => {
      const aValue: string | number = a[sortField]
      const bValue: string | number = b[sortField]

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [filters, sortField, sortOrder])

  // 日付変更ハンドラー
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFromPicker(date)
    setFilters(prev => ({
      ...prev,
      dateFrom: date ? date.toISOString().split('T')[0] : ''
    }))
  }

  const handleDateToChange = (date: Date | undefined) => {
    setDateToPicker(date)
    setFilters(prev => ({
      ...prev,
      dateTo: date ? date.toISOString().split('T')[0] : ''
    }))
  }

  // フィルターリセット
  const resetFilters = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    })
    setDateFromPicker(undefined)
    setDateToPicker(undefined)
  }

  // ソート変更
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 支出アイテムコンポーネント
  const ExpenseItem = ({ expense }: { expense: ExpenseRecord }) => {
    const category = demoCategories.find(cat => cat.id === expense.category_id)
    
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow bg-white">
        {/* カテゴリアイコン */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 flex-shrink-0`}>
          <Utensils className="h-4 w-4 text-red-600" />
        </div>
        
        {/* メイン情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{category?.name || '未分類'}</h3>
            <p className="text-lg font-bold text-red-600 ml-3">
              -{formatCurrency(expense.amount)}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
            <p className="truncate flex-1 mr-2">{expense.memo || 'メモなし'}</p>
            <p className="whitespace-nowrap">{formatDate(expense.transaction_date)}</p>
          </div>
        </div>
        
        {/* アクションメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-3 w-3 mr-2" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-3 w-3 mr-2" />
              複製
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-3 w-3 mr-2" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        
        {/* ヘッダー */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">支出管理</h1>
              <p className="text-sm text-gray-600">
                {filteredExpenses.length}件の支出記録
              </p>
            </div>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              支出を追加
            </Button>
          </div>
        </div>

        {/* フィルター・検索エリア */}
        <div className="px-4 lg:px-6">
          <div className="bg-white rounded-lg border p-4">
            {/* 基本検索バー */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="メモで検索..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  className="pl-10 h-9"
                />
              </div>
              
              <Select
                value={filters.categoryId}
                onValueChange={(value) => setFilters({...filters, categoryId: value})}
              >
                <SelectTrigger className="w-full sm:w-48 h-9">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {demoCategories
                    .filter(cat => cat.type === 'expense' || cat.type === 'both')
                    .map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="h-9 px-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                詳細
              </Button>
            </div>

            {/* 詳細フィルター（折りたたみ） */}
            {isFilterExpanded && (
              <div className="space-y-3 pt-3 border-t">
                {/* 日付範囲 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">開始日</Label>
                    <DatePicker
                      date={dateFromPicker}
                      onDateChange={handleDateFromChange}
                      placeholder="開始日を選択"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">終了日</Label>
                    <DatePicker
                      date={dateToPicker}
                      onDateChange={handleDateToChange}
                      placeholder="終了日を選択"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                {/* 金額範囲 */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">最小金額</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.amountMin}
                      onChange={(e) => setFilters({...filters, amountMin: e.target.value})}
                      className="h-8 text-sm"
                    />
                  </div>
                  <span className="text-sm text-gray-400 pt-4">〜</span>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">最大金額</Label>
                    <Input
                      type="number"
                      placeholder="999999"
                      value={filters.amountMax}
                      onChange={(e) => setFilters({...filters, amountMax: e.target.value})}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={resetFilters} className="h-8">
                    リセット
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ソート・統計 */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {filteredExpenses.length}件
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  並び替え
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort('transaction_date')}>
                  日付順 {sortField === 'transaction_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('amount')}>
                  金額順 {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('category_id')}>
                  カテゴリ順 {sortField === 'category_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 支出一覧 */}
        <div className="px-4 lg:px-6">
          <div className="space-y-2">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <ExpenseItem key={expense.id} expense={expense} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-3">条件に合う支出記録が見つかりません</p>
                <Button 
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  最初の支出を追加
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 支出追加モーダル */}
      <ExpenseAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // 成功時に画面をリロードまたは状態を更新
          window.location.reload()
        }}
      />
    </div>
  )
} 