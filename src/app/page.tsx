'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { ALL_WORDS, getWordsByCategory } from '@/data/vocabulary'
import { getStoredProgress, getMasteryRecord } from '@/lib/storage'
import { Word, Category, CATEGORY_META } from '@/lib/types'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [progress, setProgress] = useState(getStoredProgress())

  useEffect(() => {
    // Load fresh progress on client side
    setProgress(getStoredProgress())
  }, [])

  // Filter words
  const wordsToDisplay = React.useMemo(() => {
    if (selectedCategory === 'all') return ALL_WORDS
    return getWordsByCategory(selectedCategory)
  }, [selectedCategory])

  // Calculate total mastered words
  const masteredCount = React.useMemo(() => {
    return Object.values(progress.mastery).filter((m) => m.level >= 5).length
  }, [progress])

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Word Fade" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full">
        {/* Quiet Weekly Summary */}
        <div className="mb-6 text-center pt-2">
          <p className="text-sm font-sans-ui text-[#45474a]/70 font-medium">
            {masteredCount} {masteredCount === 1 ? 'word' : 'words'} mastered
          </p>
        </div>

        {/* Start Next Word Primary Button */}
        <div className="mb-8 flex justify-center">
          <Link
            href={
              selectedCategory === 'all'
                ? '/practice'
                : `/practice?category=${selectedCategory}`
            }
            className="w-full bg-[#010204] text-[#ffffff] px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md hover:bg-[#010204]/90 active:scale-[0.98] transition-all"
          >
            <span>Start Practice</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        {/* Category Pills Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto hide-scroll pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#010204] text-white'
                : 'bg-white border border-[#c5c6ca]/40 text-[#45474a] hover:bg-[#e7eefe]'
            }`}
          >
            All Words ({ALL_WORDS.length})
          </button>
          {CATEGORY_META.filter((cat) =>
            ALL_WORDS.some((w) => w.category === cat.id)
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1 ${
                selectedCategory === cat.id
                  ? 'bg-[#010204] text-white'
                  : 'bg-white border border-[#c5c6ca]/40 text-[#45474a] hover:bg-[#e7eefe]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* List of Words with Word Fade Rule Applied */}
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/50">
              Vocabulary Deck
            </h2>
            <span className="text-xs text-[#45474a]/40">
              Fade = Mastery Level
            </span>
          </div>

          <div className="space-y-1">
            {wordsToDisplay.map((w) => {
              const record = getMasteryRecord(progress, w.id)
              const level = record.level // 0 to 5

              // Word Fade Scaffolding Calculation:
              // Level 0-1: Opacity 100%, show translation
              // Level 2-3: Opacity 75%, show faded translation
              // Level 4-5: Opacity 50%, font-light, definition completely removed (Word Fade Rule)
              const isMastered = level >= 5
              const isHighMastery = level >= 4

              return (
                <Link
                  key={w.id}
                  href={`/practice?word=${w.id}`}
                  className={`flex items-center justify-between py-4 border-b border-[#c5c6ca]/20 hover:bg-white/50 px-2 rounded-xl transition-all ${
                    isMastered
                      ? 'opacity-50'
                      : isHighMastery
                      ? 'opacity-70'
                      : level >= 2
                      ? 'opacity-85'
                      : 'opacity-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{w.emoji}</span>
                      <h3
                        className={`text-xl text-[#151c27] ${
                          isHighMastery ? 'font-light' : 'font-semibold'
                        }`}
                      >
                        {w.word}
                      </h3>
                      <span className="text-xs text-[#45474a]/40 italic font-serif-context">
                        {w.pronunciation}
                      </span>
                    </div>

                    {!isHighMastery && (
                      <p className="text-sm font-sans-ui text-[#45474a]/80 pl-7">
                        {w.translation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f3ff] text-[#45474a]">
                      {isMastered ? (
                        <span className="material-symbols-outlined text-emerald-600">
                          check_circle
                        </span>
                      ) : level > 0 ? (
                        <span className="text-xs font-bold text-[#39665d]">
                          L{level}
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-xs text-[#45474a]/30">
                          circle
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
