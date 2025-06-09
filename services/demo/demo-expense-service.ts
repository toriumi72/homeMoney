import { ExpenseRecord, ExpenseFilter, SortConfig, ExpenseSortField, PaginatedResponse } from '@/types'
import { IExpenseService } from '../interfaces/expense-service'
import { demoExpenseRecords, demoCategories } from '@/data/demo-data'
import { generateId } from '@/lib/utils'

export class DemoExpenseService implements IExpenseService {
  private expenses: ExpenseRecord[] = [...demoExpenseRecords]

  async getAll(): Promise<ExpenseRecord[]> {
    return [...this.expenses]
  }

  async getById(id: string): Promise<ExpenseRecord | null> {
    const expense = this.expenses.find(e => e.id === id)
    return expense ? { ...expense } : null
  }

  async create(expenseData: Omit<ExpenseRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ExpenseRecord> {
    const now = new Date().toISOString()
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: generateId(),
      created_at: now,
      updated_at: now
    }
    
    this.expenses.push(newExpense)
    return { ...newExpense }
  }

  async update(id: string, updates: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
    const index = this.expenses.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error(`Expense with id ${id} not found`)
    }

    const updatedExpense = {
      ...this.expenses[index],
      ...updates,
      updated_at: new Date().toISOString()
    }

    this.expenses[index] = updatedExpense
    return { ...updatedExpense }
  }

  async delete(id: string): Promise<void> {
    const index = this.expenses.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error(`Expense with id ${id} not found`)
    }

    this.expenses.splice(index, 1)
  }

  async getByFilter(filter: ExpenseFilter): Promise<ExpenseRecord[]> {
    let filtered = [...this.expenses]

    // 日付範囲フィルター
    if (filter.date_from) {
      filtered = filtered.filter(e => e.transaction_date >= filter.date_from!)
    }
    if (filter.date_to) {
      filtered = filtered.filter(e => e.transaction_date <= filter.date_to!)
    }

    // カテゴリフィルター
    if (filter.category_ids && filter.category_ids.length > 0) {
      filtered = filtered.filter(e => filter.category_ids!.includes(e.category_id))
    }

    // 金額範囲フィルター
    if (filter.amount_min !== undefined) {
      filtered = filtered.filter(e => e.amount >= filter.amount_min!)
    }
    if (filter.amount_max !== undefined) {
      filtered = filtered.filter(e => e.amount <= filter.amount_max!)
    }

    // キーワード検索（メモフィールド）
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase()
      filtered = filtered.filter(e => 
        e.memo?.toLowerCase().includes(keyword) || false
      )
    }

    // タグフィルター
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(e => 
        e.tags?.some(tag => filter.tags!.includes(tag)) || false
      )
    }

    return filtered
  }

  async getByDateRange(startDate: string, endDate: string): Promise<ExpenseRecord[]> {
    return this.getByFilter({ date_from: startDate, date_to: endDate })
  }

  async getByCategory(categoryId: string): Promise<ExpenseRecord[]> {
    return this.expenses.filter(e => e.category_id === categoryId)
  }

  async getByKeyword(keyword: string): Promise<ExpenseRecord[]> {
    return this.getByFilter({ keyword })
  }

  async getWithSort(sortConfig: SortConfig<ExpenseSortField>): Promise<ExpenseRecord[]> {
    const sorted = [...this.expenses]
    
    sorted.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortConfig.field) {
        case 'transaction_date':
          aValue = new Date(a.transaction_date).getTime()
          bValue = new Date(b.transaction_date).getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'category_name':
          const aCat = demoCategories.find(c => c.id === a.category_id)
          const bCat = demoCategories.find(c => c.id === b.category_id)
          aValue = aCat?.name || ''
          bValue = bCat?.name || ''
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (sortConfig.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return sorted
  }

  async getPaginated(
    page: number, 
    perPage: number, 
    filter?: ExpenseFilter, 
    sort?: SortConfig<ExpenseSortField>
  ): Promise<PaginatedResponse<ExpenseRecord>> {
    let data = [...this.expenses]

    // フィルター適用
    if (filter) {
      data = await this.getByFilter(filter)
    }

    // ソート適用
    if (sort) {
      const sortedExpenses = [...data]
      data = await this.getWithSort(sort)
    }

    const total = data.length
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = data.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      total,
      page,
      per_page: perPage,
      has_next: endIndex < total,
      has_prev: page > 1
    }
  }

  async getTotalByMonth(month: string): Promise<number> {
    const monthExpenses = this.expenses.filter(e => 
      e.transaction_date.startsWith(month)
    )
    return monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  }

  async getTotalByCategory(categoryId: string, month?: string): Promise<number> {
    let filtered = this.expenses.filter(e => e.category_id === categoryId)
    
    if (month) {
      filtered = filtered.filter(e => e.transaction_date.startsWith(month))
    }
    
    return filtered.reduce((sum, e) => sum + e.amount, 0)
  }

  async getRecentTransactions(limit: number): Promise<ExpenseRecord[]> {
    const sorted = await this.getWithSort({ field: 'created_at', order: 'desc' })
    return sorted.slice(0, limit)
  }

  async getCurrentMonthExpenses(): Promise<ExpenseRecord[]> {
    const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    return this.getExpensesByMonth(currentMonth)
  }

  async getExpensesByMonth(month: string): Promise<ExpenseRecord[]> {
    return this.expenses.filter(e => e.transaction_date.startsWith(month))
  }
} 