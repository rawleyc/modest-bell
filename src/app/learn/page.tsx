'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { LearnStage } from '@/components/stages/LearnStage'
import { RecognizeStage } from '@/components/stages/RecognizeStage'
import { RebuildStage } from '@/components/stages/RebuildStage'
import { RecallStage } from '@/components/stages/RecallStage'
import { UseStage } from '@/components/stages/UseStage'
import { MasterStage } from '@/components/stages/MasterStage'
import { ALL_WORDS } from '@/data/vocabulary'
import { selectSessionWords } from '@/lib/game/word-selection'
import { generateDistractors } from '@/lib/game-engine'
import { calculateUpdatedProgress } from '@/lib/mastery/scheduler'
import { createAttemptRecord } from '@/lib/game/engine'
import { updateWordProgress } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'
import {
  fetchVocabulary,
  seedVocabularyIfEmpty,
  fetchUserProgress,
  saveAttemptAndProgress,
  recordSessionCompletion,
} from '@/lib/supabase/data'
import { Word } from '@/types/word'
import { WordProgress } from '@/types/progress'
import { StageResult } from '@/lib/types'

function LearnSessionContent() {
  const router = useRouter()
  const [deck, setDeck] = useState<Word[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [stageIndex, setStageIndex] = useState<number>(0) // 0=Learn, 1=Recognize, 2=Rebuild, 3=Recall, 4=Use, 5=Master
  const [stageResults, setStageResults] = useState<StageResult[]>([])
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [totalXpEarned, setTotalXpEarned] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [userProgressMap, setUserProgressMap] = useState<Record<string, WordProgress>>({})
  const [allWords, setAllWords] = useState<Word[]>(ALL_WORDS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initSession() {
      setLoading(true)
      const supabase = createClient()
      let currentUserId: string | null = null
      let userProgress: Record<string, WordProgress> = {}

      if (supabase) {
        const { data: userAuth } = await supabase.auth.getUser()
        if (userAuth?.user) {
          currentUserId = userAuth.user.id
          setUserId(currentUserId)

          // Seed words if DB is empty
          await seedVocabularyIfEmpty()

          // Fetch user progress & vocabulary from Supabase
          const [fetchedWords, fetchedProgress] = await Promise.all([
            fetchVocabulary(),
            fetchUserProgress(currentUserId),
          ])

          if (fetchedWords.length > 0) setAllWords(fetchedWords)
          userProgress = fetchedProgress
          setUserProgressMap(fetchedProgress)
        }
      }

      // Select 5 prioritized words for the session
      const selected = selectSessionWords(allWords, userProgress)
      setDeck(selected.length > 0 ? selected : allWords.slice(0, 5))
      setLoading(false)
    }

    initSession()
  }, [])

  const currentWord = deck[wordIndex]

  const distractors = React.useMemo(() => {
    if (!currentWord) return []
    return generateDistractors(currentWord, allWords)
  }, [currentWord, allWords])

  const handleStageComplete = async (stageNumber: 1 | 2 | 3 | 4 | 5, correct: boolean) => {
    const stageNames: Record<number, any> = {
      1: 'recognize',
      2: 'rebuild',
      3: 'recall',
      4: 'use',
      5: 'master',
    }

    const newResult: StageResult = {
      stage: stageNames[stageNumber],
      correct,
    }
    const updatedResults = [...stageResults, newResult]
    setStageResults(updatedResults)

    if (currentWord) {
      // 1. Existing progress for current word
      const existingProg: WordProgress = userProgressMap[currentWord.id] || {
        userId: userId || 'local',
        wordId: currentWord.id,
        masteryScore: 0,
        correctAttempts: 0,
        incorrectAttempts: 0,
        totalAttempts: 0,
      }

      // 2. Calculate updated mastery score & schedule
      const updatedProg = calculateUpdatedProgress(existingProg, stageNumber, correct)

      // 3. Update in-memory state
      setUserProgressMap((prev) => ({
        ...prev,
        [currentWord.id]: updatedProg,
      }))

      // 4. Save attempt and progress to Supabase if authenticated
      if (userId) {
        const attempt = createAttemptRecord(
          userId,
          currentWord.id,
          stageNumber,
          stageNames[stageNumber],
          correct
        )
        saveAttemptAndProgress(userId, attempt, updatedProg)
      }
    }

    if (stageNumber < 5) {
      // Advance to next stage for current word
      setStageIndex(stageNumber)
    } else {
      // Word completed across all 5 stages!
      const correctCount = updatedResults.filter((r) => r.correct).length
      const accuracy = correctCount / updatedResults.length
      updateWordProgress(currentWord.id, accuracy)

      // Award XP (+10 per word, +25 stage bonus if perfect)
      const wordXp = 10 + (correctCount === 5 ? 25 : 0)
      setTotalXpEarned((prev) => prev + wordXp)

      if (wordIndex < deck.length - 1) {
        // Move to next word in session
        setWordIndex((prev) => prev + 1)
        setStageIndex(0)
        setStageResults([])
      } else {
        // Entire 5-word session completed!
        const finalXp = totalXpEarned + wordXp + 50
        setTotalXpEarned(finalXp)
        setSessionCompleted(true)

        if (userId) {
          recordSessionCompletion(userId, finalXp)
        }
      }
    }
  }

  if (loading || !currentWord) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
        <Navbar title="Learn" showBack onBack={() => router.push('/')} />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-sm font-sans-ui text-[#45474a]/60">Setting up learning session...</p>
        </div>
      </div>
    )
  }

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
        <Navbar title="Session Completed" showBack onBack={() => router.push('/')} />
        <main className="pt-24 pb-16 px-6 max-w-md mx-auto flex flex-col flex-grow w-full justify-center text-center space-y-6">
          <div className="bg-white border border-[#c5c6ca]/30 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center mx-auto text-emerald-800 font-bold text-2xl">
              ✓
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-[#010204]">Session Completed!</h2>
              <p className="text-sm text-[#45474a]/70 font-sans-ui">
                You mastered 5 words in this session.
              </p>
            </div>

            <div className="bg-[#e7eefe] border border-[#c5c6ca]/30 rounded-2xl p-4 flex justify-around items-center">
              <div>
                <span className="text-2xl font-bold text-[#010204]">+{totalXpEarned}</span>
                <p className="text-xs uppercase font-bold tracking-wider text-[#39665d]">XP Earned</p>
              </div>
              <div className="h-8 w-0.5 bg-[#c5c6ca]/30" />
              <div>
                <span className="text-2xl font-bold text-[#010204]">5</span>
                <p className="text-xs uppercase font-bold tracking-wider text-[#45474a]/60">Words</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full bg-[#010204] text-white py-4 rounded-full font-bold text-sm tracking-wider uppercase hover:bg-[#010204]/90 active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              Return Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar
        title={`Session (${wordIndex + 1}/${deck.length})`}
        showBack
        onBack={() => router.push('/')}
      />

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-[#dce2f3] z-40 pointer-events-none">
        <div
          className="h-full bg-[#010204] transition-all duration-300 ease-out"
          style={{
            width: `${((wordIndex * 6 + stageIndex + 1) / (deck.length * 6)) * 100}%`,
          }}
        />
      </div>

      <main className="pt-20 pb-8 px-6 max-w-md mx-auto flex flex-col flex-grow w-full relative z-10">
        {stageIndex === 0 && (
          <LearnStage
            word={currentWord}
            onComplete={() => setStageIndex(1)}
          />
        )}
        {stageIndex === 1 && (
          <RecognizeStage
            word={currentWord}
            distractors={distractors}
            onAnswer={(correct) => handleStageComplete(1, correct)}
          />
        )}
        {stageIndex === 2 && (
          <RebuildStage
            word={currentWord}
            onAnswer={(correct) => handleStageComplete(2, correct)}
          />
        )}
        {stageIndex === 3 && (
          <RecallStage
            word={currentWord}
            onAnswer={(correct) => handleStageComplete(3, correct)}
          />
        )}
        {stageIndex === 4 && (
          <UseStage
            word={currentWord}
            onAnswer={(correct) => handleStageComplete(4, correct)}
          />
        )}
        {stageIndex === 5 && (
          <MasterStage
            word={currentWord}
            onAnswer={(correct) => handleStageComplete(5, correct)}
          />
        )}
      </main>
    </div>
  )
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
          <p className="text-sm font-sans-ui text-[#45474a]/60">Loading learning session...</p>
        </div>
      }
    >
      <LearnSessionContent />
    </Suspense>
  )
}
