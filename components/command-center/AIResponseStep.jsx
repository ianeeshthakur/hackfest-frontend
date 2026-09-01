import React, { useEffect, useState } from "react";

export function AIResponseStep({ label, state, isLast }) {
  // state can be "UPCOMING", "ACTIVE", "COMPLETING", "COMPLETED"
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (state === "COMPLETING" || state === "COMPLETED") {
      setShowCheck(true);
    } else {
      setShowCheck(false);
    }
  }, [state]);

  const isActive = state === "ACTIVE" || state === "COMPLETING";
  const isCompleted = state === "COMPLETED";

  return (
    <div className="relative flex flex-col items-center flex-1">
      <div className="flex items-center justify-center w-full mb-3 relative">
        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 bg-white
          ${isActive ? "border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""}
          ${isCompleted ? "border-emerald-500" : ""}
          ${state === "UPCOMING" ? "border-slate-200" : ""}
        `}>
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-20"></div>
          )}
          
          {showCheck && (
            <svg
              className={`w-4 h-4 text-emerald-500 ${state === "COMPLETED" ? "opacity-100" : "animate-[drawCheck_0.5s_ease-out_forwards]"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: state === "COMPLETED" ? 0 : 24,
              }}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
          {!showCheck && isActive && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          )}
          {!showCheck && !isActive && (
             <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          )}
        </div>

        {!isLast && (
          <div className="absolute top-1/2 left-[50%] w-full h-[2px] -translate-y-1/2 bg-slate-100 -z-0">
             <div 
               className="h-full bg-emerald-500 transition-all duration-700 ease-in-out" 
               style={{ width: isCompleted ? "100%" : "0%" }}
             ></div>
          </div>
        )}
      </div>
      <div className={`text-xs font-semibold ${isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
        {label}
      </div>
      {isActive && (
        <div className="mt-1 flex gap-1 items-center justify-center h-4">
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drawCheck {
          0% {
            stroke-dashoffset: 24;
            opacity: 0;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1);
          }
        }
      `}} />
    </div>
  );
}
