'use client'

import React from 'react'
import { Word, StageResult, STAGE_LABELS } from '@/lib/types'
import Link from 'next/link'

interface ResultSummaryProps {
  word: Word
  stageResults: StageResult[]
  accuracy: number
  onNextWord?: () => void
}

export function ResultSummary({
  word,
  stageResults,
  accuracy,
  onNextWord,
}: ResultSummaryProps) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[70vh] py-6">
      <div className="w-full flex flex-col items-center space-y-6 text-center my-auto">
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#45474a]/60 bg-[#e7eefe] px-3 py-1 rounded-full">
          Round Summary
        </span>

        {/* Word Display */}
        <div className="space-y-1">
          <h2 className="text-4xl font-semibold text-[#010204]">{word.word}</h2>
          <p className="font-serif-context text-lg text-[#45474a]/80">
            {word.translation}
          </p>
        </div>

        {/* Score Ring / Quiet Badge */}
        <div className="w-28 h-28 rounded-full border-4 border-[#39665d] bg-[#b9eade]/20 flex flex-col items-center justify-center my-2">
          <span className="text-3xl font-bold text-[#010204]">
            {Math.round(accuracy)}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d6b61]">
            Accuracy
          </span>
        </div>

        {/* Stage Performance List */}
        <div className="w-full bg-white border border-[#c5c6ca]/30 rounded-2xl p-4 shadow-sm space-y-2 text-left">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#45474a]/60 mb-2">
            Stage Performance
          </h3>
          {stageResults.map((sr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-[#c5c6ca]/10 last:border-none"
            >
              <span className="text-sm font-medium text-[#151c27]">
                Stage {idx}: {STAGE_LABELS[sr.stage]}
              </span>
              {sr.correct ? (
                <span className="material-symbols-outlined text-emerald-600 text-lg">
                  check_circle
                </span>
              ) : (
                <span className="material-symbols-outlined text-rose-500 text-lg">
                  cancel
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full space-y-3 pt-4">
        {onNextWord ? (
          <button
            onClick={onNextWord}
            className="w-full bg-[#010204] text-white py-4 px-6 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#010204]/90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <span>Next Word</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        ) : null}

        <Link
          href="/"
          className="w-full bg-white border border-[#c5c6ca] text-[#010204] py-3.5 px-6 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#e7eefe] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-center"
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}
