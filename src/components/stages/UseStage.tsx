'use client'

import React, { useState } from 'react'
import { Word } from '@/lib/types'
import { isAnswerCorrect } from '@/lib/game-engine'

interface UseStageProps {
  word: Word
  onAnswer: (correct: boolean) => void
}

export function UseStage({ word, onAnswer }: UseStageProps) {
  const [input, setInput] = useState('')
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
          Stage 4: Use in Context
        </span>

        <div className="space-y-1">
          <p className="text-xs uppercase font-bold tracking-widest text-[#45474a]/50">
            Fill in the missing word:
          </p>
          <p className="text-sm text-[#45474a]/60 italic font-sans-ui">
            Translation: "{word.exampleTranslation}"
          </p>
        </div>

        {/* Context Sentence Card with Embedded Input */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 pt-2">
          <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-6 shadow-sm text-center font-serif-context text-xl leading-relaxed text-[#151c27]">
            <span>{word.sentenceParts[0]}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitted}
              autoFocus
              placeholder="___"
              className={`mx-1 px-3 py-1 border-b-2 outline-none font-sans-ui text-center text-xl transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                  : 'border-[#010204] bg-[#f9f9ff] text-[#010204] focus:bg-white'
              }`}
              style={{ width: `${Math.max(word.word.length * 18, 90)}px` }}
            />
            <span>{word.sentenceParts[1]}</span>
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
            Correct answer: <strong className="font-semibold">{word.word}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
