'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { ALL_WORDS } from '@/data/vocabulary'
import { createClient } from '@/lib/supabase/client'
import {
  fetchVocabulary,
  fetchUserProgress,
  fetchUserProfile,
} from '@/lib/supabase/data'
import { WordProgress, UserProfile } from '@/types/progress'
import { Word } from '@/types/word'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>({})
  const [words, setWords] = useState<Word[]>(ALL_WORDS)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      if (supabase) {
        const { data: userAuth } = await supabase.auth.getUser()
        if (userAuth?.user) {
          const [prof, prog, vocab] = await Promise.all([
            fetchUserProfile(userAuth.user.id),
            fetchUserProgress(userAuth.user.id),
            fetchVocabulary(),
          ])

          if (prof) setProfile(prof)
          if (prog) setProgressMap(prog)
          if (vocab.length > 0) setWords(vocab)
        }
      }
      setMounted(true)
    }

    loadData()
  }, [])

  const masteredCount = React.useMemo(() => {
    if (!mounted) return 0
    return Object.values(progressMap).filter((p) => p.masteryScore >= 80).length
  }, [progressMap, mounted])

  const dueForReviewCount = React.useMemo(() => {
    if (!mounted) return 0
    const now = new Date()
    return Object.values(progressMap).filter(
      (p) => p.nextReviewAt && new Date(p.nextReviewAt) <= now
    ).length
  }, [progressMap, mounted])

  const streak = profile?.currentStreak || 1
  const displayName = profile?.displayName || 'Learner'

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Słówka V2" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full space-y-6">
        {/* Streak & Greeting Banner */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#39665d]">
              Cześć, {displayName}!
            </span>
            <h2 className="text-2xl font-bold text-[#010204]">Daily Target</h2>
            <p className="text-xs text-[#45474a]/70 font-sans-ui">
              {profile?.xp ? `${profile.xp} total XP earned` : '5-Word Session'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#010204]">🔥 {streak}d</span>
            <p className="text-[10px] uppercase font-bold text-[#45474a]/60">Streak</p>
          </div>
        </div>

        {/* Overdue Review Banner if items waiting */}
        {dueForReviewCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800">
                Review Required
              </span>
              <p className="text-sm font-bold text-amber-950">
                {dueForReviewCount} word{dueForReviewCount > 1 ? 's' : ''} waiting for review
              </p>
            </div>
            <Link
              href="/learn"
              className="bg-amber-600 text-white text-xs uppercase font-bold tracking-wider px-4 py-2.5 rounded-full hover:bg-amber-700 transition-all cursor-pointer"
            >
              Review Now
            </Link>
          </div>
        )}

        {/* Primary Action: Continue Learning Session */}
        <div className="space-y-3">
          <Link
            href="/learn"
            className="w-full bg-[#010204] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md hover:bg-[#010204]/90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Continue Learning (5 Words)</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>

          <Link
            href="/practice"
            className="w-full bg-white border border-[#39665d] text-[#39665d] px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 hover:bg-[#b9eade]/20 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-center"
          >
            <span>Practice Modes</span>
          </Link>
        </div>

        {/* Vocabulary Mastery Overview */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
              Vocabulary Mastery
            </h3>
            <span className="text-xs font-bold text-[#010204]">
              {masteredCount} / {words.length} Mastered
            </span>
          </div>

          <div className="w-full h-3 bg-[#e2e8f8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#39665d] transition-all duration-500 ease-out"
              style={{
                width: `${Math.round((masteredCount / Math.max(1, words.length)) * 100)}%`,
              }}
            />
          </div>

          <div className="pt-2 flex justify-between text-xs text-[#45474a]/70">
            <span>{words.length - masteredCount} words remaining</span>
            <Link href="/progress" className="text-[#39665d] font-bold hover:underline">
              View Dashboard ➔
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
