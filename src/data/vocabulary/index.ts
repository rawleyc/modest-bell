import { Word, Category } from '@/lib/types'
import { POLISH_ANIMALS } from './polish-animals'
import { POLISH_FOOD } from './polish-food'
import { POLISH_GREETINGS } from './polish-greetings'

export const ALL_WORDS: Word[] = [
  ...POLISH_ANIMALS,
  ...POLISH_FOOD,
  ...POLISH_GREETINGS,
]

export function getWordsByCategory(category: Category): Word[] {
  return ALL_WORDS.filter((w) => w.category === category)
}

export function getWordById(id: string): Word | undefined {
  return ALL_WORDS.find((w) => w.id === id)
}
