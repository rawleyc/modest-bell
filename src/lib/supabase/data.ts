import { createClient } from './client'
import { Word } from '@/types/word'
import { WordProgress, AttemptRecord, UserProfile } from '@/types/progress'
import { ALL_WORDS } from '@/data/vocabulary'

/**
 * Fetches the vocabulary word list from Supabase, falling back to static seed data.
 */
export async function fetchVocabulary(): Promise<Word[]> {
  const supabase = createClient()
  if (!supabase) return ALL_WORDS

  try {
    const { data, error } = await supabase.from('words').select('*')
    if (error || !data || data.length === 0) {
      return ALL_WORDS
    }

    return data.map((row: any) => ({
      id: row.id,
      language: row.language || 'pl',
      word: row.word,
      translation: row.translation,
      pronunciation: row.pronunciation || '',
      partOfSpeech: row.part_of_speech || 'noun',
      emoji: row.emoji || '📖',
      exampleSentence: row.example_sentence || '',
      exampleTranslation: row.example_translation || '',
      sentenceParts: [row.example_sentence || '', ''],
      hint: row.pronunciation || '',
      category: row.category || 'general',
      difficulty: row.difficulty || 1,
    }))
  } catch {
    return ALL_WORDS
  }
}

/**
 * Seeds static vocabulary to Supabase words table if it is currently empty.
 */
export async function seedVocabularyIfEmpty(): Promise<void> {
  const supabase = createClient()
  if (!supabase) return

  try {
    const { count } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })

    if (count === 0) {
      const rowsToInsert = ALL_WORDS.map((w) => ({
        id: w.id,
        language: w.language || 'pl',
        word: w.word,
        translation: w.translation,
        pronunciation: w.pronunciation || null,
        example_sentence: w.exampleSentence || null,
        example_translation: w.exampleTranslation || null,
        category: w.category,
        difficulty: w.difficulty || 1,
      }))

      await supabase.from('words').upsert(rowsToInsert, { onConflict: 'id' })
    }
  } catch (err) {
    console.error('Failed to seed vocabulary:', err)
  }
}

/**
 * Fetches all WordProgress records for a specific user.
 */
export async function fetchUserProgress(
  userId: string
): Promise<Record<string, WordProgress>> {
  const supabase = createClient()
  const progressMap: Record<string, WordProgress> = {}
  if (!supabase || !userId) return progressMap

  try {
    const { data, error } = await supabase
      .from('word_progress')
      .select('*')
      .eq('user_id', userId)

    if (error || !data) return progressMap

    data.forEach((row: any) => {
      progressMap[row.word_id] = {
        id: row.id,
        userId: row.user_id,
        wordId: row.word_id,
        masteryScore: row.mastery_score,
        correctAttempts: row.correct_attempts,
        incorrectAttempts: row.incorrect_attempts,
        totalAttempts: row.total_attempts,
        lastReviewedAt: row.last_reviewed_at,
        nextReviewAt: row.next_review_at,
      }
    })
  } catch {
    // Return empty map on failure
  }

  return progressMap
}

/**
 * Fetches the UserProfile for a specific user.
 */
export async function fetchUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient()
  if (!supabase || !userId) return null

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      nativeLanguage: data.native_language,
      learningLanguage: data.learning_language,
      xp: data.xp,
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      lastActivityDate: data.last_activity_date,
    }
  } catch {
    return null
  }
}

/**
 * Persists an atomic attempt and updates the user's word_progress in Supabase.
 */
export async function saveAttemptAndProgress(
  userId: string,
  attempt: AttemptRecord,
  progress: WordProgress
): Promise<void> {
  const supabase = createClient()
  if (!supabase || !userId) return

  try {
    // 1. Insert attempt evidence log
    await supabase.from('attempts').insert({
      user_id: userId,
      word_id: attempt.wordId,
      stage: attempt.stage,
      question_type: attempt.questionType,
      correct: attempt.correct,
      response_time_ms: attempt.responseTimeMs || null,
      used_hint: attempt.usedHint || false,
    })

    // 2. Upsert word_progress record
    await supabase.from('word_progress').upsert(
      {
        user_id: userId,
        word_id: progress.wordId,
        mastery_score: progress.masteryScore,
        correct_attempts: progress.correctAttempts,
        incorrect_attempts: progress.incorrectAttempts,
        total_attempts: progress.totalAttempts,
        last_reviewed_at: progress.lastReviewedAt || new Date().toISOString(),
        next_review_at: progress.nextReviewAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,word_id' }
    )
  } catch (err) {
    console.error('Failed to save attempt/progress to Supabase:', err)
  }
}

/**
 * Updates streak, XP, and activity date in the user's profile after a completed session.
 */
export async function recordSessionCompletion(
  userId: string,
  xpEarned: number
): Promise<void> {
  const supabase = createClient()
  if (!supabase || !userId) return

  try {
    const profile = await fetchUserProfile(userId)
    if (!profile) return

    const todayStr = new Date().toISOString().split('T')[0]
    let newStreak = profile.currentStreak

    if (!profile.lastActivityDate) {
      newStreak = 1
    } else {
      const lastDate = new Date(profile.lastActivityDate)
      const today = new Date(todayStr)
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      )

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1
      }
      // If diffDays === 0, already completed today, streak remains same
    }

    const longestStreak = Math.max(profile.longestStreak || 0, newStreak)
    const newXp = (profile.xp || 0) + xpEarned

    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: todayStr,
        xp: newXp,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
  } catch (err) {
    console.error('Failed to update user profile session completion:', err)
  }
}
