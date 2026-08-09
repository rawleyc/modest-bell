'use client'

import React, { useState } from 'react'
import { Word } from '@/lib/types'

interface RecognizeStageProps {
  word: Word
  distractors: string[]
  onAnswer: (correct: boolean) => void
}

export function RecognizeStage({ word, distractors, onAnswer }: RecognizeStageProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  // Options list: word.word + distractors
  const options = React.useMemo(() => {
    const list = [word.word, ...distractors]
    return list.sort(() => 0.5 - Math.random())
  }, [word.id, distractors])

  const handleSelect = (option: string) => {
    if (answered) return
    setSelectedOption(option)
    setAnswered(true)

    const isCorrect = option.toLowerCase() === word.word.toLowerCase()
    setTimeout(() => {
      onAnswer(isCorrect)
    }, 700)
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[65vh] py-4">
      <div className="w-full flex flex-col items-center space-y-6 text-center my-auto">
        {/* Stage Header */}
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#45474a]/60 bg-[#e7eefe] px-3 py-1 rounded-full">
          Stage 1: Recognize
        </span>

        {/* Prompt: English Translation with Faded Scaffolding */}
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold tracking-widest text-[#45474a]/50">
            Select the Polish word for:
          </p>
          <h2 className="font-serif-context text-3xl md:text-4xl text-[#010204]">
            "{word.translation}"
          </h2>
          <p className="text-sm text-[#45474a]/40 italic font-sans-ui transition-opacity opacity-50">
            Hint: {word.hint}
          </p>
        </div>

        {/* Options Grid */}
        <div className="w-full space-y-3 pt-4 relative z-20">
          {options.map((option) => {
            const isSelected = selectedOption === option
            const isTarget = option.toLowerCase() === word.word.toLowerCase()

            let buttonStyle = 'bg-white border-[#c5c6ca]/30 text-[#151c27] hover:border-[#010204]'
            if (answered) {
              if (isTarget) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
              } else if (isSelected && !isTarget) {
                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-900'
              } else {
                buttonStyle = 'bg-white border-[#c5c6ca]/20 text-[#45474a]/40'
              }
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={answered}
                className={`w-full p-4 rounded-xl border text-lg text-left transition-all flex items-center justify-between shadow-sm active:scale-[0.99] cursor-pointer relative z-20 ${buttonStyle}`}
              >
                <span>{option}</span>
                {answered && isTarget && (
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                )}
                {answered && isSelected && !isTarget && (
                  <span className="material-symbols-outlined text-rose-600">cancel</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
