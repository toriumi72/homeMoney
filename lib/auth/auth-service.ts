import { createClient } from '@/lib/supabase/client'
import { liffClient } from './liff-client'
import { AccessDetector } from './access-detector'
import type { LineProfile, AuthError } from '@/types/auth'

export class AuthService {
  private supabase = createClient()

  /**
   * メール/パスワードでサインイン
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // プロフィール同期
      await this.syncUserProfile({
        auth_provider: 'email',
        email,
        display_name: email.split('@')[0],
      })

      return data
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * メール/パスワードで新規登録
   */
  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: email.split('@')[0],
            auth_provider: 'email',
          }
        }
      })

      if (error) throw error
      return data
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * Google認証でサインイン
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
      return data
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * GitHub認証でサインイン
   */
  async signInWithGithub() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error
      return data
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * LINE認証でサインイン（LIFF経由）
   */
  async signInWithLine() {
    if (!AccessDetector.isLiffEnvironment()) {
      throw new Error('LINE login is only available in LINE app')
    }

    try {
      // LIFF初期化
      await liffClient.initialize()
      
      if (!liffClient.isLoggedIn()) {
        await liffClient.login()
        return
      }

      // LINEプロファイル取得
      const profile = await liffClient.getProfile()

      // カスタムJWTトークンでSupabase認証
      // 実際の本番環境では、バックエンドでLINEアクセストークンを検証してJWTを生成
      const result = await this.signInWithCustomToken(profile)

      if ('error' in result && result.error) throw result.error

      // プロフィール同期
      await this.syncUserProfile({
        auth_provider: 'line',
        line_user_id: profile.userId,
        display_name: profile.displayName,
        avatar_url: profile.pictureUrl,
      })

      return 'data' in result ? result.data : result
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * カスタムトークンでのサインイン（LINE用）
   */
  private async signInWithCustomToken(profile: LineProfile) {
    // 開発環境ではデモユーザーとしてサインイン
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      return await this.signUpWithEmail(
        `${profile.userId}@line.demo`, 
        'demo-password-123'
      )
    }

    // 本番環境では実際のLINE認証APIを使用
    // ここでは簡素化のため、仮の実装
    return { data: null, error: new Error('LINE authentication not fully implemented yet') }
  }

  /**
   * ユーザープロフィール同期
   */
  private async syncUserProfile(profileData: {
    auth_provider: 'email' | 'google' | 'github' | 'line'
    email?: string
    line_user_id?: string
    google_user_id?: string
    display_name: string
    avatar_url?: string
  }) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) return

      // users テーブルが存在する場合の処理
      // 実際のデータベーススキーマに合わせて調整が必要
      const updateData = {
        id: user.id,
        email: profileData.email || user.email,
        display_name: profileData.display_name,
        avatar_url: profileData.avatar_url || user.user_metadata?.avatar_url,
        auth_provider: profileData.auth_provider,
        line_user_id: profileData.line_user_id,
        google_user_id: profileData.google_user_id,
        updated_at: new Date().toISOString(),
      }

      console.log('Profile sync data:', updateData)
      // 実際のDBアップサート処理はデータベース設定後に実装
    } catch (error) {
      console.error('Failed to sync user profile:', error)
    }
  }

  /**
   * サインアウト
   */
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error
      
      // LINEプロファイル情報をクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('line_profile')
      }
    } catch (error: unknown) {
      throw this.handleAuthError(error)
    }
  }

  /**
   * 現在のセッション取得
   */
  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  /**
   * 現在のユーザー取得
   */
  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  /**
   * 認証状態変更の監視
   */
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  /**
   * エラーハンドリング
   */
  private handleAuthError(error: unknown): AuthError {
    console.error('Auth error:', error)
    
    const errorObj = error as { message?: string; error_code?: string; code?: string }
    
    return {
      message: errorObj.message || '認証エラーが発生しました',
      code: errorObj.error_code || errorObj.code,
    }
  }
}

export const authService = new AuthService() 