import { useState, useRef, useEffect, useCallback } from "react";
import { generateNeuralTTS } from "./ttsService";
import { preprocessForSpeech } from "./textPreprocessor";

export function useAudioPlayer() {
  const [playbackState, setPlaybackState] = useState("IDLE"); // IDLE, GENERATING, PLAYING, ERROR
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const currentObjectUrl = useRef(null);
  const synthRef = useRef(null); // Fallback browser TTS

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      synthRef.current = window.speechSynthesis;

      audioRef.current.onended = () => {
        setPlaybackState("IDLE");
        if (currentObjectUrl.current) {
          URL.revokeObjectURL(currentObjectUrl.current);
          currentObjectUrl.current = null;
        }
      };

      audioRef.current.onerror = () => {
        console.error("Audio playback error");
        setPlaybackState("ERROR");
      };
      
      // Add telemetry for when playback actually starts
      audioRef.current.onplay = () => {
         const t7 = performance.now();
         const ttsStartTime = parseFloat(audioRef.current.dataset.ttsStartTime || "0");
         if (ttsStartTime > 0) {
           console.log(`[TELEMETRY] Audio playback started. Time to first audio (T7 - T5): ${(t7 - ttsStartTime).toFixed(2)}ms`);
         }
         setPlaybackState("PLAYING");
      };
    }

    return () => {
      stop();
    };
  }, []);

  const stop = useCallback(() => {
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

    const t5 = performance.now();
    console.log(`[TELEMETRY] T5: TTS request started for text length: ${text.length}`);

    try {
      setPlaybackState("GENERATING");
      
      const audioUrl = await generateNeuralTTS(text, voice, speed);
      
      const t6 = performance.now();
      console.log(`[TELEMETRY] T6: First audio data received (Blob URL created). TTS API Latency: ${(t6 - t5).toFixed(2)}ms`);
      
      if (audioUrl && audioRef.current) {
        currentObjectUrl.current = audioUrl;
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = 1.0; 
        audioRef.current.dataset.ttsStartTime = t5.toString();
        
        // This will trigger the onplay event which transitions to PLAYING
        await audioRef.current.play();
      }
    } catch (error) {
      console.warn("Falling back to browser TTS:", error.message);
      
      // Fallback to browser TTS
      if (synthRef.current) {
        setPlaybackState("PLAYING");
        const cleanText = preprocessForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = speed;
        
        // Try to find a premium/female voice for the fallback
        const voices = synthRef.current.getVoices();
        const femaleVoice = voices.find(v => 
          v.name.includes("Female") || 
          v.name.includes("Samantha") || 
          v.name.includes("Victoria") || 
          v.name.includes("Google UK English")
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        utterance.onend = () => {
          setPlaybackState("IDLE");
        };
        
        synthRef.current.speak(utterance);
      } else {
        setPlaybackState("ERROR");
      }
    }
  }, [isMuted, stop]);

  return {
    play,
    stop,
    playbackState,
    isMuted,
    setIsMuted
  };
}
