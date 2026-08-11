import { describe, it, expect } from 'vitest'
import { analyzeUserWeaknesses } from '../analytics'
import { buildAdaptiveSession } from '../session-builder'
import { AttemptRecord, WordProgress } from '@/types/progress'
import { ALL_WORDS } from '@/data/vocabulary'

describe('Adaptive Learning Engine', () => {
  it('correctly calculates overall accuracy and identifies weakest stage', () => {
    const mockAttempts: AttemptRecord[] = [
      { userId: 'u1', wordId: 'pies', stage: 1, questionType: 'multiple-choice', correct: true },
      { userId: 'u1', wordId: 'pies', stage: 1, questionType: 'multiple-choice', correct: true },
      { userId: 'u1', wordId: 'pies', stage: 5, questionType: 'production', correct: false },
      { userId: 'u1', wordId: 'pies', stage: 5, questionType: 'production', correct: false },
    ]

    const report = analyzeUserWeaknesses(mockAttempts)
    expect(report.overallAccuracy).toBe(50)
    expect(report.weakestStage).toBe(5)
    expect(report.weakestStageName).toBe('Production')
    expect(report.stageBreakdown[1].accuracyPercentage).toBe(100)
    expect(report.stageBreakdown[5].accuracyPercentage).toBe(0)
  })

  it('builds session prioritizing due SRS reviews and weak words', () => {
    const now = new Date()
    const pastDate = new Date(now.getTime() - 86400000).toISOString()

    const mockProgress: Record<string, WordProgress> = {
      pies: {
        id: 'p1',
        userId: 'u1',
        wordId: 'pies',
        masteryScore: 30,
        correctAttempts: 1,
        incorrectAttempts: 5,
        totalAttempts: 6,
        nextReviewAt: pastDate,
      },
    }

    const session = buildAdaptiveSession(ALL_WORDS, mockProgress, [], 3)
    expect(session.words.length).toBe(3)
    expect(session.words[0].word.id).toBe('pies')
    expect(session.words[0].priorityReason).toBe('srs-due')
  })
})
