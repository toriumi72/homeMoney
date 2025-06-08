// ユーザー情報
export interface User {
  id: string; // UUID
  email?: string;
  display_name: string;
  avatar_url?: string;
  timezone: string;
  currency: string;
  budget_reset_day: number; // 1-31
  notification_enabled: boolean;
  line_user_id?: string;
  auth_provider: 'email' | 'google' | 'github' | 'line';
  is_line_linked: boolean;
  linked_at?: string; // ISO 8601
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// カテゴリ
export interface Category {
  id: string; // UUID
  user_id: string;
  name: string; // 最大20文字
  icon: string; // Lucide icon name
  color: string; // Hex color
  type: 'expense' | 'income' | 'both';
  monthly_budget?: number; // 月次予算
  sort_order: number;
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// 支出レコード
export interface ExpenseRecord {
  id: string; // UUID
  user_id: string;
  category_id: string;
  amount: number; // 正の数値
  transaction_date: string; // YYYY-MM-DD
  memo?: string; // 最大200文字
  receipt_image_url?: string;
  receipt_image_path?: string;
  template_id?: string;
  tags?: string[]; // 将来拡張用
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// 収入レコード
export interface IncomeRecord {
  id: string; // UUID
  user_id: string;
  amount: number; // 正の数値
  transaction_date: string; // YYYY-MM-DD
  source: string; // 収入源
  memo?: string; // 最大200文字
  is_recurring: boolean; // 定期収入フラグ
  template_id?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// 支出テンプレート（定期支出）
export interface ExpenseTemplate {
  id: string; // UUID
  user_id: string;
  category_id: string;
  name: string; // 最大50文字
  amount: number;
  memo?: string;
  recurrence_type: 'monthly' | 'bimonthly' | 'yearly';
  recurrence_day: number; // 1-31
  is_active: boolean;
  next_due_date?: string; // YYYY-MM-DD
  auto_generate: boolean; // 自動生成 or 通知のみ
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// 収入テンプレート（定期収入）
export interface IncomeTemplate {
  id: string; // UUID
  user_id: string;
  name: string; // 最大50文字
  amount: number;
  source: string; // 最大50文字
  memo?: string;
  recurrence_type: 'monthly' | 'bimonthly' | 'yearly';
  recurrence_day: number; // 1-31
  is_active: boolean;
  next_due_date?: string; // YYYY-MM-DD
  auto_generate: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// ユーザー設定
export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ja' | 'en';
  default_expense_category_id?: string;
  quick_categories: string[]; // クイック入力用カテゴリID配列
  notification_settings: {
    budget_alert: boolean;
    template_reminder: boolean;
    weekly_summary: boolean;
  };
  export_settings: {
    format: 'csv' | 'pdf';
    include_deleted: boolean;
  };
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// 削除されたレコード（ゴミ箱）
export interface DeletedRecord {
  id: string; // UUID
  user_id: string;
  record_type: 'expense' | 'income' | 'category';
  original_id: string;
  original_data: any; // 元のデータのJSON
  deleted_at: string; // ISO 8601
  auto_delete_at: string; // ISO 8601 (30日後)
}

// 月次サマリー（計算用）
export interface MonthlySummary {
  month: string; // YYYY-MM
  total_income: number;
  total_expense: number;
  net_amount: number; // 収支
  expense_by_category: {
    category_id: string;
    category_name: string;
    amount: number;
    budget?: number;
    over_budget: boolean;
  }[];
}

// カテゴリ別月次サマリー
export interface CategoryMonthlySummary {
  category_id: string;
  category_name: string;
  month: string; // YYYY-MM
  total_amount: number;
  transaction_count: number;
  monthly_budget?: number;
  budget_usage_percentage?: number;
}

// フィルター条件
export interface ExpenseFilter {
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  category_ids?: string[];
  amount_min?: number;
  amount_max?: number;
  keyword?: string; // メモ検索
  tags?: string[];
}

export interface IncomeFilter {
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  sources?: string[];
  amount_min?: number;
  amount_max?: number;
  keyword?: string; // メモ検索
  is_recurring?: boolean;
}

// ソート条件
export type SortOrder = 'asc' | 'desc';
export type ExpenseSortField = 'transaction_date' | 'amount' | 'category_name' | 'created_at';
export type IncomeSortField = 'transaction_date' | 'amount' | 'source' | 'created_at';

export interface SortConfig<T> {
  field: T;
  order: SortOrder;
}

// API レスポンス型
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

// フォーム用型
export interface ExpenseFormData {
  amount: number;
  transaction_date: string;
  category_id: string;
  memo?: string;
  receipt_image?: File;
  tags?: string[];
}

export interface IncomeFormData {
  amount: number;
  transaction_date: string;
  source: string;
  memo?: string;
  is_recurring?: boolean;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  monthly_budget?: number;
}

// 認証関連型
export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: any;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in: number;
  token_type: string;
  user: AuthUser;
} 