// アプリケーション情報
export const APP_NAME = 'MoneyFlow'
export const APP_VERSION = '1.0.0'

// 日付・時間関連
export const DEFAULT_TIMEZONE = 'Asia/Tokyo'
export const DEFAULT_CURRENCY = 'JPY'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

// バリデーション制限
export const VALIDATION = {
  AMOUNT: {
    MIN: 1,
    MAX: 9999999
  },
  CATEGORY_NAME: {
    MAX_LENGTH: 20
  },
  MEMO: {
    MAX_LENGTH: 200
  },
  TEMPLATE_NAME: {
    MAX_LENGTH: 50
  },
  INCOME_SOURCE: {
    MAX_LENGTH: 50
  }
} as const

// デフォルト予算設定
export const DEFAULT_BUDGET_RESET_DAY = 1

// ページング設定
export const PAGINATION = {
  DEFAULT_PER_PAGE: 50,
  MAX_PER_PAGE: 100
} as const

// アイコン設定（Lucideアイコン名）
export const CATEGORY_ICONS = [
  'UtensilsCrossed', // 食べ物
  'Car', // 交通
  'Gamepad2', // 娯楽
  'ShoppingCart', // 買い物
  'Zap', // 電気
  'Home', // 家
  'Heart', // 健康
  'Book', // 教育
  'Plane', // 旅行
  'Gift', // ギフト
  'Coffee', // カフェ
  'Fuel', // 燃料
  'Phone', // 電話
  'Wifi', // インターネット
  'Dumbbell', // 運動
  'Shirt', // 衣類
  'Scissors', // 美容
  'PawPrint', // ペット
  'Banknote', // 給与
  'Laptop', // 仕事
  'Plus' // その他
] as const

// カテゴリ色設定
export const CATEGORY_COLORS = [
  '#FF6B6B', // 赤
  '#4ECDC4', // ターコイズ
  '#45B7D1', // 青
  '#96CEB4', // 緑
  '#FFEAA7', // 黄
  '#DDA0DD', // 薄紫
  '#FF69B4', // ピンク
  '#6C5CE7', // 紫
  '#A29BFE', // 薄青紫
  '#00B894', // エメラルド
  '#E17055', // オレンジ
  '#74B9FF'  // 空色
] as const

// テーマ設定
export const THEMES = ['light', 'dark', 'system'] as const
export const LANGUAGES = ['ja', 'en'] as const

// 繰り返し設定
export const RECURRENCE_TYPES = [
  { value: 'monthly', label: '毎月' },
  { value: 'bimonthly', label: '隔月' },
  { value: 'yearly', label: '毎年' }
] as const

// ソート設定
export const EXPENSE_SORT_OPTIONS = [
  { value: 'transaction_date', label: '取引日' },
  { value: 'amount', label: '金額' },
  { value: 'category_name', label: 'カテゴリ' },
  { value: 'created_at', label: '作成日' }
] as const

export const INCOME_SORT_OPTIONS = [
  { value: 'transaction_date', label: '取引日' },
  { value: 'amount', label: '金額' },
  { value: 'source', label: '収入源' },
  { value: 'created_at', label: '作成日' }
] as const

// 期間フィルタープリセット
export const DATE_FILTER_PRESETS = [
  { value: 'today', label: '今日' },
  { value: 'this_week', label: '今週' },
  { value: 'this_month', label: '今月' },
  { value: 'last_month', label: '先月' },
  { value: 'this_year', label: '今年' },
  { value: 'last_year', label: '昨年' },
  { value: 'custom', label: 'カスタム' }
] as const

// レポート形式
export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' }
] as const

// ローカルストレージキー
export const LOCAL_STORAGE_KEYS = {
  USER: 'moneyflow_user',
  SETTINGS: 'moneyflow_settings',
  EXPENSES: 'moneyflow_expenses',
  INCOMES: 'moneyflow_incomes',
  CATEGORIES: 'moneyflow_categories',
  TEMPLATES: 'moneyflow_templates',
  DELETED_ITEMS: 'moneyflow_deleted_items',
  LINE_PROFILE: 'moneyflow_line_profile'
} as const

// 認証プロバイダー
export const AUTH_PROVIDERS = [
  { value: 'email', label: 'メール', icon: 'Mail' },
  { value: 'google', label: 'Google', icon: 'Chrome' },
  { value: 'github', label: 'GitHub', icon: 'Github' },
  { value: 'line', label: 'LINE', icon: 'MessageCircle' }
] as const

// 通知設定
export const NOTIFICATION_TYPES = {
  BUDGET_ALERT: 'budget_alert',
  TEMPLATE_REMINDER: 'template_reminder',
  WEEKLY_SUMMARY: 'weekly_summary'
} as const

// 予算アラート閾値
export const BUDGET_ALERT_THRESHOLDS = [
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
  { value: 110, label: '110%' }
] as const

// チャート関連
export const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#FF69B4', '#6C5CE7',
  '#A29BFE', '#00B894', '#E17055', '#74B9FF'
] as const

// デフォルトカテゴリ設定
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: '食費', icon: 'UtensilsCrossed', color: '#FF6B6B', budget: 50000 },
  { name: '交通費', icon: 'Car', color: '#4ECDC4', budget: 15000 },
  { name: '娯楽', icon: 'Gamepad2', color: '#45B7D1', budget: 20000 },
  { name: '日用品', icon: 'ShoppingCart', color: '#96CEB4', budget: 12000 },
  { name: '光熱費', icon: 'Zap', color: '#FFEAA7', budget: 18000 }
] as const

export const DEFAULT_INCOME_CATEGORIES = [
  { name: '給与', icon: 'Banknote', color: '#6C5CE7' },
  { name: '副業', icon: 'Laptop', color: '#A29BFE' },
  { name: 'その他収入', icon: 'Plus', color: '#00B894' }
] as const

// APIエラーメッセージ
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました。',
  UNAUTHORIZED: '認証が必要です。',
  FORBIDDEN: 'アクセス権限がありません。',
  NOT_FOUND: '指定されたデータが見つかりません。',
  VALIDATION_ERROR: '入力内容にエラーがあります。',
  SERVER_ERROR: 'サーバーエラーが発生しました。',
  UNKNOWN_ERROR: '不明なエラーが発生しました。'
} as const

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  EXPENSE_CREATED: '支出を登録しました。',
  EXPENSE_UPDATED: '支出を更新しました。',
  EXPENSE_DELETED: '支出を削除しました。',
  INCOME_CREATED: '収入を登録しました。',
  INCOME_UPDATED: '収入を更新しました。',
  INCOME_DELETED: '収入を削除しました。',
  CATEGORY_CREATED: 'カテゴリを作成しました。',
  CATEGORY_UPDATED: 'カテゴリを更新しました。',
  CATEGORY_DELETED: 'カテゴリを削除しました。',
  SETTINGS_UPDATED: '設定を更新しました。'
} as const 