'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { TurboCard, TurboDirection } from '@/components/TurboCard'
import { ALL_WORDS } from '@/data/vocabulary'
import { shuffle } from '@/lib/utils'
import { Word } from '@/lib/types'

function TurboSessionContent() {
  const router = useRouter()

  // Randomized burst deck of words
  const [deck, setDeck] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState<number>(2500) // ms per card (default 2.5s)
  const [directionMode, setDirectionMode] = useState<'mixed' | 'pl-to-en' | 'en-to-pl'>('mixed')

  // Initialize shuffled deck on mount
  useEffect(() => {
    setDeck(shuffle(ALL_WORDS))
  }, [])

  const currentWord = deck[currentIndex]

  // Calculate card direction
  const currentDirection: TurboDirection = React.useMemo(() => {
    if (directionMode === 'pl-to-en') return 'pl-to-en'
    if (directionMode === 'en-to-pl') return 'en-to-pl'
    return currentIndex % 2 === 0 ? 'pl-to-en' : 'en-to-pl'
  }, [directionMode, currentIndex])

  // Timer ref for auto-advance
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = React.useCallback(() => {
    if (deck.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % deck.length)
  }, [deck.length])

  const handlePrev = () => {
    if (deck.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length)
  }

  const handleReshuffle = () => {
    setDeck(shuffle(ALL_WORDS))
    setCurrentIndex(0)
    setIsPlaying(true)
  }

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying && deck.length > 0) {
      timerRef.current = setInterval(() => {
        handleNext()
      }, speed)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, handleNext, deck.length])

  if (!currentWord) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
        <Navbar title="Turbo Stream" showBack onBack={() => router.push('/')} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-sm text-[#45474a]/60 font-sans-ui">Preparing stream...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Turbo Stream" showBack onBack={() => router.push('/')} />

      {/* Dynamic top progress bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-[#dce2f3] z-40 pointer-events-none">
        <div
          className="h-full bg-[#39665d] transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + 1) / deck.length) * 100}%`,
          }}
        />
      </div>

      <main className="pt-20 pb-12 px-6 max-w-md mx-auto flex flex-col flex-grow w-full justify-between">
        {/* Header Controls */}
        <div className="flex justify-between items-center py-2 text-xs font-bold uppercase tracking-wider text-[#45474a]/60">
          <span>Card {currentIndex + 1} of {deck.length}</span>
          <button
            type="button"
            onClick={handleReshuffle}
            className="flex items-center space-x-1 text-[#39665d] hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shuffle</span>
            <span>Reshuffle Deck</span>
          </button>
        </div>

        {/* Turbo Flash Card */}
        <div className="my-auto py-4">
          <TurboCard
            key={`${currentWord.id}-${currentIndex}`}
            word={currentWord}
            direction={currentDirection}
            autoPlayAudio={isPlaying}
          />
        </div>

        {/* Bottom Control Dock */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-4 shadow-sm space-y-3 relative z-30">
          {/* Main Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous card"
              className="p-3 rounded-full border border-[#c5c6ca]/40 hover:bg-[#e7eefe] text-[#010204] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">skip_previous</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="bg-[#010204] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#010204]/90 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-xl">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next card"
              className="p-3 rounded-full border border-[#c5c6ca]/40 hover:bg-[#e7eefe] text-[#010204] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">skip_next</span>
            </button>
          </div>

          {/* Speed & Direction Selectors */}
          <div className="flex justify-between items-center pt-2 border-t border-[#c5c6ca]/20 text-xs">
            {/* Speed Toggle */}
            <div className="flex items-center space-x-1">
              <span className="text-[#45474a]/60">Speed:</span>
              {[
                { label: '1.5s', ms: 1500 },
                { label: '2.5s', ms: 2500 },
                { label: '4.0s', ms: 4000 },
              ].map((s) => (
                <button
                  key={s.ms}
                  type="button"
                  onClick={() => setSpeed(s.ms)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    speed === s.ms
                      ? 'bg-[#010204] text-white'
                      : 'bg-[#f0f3ff] text-[#45474a] hover:bg-[#e2e8f8]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Direction Mode Selector */}
            <button
              type="button"
              onClick={() => {
                setDirectionMode((prev) =>
                  prev === 'mixed' ? 'pl-to-en' : prev === 'pl-to-en' ? 'en-to-pl' : 'mixed'
                )
              }}
              className="text-[11px] font-semibold uppercase text-[#39665d] hover:underline cursor-pointer"
            >
              Mode: {directionMode}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function TurboPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
          <p className="text-sm font-sans-ui text-[#45474a]/60">Loading Turbo Stream...</p>
        </div>
      }
    >
      <TurboSessionContent />
    </Suspense>
  )
}
