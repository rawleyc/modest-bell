// ═══════════════════════════════════════════════════
// Word Fade — Core Type Definitions
// ═══════════════════════════════════════════════════

export type Language = 'pl'

export type Category =
  | 'greetings'
  | 'numbers'
  | 'food'
  | 'family'
  | 'animals'
  | 'home'
  | 'body'
  | 'travel'
  | 'weather'
  | 'common-verbs'
  | 'common-adjectives'
  | 'feelings'
  | 'shopping'
  | 'university'

export type Word = {
  id: string
  language: Language
  word: string
  translation: string
  pronunciation: string
  partOfSpeech: string
  emoji: string
  exampleSentence: string
  exampleTranslation: string
  sentenceParts: [string, string] // [before blank, after blank]
  hint: string
  crossLanguageHint?: string
  category: Category
  difficulty: 1 | 2 | 3
}

export type Stage = 'learn' | 'recognize' | 'rebuild' | 'recall' | 'use' | 'master'

export const STAGE_ORDER: Stage[] = [
  'learn',
  'recognize',
  'rebuild',
  'recall',
  'use',
  'master',
]

export const STAGE_LABELS: Record<Stage, string> = {
  learn: 'Learn',
  recognize: 'Recognize',
  rebuild: 'Rebuild',
  recall: 'Recall',
  use: 'Use',
  master: 'Master',
}

export const STAGE_NUMBER: Record<Stage, number> = {
  learn: 0,
  recognize: 1,
  rebuild: 2,
  recall: 3,
  use: 4,
  master: 5,
}

export type MasteryRecord = {
  wordId: string
  level: number // 0-5
  correct: number
  wrong: number
  lastPracticed?: string // ISO date
  streak: number
}

export type UserProgress = {
  mastery: Record<string, MasteryRecord>
  totalSessions: number
  lastSessionDate?: string
}

export type StageResult = {
  stage: Stage
  correct: boolean
}

export type RoundResult = {
  wordId: string
  stageResults: StageResult[]
  accuracy: number
  completedAt: string
}

export type CategoryMeta = {
  id: Category
  name: string
  emoji: string
  description: string
  color: string // Tailwind color class for accent
}

export const CATEGORY_META: CategoryMeta[] = [
  { id: 'greetings', name: 'Greetings', emoji: '👋', description: 'Hello, goodbye, and polite phrases', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'numbers', name: 'Numbers', emoji: '🔢', description: 'Counting and basic numbers', color: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'food', name: 'Food', emoji: '🍽️', description: 'Meals, ingredients, and drinks', color: 'from-red-500/20 to-rose-500/20' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Family members and relationships', color: 'from-pink-500/20 to-fuchsia-500/20' },
  { id: 'animals', name: 'Animals', emoji: '🐾', description: 'Pets, farm, and wild animals', color: 'from-emerald-500/20 to-green-500/20' },
  { id: 'home', name: 'Home', emoji: '🏠', description: 'Rooms, furniture, and household', color: 'from-sky-500/20 to-cyan-500/20' },
  { id: 'body', name: 'Body', emoji: '🫀', description: 'Body parts and health', color: 'from-rose-500/20 to-red-500/20' },
  { id: 'travel', name: 'Travel', emoji: '✈️', description: 'Transport, directions, and places', color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'weather', name: 'Weather', emoji: '🌤️', description: 'Seasons, climate, and nature', color: 'from-cyan-500/20 to-teal-500/20' },
  { id: 'common-verbs', name: 'Common Verbs', emoji: '🏃', description: 'Essential everyday actions', color: 'from-orange-500/20 to-amber-500/20' },
  { id: 'common-adjectives', name: 'Adjectives', emoji: '🎨', description: 'Colors, sizes, and qualities', color: 'from-fuchsia-500/20 to-pink-500/20' },
  { id: 'feelings', name: 'Feelings', emoji: '💭', description: 'Emotions and states of mind', color: 'from-purple-500/20 to-violet-500/20' },
  { id: 'shopping', name: 'Shopping', emoji: '🛒', description: 'Stores, money, and buying', color: 'from-teal-500/20 to-emerald-500/20' },
  { id: 'university', name: 'University', emoji: '🎓', description: 'Academic life and learning', color: 'from-indigo-500/20 to-blue-500/20' },
]
