'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { ALL_WORDS } from '@/data/vocabulary'
import { getMasteryTier } from '@/lib/mastery/scheduler'
import { createClient } from '@/lib/supabase/client'
import {
  fetchVocabulary,
  fetchUserProgress,
  fetchUserProfile,
} from '@/lib/supabase/data'
import { WordProgress, UserProfile } from '@/types/progress'
import { Word } from '@/types/word'

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>({})
  const [words, setWords] = useState<Word[]>(ALL_WORDS)
  const [filterTier, setFilterTier] = useState<string>('all')

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

  // Calculate mastery distribution counts
  const distribution = React.useMemo(() => {
    const counts = {
      Expert: 0,
      Mastered: 0,
      Strong: 0,
      Familiar: 0,
      Learning: 0,
      New: 0,
    }

    words.forEach((w) => {
      const record = progressMap[w.id]
      if (!record || record.masteryScore === 0) {
        counts.New++
      } else {
        const tier = getMasteryTier(record.masteryScore)
        counts[tier]++
      }
    })

    return counts
  }, [words, progressMap])

  const filteredWords = React.useMemo(() => {
    const now = new Date()
    return words.filter((w) => {
      const prog = progressMap[w.id]
      const score = prog ? prog.masteryScore : 0
      const tier = getMasteryTier(score)

      if (filterTier === 'all') return true
      if (filterTier === 'needs-review') {
        return prog?.nextReviewAt && new Date(prog.nextReviewAt) <= now
      }
      return tier.toLowerCase() === filterTier.toLowerCase()
    })
  }, [words, progressMap, filterTier])

  const totalPracticed = Object.keys(progressMap).length

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Progress Dashboard" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full space-y-6">
        {/* Streak & XP Header Cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm text-center">
            <span className="text-3xl font-bold text-[#010204]">
              🔥 {profile?.currentStreak || 1}
            </span>
            <p className="text-xs uppercase font-bold tracking-wider text-[#39665d] mt-1">
              Day Streak
            </p>
          </div>
          <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm text-center">
            <span className="text-3xl font-bold text-[#010204]">
              {profile?.xp || 0}
            </span>
            <p className="text-xs uppercase font-bold tracking-wider text-[#45474a]/60 mt-1">
              Total XP
            </p>
          </div>
        </div>

        {/* Mastery Distribution Card */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
            Mastery Distribution
          </h3>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.Expert}</span>
              <p className="text-[10px] font-bold uppercase text-[#39665d]">Expert</p>
            </div>
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.Mastered}</span>
              <p className="text-[10px] font-bold uppercase text-emerald-700">Mastered</p>
            </div>
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.Strong}</span>
              <p className="text-[10px] font-bold uppercase text-sky-700">Strong</p>
            </div>
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.Familiar}</span>
              <p className="text-[10px] font-bold uppercase text-indigo-700">Familiar</p>
            </div>
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.Learning}</span>
              <p className="text-[10px] font-bold uppercase text-amber-700">Learning</p>
            </div>
            <div className="bg-[#f0f3ff] p-2.5 rounded-xl">
              <span className="text-lg font-bold text-[#010204]">{distribution.New}</span>
              <p className="text-[10px] font-bold uppercase text-gray-500">New</p>
            </div>
          </div>
        </div>

        {/* Word Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'needs-review', 'learning', 'familiar', 'strong', 'mastered', 'expert'].map(
            (tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setFilterTier(tier)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap cursor-pointer transition-all ${
                  filterTier === tier
                    ? 'bg-[#010204] text-white shadow-sm'
                    : 'bg-white border border-[#c5c6ca]/30 text-[#45474a]'
                }`}
              >
                {tier.replace('-', ' ')}
              </button>
            )
          )}
        </div>

        {/* Word Mastery List */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
              Vocabulary Progress ({filteredWords.length} / {words.length})
            </h3>
          </div>

          {filteredWords.length === 0 ? (
            <p className="text-sm text-[#45474a]/50 py-4 text-center">
              No words match the selected filter.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredWords.map((wordObj) => {
                const record = progressMap[wordObj.id]
                const score = record ? record.masteryScore : 0
                const tier = getMasteryTier(score)
                const isOverdue =
                  record?.nextReviewAt && new Date(record.nextReviewAt) <= new Date()

                return (
                  <div
                    key={wordObj.id}
                    className="flex justify-between items-center py-2 border-b border-[#c5c6ca]/10 last:border-none"
                  >
                    <div>
                      <span className="font-medium text-[#010204]">{wordObj.word}</span>
                      <span className="text-xs text-[#45474a]/60 ml-2">
                        ({wordObj.translation})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Due
                        </span>
                      )}
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f0f3ff] text-[#39665d]">
                        {tier} ({score}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
