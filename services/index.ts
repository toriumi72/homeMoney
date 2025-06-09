// データアクセスサービスの統合エクスポート
// 将来的にSupabaseに切り替える際は、この部分を変更するだけで済む

import { IExpenseService } from './interfaces/expense-service'
import { ICategoryService } from './interfaces/category-service'
import { IIncomeService } from './interfaces/income-service'

import { DemoExpenseService } from './demo/demo-expense-service'
import { DemoCategoryService } from './demo/demo-category-service'

// 現在の実装を選択（デモ or Supabase）
const USE_DEMO_DATA = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SUPABASE_URL

// サービスインスタンスの作成
export const expenseService: IExpenseService = USE_DEMO_DATA 
  ? new DemoExpenseService()
  : new DemoExpenseService() // 後でSupabaseExpenseService()に変更

export const categoryService: ICategoryService = USE_DEMO_DATA
  ? new DemoCategoryService()
  : new DemoCategoryService() // 後でSupabaseCategoryService()に変更

// TODO: 収入サービス実装後に追加
// export const incomeService: IIncomeService = USE_DEMO_DATA
//   ? new DemoIncomeService()
//   : new SupabaseIncomeService()

// 便利な関数エクスポート
export * from './interfaces/expense-service'
export * from './interfaces/category-service'
export * from './interfaces/income-service'

// 設定の確認用
export const getServiceInfo = () => ({
  isUsingDemoData: USE_DEMO_DATA,
  environment: process.env.NODE_ENV,
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL
}) 