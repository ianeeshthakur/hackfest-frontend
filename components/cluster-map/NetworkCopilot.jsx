import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Square, Activity, Send, Volume2, Minus, ChevronUp } from "lucide-react";
import { parseIntent, updateContext } from "@/lib/voiceCommands";
import { useAudioPlayer } from "@/lib/voice/useAudioPlayer";

export function NetworkCopilot({ onIntentAction }) {
  const [state, setState] = useState("IDLE"); // IDLE, LISTENING, PROCESSING, RESPONDING, ERROR
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  
  const recognitionRef = useRef(null);
  const { play, stop, playbackState, isMuted, setIsMuted } = useAudioPlayer();

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onend = () => {
          if (state === "LISTENING") {
            processTranscript(transcript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          if (event.error !== 'no-speech') {
            setState("ERROR");
            setResponseText("Microphone error or permission denied.");
          } else {
            setState("IDLE");
          }
        };
      } else {
        setState("ERROR");
        setResponseText("Speech recognition not supported in this browser. Use text.");
      }
    }
  }, [transcript, state]);

  // Sync AudioPlayer state to component UI state
  useEffect(() => {
    if (playbackState === "GENERATING") {
      setState("PROCESSING");
    } else if (playbackState === "PLAYING") {
      setState("RESPONDING");
    } else if (playbackState === "IDLE" && (state === "RESPONDING" || state === "PROCESSING")) {
      setState("IDLE");
    } else if (playbackState === "ERROR") {
      setState("ERROR");
      setResponseText("Audio playback failed.");
    }
  }, [playbackState]);

  const processTranscript = (text) => {
    if (!text.trim()) {
      setState("IDLE");
      return;
    }
    setState("PROCESSING");
    
    // Process intent instantly
    const result = parseIntent(text);
    setResponseText(result.responseText);
    
    // Execute the UI action
    onIntentAction(result);
    
    // Speak the response using Neural TTS (no artificial timeout)
    if (result.responseText) {
      play(result.responseText);
    }
  };

  const toggleListening = () => {
    if (state === "LISTENING") {
      recognitionRef.current?.stop();
      setState("PROCESSING");
    } else if (state === "RESPONDING" || state === "PROCESSING") {
      stop();
      recognitionRef.current?.stop();
      setState("IDLE");
    } else {
      setTranscript("");
      setResponseText("");
      setState("LISTENING");
      try {
        recognitionRef.current?.start();
      } catch(e) {
        console.error(e);
      }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      setTranscript(textInput);
      processTranscript(textInput);
      setTextInput("");
    }
  };

  return (
    <div className={`absolute bottom-8 right-8 z-[2000] w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden font-body flex flex-col transition-all duration-300 ${isMinimized ? "h-auto" : "h-auto"}`}>
      
      {/* Header */}
      <div 
        className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-sm">Network Copilot</span>
        </div>
        <div className="flex items-center gap-3">
          {state === "LISTENING" && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <button className="text-slate-400 hover:text-white transition-colors focus:outline-none">
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!isMinimized && (
        <>
          <div className="p-4 min-h-[120px] max-h-[250px] overflow-y-auto flex flex-col justify-center">
        {state === "IDLE" && (
          <div className="text-center text-slate-500 text-sm">
            Ask about your supply network
          </div>
        )}

        {state === "LISTENING" && (
          <div className="flex flex-col items-center">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Listening...</div>
            <div className="text-slate-800 text-center font-medium italic">
              "{transcript || "..."}"
            </div>
          </div>
        )}

        {state === "PROCESSING" && (
          <div className="flex flex-col items-center">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Analyzing...</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {state === "RESPONDING" && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-2 text-emerald-600">
              <Volume2 className="h-3 w-3 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Speaking</span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed font-medium">
              "{responseText}"
            </div>
          </div>
        )}

        {state === "ERROR" && (
          <div className="text-red-600 text-sm text-center">
            {responseText}
          </div>
        )}
      </div>

      {/* Footer / Controls */}
      <div className="border-t border-slate-100 p-3 bg-slate-50 flex items-center gap-2">
        <button
          onClick={toggleListening}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            state === "LISTENING" 
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : state === "RESPONDING" || state === "PROCESSING"
              ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
              : "bg-slate-900 text-white hover:bg-slate-700 shadow-md"
          }`}
          title={state === "LISTENING" ? "Stop listening" : state === "RESPONDING" ? "Stop speaking" : "Click to speak"}
        >
          {state === "LISTENING" ? <Square className="h-4 w-4" fill="currentColor" /> : <Mic className="h-5 w-5" />}
        </button>
        
        <form onSubmit={handleTextSubmit} className="flex-1 flex">
          <input 
            type="text" 
            placeholder="Ask the network..." 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-l-lg outline-none focus:border-slate-400"
            disabled={state === "LISTENING"}
          />
          <button 
            type="submit" 
            disabled={!textInput.trim() || state === "LISTENING"}
            className="bg-slate-200 px-2.5 rounded-r-lg border-y border-r border-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
      </>
      )}

    </div>
  );
}
