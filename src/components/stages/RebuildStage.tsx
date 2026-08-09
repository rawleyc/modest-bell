'use client'

import React, { useState, useEffect } from 'react'
import { Word } from '@/lib/types'

interface RebuildStageProps {
  word: Word
  onAnswer: (correct: boolean) => void
}

export function RebuildStage({ word, onAnswer }: RebuildStageProps) {
  const targetChars = word.word.split('')
  
  const [tiles, setTiles] = useState<{ id: number; char: string; used: boolean }[]>([])
  const [assembled, setAssembled] = useState<{ tileId: number; char: string }[]>([])
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    const charArray = word.word.split('').map((char, index) => ({
      id: index,
      char,
      used: false,
    }))
    setTiles([...charArray].sort(() => 0.5 - Math.random()))
  }, [word])

  const handleTileClick = (tileId: number, char: string) => {
    if (answered) return

    setTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, used: true } : t))
    )
    const newAssembled = [...assembled, { tileId, char }]
    setAssembled(newAssembled)

    if (newAssembled.length === targetChars.length) {
      const builtWord = newAssembled.map((a) => a.char).join('')
      const correct = builtWord.toLowerCase() === word.word.toLowerCase()
      setAnswered(true)
      setIsCorrect(correct)

      setTimeout(() => {
        onAnswer(correct)
      }, 700)
    }
  }

  const handleRemoveAssembled = (index: number) => {
    if (answered) return
    const removedItem = assembled[index]
    const newAssembled = assembled.filter((_, i) => i !== index)
    setAssembled(newAssembled)
    setTiles((prev) =>
      prev.map((t) => (t.id === removedItem.tileId ? { ...t, used: false } : t))
    )
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[65vh] py-4">
      <div className="w-full flex flex-col items-center space-y-8 text-center my-auto">
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#45474a]/60 bg-[#e7eefe] px-3 py-1 rounded-full">
          Stage 2: Rebuild
        </span>

        {/* Translation Prompt */}
        <div className="space-y-1">
          <p className="text-xs uppercase font-bold tracking-widest text-[#45474a]/50">
            Rebuild the word for:
          </p>
          <h2 className="font-serif-context text-3xl text-[#010204]">
            "{word.translation}"
          </h2>
        </div>

        {/* Target Slots */}
        <div className="flex flex-wrap justify-center gap-2 my-4 min-h-[56px] relative z-20">
          {targetChars.map((_, idx) => {
            const filled = assembled[idx]
            let slotStyle = 'bg-white border-[#c5c6ca]/50 text-[#010204]'
            if (answered) {
              slotStyle = isCorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                : 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => filled && handleRemoveAssembled(idx)}
                disabled={!filled || answered}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-semibold shadow-sm transition-all cursor-pointer relative z-20 ${slotStyle}`}
              >
                {filled?.char || ''}
              </button>
            )
          })}
        </div>

        {/* Available Letter Tiles Bank */}
        <div className="flex flex-wrap justify-center gap-2 pt-4 relative z-20">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClick(tile.id, tile.char)}
              disabled={tile.used || answered}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-medium transition-all cursor-pointer relative z-20 ${
                tile.used
                  ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-30'
                  : 'bg-[#ffffff] border-[#c5c6ca] text-[#010204] hover:bg-[#e7eefe] active:scale-95 shadow-sm'
              }`}
            >
              {tile.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
