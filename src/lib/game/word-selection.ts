import { Word } from '@/types/word'
import { WordProgress } from '@/types/progress'
import { shuffle } from '@/lib/utils'

/**
 * Selects a prioritized list of words for a 5-word learning session.
 * Priority order:
 * 1. Overdue review words (next_review_at <= now)
 * 2. Words in progress (0 < masteryScore < 80)
 * 3. New words (never attempted)
 * 4. Mastered words occasionally
 */
export function selectSessionWords(
  allWords: Word[],
  progressMap: Record<string, WordProgress>,
  sessionSize: number = 5
): Word[] {
  const now = new Date()

  // Categorize words into priority buckets
  const overdueWords: Word[] = []
  const inProgressWords: Word[] = []
  const newWords: Word[] = []
  const masteredWords: Word[] = []

  for (const word of allWords) {
    const prog = progressMap[word.id]
    if (!prog || prog.totalAttempts === 0) {
      newWords.push(word)
    } else if (prog.nextReviewAt && new Date(prog.nextReviewAt) <= now) {
      overdueWords.push(word)
    } else if (prog.masteryScore < 80) {
      inProgressWords.push(word)
    } else {
      masteredWords.push(word)
    }
  }

  // Combine by priority
  const selected: Word[] = []

  // Add overdue words
  selected.push(...shuffle(overdueWords))

  // Add in-progress words
  if (selected.length < sessionSize) {
    selected.push(...shuffle(inProgressWords))
  }

  // Add new words
  if (selected.length < sessionSize) {
    selected.push(...shuffle(newWords))
  }

  // Add mastered words fallback if needed
  if (selected.length < sessionSize) {
    selected.push(...shuffle(masteredWords))
  }

  // Deduplicate and cap to sessionSize
  const uniqueSelected: Word[] = []
  const seenIds = new Set<string>()

  for (const w of selected) {
    if (!seenIds.has(w.id)) {
      seenIds.add(w.id)
      uniqueSelected.push(w)
      if (uniqueSelected.length === sessionSize) break
    }
  }

  return uniqueSelected
}
