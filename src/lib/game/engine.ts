import { Word } from '@/types/word'
import {
  Question,
  MultipleChoiceQuestion,
  PartialRecallQuestion,
  RecallQuestion,
  ContextQuestion,
  ProductionQuestion,
} from '@/types/question'
import { AttemptRecord } from '@/types/progress'
import { normalize, shuffle } from '@/lib/utils'

export type ValidationResult = {
  correct: boolean
  exactMatch: boolean
  feedbackMessage?: string
}

/**
 * Validates user answer against target Polish word.
 * Distinguishes exact match from normalized match (diacritic tolerance).
 */
export function validateAnswer(userInput: string, targetWord: string): ValidationResult {
  const cleanInput = userInput.trim()
  const cleanTarget = targetWord.trim()

  if (cleanInput === cleanTarget) {
    return { correct: true, exactMatch: true }
  }

  if (normalize(cleanInput) === normalize(cleanTarget)) {
    return {
      correct: true,
      exactMatch: false,
      feedbackMessage: `Almost! The exact spelling is ${cleanTarget}`,
    }
  }

  return { correct: false, exactMatch: false }
}

/**
 * Generates the 5 structured Stage Questions for a target word.
 */
export function generateQuestionsForWord(
  word: Word,
  distractors: string[] = []
): Record<1 | 2 | 3 | 4 | 5, Question> {
  // Stage 1: Multiple Choice
  const stage1Options = shuffle([word.translation, ...distractors]).slice(0, 4)
  const stage1: MultipleChoiceQuestion = {
    id: `${word.id}-s1`,
    wordId: word.id,
    stage: 1,
    type: 'multiple-choice',
    prompt: `What is the translation for "${word.word}"?`,
    options: stage1Options,
    correctAnswer: word.translation,
    hint: word.pronunciation,
  }

  // Stage 2: Partial Recall (Letter Tiles Scramble)
  const charTiles = shuffle(word.word.split(''))
  const stage2: PartialRecallQuestion = {
    id: `${word.id}-s2`,
    wordId: word.id,
    stage: 2,
    type: 'partial-recall',
    prompt: `Rebuild "${word.translation}" in Polish:`,
    scrambledTiles: charTiles,
    targetWord: word.word,
  }

  // Stage 3: Free Recall
  const stage3: RecallQuestion = {
    id: `${word.id}-s3`,
    wordId: word.id,
    stage: 3,
    type: 'recall',
    prompt: `Type the Polish word for "${word.translation}":`,
    targetWord: word.word,
    hint: word.pronunciation,
  }

  // Stage 4: Contextual Recall
  const sentenceParts = word.sentenceParts || ['', '']
  const stage4: ContextQuestion = {
    id: `${word.id}-s4`,
    wordId: word.id,
    stage: 4,
    type: 'context',
    sentenceParts,
    exampleTranslation: word.exampleTranslation || '',
    targetWord: word.word,
  }

  // Stage 5: Production
  const stage5: ProductionQuestion = {
    id: `${word.id}-s5`,
    wordId: word.id,
    stage: 5,
    type: 'production',
    englishPrompt: word.translation,
    targetWord: word.word,
    pronunciation: word.pronunciation,
  }

  return { 1: stage1, 2: stage2, 3: stage3, 4: stage4, 5: stage5 }
}

/**
 * Creates an atomic AttemptRecord evidence object.
 */
export function createAttemptRecord(
  userId: string,
  wordId: string,
  stage: 1 | 2 | 3 | 4 | 5,
  questionType: string,
  correct: boolean,
  usedHint: boolean = false,
  responseTimeMs?: number
): AttemptRecord {
  return {
    userId,
    wordId,
    stage,
    questionType,
    correct,
    usedHint,
    responseTimeMs,
    createdAt: new Date().toISOString(),
  }
}
