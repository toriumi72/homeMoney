'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { AccessDetector } from '@/lib/auth/access-detector'
import { liffClient } from '@/lib/auth/liff-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Smartphone, 
  Globe, 
  User, 
  Mail,
  MessageCircle 
} from 'lucide-react'

export function AuthDemo() {
  const { 
    user, 
    session,
    lineProfile,
    isLoading,
    accessMethod,
    signOut
  } = useAuth()

  const [testResults, setTestResults] = useState<{
    accessDetection: boolean | null
    liffInitialization: boolean | null
    lineProfile: boolean | null
    authentication: boolean | null
  }>({
    accessDetection: null,
    liffInitialization: null,
    lineProfile: null,
    authentication: null,
  })

  const [testing, setTesting] = useState(false)
  const [testLogs, setTestLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runFullTest = async () => {
    setTesting(true)
    setTestLogs([])
    setTestResults({
      accessDetection: null,
      liffInitialization: null,
      lineProfile: null,
      authentication: null,
    })

    try {
      // 1. アクセス方法検出テスト
      addLog('アクセス方法検出テスト開始')
      const detectedMethod = AccessDetector.detectAccessMethod()
      const isMock = AccessDetector.shouldUseLiffMock()
      addLog(`検出結果: ${detectedMethod} (Mock: ${isMock})`)
      setTestResults(prev => ({ ...prev, accessDetection: true }))

      // 2. LIFF初期化テスト
      addLog('LIFF初期化テスト開始')
      try {
        await liffClient.initialize()
        addLog('LIFF初期化成功')
        setTestResults(prev => ({ ...prev, liffInitialization: true }))
      } catch (error) {
        addLog(`LIFF初期化失敗: ${error}`)
        setTestResults(prev => ({ ...prev, liffInitialization: false }))
      }

      // 3. LINEプロファイル取得テスト
      if (accessMethod === 'line' || AccessDetector.shouldUseLiffMock()) {
        addLog('LINEプロファイル取得テスト開始')
        try {
          const profile = await liffClient.getProfile()
          addLog(`プロファイル取得成功: ${profile.displayName}`)
          setTestResults(prev => ({ ...prev, lineProfile: true }))
        } catch (error) {
          addLog(`プロファイル取得失敗: ${error}`)
          setTestResults(prev => ({ ...prev, lineProfile: false }))
        }
      } else {
        addLog('LINEプロファイルテストをスキップ（非LINE環境）')
        setTestResults(prev => ({ ...prev, lineProfile: null }))
      }

      // 4. 認証状態確認
      addLog('認証状態確認')
      if (user) {
        addLog(`認証済みユーザー: ${user.email || 'Unknown'}`)
        setTestResults(prev => ({ ...prev, authentication: true }))
      } else {
        addLog('未認証状態')
        setTestResults(prev => ({ ...prev, authentication: false }))
      }

      addLog('全テスト完了')
    } catch (error) {
      addLog(`テスト実行エラー: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  const TestResultIcon = ({ result }: { result: boolean | null }) => {
    if (result === null) return <div className="w-5 h-5 bg-gray-200 rounded-full" />
    return result ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> :
      <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            認証システム デモ・テストページ
          </CardTitle>
          <CardDescription>
            LINEとSupabase認証の動作確認とデバッグ用ページ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 現在の状態表示 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  アクセス環境
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>アクセス方法:</span>
                  <Badge variant={accessMethod === 'line' ? 'default' : 'secondary'}>
                    {accessMethod === 'line' ? 'LINE アプリ' : 'ブラウザ'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>LIFFモック:</span>
                  <Badge variant={AccessDetector.shouldUseLiffMock() ? 'destructive' : 'outline'}>
                    {AccessDetector.shouldUseLiffMock() ? '有効' : '無効'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>モバイル:</span>
                  <Badge variant={AccessDetector.isMobileDevice() ? 'default' : 'outline'}>
                    {AccessDetector.isMobileDevice() ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  認証状態
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>ログイン状態:</span>
                  <Badge variant={user ? 'default' : 'secondary'}>
                    {user ? '認証済み' : '未認証'}
                  </Badge>
                </div>
                {user && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>ユーザーID:</span>
                      <span className="text-xs truncate max-w-32">{user.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>メール:</span>
                      <span className="text-xs">{user.email || 'N/A'}</span>
                    </div>
                  </>
                )}
                {lineProfile && (
                  <div className="flex items-center justify-between">
                    <span>LINE名:</span>
                    <span className="text-xs">{lineProfile.displayName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* テスト実行セクション */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">統合テスト実行</h3>
              <Button 
                onClick={runFullTest} 
                disabled={testing}
                variant="outline"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    テスト実行中
                  </>
                ) : (
                  'フルテスト実行'
                )}
              </Button>
            </div>

            {/* テスト結果表示 */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <TestResultIcon result={testResults.accessDetection} />
                <span className="text-sm">アクセス方法検出</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <TestResultIcon result={testResults.liffInitialization} />
                <span className="text-sm">LIFF初期化</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <TestResultIcon result={testResults.lineProfile} />
                <span className="text-sm">LINEプロファイル取得</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <TestResultIcon result={testResults.authentication} />
                <span className="text-sm">認証状態確認</span>
              </div>
            </div>

            {/* テストログ */}
            {testLogs.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">実行ログ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-3 rounded-lg text-xs font-mono max-h-48 overflow-y-auto">
                    {testLogs.map((log, index) => (
                      <div key={index}>{log}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* クイックアクション */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">クイックアクション</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/auth'}
              >
                認証ページへ
              </Button>
              {user && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                >
                  ログアウト
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                ページリロード
              </Button>
            </div>
          </div>

          {/* モック使用時の注意 */}
          {AccessDetector.shouldUseLiffMock() && (
            <Alert>
              <AlertDescription>
                <strong>開発モード:</strong> LIFFモックが有効です。本番環境では実際のLINE認証が使用されます。
                モック無効化: <code>NEXT_PUBLIC_LIFF_MOCK_ENABLED=false</code>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 