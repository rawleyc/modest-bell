// ═══════════════════════════════════════════════════
// Word Fade — Game Engine (pure functions)
// ═══════════════════════════════════════════════════

import type { Word, MasteryRecord, StageResult } from './types'
import { shuffle, getMissingLetterIndices, normalize } from './utils'

/**
 * Check if user input matches target word (diacritic-tolerant).
 */
export function isAnswerCorrect(input: string, target: string): boolean {
  if (!input || !target) return false
  return normalize(input.trim()) === normalize(target.trim())
}

/**
 * Select words for a round from a category.
 * Prioritizes words with lower mastery levels.
 * Returns up to `count` words.
 */
export function selectRoundWords(
  words: Word[],
  masteryMap: Record<string, MasteryRecord>,
  count: number = 8
): Word[] {
  const sorted = [...words].sort((a, b) => {
    const ma = masteryMap[a.id]?.level ?? 0
    const mb = masteryMap[b.id]?.level ?? 0
    if (ma !== mb) return ma - mb
    return Math.random() - 0.5 // random within same tier
  })
  return sorted.slice(0, count)
}

/**
 * Get the next unmastered word from a category.
 * Returns null if all words are mastered (level >= 5).
 */
export function getNextWord(
  words: Word[],
  masteryMap: Record<string, MasteryRecord>
): Word | null {
  const sorted = [...words].sort((a, b) => {
    const ma = masteryMap[a.id]?.level ?? 0
    const mb = masteryMap[b.id]?.level ?? 0
    return ma - mb
  })

  const next = sorted.find((w) => (masteryMap[w.id]?.level ?? 0) < 5)
  return next || null
}

/**
 * Generate distractors for a multiple-choice question.
 * Pulls from the same category when possible, then from the full pool.
 */
export function generateDistractors(
  correctWord: Word,
  allWords: Word[],
  count: number = 3
): string[] {
  // Prefer same-category words for better distractors
  const sameCat = allWords.filter(
    (w) => w.category === correctWord.category && w.id !== correctWord.id
  )
  const otherCat = allWords.filter(
    (w) => w.category !== correctWord.category && w.id !== correctWord.id
  )

  const pool = [...shuffle(sameCat), ...shuffle(otherCat)]
  const distractors = pool
    .filter((w) => w.translation !== correctWord.translation)
    .slice(0, count)
    .map((w) => w.translation)

  return distractors
}

/**
 * Generate the partial word display for the Rebuild stage.
 * Returns the word split into visible chars and blank positions.
 */
export function generatePartialWord(word: string): {
  chars: (string | null)[] // null = blank
  missingIndices: number[]
  answers: string[] // the correct characters for each blank
} {
  // For short words (<=4), hide 1 letter. For longer, hide 2.
  const hideCount = word.length <= 4 ? 1 : 2
  const missingIndices = getMissingLetterIndices(word, hideCount)

  const chars = word.split('').map((ch, i) =>
    missingIndices.includes(i) ? null : ch
  )

  const answers = missingIndices.map((i) => word[i])

  return { chars, missingIndices, answers }
}

/**
 * Generate keyboard keys for the Rebuild stage.
 * Includes the correct answers plus plausible distractors.
 */
export function generateKeyboardKeys(
  correctKeys: string[],
  keyCount: number = 6
): string[] {
  const polishChars = [
    'a', 'e', 'i', 'o', 'u', 'ą', 'ę', 'ó',
    'k', 'r', 't', 'n', 's', 'z', 'ż', 'ź',
    'ć', 'ł', 'b', 'd', 'w', 'p', 'j', 'm',
  ]

  const pool = new Set(correctKeys.map((k) => k.toLowerCase()))
  const shuffledExtras = shuffle(polishChars)

  for (const ch of shuffledExtras) {
    if (pool.size >= keyCount) break
    pool.add(ch)
  }

  return shuffle([...pool]).slice(0, keyCount)
}

/**
 * Calculate accuracy percentage from a series of boolean or StageResult results.
 */
export function calculateAccuracy(results: (boolean | StageResult)[]): number {
  if (results.length === 0) return 100
  const bools = results.map((r) => (typeof r === 'boolean' ? r : r.correct))
  const correct = bools.filter(Boolean).length
  return Math.round((correct / bools.length) * 100)
}
