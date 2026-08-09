'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { LearnStage } from '@/components/stages/LearnStage'
import { RecognizeStage } from '@/components/stages/RecognizeStage'
import { RebuildStage } from '@/components/stages/RebuildStage'
import { RecallStage } from '@/components/stages/RecallStage'
import { UseStage } from '@/components/stages/UseStage'
import { MasterStage } from '@/components/stages/MasterStage'
import { ResultSummary } from '@/components/ResultSummary'
import { ALL_WORDS, getWordsByCategory, getWordById } from '@/data/vocabulary'
import { updateWordProgress } from '@/lib/storage'
import { generateDistractors, calculateAccuracy } from '@/lib/game-engine'
import { Word, Stage, STAGE_ORDER, StageResult, Category } from '@/lib/types'

function PracticeSessionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const categoryParam = searchParams.get('category') as Category | null
  const wordParam = searchParams.get('word')

  // Deck of words for this session
  const deck = React.useMemo(() => {
    if (wordParam) {
      const single = getWordById(wordParam)
      if (single) return [single]
    }
    if (categoryParam) {
      const catWords = getWordsByCategory(categoryParam)
      if (catWords.length > 0) return catWords
    }
    return ALL_WORDS
  }, [categoryParam, wordParam])

  // Active word index in deck
  const [wordIndex, setWordIndex] = useState(0)
  const currentWord = deck[wordIndex] || deck[0]

  // Stage progression state
  const [stageIndex, setStageIndex] = useState(0)
  const currentStage: Stage = STAGE_ORDER[stageIndex]

  // Collected results for the current word round
  const [stageResults, setStageResults] = useState<StageResult[]>([])
  const [isRoundComplete, setIsRoundComplete] = useState(false)

  // Distractors generated for Recognize stage
  const distractors = React.useMemo(() => {
    if (!currentWord) return []
    return generateDistractors(currentWord, ALL_WORDS)
  }, [currentWord])

  const handleStageAnswer = (correct: boolean) => {
    const newResult: StageResult = {
      stage: currentStage,
      correct,
    }
    const updatedResults = [...stageResults, newResult]
    setStageResults(updatedResults)

    if (stageIndex < STAGE_ORDER.length - 1) {
      // Advance to next stage
      setStageIndex((prev) => prev + 1)
    } else {
      // Round Complete! Save progress and show summary
      const accuracy = calculateAccuracy(updatedResults)
      updateWordProgress(currentWord.id, accuracy)
      setIsRoundComplete(true)
    }
  }

  const handleNextWord = () => {
    if (wordIndex < deck.length - 1) {
      setWordIndex((prev) => prev + 1)
      setStageIndex(0)
      setStageResults([])
      setIsRoundComplete(false)
    } else {
      // Return Home when deck is finished
      router.push('/')
    }
  }

  if (!currentWord) {
    return (
      <div className="p-8 text-center">
        <p>No words found in deck.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-blue-600 underline">
          Go back home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar
        title={isRoundComplete ? 'Summary' : `Practice (${wordIndex + 1}/${deck.length})`}
        showBack
        onBack={() => router.push('/')}
      />

      {/* Progress Bar top indicator with pointer-events-none */}
      {!isRoundComplete && (
        <div className="fixed top-16 left-0 w-full h-1 bg-[#dce2f3] z-40 pointer-events-none">
          <div
            className="h-full bg-[#010204] transition-all duration-300 ease-out"
            style={{
              width: `${((stageIndex + 1) / STAGE_ORDER.length) * 100}%`,
            }}
          />
        </div>
      )}

      <main className="pt-20 pb-8 px-6 max-w-md mx-auto flex flex-col flex-grow w-full relative z-10">
        {isRoundComplete ? (
          <ResultSummary
            word={currentWord}
            stageResults={stageResults}
            accuracy={calculateAccuracy(stageResults)}
            onNextWord={wordIndex < deck.length - 1 ? handleNextWord : undefined}
          />
        ) : (
          <>
            {currentStage === 'learn' && (
              <LearnStage
                word={currentWord}
                onComplete={() => handleStageAnswer(true)}
              />
            )}
            {currentStage === 'recognize' && (
              <RecognizeStage
                word={currentWord}
                distractors={distractors}
                onAnswer={handleStageAnswer}
              />
            )}
            {currentStage === 'rebuild' && (
              <RebuildStage word={currentWord} onAnswer={handleStageAnswer} />
            )}
            {currentStage === 'recall' && (
              <RecallStage word={currentWord} onAnswer={handleStageAnswer} />
            )}
            {currentStage === 'use' && (
              <UseStage word={currentWord} onAnswer={handleStageAnswer} />
            )}
            {currentStage === 'master' && (
              <MasterStage word={currentWord} onAnswer={handleStageAnswer} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
          <p className="text-sm font-sans-ui text-[#45474a]/60">Loading practice session...</p>
        </div>
      }
    >
      <PracticeSessionContent />
    </Suspense>
  )
}
