/**
 * LIFF Mock Implementation
 * 開発環境でLINE認証をテストするためのモック実装
 */

export interface MockLiffProfile {
  userId: string
  displayName: string
  pictureUrl: string
  statusMessage: string
}

export interface MockLiffConfig {
  isInClient: boolean
  isLoggedIn: boolean
  profile: MockLiffProfile
  accessToken: string
}

class LiffMock {
  private config: MockLiffConfig
  private initialized = false

  constructor() {
    this.config = {
      isInClient: true,
      isLoggedIn: true,
      profile: {
        userId: process.env.NEXT_PUBLIC_TEST_LINE_USER_ID || 'mock-user-123',
        displayName: process.env.NEXT_PUBLIC_TEST_LINE_DISPLAY_NAME || 'テストユーザー',
        pictureUrl: 'https://via.placeholder.com/150',
        statusMessage: 'テスト中です',
      },
      accessToken: 'mock-access-token-' + Date.now(),
    }
  }

  async init(config: { liffId: string }): Promise<void> {
    console.log('🧪 LIFF Mock initialized with:', {
      liffId: config.liffId,
      userId: this.config.profile.userId,
      displayName: this.config.profile.displayName,
    })
    
    this.initialized = true
    
    // 実際のLIFF初期化をシミュレート
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  isInClient(): boolean {
    return this.config.isInClient
  }

  isLoggedIn(): boolean {
    return this.config.isLoggedIn
  }

  async getProfile(): Promise<MockLiffProfile> {
    if (!this.initialized) {
      throw new Error('LIFF Mock not initialized')
    }
    
    // API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 50))
    
    return { ...this.config.profile }
  }

  getAccessToken(): string {
    if (!this.initialized) {
      throw new Error('LIFF Mock not initialized')
    }
    
    return this.config.accessToken
  }

  login(): void {
    console.log('🧪 LIFF Mock login called - already logged in')
    // モックでは常にログイン済み状態
  }

  openWindow(options: { url: string; external?: boolean }): void {
    console.log('🧪 LIFF Mock openWindow called:', options)
    // 実際の実装では何もしない（開発環境用）
  }

  // 設定更新メソッド（テスト用）
  updateConfig(newConfig: Partial<MockLiffConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('🧪 LIFF Mock config updated:', this.config)
  }

  // リセットメソッド（テスト用）
  reset(): void {
    this.initialized = false
    this.config.isLoggedIn = true
    console.log('🧪 LIFF Mock reset')
  }
}

export const liffMock = new LiffMock()

// LIFF互換インターフェース
export const mockLiffInterface = {
  init: liffMock.init.bind(liffMock),
  isInClient: liffMock.isInClient.bind(liffMock),
  isLoggedIn: liffMock.isLoggedIn.bind(liffMock),
  getProfile: liffMock.getProfile.bind(liffMock),
  getAccessToken: liffMock.getAccessToken.bind(liffMock),
  login: liffMock.login.bind(liffMock),
  openWindow: liffMock.openWindow.bind(liffMock),
} 