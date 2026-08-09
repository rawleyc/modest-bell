// ═══════════════════════════════════════════════════
// Word Fade — localStorage Abstraction
// ═══════════════════════════════════════════════════

import type { Category, MasteryRecord, UserProgress } from './types'

const STORAGE_KEY = 'wordfade_progress'

function getDefaultProgress(): UserProgress {
  return {
    mastery: {},
    totalSessions: 0,
    lastSessionDate: undefined,
  }
}

function getDefaultMastery(wordId: string): MasteryRecord {
  return {
    wordId,
    level: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
  }
}

/**
 * Load full user progress from localStorage.
 */
export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...getDefaultProgress(), ...JSON.parse(raw) }
    }
  } catch {
    // Corrupted data — start fresh
  }
  return getDefaultProgress()
}

export const getStoredProgress = loadProgress

/**
 * Save full user progress to localStorage.
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage full or disabled — fail silently
  }
}

/**
 * Clear all stored progress.
 */
export function clearProgress(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore error
  }
}

/**
 * Get mastery for a specific word from user progress.
 */
export function getMasteryRecord(
  progress: UserProgress,
  wordId: string
): MasteryRecord {
  return progress.mastery[wordId] || getDefaultMastery(wordId)
}

export function getMastery(wordId: string): MasteryRecord {
  const progress = loadProgress()
  return getMasteryRecord(progress, wordId)
}

/**
 * Update mastery after a stage attempt.
 * Returns the updated MasteryRecord.
 */
export function updateMastery(wordId: string, correct: boolean): MasteryRecord {
  const progress = loadProgress()
  const mastery = progress.mastery[wordId] || getDefaultMastery(wordId)

  if (correct) {
    mastery.correct++
    mastery.level = Math.min(5, mastery.level + 1)
    mastery.streak++
  } else {
    mastery.wrong++
    mastery.level = Math.max(0, mastery.level - 1)
    mastery.streak = 0
  }
  mastery.lastPracticed = new Date().toISOString()

  progress.mastery[wordId] = mastery
  saveProgress(progress)
  return mastery
}

/**
 * Update word progress after a full round based on overall round accuracy.
 */
export function updateWordProgress(wordId: string, accuracy: number): void {
  const progress = loadProgress()
  const mastery = progress.mastery[wordId] || getDefaultMastery(wordId)

  if (accuracy >= 0.8) {
    mastery.correct++
    mastery.level = Math.min(5, mastery.level + 1)
    mastery.streak++
  } else {
    mastery.wrong++
    mastery.level = Math.max(0, mastery.level - 1)
    mastery.streak = 0
  }
  mastery.lastPracticed = new Date().toISOString()

  progress.mastery[wordId] = mastery
  progress.totalSessions++
  progress.lastSessionDate = new Date().toISOString()

  saveProgress(progress)
}

/**
 * Get category-level progress statistics.
 */
export function getCategoryProgress(
  category: Category,
  wordIds: string[]
): { total: number; mastered: number; inProgress: number; averageLevel: number } {
  const progress = loadProgress()
  let mastered = 0
  let inProgress = 0
  let totalLevel = 0

  for (const id of wordIds) {
    const m = progress.mastery[id]
    if (m) {
      totalLevel += m.level
      if (m.level >= 5) mastered++
      else if (m.level > 0) inProgress++
    }
  }

  return {
    total: wordIds.length,
    mastered,
    inProgress,
    averageLevel: wordIds.length > 0 ? totalLevel / wordIds.length : 0,
  }
}

/**
 * Get overall stats across all words.
 */
export function getOverallStats(allWordIds: string[]): {
  totalWords: number
  mastered: number
  inProgress: number
  untouched: number
} {
  const progress = loadProgress()
  let mastered = 0
  let inProgress = 0

  for (const id of allWordIds) {
    const m = progress.mastery[id]
    if (m) {
      if (m.level >= 5) mastered++
      else if (m.level > 0) inProgress++
    }
  }

  return {
    totalWords: allWordIds.length,
    mastered,
    inProgress,
    untouched: allWordIds.length - mastered - inProgress,
  }
}

/**
 * Increment session count and update last session date.
 */
export function recordSession(): void {
  const progress = loadProgress()
  progress.totalSessions++
  progress.lastSessionDate = new Date().toISOString()
  saveProgress(progress)
}
