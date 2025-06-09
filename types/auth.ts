import { User, Session } from '@supabase/supabase-js'

// LINE プロファイル型
export interface LineProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

// アプリ内ユーザー型（Supabase authユーザーを拡張）
export interface AppUser extends User {
  user_metadata: {
    display_name?: string
    avatar_url?: string
    line_user_id?: string
    auth_provider?: 'email' | 'google' | 'github' | 'line'
  }
}

// 認証コンテキスト型
export interface AuthContextType {
  user: AppUser | null
  session: Session | null
  lineProfile: LineProfile | null
  isLoading: boolean
  accessMethod: 'browser' | 'line'
  
  // 認証メソッド
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signInWithLine: () => Promise<void>
  signOut: () => Promise<void>
}

// アクセス検出結果型
export type AccessMethod = 'browser' | 'line'

// 認証エラー型
export interface AuthError {
  message: string
  code?: string
} 