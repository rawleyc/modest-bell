'use client'

import React from 'react'
import { Word } from '@/lib/types'
import { speakPolish } from '@/lib/speech'

interface MasterStageProps {
  word: Word
  onAnswer: (correct: boolean) => void
}

export function MasterStage({ word, onAnswer }: MasterStageProps) {
  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    speakPolish(word.word)
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[65vh] py-4">
      <div className="w-full flex flex-col items-center space-y-8 text-center my-auto">
        <span className="text-[12px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Stage 5: Master
        </span>

        {/* Minimalist Word Presentation with Faded Scaffolding */}
        <div className="space-y-4 py-8">
          <h2 className="text-5xl md:text-6xl font-light tracking-tight text-[#010204]">
            {word.word}
          </h2>

          <button
            type="button"
            onClick={handleAudio}
            aria-label="Listen to audio"
            className="p-3 rounded-full hover:bg-[#dce2f3]/50 text-[#010204] active:scale-95 transition-all inline-flex items-center justify-center cursor-pointer relative z-20"
          >
            <span className="material-symbols-outlined text-3xl">volume_up</span>
          </button>

          <p className="text-xs uppercase font-bold tracking-widest text-[#45474a]/40 pt-4">
            Zero scaffolding mode • Do you instinctively know this word?
          </p>
        </div>

        {/* Self-Assessment buttons */}
        <div className="w-full space-y-3 pt-4 relative z-20">
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className="w-full bg-[#010204] text-white py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#010204]/90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md relative z-20"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>Instinctively Know It (Mastered)</span>
          </button>

          <button
            type="button"
            onClick={() => onAnswer(false)}
            className="w-full bg-white border border-[#c5c6ca] text-[#45474a] py-3 px-6 rounded-full font-medium text-xs tracking-wider uppercase hover:bg-[#e7eefe] active:scale-[0.99] transition-all cursor-pointer relative z-20"
          >
            <span>Need More Practice</span>
          </button>
        </div>
      </div>
    </div>
  )
}
