export type BaseQuestion = {
  id: string
  wordId: string
  stage: 1 | 2 | 3 | 4 | 5
}

export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple-choice'
  prompt: string
  options: string[]
  correctAnswer: string
  hint?: string
}

export type PartialRecallQuestion = BaseQuestion & {
  type: 'partial-recall'
  prompt: string
  scrambledTiles: string[]
  targetWord: string
}

export type RecallQuestion = BaseQuestion & {
  type: 'recall'
  prompt: string
  targetWord: string
  hint?: string
}

export type ContextQuestion = BaseQuestion & {
  type: 'context'
  sentenceParts: [string, string]
  exampleTranslation: string
  targetWord: string
}

export type ProductionQuestion = BaseQuestion & {
  type: 'production'
  englishPrompt: string
  targetWord: string
  pronunciation?: string
}

export type Question =
  | MultipleChoiceQuestion
  | PartialRecallQuestion
  | RecallQuestion
  | ContextQuestion
  | ProductionQuestion
