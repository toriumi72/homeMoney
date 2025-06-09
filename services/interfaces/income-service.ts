import { IncomeRecord, IncomeFilter, SortConfig, IncomeSortField, PaginatedResponse } from '@/types'

// 収入データアクセスサービスのインターフェース
export interface IIncomeService {
  // 基本CRUD操作
  getAll(): Promise<IncomeRecord[]>
  getById(id: string): Promise<IncomeRecord | null>
  create(income: Omit<IncomeRecord, 'id' | 'created_at' | 'updated_at'>): Promise<IncomeRecord>
  update(id: string, income: Partial<IncomeRecord>): Promise<IncomeRecord>
  delete(id: string): Promise<void>
  
  // フィルター・検索
  getByFilter(filter: IncomeFilter): Promise<IncomeRecord[]>
  getByDateRange(startDate: string, endDate: string): Promise<IncomeRecord[]>
  getBySource(source: string): Promise<IncomeRecord[]>
  getRecurring(): Promise<IncomeRecord[]>
  getByKeyword(keyword: string): Promise<IncomeRecord[]>
  
  // ソート・ページング
  getWithSort(sortConfig: SortConfig<IncomeSortField>): Promise<IncomeRecord[]>
  getPaginated(page: number, perPage: number, filter?: IncomeFilter, sort?: SortConfig<IncomeSortField>): Promise<PaginatedResponse<IncomeRecord>>
  
  // 集計・分析
  getTotalByMonth(month: string): Promise<number>
  getTotalBySource(source: string, month?: string): Promise<number>
  getRecentTransactions(limit: number): Promise<IncomeRecord[]>
  
  // 月次データ
  getCurrentMonthIncomes(): Promise<IncomeRecord[]>
  getIncomesByMonth(month: string): Promise<IncomeRecord[]>
} 