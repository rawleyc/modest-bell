// ═══════════════════════════════════════════════════
// Word Fade — Text-to-Speech Wrapper
// ═══════════════════════════════════════════════════

let polishVoice: SpeechSynthesisVoice | null = null

/**
 * Initialize voices — call once on app load.
 */
export function initSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  function loadVoices() {
    const voices = window.speechSynthesis.getVoices()
    polishVoice = voices.find((v) => v.lang.startsWith('pl')) || null
  }

  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

/**
 * Speak a Polish word using Web Speech API.
 */
export function speakPolish(text: string, rate: number = 0.8): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'pl-PL'
  utt.rate = rate
  utt.pitch = 1

  if (polishVoice) {
    utt.voice = polishVoice
  }

  window.speechSynthesis.speak(utt)
}

/**
 * Check if speech synthesis is available.
 */
export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}
