import { describe, it, expect } from 'vitest'
import { getAIProvider } from '../provider'
import { LocalProvider } from '../local'
import { GeminiProvider } from '../gemini'

describe('AI Provider Abstraction Layer', () => {
  it('defaults to LocalProvider when AI_PROVIDER is unconfigured or set to local', () => {
    delete process.env.AI_PROVIDER
    const provider = getAIProvider()
    expect(provider.name).toBe('local')
    expect(provider).toBeInstanceOf(LocalProvider)
  })

  it('instantiates GeminiProvider when AI_PROVIDER=gemini', () => {
    process.env.AI_PROVIDER = 'gemini'
    const provider = getAIProvider()
    expect(provider.name).toBe('gemini')
    expect(provider).toBeInstanceOf(GeminiProvider)
  })

  it('LocalProvider generates examples deterministically', async () => {
    const local = new LocalProvider()
    const result = await local.generateExamples({
      word: 'pies',
      translation: 'dog',
      language: 'pl',
      difficulty: 1,
      category: 'animals',
    })

    expect(result.word).toBe('pies')
    expect(result.examples.length).toBeGreaterThan(0)
    expect(result.examples[0].sentence).toBeDefined()
  })

  it('LocalProvider generates structured exercise for Stage 4', async () => {
    const local = new LocalProvider()
    const result = await local.generateExercise({
      wordId: 'pies',
      word: 'pies',
      translation: 'dog',
      stage: 4,
      difficulty: 1,
      category: 'animals',
    })

    expect(result.wordId).toBe('pies')
    expect(result.question.stage).toBe(4)
    expect(result.question.type).toBe('context')
  })

  it('GeminiProvider falls back to LocalProvider when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY
    const gemini = new GeminiProvider()

    const result = await gemini.generateExercise({
      wordId: 'pies',
      word: 'pies',
      translation: 'dog',
      stage: 4,
      difficulty: 1,
      category: 'animals',
    })

    expect(result.question.stage).toBe(4)
    expect(result.question.wordId).toBe('pies')
  })
})
