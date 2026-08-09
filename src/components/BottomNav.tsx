'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  // Hide bottom nav during active learning or practice sessions
  if (pathname.startsWith('/learn') || pathname.startsWith('/turbo')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 bg-[#f9f9ff] border-t border-[#c5c6ca]/20">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/'
            ? 'text-[#010204] scale-105'
            : 'text-[#45474a]/40 hover:text-[#010204]'
        }`}
      >
        <span
          className="material-symbols-outlined mb-0.5"
          style={{ fontVariationSettings: pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Home</span>
      </Link>

      <Link
        href="/learn"
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/learn'
            ? 'text-[#010204]'
            : 'text-[#45474a]/40 hover:text-[#010204]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5">school</span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Learn</span>
      </Link>

      <Link
        href="/progress"
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/progress'
            ? 'text-[#010204]'
            : 'text-[#45474a]/40 hover:text-[#010204]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5">bar_chart</span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Progress</span>
      </Link>

      <Link
        href="/practice"
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/practice'
            ? 'text-[#010204]'
            : 'text-[#45474a]/40 hover:text-[#010204]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5">extension</span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Practice</span>
      </Link>

      <Link
        href="/settings"
        className={`flex flex-col items-center justify-center transition-colors ${
          pathname === '/settings'
            ? 'text-[#010204]'
            : 'text-[#45474a]/40 hover:text-[#010204]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5">settings</span>
        <span className="text-[11px] font-bold tracking-wider uppercase">Settings</span>
      </Link>
    </nav>
  )
}
