import { useState, useRef, useEffect, useCallback } from "react";
import { generateNeuralTTS } from "./ttsService";
import { preprocessForSpeech } from "./textPreprocessor";

export function useAudioPlayer() {
  const [playbackState, setPlaybackState] = useState("IDLE"); // IDLE, GENERATING, PLAYING, ERROR
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const synthRef = useRef(null); // Fallback browser TTS
  
  // Queue state
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);
  const isGenerating = useRef(false);
  const currentObjectUrl = useRef(null);
  
  // Abort controller for canceling background generation
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      synthRef.current = window.speechSynthesis;

      audioRef.current.onended = () => {
        // Clean up previous URL
        if (currentObjectUrl.current) {
          URL.revokeObjectURL(currentObjectUrl.current);
          currentObjectUrl.current = null;
        }
        isPlaying.current = false;
        playNextInQueue();
      };

      audioRef.current.onerror = () => {
        console.error("Audio playback error");
        isPlaying.current = false;
        playNextInQueue(); // try playing next chunk if one fails
      };
    }

    return () => {
      stop();
    };
  }, []);

  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length > 0) {
      const nextUrl = audioQueue.current.shift();
      if (audioRef.current) {
        currentObjectUrl.current = nextUrl;
        audioRef.current.src = nextUrl;
        audioRef.current.playbackRate = 1.0;
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
        isPlaying.current = true;
        setPlaybackState("PLAYING");
      }
    } else {
      if (!isGenerating.current) {
        setPlaybackState("IDLE");
      } else {
        setPlaybackState("GENERATING");
      }
    }
  }, []);

  const stop = useCallback(() => {
    // Cancel any ongoing generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    isGenerating.current = false;
    isPlaying.current = false;
    
    // Clear queue and revoke all unplayed URLs
    while (audioQueue.current.length > 0) {
      const url = audioQueue.current.shift();
      URL.revokeObjectURL(url);
    }

    // Stop neural audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop fallback synthesis
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    setPlaybackState("IDLE");
  }, []);

  const play = useCallback(async (text, voice = 'Aoede', speed = 0.95) => {
    if (isMuted || !text) return;

    // Immediately stop any currently playing audio (interruption)
    stop();

    const cleanText = preprocessForSpeech(text);
    if (!cleanText) return;

    // Split text into sentences for chunking using standard punctuation boundaries.
    const rawSentences = cleanText.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleanText];
    const sentences = rawSentences.map(s => s.trim()).filter(Boolean);
    
    if (sentences.length === 0) return;

    setPlaybackState("GENERATING");
    isGenerating.current = true;
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    let useFallback = false;

    // Fire all chunk generation requests in parallel immediately
    const chunkPromises = sentences.map(sentence => {
      // Return a promise that resolves to { url, error, sentence }
      return generateNeuralTTS(sentence, voice, speed, signal)
        .then(url => ({ url, error: null, sentence }))
        .catch(err => ({ url: null, error: err, sentence }));
    });

    // Process them sequentially to preserve order
    for (let i = 0; i < chunkPromises.length; i++) {
      if (signal.aborted) break;

      const result = await chunkPromises[i];
      
      if (signal.aborted) {
         if (result.url) URL.revokeObjectURL(result.url);
         break;
      }

      if (result.error && !useFallback) {
         console.warn("Neural TTS failed for a chunk, switching to browser TTS fallback:", result.error.message);
         useFallback = true;
      }

      if (!useFallback && result.url) {
        audioQueue.current.push(result.url);
        
        // If nothing is playing, start immediately!
        if (!isPlaying.current) {
          playNextInQueue();
        }
      }

      // If neural failed, we fall back to browser TTS for this and all remaining chunks
      if (useFallback) {
        if (synthRef.current) {
          // If we haven't played anything yet, we can just say the whole text cleanly
          if (i === 0 && !isPlaying.current) {
             setPlaybackState("PLAYING");
             const utterance = new SpeechSynthesisUtterance(cleanText);
             utterance.rate = speed;
             utterance.onend = () => setPlaybackState("IDLE");
             synthRef.current.speak(utterance);
             isGenerating.current = false;
             return;
          } else {
             // Append chunk to fallback queue
             const utterance = new SpeechSynthesisUtterance(result.sentence);
             utterance.rate = speed;
             if (i === chunkPromises.length - 1) {
               utterance.onend = () => setPlaybackState("IDLE");
             }
             synthRef.current.speak(utterance);
             setPlaybackState("PLAYING");
          }
        } else {
          setPlaybackState("ERROR");
        }
      }
    }
    
    isGenerating.current = false;
    
    // Edge case: if we finished generating but queue is empty and nothing is playing
    if (!isPlaying.current && audioQueue.current.length === 0 && !useFallback) {
      setPlaybackState("IDLE");
    }

  }, [isMuted, stop, playNextInQueue]);

  return {
    play,
    stop,
    playbackState,
    isMuted,
    setIsMuted
  };
}
