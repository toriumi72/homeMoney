import { ExpenseRecord, ExpenseFilter, SortConfig, ExpenseSortField, PaginatedResponse } from '@/types'

// 支出データアクセスサービスのインターフェース
export interface IExpenseService {
  // 基本CRUD操作
  getAll(): Promise<ExpenseRecord[]>
  getById(id: string): Promise<ExpenseRecord | null>
  create(expense: Omit<ExpenseRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ExpenseRecord>
  update(id: string, expense: Partial<ExpenseRecord>): Promise<ExpenseRecord>
  delete(id: string): Promise<void>
  
  // フィルター・検索
  getByFilter(filter: ExpenseFilter): Promise<ExpenseRecord[]>
  getByDateRange(startDate: string, endDate: string): Promise<ExpenseRecord[]>
  getByCategory(categoryId: string): Promise<ExpenseRecord[]>
  getByKeyword(keyword: string): Promise<ExpenseRecord[]>
  
  // ソート・ページング
  getWithSort(sortConfig: SortConfig<ExpenseSortField>): Promise<ExpenseRecord[]>
  getPaginated(page: number, perPage: number, filter?: ExpenseFilter, sort?: SortConfig<ExpenseSortField>): Promise<PaginatedResponse<ExpenseRecord>>
  
  // 集計・分析
  getTotalByMonth(month: string): Promise<number>
  getTotalByCategory(categoryId: string, month?: string): Promise<number>
  getRecentTransactions(limit: number): Promise<ExpenseRecord[]>
  
  // 月次データ
  getCurrentMonthExpenses(): Promise<ExpenseRecord[]>
  getExpensesByMonth(month: string): Promise<ExpenseRecord[]>
} 