import type { AccessMethod } from '@/types/auth'

export class AccessDetector {
  /**
   * ブラウザアクセスかLINEアプリアクセスかを判定
   */
  static detectAccessMethod(): AccessMethod {
    if (typeof window === 'undefined') return 'browser'
    
    const userAgent = window.navigator.userAgent
    
    // LINEアプリ内ブラウザの判定
    if (userAgent.includes('Line/')) {
      return 'line'
    }
    
    // LIFF環境の判定
    if (process.env.NEXT_PUBLIC_LIFF_ID && 
        (window.location.hostname.includes('liff') || 
         window.location.hostname.includes('localhost'))) {
      return 'line'
    }
    
    return 'browser'
  }
  
  /**
   * LIFF環境かどうかを判定
   */
  static isLiffEnvironment(): boolean {
    return this.detectAccessMethod() === 'line'
  }
  
  /**
   * モバイルデバイスかどうかを判定
   */
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    )
  }
  
  /**
   * 開発環境でのLIFFモック使用判定
   */
  static shouldUseLiffMock(): boolean {
    return process.env.NEXT_PUBLIC_LIFF_MOCK_ENABLED === 'true'
  }
} 