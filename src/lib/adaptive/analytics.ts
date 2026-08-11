import { AttemptRecord, WordProgress } from '@/types/progress'

export type StageAccuracy = {
  stage: 1 | 2 | 3 | 4 | 5
  stageName: string
  totalAttempts: number
  correctAttempts: number
  accuracyPercentage: number
}

export type UserWeaknessReport = {
  overallAccuracy: number
  totalAttempts: number
  weakestStage: 1 | 2 | 3 | 4 | 5
  weakestStageName: string
  stageBreakdown: Record<1 | 2 | 3 | 4 | 5, StageAccuracy>
  weakWordIds: string[]
}

const STAGE_NAMES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Recognition',
  2: 'Rebuild',
  3: 'Recall',
  4: 'Context',
  5: 'Production',
}

/**
 * Calculates detailed accuracy breakdown across all 5 stages from attempt logs.
 */
export function analyzeUserWeaknesses(
  attempts: AttemptRecord[],
  progressList: WordProgress[] = []
): UserWeaknessReport {
  const stageStats: Record<1 | 2 | 3 | 4 | 5, { total: number; correct: number }> = {
    1: { total: 0, correct: 0 },
    2: { total: 0, correct: 0 },
    3: { total: 0, correct: 0 },
    4: { total: 0, correct: 0 },
    5: { total: 0, correct: 0 },
  }

  let totalAttemptsCount = 0
  let totalCorrectCount = 0

  attempts.forEach((attempt) => {
    totalAttemptsCount++
    if (attempt.correct) totalCorrectCount++

    if (stageStats[attempt.stage]) {
      stageStats[attempt.stage].total++
      if (attempt.correct) stageStats[attempt.stage].correct++
    }
  })

  const overallAccuracy =
    totalAttemptsCount > 0 ? Math.round((totalCorrectCount / totalAttemptsCount) * 100) : 100

  const stageBreakdown: Record<1 | 2 | 3 | 4 | 5, StageAccuracy> = {
    1: { stage: 1, stageName: STAGE_NAMES[1], totalAttempts: 0, correctAttempts: 0, accuracyPercentage: 100 },
    2: { stage: 2, stageName: STAGE_NAMES[2], totalAttempts: 0, correctAttempts: 0, accuracyPercentage: 100 },
    3: { stage: 3, stageName: STAGE_NAMES[3], totalAttempts: 0, correctAttempts: 0, accuracyPercentage: 100 },
    4: { stage: 4, stageName: STAGE_NAMES[4], totalAttempts: 0, correctAttempts: 0, accuracyPercentage: 100 },
    5: { stage: 5, stageName: STAGE_NAMES[5], totalAttempts: 0, correctAttempts: 0, accuracyPercentage: 100 },
  }

  let weakestStage: 1 | 2 | 3 | 4 | 5 = 5;
  let lowestAccuracy = 101;

  const stages: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];
  stages.forEach((stg) => {
    const stat = stageStats[stg]
    const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 100

    stageBreakdown[stg] = {
      stage: stg,
      stageName: STAGE_NAMES[stg],
      totalAttempts: stat.total,
      correctAttempts: stat.correct,
      accuracyPercentage: acc,
    }

    if (stat.total > 0 && acc < lowestAccuracy) {
      lowestAccuracy = acc
      weakestStage = stg
    }
  })

  // Identify weak word IDs (mastery < 60 or high error ratio)
  const weakWordIds = progressList
    .filter((p) => p.masteryScore < 60 || p.incorrectAttempts > p.correctAttempts)
    .map((p) => p.wordId)

  return {
    overallAccuracy,
    totalAttempts: totalAttemptsCount,
    weakestStage,
    weakestStageName: STAGE_NAMES[weakestStage],
    stageBreakdown,
    weakWordIds,
  }
}
