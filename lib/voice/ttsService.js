import { preprocessForSpeech } from "./textPreprocessor";

const audioCache = new Map();

/**
 * Service to handle Neural TTS generation.
 * Calls the backend API route securely.
 */
export async function generateNeuralTTS(text, voice = 'Aoede', speed = 0.95, signal = null) {
  try {
    const cleanText = preprocessForSpeech(text);
    
    if (!cleanText) return null;

    const cacheKey = `${voice}-${speed}-${cleanText}`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey);
    }

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanText,
        voice,
        speed
      }),
      signal
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('TTS_API_KEY_MISSING');
      }
      throw new Error(`TTS API failed: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    audioCache.set(cacheKey, audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.warn("Neural TTS generation failed:", error.message);
    throw error;
  }
}
