"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExpenseAddModal } from "@/components/modals/ExpenseAddModal"
import { IncomeAddModal } from "@/components/modals/IncomeAddModal"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // マウント状態を管理
  useEffect(() => {
    setMounted(true)
  }, [])

  // スクロール時の表示/非表示制御
  useEffect(() => {
    if (!mounted) return

    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // 下にスクロール
        setIsVisible(false)
        setIsOpen(false)
      } else {
        // 上にスクロール
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [lastScrollY, mounted])

  // ESCキーでメニューを閉じる
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, mounted])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleIncomeModal = () => {
    setShowIncomeModal(true)
    setIsOpen(false)
  }

  const handleExpenseModal = () => {
    setShowExpenseModal(true)
    setIsOpen(false)
  }

  // ハイドレーションエラーを防ぐため、マウント後に表示
  if (!mounted) {
    return null
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    )}>
      {/* メニューアイテム */}
      <div
        className={cn(
          "absolute bottom-16 right-0 flex flex-col gap-2 transition-all duration-300 ease-out transform-gpu",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        )}
      >
        {/* 収入登録ボタン */}
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200 ease-out",
          isOpen ? "delay-100" : ""
        )}>
          <span className="bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm shadow-lg">
            💰 収入を登録
          </span>
          <button
            aria-label="収入を登録"
            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 touch-manipulation flex items-center justify-center focus:outline-none outline-none border-0 p-0"
            onClick={handleIncomeModal}
          >
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>

        {/* 支出登録ボタン */}
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200 ease-out",
          isOpen ? "delay-50" : ""
        )}>
          <span className="bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm shadow-lg">
            💸 支出を登録
          </span>
          <button
            aria-label="支出を登録"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 touch-manipulation flex items-center justify-center focus:outline-none outline-none border-0 p-0"
            onClick={handleExpenseModal}
          >
            <TrendingDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* メインFABボタン */}
      <button
        aria-label={isOpen ? "メニューを閉じる" : "登録メニューを開く"}
        aria-expanded={isOpen}
        className={cn(
          "h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-out",
          "hover:opacity-90 hover:scale-110 active:scale-95",
          "backdrop-blur-sm border border-white/20",
          "touch-manipulation flex items-center justify-center",
          "focus:outline-none outline-none border-0 p-0",
          isOpen && "rotate-45 bg-gradient-to-r from-purple-600 to-pink-600"
        )}
        onClick={toggleMenu}
      >
        <Plus className={cn(
          "h-6 w-6 transition-transform duration-300 ease-out",
          isOpen && "rotate-45"
        )} />
      </button>

      {/* オーバーレイ（メニューが開いているときにクリックして閉じる） */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm -z-10 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* モーダル */}
      <ExpenseAddModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSuccess={() => {
          setShowExpenseModal(false)
          // 必要に応じて追加の処理（データリフレッシュなど）
        }}
      />

      <IncomeAddModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSuccess={() => {
          setShowIncomeModal(false)
          // 必要に応じて追加の処理（データリフレッシュなど）
        }}
      />
    </div>
  )
} 