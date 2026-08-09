'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { CATEGORY_META } from '@/lib/types'

export default function PracticeHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Practice Hub" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full space-y-6">
        <div className="space-y-1 pt-2">
          <h2 className="text-2xl font-bold text-[#010204]">Supplementary Practice</h2>
          <p className="text-xs text-[#45474a]/60">
            Strengthen your memory with quick, zero-pressure practice modes
          </p>
        </div>

        {/* Practice Modes Cards */}
        <div className="space-y-3">
          <Link
            href="/turbo"
            className="block bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm hover:border-[#39665d] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-[#010204]">Turbo Stream</h3>
              <span className="text-xs font-bold text-[#39665d] bg-[#b9eade]/30 px-2.5 py-0.5 rounded-full">
                Passive
              </span>
            </div>
            <p className="text-xs text-[#45474a]/70">
              High-speed, auto-advancing word exposure stream. No scoring pressure.
            </p>
          </Link>
        </div>

        {/* Practice By Topic Category */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
            Practice By Topic
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_META.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/learn?category=${cat.id}`}
                className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-4 shadow-sm hover:border-[#010204] transition-all cursor-pointer space-y-1"
              >
                <h4 className="font-bold text-sm text-[#010204]">{cat.name}</h4>
                <p className="text-[11px] text-[#45474a]/60 line-clamp-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
