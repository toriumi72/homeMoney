import liff from '@line/liff'
import type { LineProfile } from '@/types/auth'
import { mockLiffInterface } from './liff-mock'

export class LiffClient {
  private static instance: LiffClient
  private isInitialized = false

  static getInstance(): LiffClient {
    if (!LiffClient.instance) {
      LiffClient.instance = new LiffClient()
    }
    return LiffClient.instance
  }

  /**
   * LIFF初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    const liffId = process.env.NEXT_PUBLIC_LIFF_ID
    if (!liffId) {
      throw new Error('LIFF_ID is required for LINE authentication')
    }

    try {
      // 開発環境でのモック設定
      if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
        await this.initializeMock(liffId)
      } else {
        await liff.init({ liffId })
      }

      this.isInitialized = true
      console.log('LIFF initialized successfully')
    } catch (error) {
      console.error('LIFF initialization failed:', error)
      throw error
    }
  }

  /**
   * 開発環境用のモック初期化
   */
  private async initializeMock(liffId: string): Promise<void> {
    try {
      console.log('🧪 Initializing LIFF with mock implementation')
      
      // 自前のモック実装を使用
      await mockLiffInterface.init({ liffId })
      
      console.log('🧪 LIFF Mock initialized successfully')
    } catch (error) {
      console.warn('Mock initialization failed, using basic LIFF:', error)
      await liff.init({ liffId })
    }
  }

  /**
   * LINEプロファイル取得
   */
  async getProfile(): Promise<LineProfile> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      // モックモードの場合はモック実装を使用
      if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
        const profile = await mockLiffInterface.getProfile()
        return {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
        }
      }

      // 本番環境では実際のLIFF APIを使用
      const profile = await liff.getProfile()
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      }
    } catch (error) {
      console.error('Failed to get LINE profile:', error)
      throw new Error('LINEプロファイルの取得に失敗しました')
    }
  }

  /**
   * ログイン状態確認
   */
  isLoggedIn(): boolean {
    if (!this.isInitialized) return false
    
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      return mockLiffInterface.isLoggedIn()
    }
    
    return liff.isLoggedIn()
  }

  /**
   * LINEログイン実行
   */
  async login(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      mockLiffInterface.login()
      return
    }

    if (!liff.isLoggedIn()) {
      liff.login()
    }
  }

  /**
   * アクセストークン取得
   */
  getAccessToken(): string {
    if (!this.isInitialized) {
      throw new Error('LIFF not initialized')
    }
    
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      return mockLiffInterface.getAccessToken()
    }
    
    return liff.getAccessToken() || 'mock-token'
  }

  /**
   * LIFF環境確認
   */
  isInClient(): boolean {
    if (!this.isInitialized) return false
    
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      return mockLiffInterface.isInClient()
    }
    
    return liff.isInClient()
  }

  /**
   * LINEアプリで開く
   */
  openInApp(): void {
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true') {
      mockLiffInterface.openWindow({
        url: window.location.href,
        external: false
      })
      return
    }

    if (this.isInClient()) {
      liff.openWindow({
        url: window.location.href,
        external: false
      })
    }
  }
}

export const liffClient = LiffClient.getInstance() 