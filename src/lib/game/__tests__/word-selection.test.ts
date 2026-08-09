import { describe, it, expect } from 'vitest'
import { selectSessionWords } from '../word-selection'
import { Word } from '@/types/word'
import { WordProgress } from '@/types/progress'

function createMockWord(id: string): Word {
  return {
    id,
    word: id,
    translation: `trans-${id}`,
    language: 'pl',
    category: 'general',
    difficulty: 1,
    pronunciation: id,
    partOfSpeech: 'noun',
    emoji: '📖',
    exampleSentence: `${id} example`,
    exampleTranslation: `trans-${id} example`,
    sentenceParts: [`${id} `, ' example'],
    hint: id,
  }
}

const mockWords: Word[] = [
  createMockWord('w1'),
  createMockWord('w2'),
  createMockWord('w3'),
  createMockWord('w4'),
  createMockWord('w5'),
  createMockWord('w6'),
]

describe('Word Selection Algorithm', () => {
  it('selects exact session size (5 words)', () => {
    const selected = selectSessionWords(mockWords, {}, 5)
    expect(selected.length).toBe(5)
  })

  it('prioritizes overdue review words first', () => {
    const pastDate = new Date(Date.now() - 1000 * 3600 * 24).toISOString()
    const progressMap: Record<string, WordProgress> = {
      w6: {
        userId: 'u1',
        wordId: 'w6',
        masteryScore: 50,
        correctAttempts: 5,
        incorrectAttempts: 1,
        totalAttempts: 6,
        nextReviewAt: pastDate,
      },
    }

    const selected = selectSessionWords(mockWords, progressMap, 5)
    expect(selected.some((w) => w.id === 'w6')).toBe(true)
  })
})
