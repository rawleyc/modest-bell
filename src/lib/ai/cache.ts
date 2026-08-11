import { createClient } from '@/lib/supabase/client'
import { ExampleResponse, ExerciseResponse } from './types'

/**
 * Retrieves cached AI-generated example sentences for a given word ID.
 */
export async function getCachedExamples(wordId: string): Promise<ExampleResponse | null> {
  const supabase = createClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('generated_content')
      .select('content_json')
      .eq('word_id', wordId)
      .eq('type', 'examples')
      .single()

    if (error || !data) return null
    return data.content_json as ExampleResponse
  } catch {
    return null
  }
}

/**
 * Saves AI-generated example sentences into Supabase cache.
 */
export async function saveCachedExamples(
  wordId: string,
  examples: ExampleResponse
): Promise<void> {
  const supabase = createClient()
  if (!supabase) return

  try {
    await supabase.from('generated_content').upsert(
      {
        word_id: wordId,
        type: 'examples',
        content_json: examples,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'word_id,type' }
    )
  } catch (err) {
    console.error('Failed to cache AI examples:', err)
  }
}

/**
 * Retrieves cached AI-generated exercise for a given word ID and stage.
 */
export async function getCachedExercise(
  wordId: string,
  stage: number
): Promise<ExerciseResponse | null> {
  const supabase = createClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('generated_exercises')
      .select('exercise_json')
      .eq('word_id', wordId)
      .eq('stage', stage)
      .single()

    if (error || !data) return null
    return data.exercise_json as ExerciseResponse
  } catch {
    return null
  }
}

/**
 * Saves AI-generated exercise into Supabase cache.
 */
export async function saveCachedExercise(
  wordId: string,
  stage: number,
  exercise: ExerciseResponse
): Promise<void> {
  const supabase = createClient()
  if (!supabase) return

  try {
    await supabase.from('generated_exercises').upsert(
      {
        word_id: wordId,
        stage,
        exercise_json: exercise,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'word_id,stage' }
    )
  } catch (err) {
    console.error('Failed to cache AI exercise:', err)
  }
}
