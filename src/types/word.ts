export type Word = {
  id: string
  language: string
  word: string
  translation: string
  pronunciation: string
  partOfSpeech: string
  emoji: string
  exampleSentence: string
  exampleTranslation: string
  sentenceParts: [string, string]
  hint: string
  crossLanguageHint?: string
  category: string
  difficulty: number
}
