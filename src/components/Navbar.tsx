'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export function Navbar({ title = 'Word Fade', showBack = false, onBack }: NavbarProps) {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user)
      })
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
      router.refresh()
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#f9f9ff] border-b border-[#c5c6ca]/30">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center p-2 text-[#45474a]/70 hover:text-[#010204] transition-colors rounded-full active:scale-95 cursor-pointer relative z-10"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      ) : (
        <Link
          href="/"
          className="flex items-center justify-center p-2 text-[#45474a]/50 hover:text-[#010204] transition-colors cursor-pointer relative z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </Link>
      )}

      <h1 className="font-sans-ui text-xl font-semibold tracking-tight text-[#010204]">
        {title}
      </h1>

      <div className="flex items-center space-x-2">
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="text-xs font-bold text-[#45474a]/70 hover:text-rose-600 px-2 py-1 transition-colors cursor-pointer"
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="text-xs font-bold text-[#39665d] bg-[#b9eade]/30 hover:bg-[#b9eade]/50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  )
}
