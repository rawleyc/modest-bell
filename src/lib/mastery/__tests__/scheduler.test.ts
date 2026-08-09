import { describe, it, expect } from 'vitest'
import {
  getMasteryTier,
  getStageScoreDelta,
  calculateNextReviewDate,
  calculateUpdatedProgress,
} from '../scheduler'
import { WordProgress } from '@/types/progress'

describe('Mastery Scheduler - Tiers & Deltas', () => {
  it('resolves correct mastery tiers', () => {
    expect(getMasteryTier(0)).toBe('New')
    expect(getMasteryTier(15)).toBe('New')
    expect(getMasteryTier(20)).toBe('Learning')
    expect(getMasteryTier(40)).toBe('Familiar')
    expect(getMasteryTier(60)).toBe('Strong')
    expect(getMasteryTier(80)).toBe('Mastered')
    expect(getMasteryTier(100)).toBe('Expert')
  })

  it('calculates correct score deltas per stage', () => {
    expect(getStageScoreDelta(1, true)).toBe(5)
    expect(getStageScoreDelta(2, true)).toBe(10)
    expect(getStageScoreDelta(3, true)).toBe(15)
    expect(getStageScoreDelta(4, true)).toBe(20)
    expect(getStageScoreDelta(5, true)).toBe(25)
    expect(getStageScoreDelta(1, false)).toBe(-10)
    expect(getStageScoreDelta(5, false)).toBe(-10)
  })
})

describe('Mastery Scheduler - Progress Calculations', () => {
  const initialProg: WordProgress = {
    userId: 'user1',
    wordId: 'pl-kot',
    masteryScore: 0,
    correctAttempts: 0,
    incorrectAttempts: 0,
    totalAttempts: 0,
  }

  it('increases score and clamps at 100', () => {
    const updated = calculateUpdatedProgress(
      { ...initialProg, masteryScore: 90 },
      5,
      true
    )
    expect(updated.masteryScore).toBe(100)
    expect(updated.correctAttempts).toBe(1)
    expect(updated.totalAttempts).toBe(1)
  })

  it('decreases score on failure and clamps at 0', () => {
    const updated = calculateUpdatedProgress(initialProg, 1, false)
    expect(updated.masteryScore).toBe(0)
    expect(updated.incorrectAttempts).toBe(1)
    expect(updated.totalAttempts).toBe(1)
  })

  it('calculates future nextReviewAt date', () => {
    const now = new Date()
    const updated = calculateUpdatedProgress(
      { ...initialProg, masteryScore: 50 },
      4,
      true
    )
    expect(updated.nextReviewAt).toBeDefined()
    expect(new Date(updated.nextReviewAt!).getTime()).toBeGreaterThan(now.getTime())
  })
})
