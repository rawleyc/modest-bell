'use client'

import React from 'react'
import { Word } from '@/lib/types'
import { speakPolish } from '@/lib/speech'

interface LearnStageProps {
  word: Word
  onComplete: () => void
}

export function LearnStage({ word, onComplete }: LearnStageProps) {
  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    speakPolish(word.word)
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[65vh] py-4">
      <div className="w-full flex flex-col items-center space-y-6 text-center my-auto">
        {/* Category Badge */}
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#45474a]/60 bg-[#e7eefe] px-3 py-1 rounded-full">
          Stage 0: Learn
        </span>

        {/* Word Display */}
        <div className="flex flex-col items-center space-y-2 w-full">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#010204] tracking-tight">
            {word.word}
          </h2>

          <div className="flex items-center space-x-3 text-[#45474a]">
            <span className="font-serif-context text-lg italic text-[#45474a]/80">
              {word.pronunciation}
            </span>
            <button
              type="button"
              onClick={handleAudio}
              aria-label="Listen to pronunciation"
              className="p-2 rounded-full hover:bg-[#dce2f3]/50 text-[#010204] active:scale-95 transition-all cursor-pointer relative z-10"
            >
              <span className="material-symbols-outlined text-2xl">volume_up</span>
            </button>
          </div>
        </div>

        {/* Primary Translation */}
        <div className="space-y-1">
          <p className="font-serif-context text-2xl text-[#151c27]">
            {word.translation}
          </p>
          <p className="text-sm text-[#45474a]/60 italic font-sans-ui">
            {word.partOfSpeech}
          </p>
        </div>

        {/* Example Sentence Context Card */}
        <div className="w-full bg-[#ffffff] border border-[#c5c6ca]/30 rounded-2xl p-5 text-left shadow-sm space-y-2">
          <p className="font-serif-context text-lg text-[#151c27]">
            {word.sentenceParts[0]}
            <strong className="text-[#010204] font-semibold underline decoration-accent text-emerald-700">
              {word.word}
            </strong>
            {word.sentenceParts[1]}
          </p>
          <p className="text-sm text-[#45474a]/70 font-sans-ui">
            {word.exampleTranslation}
          </p>
        </div>
      </div>

      {/* Action Button (Sticky Bottom with clear z-index and click handler) */}
      <div className="w-full pt-6 pb-2 sticky bottom-0 bg-[#f9f9ff]/90 backdrop-blur-sm z-30">
        <button
          type="button"
          onClick={() => onComplete()}
          className="w-full bg-[#010204] text-white py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#010204]/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md relative z-30"
        >
          <span>Ready</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
