'use client'

import React, { useEffect } from 'react'
import { Word } from '@/lib/types'
import { speakPolish } from '@/lib/speech'

export type TurboDirection = 'pl-to-en' | 'en-to-pl'

interface TurboCardProps {
  word: Word
  direction: TurboDirection
  autoPlayAudio?: boolean
}

export function TurboCard({ word, direction, autoPlayAudio = true }: TurboCardProps) {
  useEffect(() => {
    if (autoPlayAudio) {
      speakPolish(word.word)
    }
  }, [word, autoPlayAudio])

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    speakPolish(word.word)
  }

  const primaryText = direction === 'pl-to-en' ? word.word : word.translation
  const secondaryText = direction === 'pl-to-en' ? word.translation : word.word

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-[#c5c6ca]/40 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center space-y-6 text-center transition-all duration-300">
      {/* Direction Indicator Badge */}
      <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#39665d] bg-[#b9eade]/30 px-3.5 py-1 rounded-full">
        <span>Turbo Stream</span>
        <span>•</span>
        <span>{direction === 'pl-to-en' ? 'PL ➔ EN' : 'EN ➔ PL'}</span>
      </div>

      {/* Primary Word */}
      <div className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#010204] tracking-tight">
          {primaryText}
        </h2>
        {direction === 'pl-to-en' && (
          <div className="flex items-center justify-center space-x-2 text-[#45474a]/70">
            <span className="font-serif-context text-lg italic">{word.pronunciation}</span>
            <button
              type="button"
              onClick={handleAudio}
              aria-label="Play audio"
              className="p-1.5 rounded-full hover:bg-[#dce2f3]/50 text-[#010204] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">volume_up</span>
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-12 h-0.5 bg-[#c5c6ca]/40 my-2" />

      {/* Secondary Counterpart */}
      <div className="space-y-1">
        <h3 className="font-serif-context text-2xl text-[#151c27]">
          {secondaryText}
        </h3>
        {direction === 'en-to-pl' && (
          <div className="flex items-center justify-center space-x-2 text-[#45474a]/70 pt-1">
            <span className="font-serif-context text-sm italic">{word.pronunciation}</span>
            <button
              type="button"
              onClick={handleAudio}
              aria-label="Play audio"
              className="p-1 rounded-full hover:bg-[#dce2f3]/50 text-[#010204] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>
        )}
        <p className="text-xs text-[#45474a]/50 italic font-sans-ui pt-1 capitalize">
          {word.partOfSpeech} • {word.category}
        </p>
      </div>

      {/* Example Context */}
      <div className="w-full bg-[#f9f9ff] border border-[#c5c6ca]/20 rounded-xl p-4 text-left space-y-1 mt-2">
        <p className="font-serif-context text-base text-[#151c27]">
          {word.exampleSentence}
        </p>
        <p className="text-xs text-[#45474a]/70 font-sans-ui">
          {word.exampleTranslation}
        </p>
      </div>
    </div>
  )
}
