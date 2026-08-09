// ═══════════════════════════════════════════════════
// Word Fade — Utility Functions
// ═══════════════════════════════════════════════════

/**
 * Merge class names, filtering out falsy values.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Fisher-Yates shuffle — returns a new array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Normalize Polish text for comparison.
 * Strips diacritics so "kot" matches "kót" etc.
 * Used for lenient answer checking — we accept stripped versions.
 */
export function normalize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
}

/**
 * Check if an answer matches the correct word.
 * First tries exact match, then falls back to diacritic-normalized.
 */
export function checkAnswer(input: string, correct: string): boolean {
  const ni = input.trim().toLowerCase()
  const nc = correct.trim().toLowerCase()
  if (ni === nc) return true
  return normalize(ni) === normalize(nc)
}

/**
 * Pick N random items from an array (without replacement).
 */
export function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/**
 * Generate a seeded-looking index for deterministic missing letter selection.
 * Picks a middle character to hide — not first or last.
 */
export function getMissingLetterIndices(word: string, count: number = 1): number[] {
  const candidates: number[] = []
  for (let i = 1; i < word.length - 1; i++) {
    if (word[i] !== ' ') candidates.push(i)
  }
  // Spread picks evenly across the word
  const indices: number[] = []
  const step = Math.max(1, Math.floor(candidates.length / count))
  for (let i = 0; i < count && i * step < candidates.length; i++) {
    indices.push(candidates[i * step])
  }
  return indices
}

/**
 * Format a percentage with no decimal places.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
