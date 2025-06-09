'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Calculator,
  Calendar,
  Tag,
  FileText,
  Camera,
  Save,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

// デモデータとユーティリティをインポート
import { demoCategories } from '@/data/demo-data'
import { formatCurrency, generateId } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import type { ExpenseFormData } from '@/types'

export default function NewExpensePage() {
  const router = useRouter()
  
  // フォーム状態
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    transaction_date: new Date().toISOString().split('T')[0], // 今日の日付
    category_id: '',
    memo: ''
  })

  // 日付選択用の状態
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // バリデーションエラー
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  // 送信中フラグ
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 入力値変更ハンドラー
  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // 日付変更ハンドラー
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setFormData(prev => ({
        ...prev,
        transaction_date: date.toISOString().split('T')[0]
      }))
      
      // エラーをクリア
      if (errors.transaction_date) {
        setErrors(prev => ({
          ...prev,
          transaction_date: ''
        }))
      }
    }
  }

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    // 金額チェック
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '金額を入力してください（1円以上）'
    } else if (formData.amount > 9999999) {
      newErrors.amount = '金額は999万円以下で入力してください'
    }

    // 日付チェック
    if (!formData.transaction_date) {
      newErrors.transaction_date = '日付を選択してください'
    }

    // カテゴリチェック
    if (!formData.category_id) {
      newErrors.category_id = 'カテゴリを選択してください'
    }

    // メモの文字数チェック
    if (formData.memo && formData.memo.length > 200) {
      newErrors.memo = 'メモは200文字以内で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: 実際のAPI呼び出しに置き換える
      // 現在はデモ用の遅延処理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('支出データ保存:', {
        id: generateId(),
        user_id: 'user-demo-123',
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      // 成功時は支出一覧に戻る
      router.push('/expenses')
      
    } catch (error) {
      console.error('支出保存エラー:', error)
      setErrors({ submit: '支出の保存に失敗しました。もう一度お試しください。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // よく使うカテゴリ（クイック選択用）
  const quickCategories = demoCategories
    .filter(cat => cat.type === 'expense' || cat.type === 'both')
    .slice(0, 6)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        
        {/* ヘッダー */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link href="/expenses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">支出を追加</h1>
              <p className="text-sm text-gray-600">新しい支出記録を登録します</p>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <div className="px-4 lg:px-6">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 金額入力 */}
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-medium">金額 *</Label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                    className={`pl-8 text-xl font-bold h-12 ${errors.amount ? 'border-red-500' : ''}`}
                    min="1"
                    max="9999999"
                  />
                </div>
                {formData.amount > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {formatCurrency(formData.amount)}
                  </p>
                )}
                {errors.amount && (
                  <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>

              {/* 日付・カテゴリ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-medium">支出日 *</Label>
                  </div>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={handleDateChange}
                    placeholder="支出日を選択"
                    className={`h-9 ${errors.transaction_date ? 'border-red-500' : ''}`}
                  />
                  {errors.transaction_date && (
                    <p className="text-xs text-red-600 mt-1">{errors.transaction_date}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-medium">カテゴリ *</Label>
                  </div>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger className={`h-9 ${errors.category_id ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoCategories
                        .filter(cat => cat.type === 'expense' || cat.type === 'both')
                        .map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && (
                    <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>
                  )}
                </div>
              </div>

              {/* クイック選択 */}
              <div className="bg-white rounded-lg border p-4">
                <Label className="text-sm font-medium mb-3 block">よく使うカテゴリ</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickCategories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={formData.category_id === category.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleInputChange('category_id', category.id)}
                    >
                      <span className="truncate">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* メモ入力 */}
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-medium">メモ</Label>
                </div>
                <Textarea
                  id="memo"
                  placeholder="例：スーパーで食材購入、映画鑑賞..."
                  value={formData.memo || ''}
                  onChange={(e) => handleInputChange('memo', e.target.value)}
                  className={`text-sm ${errors.memo ? 'border-red-500' : ''}`}
                  rows={2}
                  maxLength={200}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formData.memo?.length || 0}/200文字</span>
                </div>
                {errors.memo && (
                  <p className="text-xs text-red-600 mt-1">{errors.memo}</p>
                )}
              </div>

              {/* エラー表示 */}
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* 送信ボタン */}
              <div className="flex gap-3 pt-2">
                <Link href="/expenses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full h-10">
                    キャンセル
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700 h-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>処理中...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
} 