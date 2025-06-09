import { Category, CategoryFormData } from '@/types'
import { ICategoryService } from '../interfaces/category-service'
import { demoCategories, demoExpenseRecords } from '@/data/demo-data'
import { generateId } from '@/lib/utils'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/constants'

export class DemoCategoryService implements ICategoryService {
  private categories: Category[] = [...demoCategories]

  async getAll(): Promise<Category[]> {
    return [...this.categories]
  }

  async getById(id: string): Promise<Category | null> {
    const category = this.categories.find(c => c.id === id)
    return category ? { ...category } : null
  }

  async create(categoryData: CategoryFormData): Promise<Category> {
    const now = new Date().toISOString()
    const maxSortOrder = Math.max(...this.categories
      .filter(c => c.type === categoryData.type)
      .map(c => c.sort_order), 0)

    const newCategory: Category = {
      id: generateId(),
      user_id: 'user-demo-123', // デモ用固定値
      name: categoryData.name,
      icon: categoryData.icon,
      color: categoryData.color,
      type: categoryData.type,
      monthly_budget: categoryData.monthly_budget,
      sort_order: maxSortOrder + 1,
      is_active: true,
      created_at: now,
      updated_at: now
    }

    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`)
    }

    const updatedCategory = {
      ...this.categories[index],
      ...updates,
      updated_at: new Date().toISOString()
    }

    this.categories[index] = updatedCategory
    return { ...updatedCategory }
  }

  async delete(id: string): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`)
    }

    this.categories.splice(index, 1)
  }

  async getByType(type: 'expense' | 'income' | 'both'): Promise<Category[]> {
    return this.categories.filter(c => 
      c.type === type || c.type === 'both'
    )
  }

  async getExpenseCategories(): Promise<Category[]> {
    return this.categories.filter(c => 
      c.type === 'expense' || c.type === 'both'
    )
  }

  async getIncomeCategories(): Promise<Category[]> {
    return this.categories.filter(c => 
      c.type === 'income' || c.type === 'both'
    )
  }

  async getActive(): Promise<Category[]> {
    return this.categories.filter(c => c.is_active)
  }

  async getBySortOrder(): Promise<Category[]> {
    const sorted = [...this.categories]
    return sorted.sort((a, b) => a.sort_order - b.sort_order)
  }

  async updateSortOrder(categoryIds: string[]): Promise<void> {
    categoryIds.forEach((id, index) => {
      const category = this.categories.find(c => c.id === id)
      if (category) {
        category.sort_order = index + 1
        category.updated_at = new Date().toISOString()
      }
    })
  }

  async getCategoryUsage(categoryId: string): Promise<{ transactionCount: number; totalAmount: number }> {
    const expenses = demoExpenseRecords.filter(e => e.category_id === categoryId)
    
    return {
      transactionCount: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0)
    }
  }

  async getUnusedCategories(): Promise<Category[]> {
    const usedCategoryIds = new Set(demoExpenseRecords.map(e => e.category_id))
    return this.categories.filter(c => !usedCategoryIds.has(c.id))
  }

  async createDefaultCategories(): Promise<Category[]> {
    const now = new Date().toISOString()
    const newCategories: Category[] = []

    // デフォルト支出カテゴリを作成
    DEFAULT_EXPENSE_CATEGORIES.forEach((defaultCat, index) => {
      const category: Category = {
        id: generateId(),
        user_id: 'user-demo-123',
        name: defaultCat.name,
        icon: defaultCat.icon,
        color: defaultCat.color,
        type: 'expense',
        monthly_budget: defaultCat.budget,
        sort_order: index + 1,
        is_active: true,
        created_at: now,
        updated_at: now
      }
      newCategories.push(category)
    })

    // デフォルト収入カテゴリを作成
    DEFAULT_INCOME_CATEGORIES.forEach((defaultCat, index) => {
      const category: Category = {
        id: generateId(),
        user_id: 'user-demo-123',
        name: defaultCat.name,
        icon: defaultCat.icon,
        color: defaultCat.color,
        type: 'income',
        monthly_budget: undefined,
        sort_order: index + 1,
        is_active: true,
        created_at: now,
        updated_at: now
      }
      newCategories.push(category)
    })

    this.categories.push(...newCategories)
    return [...newCategories]
  }
} 