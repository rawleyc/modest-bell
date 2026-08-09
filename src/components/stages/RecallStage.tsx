'use client'

import React, { useState } from 'react'
import { Word } from '@/lib/types'
import { isAnswerCorrect } from '@/lib/game-engine'

interface RecallStageProps {
  word: Word
  onAnswer: (correct: boolean) => void
}

export function RecallStage({ word, onAnswer }: RecallStageProps) {
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || submitted) return

    const correct = isAnswerCorrect(input, word.word)
    setSubmitted(true)
    setIsCorrect(correct)

    setTimeout(() => {
      onAnswer(correct)
    }, 900)
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[70vh] py-6">
      <div className="w-full flex flex-col items-center space-y-6 text-center my-auto">
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#45474a]/60 bg-[#e7eefe] px-3 py-1 rounded-full">
          Stage 3: Recall
        </span>

        {/* Translation Prompt (Faded Scaffolding per Word Fade rule) */}
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold tracking-widest text-[#45474a]/50">
            Type the Polish word for:
          </p>
          <h2 className="font-serif-context text-3xl md:text-4xl text-[#010204]">
            "{word.translation}"
          </h2>
          
          {/* Toggleable Faded Hint */}
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-[#45474a]/40 hover:text-[#010204] underline transition-colors pt-1"
            >
              Need a hint?
            </button>
          ) : (
            <p className="text-sm text-[#45474a]/60 italic font-sans-ui pt-1">
              Hint: {word.hint}
            </p>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitted}
              placeholder="Type here..."
              autoFocus
              className={`w-full p-4 rounded-xl border-2 text-2xl text-center outline-none transition-all shadow-sm ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                    : 'bg-rose-50 border-rose-500 text-rose-900 font-semibold'
                  : 'bg-white border-[#c5c6ca] focus:border-[#010204] text-[#010204]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || submitted}
            className="w-full bg-[#010204] text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase disabled:opacity-30 hover:bg-[#010204]/90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <span>Submit</span>
            <span className="material-symbols-outlined text-lg">check</span>
          </button>
        </form>

        {submitted && !isCorrect && (
          <div className="text-sm text-rose-600 font-medium pt-2">
            Correct word: <strong className="font-semibold">{word.word}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
