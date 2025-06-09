'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Utensils,
  Car,
  Gamepad2,
  ShoppingCart,
  Zap,
  Home,
  Heart,
  Briefcase,
  GraduationCap,
  MapPin,
  Coffee,
  Smartphone,
  Shirt,
  Dumbbell,
  Gift,
  Wrench,
  Baby,
  PiggyBank,
  TrendingUp,
  Building,
  Wallet,
  DollarSign,
} from 'lucide-react'

import type { Category } from '@/types'

interface CategoryAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// 利用可能なアイコン一覧
const availableIcons = [
  { name: 'UtensilsCrossed', icon: Utensils, label: '食事・食品' },
  { name: 'Car', icon: Car, label: '交通・車' },
  { name: 'Gamepad2', icon: Gamepad2, label: '娯楽・ゲーム' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'ショッピング' },
  { name: 'Zap', icon: Zap, label: '光熱費・電気' },
  { name: 'Home', icon: Home, label: '住居・家' },
  { name: 'Heart', icon: Heart, label: '健康・医療' },
  { name: 'Briefcase', icon: Briefcase, label: '仕事・ビジネス' },
  { name: 'GraduationCap', icon: GraduationCap, label: '教育・学習' },
  { name: 'MapPin', icon: MapPin, label: '旅行・外出' },
  { name: 'Coffee', icon: Coffee, label: 'カフェ・飲み物' },
  { name: 'Smartphone', icon: Smartphone, label: '通信・電話' },
  { name: 'Shirt', icon: Shirt, label: '衣服・ファッション' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'スポーツ・運動' },
  { name: 'Gift', icon: Gift, label: 'ギフト・プレゼント' },
  { name: 'Wrench', icon: Wrench, label: '修理・メンテナンス' },
  { name: 'Baby', icon: Baby, label: '子供・育児' },
  { name: 'PiggyBank', icon: PiggyBank, label: '貯金・投資' },
  { name: 'TrendingUp', icon: TrendingUp, label: '投資・資産運用' },
  { name: 'Building', icon: Building, label: '不動産・建物' },
  { name: 'Wallet', icon: Wallet, label: '給与・収入' },
  { name: 'DollarSign', icon: DollarSign, label: 'その他収入' },
]

// プリセットカラー
const presetColors = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
]

export default function CategoryAddModal({ isOpen, onClose, onSuccess }: CategoryAddModalProps) {
  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: presetColors[0],
    type: 'expense' as 'expense' | 'income' | 'both',
    monthly_budget: '',
    sort_order: '100',
    is_active: true,
  })

  // エラー状態
  const [errors, setErrors] = useState<Record<string, string>>({})

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'カテゴリ名は必須です'
    } else if (formData.name.length > 20) {
      newErrors.name = 'カテゴリ名は20文字以内で入力してください'
    }

    if (!formData.icon) {
      newErrors.icon = 'アイコンを選択してください'
    }

    if (!formData.color) {
      newErrors.color = '色を選択してください'
    }

    if (formData.monthly_budget && (isNaN(Number(formData.monthly_budget)) || Number(formData.monthly_budget) < 0)) {
      newErrors.monthly_budget = '予算は0以上の数値で入力してください'
    }

    if (!formData.sort_order || isNaN(Number(formData.sort_order))) {
      newErrors.sort_order = '表示順序は数値で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 保存処理
  const handleSave = () => {
    if (!validateForm()) return

    // 新しいカテゴリデータを作成
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      type: formData.type,
      monthly_budget: formData.monthly_budget ? Number(formData.monthly_budget) : undefined,
      sort_order: Number(formData.sort_order),
      is_active: formData.is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // デモ実装: localStorageに保存
    try {
      const existingCategories = JSON.parse(localStorage.getItem('demo_categories') || '[]')
      existingCategories.push(newCategory)
      localStorage.setItem('demo_categories', JSON.stringify(existingCategories))
      
      // フォームリセット
      setFormData({
        name: '',
        icon: '',
        color: presetColors[0],
        type: 'expense',
        monthly_budget: '',
        sort_order: '100',
        is_active: true,
      })
      setErrors({})
      
      // 成功コールバック
      onSuccess()
      onClose()
    } catch (error) {
      console.error('カテゴリ保存エラー:', error)
    }
  }

  // モーダルクローズ時のリセット
  const handleClose = () => {
    setFormData({
      name: '',
      icon: '',
      color: presetColors[0],
      type: 'expense',
      monthly_budget: '',
      sort_order: '100',
      is_active: true,
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>カテゴリを追加</DialogTitle>
          <DialogDescription>
            新しいカテゴリを作成します。支出または収入の記録で使用できます。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1">
          {/* カテゴリ名 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                カテゴリ名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 食費、交通費、給与"
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                maxLength={20}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.name.length}/20文字
              </p>
            </div>

            {/* タイプ選択 */}
            <div>
              <Label className="text-sm font-medium">
                タイプ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'expense' | 'income' | 'both') => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">支出用</SelectItem>
                  <SelectItem value="income">収入用</SelectItem>
                  <SelectItem value="both">支出・収入両用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* アイコン選択 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium">
              アイコン <span className="text-red-500">*</span>
            </Label>
            {errors.icon && (
              <p className="text-sm text-red-600 mt-1">{errors.icon}</p>
            )}
            <div className="grid grid-cols-6 gap-2 mt-2">
              {availableIcons.map((iconItem) => {
                const IconComponent = iconItem.icon
                const isSelected = formData.icon === iconItem.name
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconItem.name })}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    title={iconItem.label}
                  >
                    <IconComponent className="h-5 w-5 mx-auto" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* 色選択 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium">
              色 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    formData.color === color 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 予算設定 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor="monthly_budget" className="text-sm font-medium">
                月次予算（任意）
              </Label>
              <Input
                id="monthly_budget"
                type="number"
                value={formData.monthly_budget}
                onChange={(e) => setFormData({ ...formData, monthly_budget: e.target.value })}
                placeholder="例: 30000"
                className={`mt-1 ${errors.monthly_budget ? 'border-red-500' : ''}`}
                min="0"
              />
              {errors.monthly_budget && (
                <p className="text-sm text-red-600 mt-1">{errors.monthly_budget}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                支出カテゴリの場合、予算オーバー時にアラートが表示されます
              </p>
            </div>

            <div>
              <Label htmlFor="sort_order" className="text-sm font-medium">
                表示順序
              </Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                placeholder="100"
                className={`mt-1 ${errors.sort_order ? 'border-red-500' : ''}`}
                min="0"
              />
              {errors.sort_order && (
                <p className="text-sm text-red-600 mt-1">{errors.sort_order}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                数値が小さいほど選択リストの上位に表示されます
              </p>
            </div>
          </div>

          {/* プレビュー */}
          {formData.name && formData.icon && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm font-medium">プレビュー</Label>
              <div className="flex items-center gap-3 mt-2 p-3 bg-white rounded-lg border">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {(() => {
                    const selectedIcon = availableIcons.find(icon => icon.name === formData.icon)
                    if (!selectedIcon) return null
                    const IconComponent = selectedIcon.icon
                    return <IconComponent className="h-5 w-5" style={{ color: formData.color }} />
                  })()}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{formData.name}</h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                  >
                    {formData.type === 'expense' ? '支出' : 
                     formData.type === 'income' ? '収入' : '両方'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 pt-4 flex-shrink-0 border-t mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!formData.name || !formData.icon}
          >
            カテゴリを作成
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 