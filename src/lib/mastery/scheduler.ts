import { WordProgress } from '@/types/progress'

export type MasteryTier =
  | 'New'
  | 'Learning'
  | 'Familiar'
  | 'Strong'
  | 'Mastered'
  | 'Expert'

export function getMasteryTier(score: number): MasteryTier {
  if (score >= 100) return 'Expert'
  if (score >= 80) return 'Mastered'
  if (score >= 60) return 'Strong'
  if (score >= 40) return 'Familiar'
  if (score >= 20) return 'Learning'
  return 'New'
}

/**
 * Calculates score delta for a stage outcome.
 */
export function getStageScoreDelta(stage: 1 | 2 | 3 | 4 | 5, correct: boolean): number {
  if (!correct) return -10
  switch (stage) {
    case 1:
      return 5
    case 2:
      return 10
    case 3:
      return 15
    case 4:
      return 20
    case 5:
      return 25
  }
}

/**
 * Calculates the next review ISO date based on current mastery score.
 */
export function calculateNextReviewDate(score: number, fromDate: Date = new Date()): string {
  const next = new Date(fromDate.getTime())

  if (score < 20) {
    // Review in 12 hours
    next.setHours(next.getHours() + 12)
  } else if (score < 40) {
    // Review in 1 day
    next.setDate(next.getDate() + 1)
  } else if (score < 60) {
    // Review in 2 days
    next.setDate(next.getDate() + 2)
  } else if (score < 80) {
    // Review in 5 days
    next.setDate(next.getDate() + 5)
  } else if (score < 100) {
    // Review in 10 days
    next.setDate(next.getDate() + 10)
  } else {
    // Expert: Review in 30 days
    next.setDate(next.getDate() + 30)
  }

  return next.toISOString()
}

/**
 * Updates a WordProgress object after an attempt.
 */
export function calculateUpdatedProgress(
  currentProgress: WordProgress,
  stage: 1 | 2 | 3 | 4 | 5,
  correct: boolean
): WordProgress {
  const delta = getStageScoreDelta(stage, correct)
  const newScore = Math.max(0, Math.min(100, currentProgress.masteryScore + delta))
  const now = new Date().toISOString()

  return {
    ...currentProgress,
    masteryScore: newScore,
    correctAttempts: currentProgress.correctAttempts + (correct ? 1 : 0),
    incorrectAttempts: currentProgress.incorrectAttempts + (correct ? 0 : 1),
    totalAttempts: currentProgress.totalAttempts + 1,
    lastReviewedAt: now,
    nextReviewAt: calculateNextReviewDate(newScore),
  }
}
