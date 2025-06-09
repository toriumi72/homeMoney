'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Trash2,
  FolderOpen,
  TrendingDown,
  TrendingUp,
  Utensils,
  Car,
  Gamepad2,
  ShoppingCart,
  Zap,
  Home,
  Heart,
} from 'lucide-react'

// デモデータとユーティリティをインポート
import { demoCategories } from '@/data/demo-data'
import { formatCurrency } from '@/lib/utils'
import type { Category } from '@/types'
import CategoryAddModal from '@/components/modals/CategoryAddModal'

// フィルター型定義
interface CategoryFilters {
  keyword: string
  type: string
  isActive: string
}

// ソート型定義
type SortField = 'name' | 'type' | 'monthly_budget' | 'sort_order'
type SortOrder = 'asc' | 'desc'

// アイコンマッピング
const iconMap = {
  UtensilsCrossed: Utensils,
  Car: Car,
  Gamepad2: Gamepad2,
  ShoppingCart: ShoppingCart,
  Zap: Zap,
  Home: Home,
  Heart: Heart,
  Plus: Plus,
}

export default function CategoriesPage() {
  // カテゴリデータ状態
  const [categories, setCategories] = useState<Category[]>([])

  // フィルター状態
  const [filters, setFilters] = useState<CategoryFilters>({
    keyword: '',
    type: 'all',
    isActive: 'active'
  })

  // ソート状態
  const [sortField, setSortField] = useState<SortField>('sort_order')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // フィルター展開状態
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // モーダル状態
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // データロード（初回とモーダル成功時）
  const loadCategories = () => {
    try {
      // localStorageからカスタムカテゴリを取得
      const customCategories = JSON.parse(localStorage.getItem('demo_categories') || '[]') as Category[]
      
      // デフォルトカテゴリと結合
      const allCategories = [...demoCategories, ...customCategories]
      setCategories(allCategories)
    } catch (error) {
      console.error('カテゴリデータ読み込みエラー:', error)
      setCategories(demoCategories)
    }
  }

  // 初回ロード
  useEffect(() => {
    loadCategories()
  }, [])

  // フィルター適用されたデータ
  const filteredCategories = useMemo(() => {
    let result = [...categories]

    // キーワード検索
    if (filters.keyword) {
      result = result.filter(category => 
        category.name.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    }

    // タイプフィルター
    if (filters.type && filters.type !== 'all') {
      result = result.filter(category => 
        category.type === filters.type || category.type === 'both'
      )
    }

    // アクティブフィルター
    if (filters.isActive === 'active') {
      result = result.filter(category => category.is_active)
    } else if (filters.isActive === 'inactive') {
      result = result.filter(category => !category.is_active)
    }

    // ソート適用
    result.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'monthly_budget') {
        aValue = aValue || 0
        bValue = bValue || 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [categories, filters, sortField, sortOrder])

  // フィルターリセット
  const resetFilters = () => {
    setFilters({
      keyword: '',
      type: 'all',
      isActive: 'active'
    })
  }

  // ソート処理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // カテゴリアイテムコンポーネント
  const CategoryItem = ({ category }: { category: Category }) => {
    const IconComponent = iconMap[category.icon as keyof typeof iconMap] || FolderOpen
    
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow bg-white">
        {/* カテゴリアイコン */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent 
            className="h-5 w-5"
            style={{ color: category.color }}
          />
        </div>
        
        {/* メイン情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{category.name}</h3>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  category.type === 'expense' ? 'text-red-600 border-red-200' :
                  category.type === 'income' ? 'text-green-600 border-green-200' :
                  'text-blue-600 border-blue-200'
                }`}
              >
                {category.type === 'expense' ? '支出' : 
                 category.type === 'income' ? '収入' : '両方'}
              </Badge>
            </div>
            <div className="text-right">
              {category.monthly_budget && (
                <p className="text-sm font-medium">
                  予算: {formatCurrency(category.monthly_budget)}
                </p>
              )}
              <p className="text-xs text-gray-500">
                順序: {category.sort_order}
              </p>
            </div>
          </div>
          {!category.is_active && (
            <Badge variant="secondary" className="text-xs mt-1">
              無効
            </Badge>
          )}
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
              <h1 className="text-2xl font-bold text-gray-900">カテゴリ管理</h1>
              <p className="text-sm text-gray-600">
                {filteredCategories.length}件のカテゴリ
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              カテゴリを追加
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
                  placeholder="カテゴリ名で検索..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  className="pl-10 h-9"
                />
              </div>
              
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({...filters, type: value})}
              >
                <SelectTrigger className="w-full sm:w-32 h-9">
                  <SelectValue placeholder="タイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                  <SelectItem value="income">収入</SelectItem>
                  <SelectItem value="both">両方</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.isActive}
                onValueChange={(value) => setFilters({...filters, isActive: value})}
              >
                <SelectTrigger className="w-full sm:w-32 h-9">
                  <SelectValue placeholder="状態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="active">有効</SelectItem>
                  <SelectItem value="inactive">無効</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
                className="h-9 px-3"
              >
                リセット
              </Button>
            </div>
          </div>
        </div>

        {/* ソート・統計 */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {filteredCategories.length}件
              </Badge>
              <Badge variant="outline" className="text-xs">
                予算設定: {filteredCategories.filter(cat => cat.monthly_budget).length}件
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
                <DropdownMenuItem onClick={() => handleSort('sort_order')}>
                  表示順 {sortField === 'sort_order' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  名前順 {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('type')}>
                  タイプ順 {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('monthly_budget')}>
                  予算順 {sortField === 'monthly_budget' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* カテゴリ一覧 */}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p className="mb-3">条件に合うカテゴリが見つかりません</p>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  最初のカテゴリを追加
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* カテゴリ追加モーダル */}
      <CategoryAddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadCategories()
        }}
      />
    </div>
  )
} 