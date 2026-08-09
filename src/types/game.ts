import { Word } from './word'
import { Question } from './question'

export type SessionState = {
  sessionId: string
  words: Word[]
  currentWordIndex: number
  currentStage: 1 | 2 | 3 | 4 | 5
  activeQuestion: Question | null
  isCompleted: boolean
  sessionXpEarned: number
  stageHistory: {
    wordId: string
    stage: number
    correct: boolean
  }[]
}
