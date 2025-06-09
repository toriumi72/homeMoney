import { Category, CategoryFormData } from '@/types'

// カテゴリデータアクセスサービスのインターフェース
export interface ICategoryService {
  // 基本CRUD操作
  getAll(): Promise<Category[]>
  getById(id: string): Promise<Category | null>
  create(category: CategoryFormData): Promise<Category>
  update(id: string, category: Partial<Category>): Promise<Category>
  delete(id: string): Promise<void>
  
  // フィルター・検索
  getByType(type: 'expense' | 'income' | 'both'): Promise<Category[]>
  getExpenseCategories(): Promise<Category[]>
  getIncomeCategories(): Promise<Category[]>
  getActive(): Promise<Category[]>
  
  // ソート・並び替え
  getBySortOrder(): Promise<Category[]>
  updateSortOrder(categoryIds: string[]): Promise<void>
  
  // 統計・使用状況
  getCategoryUsage(categoryId: string): Promise<{ transactionCount: number; totalAmount: number }>
  getUnusedCategories(): Promise<Category[]>
  
  // デフォルトカテゴリ
  createDefaultCategories(): Promise<Category[]>
} 