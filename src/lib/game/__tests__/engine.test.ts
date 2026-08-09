import { describe, it, expect } from 'vitest'
import { validateAnswer, generateQuestionsForWord } from '../engine'
import { Word } from '@/types/word'

const sampleWord: Word = {
  id: 'pl-cat',
  language: 'pl',
  word: 'kot',
  translation: 'cat',
  pronunciation: 'koht',
  partOfSpeech: 'noun',
  emoji: '🐈',
  exampleSentence: 'Kot śpi na kanapie.',
  exampleTranslation: 'The cat is sleeping on the sofa.',
  sentenceParts: ['Kot śpi na ', '.'],
  hint: 'koht',
  category: 'animals',
  difficulty: 1,
}

const sampleWordWithDiacritics: Word = {
  id: 'pl-hello',
  language: 'pl',
  word: 'cześć',
  translation: 'hello',
  pronunciation: 'ch-eh-sh-ch',
  partOfSpeech: 'interjection',
  emoji: '👋',
  exampleSentence: 'Cześć, jak się masz?',
  exampleTranslation: 'Hello, how are you?',
  sentenceParts: ['Cześć, ', '?'],
  hint: 'ch-eh-sh-ch',
  category: 'greetings',
  difficulty: 1,
}

describe('Game Engine - validateAnswer', () => {
  it('returns exact match for identical spelling', () => {
    const res = validateAnswer('kot', 'kot')
    expect(res.correct).toBe(true)
    expect(res.exactMatch).toBe(true)
  })

  it('returns normalized match feedback for missing diacritics', () => {
    const res = validateAnswer('czesc', 'cześć')
    expect(res.correct).toBe(true)
    expect(res.exactMatch).toBe(false)
    expect(res.feedbackMessage).toContain('Almost! The exact spelling is cześć')
  })

  it('returns incorrect for wrong answers', () => {
    const res = validateAnswer('pies', 'kot')
    expect(res.correct).toBe(false)
    expect(res.exactMatch).toBe(false)
  })
})

describe('Game Engine - generateQuestionsForWord', () => {
  it('generates all 5 stages for a word', () => {
    const questions = generateQuestionsForWord(sampleWord, ['dog', 'house', 'horse'])
    expect(questions[1].stage).toBe(1)
    expect(questions[2].stage).toBe(2)
    expect(questions[3].stage).toBe(3)
    expect(questions[4].stage).toBe(4)
    expect(questions[5].stage).toBe(5)
  })
})
