import { Question } from '@/types/question'

export type ExampleRequest = {
  word: string
  translation: string
  language: string
  difficulty: number
  category: string
}

export type GeneratedExample = {
  sentence: string
  translation: string
}

export type ExampleResponse = {
  wordId: string
  word: string
  examples: GeneratedExample[]
}

export type ExerciseRequest = {
  wordId: string
  word: string
  translation: string
  stage: 1 | 2 | 3 | 4 | 5
  difficulty: number
  category: string
  contextSentence?: string
}

export type ExerciseResponse = {
  wordId: string
  question: Question
}

export interface AIProvider {
  name: string
  generateExamples(input: ExampleRequest): Promise<ExampleResponse>
  generateExercise(input: ExerciseRequest): Promise<ExerciseResponse>
}
