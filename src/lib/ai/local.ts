import { AIProvider, ExampleRequest, ExampleResponse, ExerciseRequest, ExerciseResponse } from './types'
import { ALL_WORDS } from '@/data/vocabulary'
import { generateQuestionsForWord } from '@/lib/game/engine'

export class LocalProvider implements AIProvider {
  name = 'local'

  async generateExamples(input: ExampleRequest): Promise<ExampleResponse> {
    const matchedWord = ALL_WORDS.find(
      (w) => w.word.toLowerCase() === input.word.toLowerCase() || w.id === input.word
    )

    if (matchedWord && matchedWord.exampleSentence) {
      return {
        wordId: matchedWord.id,
        word: matchedWord.word,
        examples: [
          {
            sentence: matchedWord.exampleSentence,
            translation: matchedWord.exampleTranslation || '',
          },
        ],
      }
    }

    // Default template fallback if word is not in seed vocabulary
    return {
      wordId: input.word,
      word: input.word,
      examples: [
        {
          sentence: `To jest ${input.word}.`,
          translation: `This is ${input.translation}.`,
        },
      ],
    }
  }

  async generateExercise(input: ExerciseRequest): Promise<ExerciseResponse> {
    const matchedWord = ALL_WORDS.find((w) => w.id === input.wordId) || {
      id: input.wordId,
      language: 'pl',
      word: input.word,
      translation: input.translation,
      pronunciation: '',
      partOfSpeech: 'noun',
      emoji: '📖',
      exampleSentence: input.contextSentence || `${input.word} ...`,
      exampleTranslation: input.translation,
      sentenceParts: [input.contextSentence || '', ''],
      hint: '',
      category: input.category || 'general',
      difficulty: input.difficulty || 1,
    }

    const questionsMap = generateQuestionsForWord(matchedWord)
    const question = questionsMap[input.stage]

    return {
      wordId: input.wordId,
      question,
    }
  }
}
