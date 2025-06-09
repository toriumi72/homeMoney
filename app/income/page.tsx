'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  ArrowUpDown,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'

// デモデータとユーティリティをインポート
import { demoIncomeRecords, demoCategories } from '@/data/demo-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import type { IncomeRecord } from '@/types'

// モーダルコンポーネント
import { IncomeAddModal } from '@/components/modals/IncomeAddModal'

// フィルター型定義
interface IncomeFilters {
  keyword: string
  source: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

// ソート型定義
type SortField = 'transaction_date' | 'amount' | 'source'
type SortOrder = 'asc' | 'desc'

export default function IncomePage() {
  // フィルター状態
  const [filters, setFilters] = useState<IncomeFilters>({
    keyword: '',
    source: 'all',
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

  // 収入源の一覧を取得
  const incomeSources = useMemo(() => {
    const sources = Array.from(new Set(demoIncomeRecords.map(income => income.source)))
    return sources.sort()
  }, [])

  // フィルター適用されたデータ
  const filteredIncomes = useMemo(() => {
    let result = [...demoIncomeRecords]

    // キーワード検索
    if (filters.keyword) {
      result = result.filter(income => 
        income.memo?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        income.source.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    }

    // 収入源フィルター
    if (filters.source && filters.source !== 'all') {
      result = result.filter(income => income.source === filters.source)
    }

    // 日付範囲フィルター
    if (filters.dateFrom) {
      result = result.filter(income => income.transaction_date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter(income => income.transaction_date <= filters.dateTo)
    }

    // 金額範囲フィルター
    if (filters.amountMin) {
      result = result.filter(income => income.amount >= parseInt(filters.amountMin))
    }
    if (filters.amountMax) {
      result = result.filter(income => income.amount <= parseInt(filters.amountMax))
    }

    // ソート適用
    result.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'amount') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

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
      source: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    })
    setDateFromPicker(undefined)
    setDateToPicker(undefined)
  }

  // ソート処理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // 収入アイテムコンポーネント
  const IncomeItem = ({ income }: { income: IncomeRecord }) => {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow bg-white">
        {/* 収入アイコン */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 flex-shrink-0">
          <Wallet className="h-4 w-4 text-green-600" />
        </div>
        
        {/* メイン情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{income.source}</h3>
            <p className="text-lg font-bold text-green-600 ml-3">
              +{formatCurrency(income.amount)}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
            <p className="truncate flex-1 mr-2">{income.memo || 'メモなし'}</p>
            <p className="whitespace-nowrap">{formatDate(income.transaction_date)}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">収入管理</h1>
              <p className="text-sm text-gray-600">
                {filteredIncomes.length}件の収入記録
              </p>
            </div>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                収入を追加
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
                value={filters.source}
                onValueChange={(value) => setFilters({...filters, source: value})}
              >
                <SelectTrigger className="w-full sm:w-48 h-9">
                  <SelectValue placeholder="収入源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {incomeSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
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
                {filteredIncomes.length}件
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(filteredIncomes.reduce((sum, income) => sum + income.amount, 0))}
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
                <DropdownMenuItem onClick={() => handleSort('source')}>
                  収入源順 {sortField === 'source' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 収入一覧 */}
        <div className="px-4 lg:px-6">
          <div className="space-y-2">
            {filteredIncomes.length > 0 ? (
              filteredIncomes.map((income) => (
                <IncomeItem key={income.id} income={income} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-3">条件に合う収入記録が見つかりません</p>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  最初の収入を追加
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 収入追加モーダル */}
      <IncomeAddModal 
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