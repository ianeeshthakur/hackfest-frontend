"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, User, ChevronUp } from "lucide-react";
import { useRole } from "@/lib/roleContext";
import { useDisruption } from "@/lib/disruptionContext";
import { getPageContext, getSuggestedQuestions, generateAIResponse } from "@/lib/aiAgentLogic";

export function ThreadlineAIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  const pathname = usePathname();
  const { role } = useRole();
  const disruptionContext = useDisruption(); // Contains currentConfig and simulationState
  
  const messagesEndRef = useRef(null);

  const pageContext = getPageContext(pathname, role);
  const suggestedQuestions = getSuggestedQuestions(pathname, role);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial greeting when page changes
  useEffect(() => {
    // Clear chat when page changes (optional, but requested behavior is not to unnecessarily clear.
    // User requested: "Do NOT reset the entire conversation unnecessarily when navigating. Keep the agent persistent."
    // However, we should inject a new contextual message if we switch domains significantly.
    // To keep it simple and fulfill "Keep the agent persistent", we'll just push a system message.
    
    // Instead of pushing multiple greetings, let's ensure the agent greets once on load, 
    // and just updates the Header based on `pageContext`.
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "ai",
          text: `Hello. I am your ${pageContext.title}. How can I assist you with your supply chain today?`,
        }
      ]);
    }
  }, [pathname, role, messages.length, pageContext.title]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const response = generateAIResponse(text, pathname, role, disruptionContext);
      let aiMsg;
      
      if (typeof response === "string") {
        aiMsg = { id: Date.now() + 1, sender: "ai", text: response };
      } else {
        // It's a structured object from the new engine
        aiMsg = { id: Date.now() + 1, sender: "ai", text: response.text, obj: response };
      }
      
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(input);
    }
  };

  // Render markdown-like bold tags safely
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 animate-fade-in-up"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-indigo-900/20 border border-slate-700 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative flex items-center justify-center bg-indigo-500 rounded-full p-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[13px] font-bold tracking-wide">ThreadLine AI</span>
            <span className="text-[10px] text-indigo-300 font-medium tracking-widest uppercase">{pageContext.title}</span>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden z-50 animate-fade-in-up font-body">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center bg-indigo-500 rounded-lg p-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
        <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide flex items-center gap-2">
              ThreadLine AI
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-300 uppercase tracking-widest border border-slate-700">
                {role === "owner" ? "Factory Owner" : "Buyer-Secured"}
              </span>
            </span>
            <span className="text-[11px] text-indigo-300 font-medium tracking-widest uppercase">
              {pageContext.title}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center mr-2 shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
              msg.sender === "user" 
                ? "bg-slate-800 text-white rounded-br-none" 
                : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
            }`}>
              
              {msg.sender === "user" ? (
                msg.text
              ) : (
                <div className="space-y-3">
                  
                  {/* Scenario Headers */}
                  {(msg.obj?.type === "scenario" || msg.obj?.type === "comparison") && (
                     <div className="border-b border-indigo-100 pb-2 mb-2">
                       <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">
                         AI SCENARIO ANALYSIS
                       </span>
                       <div className="text-[9px] text-slate-400">Powered by ThreadLine Scenario Engine</div>
                     </div>
                  )}

                  {/* The actual text explanation */}
                  <div>{formatText(msg.text)}</div>
                  
                  {/* Scenario Data Card */}
                  {msg.obj?.type === "scenario" && msg.obj.data && (
                    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">
                         Projected Impact
                       </div>
                       
                       <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">Risk Score</span>
                           <span className="text-[12px] font-bold text-slate-900">{msg.obj.data.current.risk} → <span className="text-red-500">{msg.obj.data.projected.risk}</span></span>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">Expected Delay</span>
                           <span className="text-[12px] font-bold text-red-500">+{msg.obj.data.projected.delay}h</span>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">Capacity</span>
                           <span className="text-[12px] font-bold text-slate-900">{msg.obj.data.current.capacityPct}% → <span className="text-amber-500">{msg.obj.data.projected.capacityPct}%</span></span>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">Orders at Risk</span>
                           <span className="text-[12px] font-bold text-slate-900">{msg.obj.data.current.ordersAtRisk} → <span className="text-red-500">{msg.obj.data.projected.ordersAtRisk}</span></span>
                         </div>
                       </div>

                       <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500">Recommended</span>
                           <span className="text-[11px] font-bold text-emerald-600">{msg.obj.data.projected.recommendedAction}</span>
                         </div>
                         <div className="flex flex-col items-end">
                           <span className="text-[10px] text-slate-500">Confidence</span>
                           <span className="text-[11px] font-bold text-indigo-600">{msg.obj.data.projected.confidence}%</span>
                         </div>
                       </div>
                       
                       {/* Assumptions Toggle */}
                       <div className="mt-3 bg-white p-2 rounded border border-slate-100">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Scenario Assumptions</span>
                         <ul className="text-[10px] text-slate-500 space-y-0.5 leading-tight">
                           {msg.obj.data.assumptions.map((a, idx) => (
                             <li key={idx} className="flex items-start gap-1"><span className="text-indigo-400">•</span> {a}</li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  )}

                  {/* Comparison Data Card */}
                  {msg.obj?.type === "comparison" && msg.obj.data?.comparisons && (
                    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">
                         Scenario Comparison
                       </div>
                       
                       <div className="w-full">
                         {/* Header row */}
                         <div className="grid grid-cols-5 gap-2 text-[10px] text-slate-500 font-bold mb-2 pb-1 border-b border-slate-200">
                           <div className="col-span-1">Action</div>
                           <div className="text-center">Risk</div>
                           <div className="text-center">Delay</div>
                           <div className="text-center">Cost</div>
                           <div className="text-center">Conf.</div>
                         </div>
                         
                         {/* Rows */}
                         {msg.obj.data.comparisons.map((comp, idx) => (
                           <div key={idx} className="grid grid-cols-5 gap-2 text-[11px] mb-2 items-center">
                             <div className="col-span-1 font-bold text-slate-700">{comp.name}</div>
                             <div className="text-center font-bold text-slate-900">{comp.risk}</div>
                             <div className="text-center font-bold text-red-500">+{comp.delay}h</div>
                             <div className="text-center font-bold text-slate-600">{comp.cost === 0 ? "₹0" : `+₹${(comp.cost/1000).toFixed(1)}k`}</div>
                             <div className="text-center font-bold text-indigo-600">{comp.confidence}%</div>
                           </div>
                         ))}
                       </div>
                       
                       {/* Assumptions Toggle */}
                       <div className="mt-3 bg-white p-2 rounded border border-slate-100">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Scenario Assumptions</span>
                         <ul className="text-[10px] text-slate-500 space-y-0.5 leading-tight">
                           {msg.obj.data.assumptions.map((a, idx) => (
                             <li key={idx} className="flex items-start gap-1"><span className="text-indigo-400">•</span> {a}</li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  )}

                  {/* Follow ups rendered inside the message bubble at the bottom */}
                  {msg.obj?.followUps && msg.obj.followUps.length > 0 && (
                     <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                       {msg.obj.followUps.map((q, i) => (
                         <button
                           key={i}
                           onClick={() => handleSend(q)}
                           className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-1 rounded-md transition-colors text-left"
                         >
                           {q}
                         </button>
                       ))}
                     </div>
                  )}

                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center ml-2 shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex w-full justify-start items-end">
            <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center mr-2 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (Chips) */}
      {!isTyping && (
        <div className="px-4 pb-2 bg-slate-50/50">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ThreadLine AI..."
            className="w-full bg-slate-50 border border-slate-200 text-[13px] text-slate-900 placeholder:text-slate-400 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
