import { AuthDemo } from './auth-demo'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">💰 MoneyFlow - デモページ</h1>
        <p className="text-gray-600">
          開発・テスト用のデモンストレーションページです。各機能の動作確認やデバッグに使用してください。
        </p>
      </div>
      
      <AuthDemo />
    </div>
  )
} 