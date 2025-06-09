import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/sonner'
import '../globals.css'

export const metadata = {
  title: 'ログイン - MoneyFlow',
  description: 'MoneyFlow にログインして家計簿を管理しましょう',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {children}
      </div>
      <Toaster />
    </AuthProvider>
  )
} 