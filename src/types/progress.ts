export type WordProgress = {
  id?: string
  userId: string
  wordId: string
  masteryScore: number // 0 to 100
  correctAttempts: number
  incorrectAttempts: number
  totalAttempts: number
  lastReviewedAt?: string
  nextReviewAt?: string
}

export type AttemptRecord = {
  id?: string
  userId: string
  wordId: string
  stage: 1 | 2 | 3 | 4 | 5
  questionType: string
  correct: boolean
  responseTimeMs?: number
  usedHint?: boolean
  createdAt?: string
}

export type UserProfile = {
  id: string
  username?: string
  displayName: string
  nativeLanguage: string
  learningLanguage: string
  xp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate?: string
}
