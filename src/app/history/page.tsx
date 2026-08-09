'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { getStoredProgress, clearProgress } from '@/lib/storage'
import { ALL_WORDS } from '@/data/vocabulary'

export default function HistoryPage() {
  const [progress, setProgress] = useState(getStoredProgress())

  useEffect(() => {
    setProgress(getStoredProgress())
  }, [])

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all stored practice progress?')) {
      clearProgress()
      setProgress(getStoredProgress())
    }
  }

  // Calculate stats
  const totalPracticed = Object.keys(progress.mastery).length
  const masteredCount = Object.values(progress.mastery).filter((m) => m.level >= 5).length
  const inProgressCount = Object.values(progress.mastery).filter(
    (m) => m.level > 0 && m.level < 5
  ).length

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Practice History" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/50 pt-2">
          Learning Statistics
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm text-center">
            <span className="text-3xl font-bold text-[#010204]">{masteredCount}</span>
            <p className="text-xs uppercase font-bold tracking-wider text-[#3d6b61] mt-1">
              Mastered (L5)
            </p>
          </div>
          <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm text-center">
            <span className="text-3xl font-bold text-[#010204]">{inProgressCount}</span>
            <p className="text-xs uppercase font-bold tracking-wider text-[#45474a]/60 mt-1">
              In Progress
            </p>
          </div>
        </div>

        {/* Total Sessions Banner */}
        <div className="bg-[#e7eefe] border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-[#010204]">Total Practice Rounds</h3>
            <p className="text-xs text-[#45474a]/70">Sessions completed in app</p>
          </div>
          <span className="text-2xl font-bold text-[#010204]">
            {progress.totalSessions}
          </span>
        </div>

        {/* Mastered Word List */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
            Word Mastery Log ({totalPracticed} / {ALL_WORDS.length})
          </h3>

          {totalPracticed === 0 ? (
            <p className="text-sm text-[#45474a]/50 py-4 text-center">
              No practice records yet. Start practicing to build your log!
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(progress.mastery).map(([wordId, record]) => {
                const wordObj = ALL_WORDS.find((w) => w.id === wordId)
                if (!wordObj) return null

                return (
                  <div
                    key={wordId}
                    className="flex justify-between items-center py-2 border-b border-[#c5c6ca]/10 last:border-none"
                  >
                    <div>
                      <span className="font-medium text-[#010204]">
                        {wordObj.word}
                      </span>
                      <span className="text-xs text-[#45474a]/60 ml-2">
                        ({wordObj.translation})
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f0f3ff] text-[#39665d]">
                      Level {record.level}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <button
            onClick={handleReset}
            className="w-full bg-white border border-rose-200 text-rose-600 py-3 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-rose-50 transition-all"
          >
            Reset Practice History
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
