import { AIProvider, ExampleRequest, ExampleResponse, ExerciseRequest, ExerciseResponse } from './types'
import { LocalProvider } from './local'
import { ContextQuestion } from '@/types/question'

export class GeminiProvider implements AIProvider {
  name = 'gemini'
  private fallback = new LocalProvider()

  async generateExamples(input: ExampleRequest): Promise<ExampleResponse> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return this.fallback.generateExamples(input)
    }

    try {
      const prompt = `Generate 3 natural Polish example sentences for learning the vocabulary word "${input.word}" (translation: "${input.translation}", difficulty level: ${input.difficulty}/5).
Return ONLY valid JSON matching this schema:
{
  "examples": [
    { "sentence": "Polish sentence containing the word", "translation": "English translation" }
  ]
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      )

      if (!response.ok) {
        return this.fallback.generateExamples(input)
      }

      const data = await response.json()
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!textOutput) return this.fallback.generateExamples(input)

      const parsed = JSON.parse(textOutput)
      if (Array.isArray(parsed.examples) && parsed.examples.length > 0) {
        return {
          wordId: input.word,
          word: input.word,
          examples: parsed.examples.slice(0, 3),
        }
      }

      return this.fallback.generateExamples(input)
    } catch {
      return this.fallback.generateExamples(input)
    }
  }

  async generateExercise(input: ExerciseRequest): Promise<ExerciseResponse> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return this.fallback.generateExercise(input)
    }

    // Only generate AI exercises for Stage 4 (Contextual fill-in-the-blank)
    if (input.stage !== 4) {
      return this.fallback.generateExercise(input)
    }

    try {
      const prompt = `Create a Stage 4 fill-in-the-blank Polish context exercise for the word "${input.word}" (translation: "${input.translation}").
Return ONLY valid JSON matching this schema:
{
  "sentenceBefore": "Polish text before the blank",
  "sentenceAfter": "Polish text after the blank",
  "exampleTranslation": "Full English translation of the sentence"
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      )

      if (!response.ok) return this.fallback.generateExercise(input)

      const data = await response.json()
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!textOutput) return this.fallback.generateExercise(input)

      const parsed = JSON.parse(textOutput)
      if (parsed.sentenceBefore !== undefined && parsed.exampleTranslation) {
        const question: ContextQuestion = {
          id: `${input.wordId}-s4-ai`,
          wordId: input.wordId,
          stage: 4,
          type: 'context',
          sentenceParts: [parsed.sentenceBefore || '', parsed.sentenceAfter || ''],
          exampleTranslation: parsed.exampleTranslation,
          targetWord: input.word,
        }

        return {
          wordId: input.wordId,
          question,
        }
      }

      return this.fallback.generateExercise(input)
    } catch {
      return this.fallback.generateExercise(input)
    }
  }
}
