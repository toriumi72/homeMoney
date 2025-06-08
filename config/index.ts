// 環境設定
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
} as const

// Supabase設定
export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
} as const

// LIFF設定（LINE連携）
export const LIFF_CONFIG = {
  LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID || '',
  MOCK_ENABLED: process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true',
  TEST_LINE_USER_ID: process.env.NEXT_PUBLIC_TEST_LINE_USER_ID || 'test-user'
} as const

// OAuth設定
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || ''
} as const

// アプリケーション設定
export const APP_CONFIG = {
  NAME: 'MoneyFlow',
  VERSION: '1.0.0',
  DESCRIPTION: 'シンプルで使いやすい家計簿アプリ',
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  DEFAULT_LOCALE: 'ja',
  SUPPORTED_LOCALES: ['ja', 'en']
} as const

// ストレージ設定
export const STORAGE_CONFIG = {
  // Supabase Storage設定
  BUCKET_NAME: 'receipts',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // LocalStorage設定
  LOCAL_STORAGE_PREFIX: 'moneyflow_',
  SESSION_STORAGE_PREFIX: 'moneyflow_session_'
} as const

// API設定
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 30000, // 30秒
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000 // 1秒
} as const

// PWA設定
export const PWA_CONFIG = {
  ENABLED: true,
  SERVICE_WORKER_PATH: '/sw.js',
  CACHE_NAMES: {
    STATIC: 'moneyflow-static',
    DYNAMIC: 'moneyflow-dynamic',
    IMAGES: 'moneyflow-images'
  }
} as const

// セキュリティ設定
export const SECURITY_CONFIG = {
  // CSRF対策
  CSRF_TOKEN_NAME: 'x-csrf-token',
  
  // セッション設定
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24時間
  
  // 暗号化設定
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  
  // CORS設定
  ALLOWED_ORIGINS: ENV.IS_PRODUCTION 
    ? ['https://moneyflow.app'] 
    : ['http://localhost:3000']
} as const

// チャート設定
export const CHART_CONFIG = {
  COLORS: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#FF69B4', '#6C5CE7',
    '#A29BFE', '#00B894', '#E17055', '#74B9FF'
  ],
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'easeInOut'
  },
  RESPONSIVE: {
    BREAKPOINTS: {
      MOBILE: 768,
      TABLET: 1024,
      DESKTOP: 1280
    }
  }
} as const

// 通知設定
export const NOTIFICATION_CONFIG = {
  // Push通知設定
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  
  // デフォルト通知設定
  DEFAULT_SETTINGS: {
    budget_alert: true,
    template_reminder: true,
    weekly_summary: false,
    push_notifications: false
  },
  
  // 通知タイミング設定
  TIMING: {
    BUDGET_ALERT_THRESHOLD: [80, 90, 100, 110], // パーセンテージ
    TEMPLATE_REMINDER_DAYS_BEFORE: 1, // 1日前
    WEEKLY_SUMMARY_DAY: 0 // 日曜日（0=日曜、6=土曜）
  }
} as const

// ログ設定
export const LOG_CONFIG = {
  LEVEL: ENV.IS_DEVELOPMENT ? 'debug' : 'info',
  ENABLE_CONSOLE: ENV.IS_DEVELOPMENT,
  ENABLE_REMOTE: ENV.IS_PRODUCTION,
  MAX_LOG_SIZE: 1000 // ローカルログの最大件数
} as const

// パフォーマンス設定
export const PERFORMANCE_CONFIG = {
  // 仮想スクロール設定
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 80, // px
    BUFFER_SIZE: 5, // 画面外にレンダリングする項目数
    OVERSCAN: 3 // 追加でレンダリングする項目数
  },
  
  // 画像最適化設定
  IMAGE_OPTIMIZATION: {
    QUALITY: 80,
    FORMATS: ['webp', 'jpeg'],
    SIZES: [240, 480, 720, 1080]
  },
  
  // キャッシュ設定
  CACHE: {
    STATIC_MAX_AGE: 31536000, // 1年
    DYNAMIC_MAX_AGE: 86400, // 1日
    API_MAX_AGE: 300 // 5分
  }
} as const

// 機能フラグ設定
export const FEATURE_FLAGS = {
  // 開発中機能
  ENABLE_ADVANCED_CHARTS: ENV.IS_DEVELOPMENT,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_EXPORT_PDF: true,
  ENABLE_DARK_MODE: true,
  
  // 実験的機能
  ENABLE_LLM_AUTO_INPUT: false,
  ENABLE_MULTI_CURRENCY: false,
  ENABLE_FAMILY_SHARING: false,
  
  // LINE連携機能
  ENABLE_LINE_LOGIN: true,
  ENABLE_LINE_MESSAGING: false
} as const

// バックアップ・同期設定
export const SYNC_CONFIG = {
  // 自動同期設定
  AUTO_SYNC_ENABLED: true,
  SYNC_INTERVAL: 5 * 60 * 1000, // 5分
  
  // バックアップ設定
  AUTO_BACKUP_ENABLED: true,
  BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24時間
  MAX_BACKUP_COUNT: 30, // 30個まで保持
  
  // 競合解決設定
  CONFLICT_RESOLUTION: 'server_wins' as 'server_wins' | 'client_wins' | 'manual'
} as const

// 開発・デバッグ設定
export const DEBUG_CONFIG = {
  ENABLE_REDUX_DEVTOOLS: ENV.IS_DEVELOPMENT,
  ENABLE_REACT_QUERY_DEVTOOLS: ENV.IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: ENV.IS_PRODUCTION,
  LOG_API_CALLS: ENV.IS_DEVELOPMENT,
  MOCK_API_ENABLED: process.env.NEXT_PUBLIC_MOCK_API_ENABLED === 'true'
} as const

// 設定の妥当性検証
export function validateConfig() {
  const errors: string[] = []
  
  if (!SUPABASE_CONFIG.URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  
  if (!SUPABASE_CONFIG.ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
  
  if (FEATURE_FLAGS.ENABLE_LINE_LOGIN && !LIFF_CONFIG.LIFF_ID) {
    errors.push('NEXT_PUBLIC_LIFF_ID is required when LINE login is enabled')
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
  
  return true
}

// 設定のエクスポート
export const config = {
  env: ENV,
  app: APP_CONFIG,
  supabase: SUPABASE_CONFIG,
  liff: LIFF_CONFIG,
  oauth: OAUTH_CONFIG,
  storage: STORAGE_CONFIG,
  api: API_CONFIG,
  pwa: PWA_CONFIG,
  security: SECURITY_CONFIG,
  chart: CHART_CONFIG,
  notification: NOTIFICATION_CONFIG,
  log: LOG_CONFIG,
  performance: PERFORMANCE_CONFIG,
  features: FEATURE_FLAGS,
  sync: SYNC_CONFIG,
  debug: DEBUG_CONFIG
} as const

export default config 