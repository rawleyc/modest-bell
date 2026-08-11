import { Word } from '@/types/word'
import { WordProgress, AttemptRecord } from '@/types/progress'
import { analyzeUserWeaknesses, UserWeaknessReport } from './analytics'

export type AdaptiveWordSelection = {
  word: Word
  targetStage: 1 | 2 | 3 | 4 | 5
  priorityReason: 'srs-due' | 'weak-word' | 'new-word' | 'mastered-refresher'
}

export type AdaptiveSession = {
  words: AdaptiveWordSelection[]
  weaknessReport: UserWeaknessReport
}

/**
 * Builds an adaptive practice session prioritizing due SRS reviews, weak words, and weak stages.
 */
export function buildAdaptiveSession(
  allWords: Word[],
  progressMap: Record<string, WordProgress> = {},
  attempts: AttemptRecord[] = [],
  sessionSize: number = 5
): AdaptiveSession {
  const progressList = Object.values(progressMap)
  const weaknessReport = analyzeUserWeaknesses(attempts, progressList)
  const now = new Date()

  const dueWords: AdaptiveWordSelection[] = []
  const weakWords: AdaptiveWordSelection[] = []
  const newWords: AdaptiveWordSelection[] = []
  const masteredWords: AdaptiveWordSelection[] = []

  allWords.forEach((word) => {
    const prog = progressMap[word.id]

    if (!prog) {
      // New word
      newWords.push({
        word,
        targetStage: 1, // Start new words at Recognition
        priorityReason: 'new-word',
      })
      return
    }

    const isDue = prog.nextReviewAt && new Date(prog.nextReviewAt) <= now
    if (isDue) {
      dueWords.push({
        word,
        targetStage: weaknessReport.weakestStage,
        priorityReason: 'srs-due',
      })
    } else if (prog.masteryScore < 60 || prog.incorrectAttempts > prog.correctAttempts) {
      weakWords.push({
        word,
        targetStage: weaknessReport.weakestStage,
        priorityReason: 'weak-word',
      })
    } else {
      masteredWords.push({
        word,
        targetStage: weaknessReport.weakestStage,
        priorityReason: 'mastered-refresher',
      })
    }
  })

  // Assemble queue in strict priority order: Due SRS -> Weak Words -> New Words -> Mastered
  const selected: AdaptiveWordSelection[] = []
  const addedIds = new Set<string>()

  const pool = [...dueWords, ...weakWords, ...newWords, ...masteredWords]

  for (const item of pool) {
    if (selected.length >= sessionSize) break
    if (!addedIds.has(item.word.id)) {
      addedIds.add(item.word.id)
      selected.push(item)
    }
  }

  return {
    words: selected,
    weaknessReport,
  }
}
