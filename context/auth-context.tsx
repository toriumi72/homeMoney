'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/lib/auth/auth-service'
import { liffClient } from '@/lib/auth/liff-client'
import { AccessDetector } from '@/lib/auth/access-detector'
import type { AuthContextType, AppUser, LineProfile, AccessMethod } from '@/types/auth'
import { Session } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessMethod, setAccessMethod] = useState<AccessMethod>('browser')

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // アクセス方法検出
        const method = AccessDetector.detectAccessMethod()
        setAccessMethod(method)

        // 既存セッション確認
        const session = await authService.getSession()
        if (session && isMounted) {
          setSession(session)
          setUser(session.user as AppUser)
        }

        // LINE環境の初期化
        if (method === 'line') {
          await initializeLine()
        }

        // 認証状態変更の監視
        const { data: { subscription } } = authService.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return

            console.log('Auth state changed:', event, session)
            setSession(session as Session | null)
            setUser((session as Session)?.user as AppUser || null)

            if (event === 'SIGNED_IN' && session) {
              // サインイン時の処理
              if (AccessDetector.isLiffEnvironment()) {
                await updateLineProfile()
              }
            } else if (event === 'SIGNED_OUT') {
              // サインアウト時の処理
              setLineProfile(null)
              if (typeof window !== 'undefined') {
                localStorage.removeItem('line_profile')
              }
            }
          }
        )

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const initializeLine = async () => {
      try {
        if (AccessDetector.shouldUseLiffMock()) {
          console.log('Initializing LINE with mock')
        }
        
        await liffClient.initialize()
        await updateLineProfile()
      } catch (error) {
        console.error('LINE initialization failed:', error)
      }
    }

    const updateLineProfile = async () => {
      try {
        if (liffClient.isLoggedIn()) {
          const profile = await liffClient.getProfile()
          setLineProfile(profile)
          
          // ローカルストレージに保存
          if (typeof window !== 'undefined') {
            localStorage.setItem('line_profile', JSON.stringify(profile))
          }
        }
      } catch (error) {
        console.error('Failed to update LINE profile:', error)
      }
    }

    const cleanup = initializeAuth()

    return () => {
      isMounted = false
      cleanup?.then(unsub => unsub?.())
    }
  }, [])

  // 認証メソッド
  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signInWithEmail(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signUpWithEmail(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      await authService.signInWithGoogle()
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGithub = async () => {
    setIsLoading(true)
    try {
      await authService.signInWithGithub()
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithLine = async () => {
    setIsLoading(true)
    try {
      await authService.signInWithLine()
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    lineProfile,
    isLoading,
    accessMethod,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signInWithLine,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 