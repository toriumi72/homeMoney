'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar,
  Calculator,
  FileText,
  Save,
  AlertCircle,
  Wallet,

} from 'lucide-react'

// デモデータとユーティリティをインポート
import { formatCurrency } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import type { IncomeRecord } from '@/types'

// フォームデータ型定義
interface IncomeFormData {
  amount: number
  transaction_date: string
  source: string
  memo?: string
  is_recurring: boolean
}

// エラー型定義
interface FormErrors {
  amount?: string
  transaction_date?: string
  source?: string
  memo?: string
  submit?: string
}

interface IncomeAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function IncomeAddModal({ isOpen, onClose, onSuccess }: IncomeAddModalProps) {
  // フォーム状態
  const [formData, setFormData] = useState<IncomeFormData>({
    amount: 0,
    transaction_date: new Date().toISOString().split('T')[0],
    source: '',
    memo: '',
    is_recurring: false
  })

  // 日付選択用の状態
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // エラー状態
  const [errors, setErrors] = useState<FormErrors>({})
  
  // 送信状態
  const [isSubmitting, setIsSubmitting] = useState(false)

  // よく使う収入源
  const quickSources = [
    '給与',
    '副業',
    '投資',
    'ボーナス',
    'その他'
  ]

  // 入力変更ハンドラー
  const handleInputChange = (field: keyof IncomeFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // エラーをクリア
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
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
          transaction_date: undefined
        }))
      }
    }
  }

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 金額チェック
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = '金額を入力してください'
    } else if (formData.amount > 9999999) {
      newErrors.amount = '金額は999万円以下で入力してください'
    }

    // 日付チェック
    if (!formData.transaction_date) {
      newErrors.transaction_date = '日付を選択してください'
    }

    // 収入源チェック
    if (!formData.source.trim()) {
      newErrors.source = '収入源を入力してください'
    } else if (formData.source.length > 50) {
      newErrors.source = '収入源は50文字以内で入力してください'
    }

    // メモチェック（任意項目）
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
      // ここで実際のAPI呼び出しを行う
      // 現在はデモなので、localStorageに保存
      const newIncome: IncomeRecord = {
        id: `income_${Date.now()}`,
        user_id: 'user-demo-123', // デモ用
        amount: formData.amount,
        transaction_date: formData.transaction_date,
        source: formData.source,
        memo: formData.memo || undefined,
        is_recurring: formData.is_recurring,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // localStorageから既存データを取得
      const existingIncomes = JSON.parse(localStorage.getItem('demo_incomes') || '[]')
      existingIncomes.unshift(newIncome)
      localStorage.setItem('demo_incomes', JSON.stringify(existingIncomes))

      // フォームリセット
      const today = new Date()
      setFormData({
        amount: 0,
        transaction_date: today.toISOString().split('T')[0],
        source: '',
        memo: '',
        is_recurring: false
      })
      setSelectedDate(today)
      setErrors({})

      // 成功コールバック実行
      onSuccess?.()
      
      // モーダルを閉じる
      onClose()
      
    } catch {
      setErrors({ submit: '保存中にエラーが発生しました' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // モーダルクローズ時のリセット
  const handleClose = () => {
    const today = new Date()
    setFormData({
      amount: 0,
      transaction_date: today.toISOString().split('T')[0],
      source: '',
      memo: '',
      is_recurring: false
    })
    setSelectedDate(today)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600" />
            収入を追加
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 px-1">
          
          {/* 金額入力 */}
          <div className="bg-gray-50 rounded-lg p-4">
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

          {/* 日付・収入源 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">収入日 *</Label>
              </div>
              <DatePicker
                date={selectedDate}
                onDateChange={handleDateChange}
                placeholder="収入日を選択"
                className={`h-9 ${errors.transaction_date ? 'border-red-500' : ''}`}
              />
              {errors.transaction_date && (
                <p className="text-xs text-red-600 mt-1">{errors.transaction_date}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">収入源 *</Label>
              </div>
              <Input
                id="source"
                placeholder="例：給与、副業、投資..."
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className={`h-9 ${errors.source ? 'border-red-500' : ''}`}
                maxLength={50}
              />
              {errors.source && (
                <p className="text-xs text-red-600 mt-1">{errors.source}</p>
              )}
            </div>
          </div>

          {/* クイック選択 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Label className="text-sm font-medium mb-3 block">よく使う収入源</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickSources.map((source) => (
                <Button
                  key={source}
                  type="button"
                  variant={formData.source === source ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleInputChange('source', source)}
                >
                  <span className="truncate">{source}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* メモ入力 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-medium">メモ</Label>
            </div>
            <Textarea
              id="memo"
              placeholder="例：今月のお給料、副業の収入..."
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

          </div>

          {/* 送信ボタン */}
          <div className="flex gap-3 pt-4 flex-shrink-0 border-t mt-4">
            <Button type="button" variant="outline" className="flex-1 h-10" onClick={handleClose}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700 h-10"
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
      </DialogContent>
    </Dialog>
  )
} 