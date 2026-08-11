import { AIProvider } from './types'
import { LocalProvider } from './local'
import { GeminiProvider } from './gemini'

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER?.toLowerCase() || 'local'

  switch (providerName) {
    case 'gemini':
      return new GeminiProvider()
    case 'local':
    default:
      return new LocalProvider()
  }
}
