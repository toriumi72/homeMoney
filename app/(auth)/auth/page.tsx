'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { AccessDetector } from '@/lib/auth/access-detector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Github, Chrome, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const { 
    user, 
    isLoading,
    accessMethod,
    lineProfile,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signInWithLine
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // 既にログイン済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (user) {
    return null // リダイレクト処理中
  }

  const handleEmailAuth = async (mode: 'signin' | 'signup') => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    setError('')
    setAuthLoading(true)

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
    } catch (error: unknown) {
      setError((error as Error).message || '認証に失敗しました')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'github' | 'line') => {
    setError('')
    setAuthLoading(true)

    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          break
        case 'github':
          await signInWithGithub()
          break
        case 'line':
          if (!AccessDetector.isLiffEnvironment() && !AccessDetector.shouldUseLiffMock()) {
            setError('LINE認証はLINEアプリ内でのみ利用可能です')
            return
          }
          await signInWithLine()
          break
      }
    } catch (error: unknown) {
      setError((error as Error).message || '認証に失敗しました')
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
          💰
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          MoneyFlow
        </CardTitle>
        <CardDescription className="text-lg">
          {accessMethod === 'line' ? 'LINEでログイン' : 'アカウントにログイン'}
        </CardDescription>
      </CardHeader>
        <CardContent>
          {/* アクセス方法の表示 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              アクセス方法: {accessMethod === 'line' ? '📱 LINE アプリ' : '🌐 ブラウザ'}
              {AccessDetector.shouldUseLiffMock() && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  🧪 MOCK モード
                </span>
              )}
            </p>
            {lineProfile && (
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                <span>👤</span>
                LINEプロファイル: {lineProfile.displayName}
              </p>
            )}
          </div>

          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* LINE環境の場合はLINE認証のみ表示 */}
          {accessMethod === 'line' ? (
            <div className="space-y-4">
              <Button 
                onClick={() => handleSocialAuth('line')}
                disabled={authLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                LINEでログイン
              </Button>

              {AccessDetector.shouldUseLiffMock() && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-700 flex items-center gap-2">
                    <span>⚠️</span>
                    <strong>開発モード:</strong> モックユーザーでテストログインが実行されます
                  </p>
                </div>
              )}
            </div>
          ) : (
            // ブラウザ環境の場合は全ての認証方法を表示
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">ログイン</TabsTrigger>
                <TabsTrigger value="signup">新規登録</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('signin')}
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl font-medium"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  メールでログイン
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">メールアドレス</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">パスワード</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6文字以上のパスワード"
                  />
                </div>
                <Button 
                  onClick={() => handleEmailAuth('signup')}
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl font-medium"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  新規登録
                </Button>
              </TabsContent>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm text-gray-500 mb-4">
                  または
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialAuth('google')}
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl font-medium hover:shadow-md transition-shadow"
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Googleでログイン
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialAuth('github')}
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl font-medium hover:shadow-md transition-shadow"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHubでログイン
                  </Button>
                </div>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
  )
} 