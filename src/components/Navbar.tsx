'use client'

import React from 'react'
import Link from 'next/link'

interface NavbarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export function Navbar({ title = 'Word Fade', showBack = false, onBack }: NavbarProps) {
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

      <button
        type="button"
        aria-label="More options"
        className="flex items-center justify-center p-2 text-[#45474a]/50 hover:text-[#010204] transition-colors cursor-pointer relative z-10"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </header>
  )
}
