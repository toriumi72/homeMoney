import { 
  User, 
  Category, 
  ExpenseRecord, 
  IncomeRecord, 
  ExpenseTemplate, 
  IncomeTemplate, 
  UserSettings 
} from '@/types'

// デモユーザー
export const demoUser: User = {
  id: 'user-demo-123',
  email: 'demo@moneyflow.app',
  display_name: '田中太郎',
  avatar_url: undefined,
  timezone: 'Asia/Tokyo',
  currency: 'JPY',
  budget_reset_day: 1,
  notification_enabled: true,
  line_user_id: undefined,
  auth_provider: 'email',
  is_line_linked: false,
  linked_at: undefined,
  created_at: '2025-01-15T09:00:00Z',
  updated_at: '2025-06-01T10:30:00Z'
}

// デモカテゴリ
export const demoCategories: Category[] = [
  {
    id: 'cat-food',
    user_id: 'user-demo-123',
    name: '食費',
    icon: 'UtensilsCrossed',
    color: '#FF6B6B',
    type: 'expense',
    monthly_budget: 50000,
    sort_order: 1,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-transport',
    user_id: 'user-demo-123',
    name: '交通費',
    icon: 'Car',
    color: '#4ECDC4',
    type: 'expense',
    monthly_budget: 15000,
    sort_order: 2,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-entertainment',
    user_id: 'user-demo-123',
    name: '娯楽',
    icon: 'Gamepad2',
    color: '#45B7D1',
    type: 'expense',
    monthly_budget: 20000,
    sort_order: 3,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-shopping',
    user_id: 'user-demo-123',
    name: '日用品',
    icon: 'ShoppingCart',
    color: '#96CEB4',
    type: 'expense',
    monthly_budget: 12000,
    sort_order: 4,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-utilities',
    user_id: 'user-demo-123',
    name: '光熱費',
    icon: 'Zap',
    color: '#FFEAA7',
    type: 'expense',
    monthly_budget: 18000,
    sort_order: 5,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-rent',
    user_id: 'user-demo-123',
    name: '家賃',
    icon: 'Home',
    color: '#DDA0DD',
    type: 'expense',
    monthly_budget: 85000,
    sort_order: 6,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-health',
    user_id: 'user-demo-123',
    name: '医療費',
    icon: 'Heart',
    color: '#FF69B4',
    type: 'expense',
    monthly_budget: 5000,
    sort_order: 7,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-salary',
    user_id: 'user-demo-123',
    name: '給与',
    icon: 'Banknote',
    color: '#6C5CE7',
    type: 'income',
    monthly_budget: undefined,
    sort_order: 1,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-side-income',
    user_id: 'user-demo-123',
    name: '副業',
    icon: 'Laptop',
    color: '#A29BFE',
    type: 'income',
    monthly_budget: undefined,
    sort_order: 2,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  },
  {
    id: 'cat-other-income',
    user_id: 'user-demo-123',
    name: 'その他収入',
    icon: 'Plus',
    color: '#00B894',
    type: 'income',
    monthly_budget: undefined,
    sort_order: 3,
    is_active: true,
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-15T09:30:00Z'
  }
]

// デモ支出レコード（2025年4月-6月）
export const demoExpenseRecords: ExpenseRecord[] = [
  // 2025年6月のデータ
  {
    id: 'exp-2025-06-001',
    user_id: 'user-demo-123',
    category_id: 'cat-food',
    amount: 3240,
    transaction_date: '2025-06-15',
    memo: 'スーパーで食材購入',
    created_at: '2025-06-15T18:30:00Z',
    updated_at: '2025-06-15T18:30:00Z'
  },
  {
    id: 'exp-2025-06-002',
    user_id: 'user-demo-123',
    category_id: 'cat-transport',
    amount: 320,
    transaction_date: '2025-06-15',
    memo: '電車代（渋谷→新宿）',
    created_at: '2025-06-15T09:15:00Z',
    updated_at: '2025-06-15T09:15:00Z'
  },
  {
    id: 'exp-2025-06-003',
    user_id: 'user-demo-123',
    category_id: 'cat-entertainment',
    amount: 2800,
    transaction_date: '2025-06-14',
    memo: '映画鑑賞',
    created_at: '2025-06-14T20:45:00Z',
    updated_at: '2025-06-14T20:45:00Z'
  },
  {
    id: 'exp-2025-06-004',
    user_id: 'user-demo-123',
    category_id: 'cat-food',
    amount: 1580,
    transaction_date: '2025-06-13',
    memo: 'ランチ（同僚と）',
    created_at: '2025-06-13T13:20:00Z',
    updated_at: '2025-06-13T13:20:00Z'
  },
  {
    id: 'exp-2025-06-005',
    user_id: 'user-demo-123',
    category_id: 'cat-shopping',
    amount: 2240,
    transaction_date: '2025-06-12',
    memo: 'トイレットペーパー、洗剤など',
    created_at: '2025-06-12T16:10:00Z',
    updated_at: '2025-06-12T16:10:00Z'
  },
  {
    id: 'exp-2025-06-006',
    user_id: 'user-demo-123',
    category_id: 'cat-food',
    amount: 4320,
    transaction_date: '2025-06-10',
    memo: '週末の食材まとめ買い',
    created_at: '2025-06-10T11:30:00Z',
    updated_at: '2025-06-10T11:30:00Z'
  },
  {
    id: 'exp-2025-06-007',
    user_id: 'user-demo-123',
    category_id: 'cat-utilities',
    amount: 8540,
    transaction_date: '2025-06-08',
    memo: '電気代（5月分）',
    created_at: '2025-06-08T14:00:00Z',
    updated_at: '2025-06-08T14:00:00Z'
  },
  {
    id: 'exp-2025-06-008',
    user_id: 'user-demo-123',
    category_id: 'cat-rent',
    amount: 85000,
    transaction_date: '2025-06-01',
    memo: '6月分家賃',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z'
  },
  {
    id: 'exp-2025-06-009',
    user_id: 'user-demo-123',
    category_id: 'cat-transport',
    amount: 640,
    transaction_date: '2025-06-09',
    memo: 'タクシー代（雨で電車遅延）',
    created_at: '2025-06-09T19:30:00Z',
    updated_at: '2025-06-09T19:30:00Z'
  },
  {
    id: 'exp-2025-06-010',
    user_id: 'user-demo-123',
    category_id: 'cat-entertainment',
    amount: 5200,
    transaction_date: '2025-06-07',
    memo: '友人との飲み会',
    created_at: '2025-06-07T22:00:00Z',
    updated_at: '2025-06-07T22:00:00Z'
  },
  
  // 2025年5月のデータ
  {
    id: 'exp-2025-05-001',
    user_id: 'user-demo-123',
    category_id: 'cat-rent',
    amount: 85000,
    transaction_date: '2025-05-01',
    memo: '5月分家賃',
    created_at: '2025-05-01T08:00:00Z',
    updated_at: '2025-05-01T08:00:00Z'
  },
  {
    id: 'exp-2025-05-002',
    user_id: 'user-demo-123',
    category_id: 'cat-food',
    amount: 38520,
    transaction_date: '2025-05-31',
    memo: '5月の食費合計',
    created_at: '2025-05-31T23:59:00Z',
    updated_at: '2025-05-31T23:59:00Z'
  },
  {
    id: 'exp-2025-05-003',
    user_id: 'user-demo-123',
    category_id: 'cat-transport',
    amount: 12800,
    transaction_date: '2025-05-31',
    memo: '5月の交通費合計',
    created_at: '2025-05-31T23:58:00Z',
    updated_at: '2025-05-31T23:58:00Z'
  },
  {
    id: 'exp-2025-05-004',
    user_id: 'user-demo-123',
    category_id: 'cat-entertainment',
    amount: 18940,
    transaction_date: '2025-05-31',
    memo: '5月の娯楽費合計',
    created_at: '2025-05-31T23:57:00Z',
    updated_at: '2025-05-31T23:57:00Z'
  },
  {
    id: 'exp-2025-05-005',
    user_id: 'user-demo-123',
    category_id: 'cat-utilities',
    amount: 16320,
    transaction_date: '2025-05-15',
    memo: 'ガス代・水道代',
    created_at: '2025-05-15T14:30:00Z',
    updated_at: '2025-05-15T14:30:00Z'
  },
  
  // 2025年4月のデータ
  {
    id: 'exp-2025-04-001',
    user_id: 'user-demo-123',
    category_id: 'cat-rent',
    amount: 85000,
    transaction_date: '2025-04-01',
    memo: '4月分家賃',
    created_at: '2025-04-01T08:00:00Z',
    updated_at: '2025-04-01T08:00:00Z'
  },
  {
    id: 'exp-2025-04-002',
    user_id: 'user-demo-123',
    category_id: 'cat-food',
    amount: 42180,
    transaction_date: '2025-04-30',
    memo: '4月の食費合計',
    created_at: '2025-04-30T23:59:00Z',
    updated_at: '2025-04-30T23:59:00Z'
  },
  {
    id: 'exp-2025-04-003',
    user_id: 'user-demo-123',
    category_id: 'cat-health',
    amount: 3200,
    transaction_date: '2025-04-20',
    memo: '定期健康診断',
    created_at: '2025-04-20T15:00:00Z',
    updated_at: '2025-04-20T15:00:00Z'
  }
]

// デモ収入レコード
export const demoIncomeRecords: IncomeRecord[] = [
  {
    id: 'inc-2025-06-001',
    user_id: 'user-demo-123',
    amount: 280000,
    transaction_date: '2025-06-25',
    source: '給与（6月分）',
    memo: '基本給 + 残業代',
    is_recurring: true,
    template_id: 'inc-template-salary',
    created_at: '2025-06-25T09:00:00Z',
    updated_at: '2025-06-25T09:00:00Z'
  },
  {
    id: 'inc-2025-06-002',
    user_id: 'user-demo-123',
    amount: 45000,
    transaction_date: '2025-06-15',
    source: '副業（Web制作）',
    memo: 'クライアントA案件',
    is_recurring: false,
    created_at: '2025-06-15T17:30:00Z',
    updated_at: '2025-06-15T17:30:00Z'
  },
  {
    id: 'inc-2025-05-001',
    user_id: 'user-demo-123',
    amount: 275000,
    transaction_date: '2025-05-25',
    source: '給与（5月分）',
    memo: '基本給のみ',
    is_recurring: true,
    template_id: 'inc-template-salary',
    created_at: '2025-05-25T09:00:00Z',
    updated_at: '2025-05-25T09:00:00Z'
  },
  {
    id: 'inc-2025-05-002',
    user_id: 'user-demo-123',
    amount: 28000,
    transaction_date: '2025-05-10',
    source: '副業（Web制作）',
    memo: 'クライアントB案件',
    is_recurring: false,
    created_at: '2025-05-10T20:00:00Z',
    updated_at: '2025-05-10T20:00:00Z'
  },
  {
    id: 'inc-2025-04-001',
    user_id: 'user-demo-123',
    amount: 285000,
    transaction_date: '2025-04-25',
    source: '給与（4月分）',
    memo: '基本給 + 賞与',
    is_recurring: true,
    template_id: 'inc-template-salary',
    created_at: '2025-04-25T09:00:00Z',
    updated_at: '2025-04-25T09:00:00Z'
  },
  {
    id: 'inc-2025-04-002',
    user_id: 'user-demo-123',
    amount: 15000,
    transaction_date: '2025-04-05',
    source: 'その他収入',
    memo: 'メルカリ売上',
    is_recurring: false,
    created_at: '2025-04-05T12:00:00Z',
    updated_at: '2025-04-05T12:00:00Z'
  }
]

// デモ支出テンプレート
export const demoExpenseTemplates: ExpenseTemplate[] = [
  {
    id: 'exp-template-rent',
    user_id: 'user-demo-123',
    category_id: 'cat-rent',
    name: '家賃',
    amount: 85000,
    memo: '月次家賃自動支払い',
    recurrence_type: 'monthly',
    recurrence_day: 1,
    is_active: true,
    next_due_date: '2025-07-01',
    auto_generate: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'exp-template-utilities',
    user_id: 'user-demo-123',
    category_id: 'cat-utilities',
    name: '光熱費',
    amount: 15000,
    memo: '電気・ガス・水道代',
    recurrence_type: 'monthly',
    recurrence_day: 15,
    is_active: true,
    next_due_date: '2025-07-15',
    auto_generate: false,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
]

// デモ収入テンプレート
export const demoIncomeTemplates: IncomeTemplate[] = [
  {
    id: 'inc-template-salary',
    user_id: 'user-demo-123',
    name: '給与',
    amount: 280000,
    source: '株式会社サンプル',
    memo: '月次給与',
    recurrence_type: 'monthly',
    recurrence_day: 25,
    is_active: true,
    next_due_date: '2025-07-25',
    auto_generate: false,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
]

// デモユーザー設定
export const demoUserSettings: UserSettings = {
  user_id: 'user-demo-123',
  theme: 'system',
  language: 'ja',
  default_expense_category_id: 'cat-food',
  quick_categories: ['cat-food', 'cat-transport', 'cat-entertainment'],
  notification_settings: {
    budget_alert: true,
    template_reminder: true,
    weekly_summary: false
  },
  export_settings: {
    format: 'csv',
    include_deleted: false
  },
  created_at: '2025-01-15T09:30:00Z',
  updated_at: '2025-06-01T10:30:00Z'
}

// 便利な関数：現在月のデータを取得
export function getCurrentMonthExpenses(): ExpenseRecord[] {
  const currentMonth = '2025-06'
  return demoExpenseRecords.filter(record => 
    record.transaction_date.startsWith(currentMonth)
  )
}

export function getCurrentMonthIncomes(): IncomeRecord[] {
  const currentMonth = '2025-06'
  return demoIncomeRecords.filter(record => 
    record.transaction_date.startsWith(currentMonth)
  )
}

// 月次サマリーを計算する関数
export function calculateMonthlySummary(month: string) {
  const monthExpenses = demoExpenseRecords.filter(record => 
    record.transaction_date.startsWith(month)
  )
  const monthIncomes = demoIncomeRecords.filter(record => 
    record.transaction_date.startsWith(month)
  )
  
  const totalExpense = monthExpenses.reduce((sum, record) => sum + record.amount, 0)
  const totalIncome = monthIncomes.reduce((sum, record) => sum + record.amount, 0)
  
  return {
    month,
    total_income: totalIncome,
    total_expense: totalExpense,
    net_amount: totalIncome - totalExpense
  }
}

// カテゴリ別支出を取得
export function getExpensesByCategory(month: string) {
  const monthExpenses = demoExpenseRecords.filter(record => 
    record.transaction_date.startsWith(month)
  )
  
  const categoryTotals = new Map<string, number>()
  
  monthExpenses.forEach(expense => {
    const current = categoryTotals.get(expense.category_id) || 0
    categoryTotals.set(expense.category_id, current + expense.amount)
  })
  
  return Array.from(categoryTotals.entries()).map(([categoryId, amount]) => {
    const category = demoCategories.find(c => c.id === categoryId)
    return {
      category_id: categoryId,
      category_name: category?.name || '不明',
      amount,
      budget: category?.monthly_budget,
      over_budget: category?.monthly_budget ? amount > category.monthly_budget : false
    }
  })
} 