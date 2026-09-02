import React, { useEffect, useState } from "react";

export function AIResponseStep({ label, state, isLast, subSteps = [], activeIndex = -1, subStepStatus = "UPCOMING" }) {
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
      {/* Main Node */}
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
      
      <div className={`text-xs font-semibold transition-colors duration-300 ${isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
        {label}
      </div>

      {/* Sub-steps Container (Absolute positioned to not affect main timeline flow) */}
      {isActive && subSteps.length > 0 && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-start w-[200px]">
          {/* Vertical connector from main node down to sub-steps */}
          <div className="absolute left-4 -top-6 w-[1.5px] h-6 bg-slate-200"></div>
          
          <div className="relative pl-4 w-full">
            {/* The vertical trunk for the sub-steps */}
            <div className="absolute left-4 top-2 bottom-4 w-[1.5px] bg-slate-100 z-0"></div>
            
            {subSteps.map((stepText, idx) => {
              const isSubActive = idx === activeIndex && subStepStatus === "ACTIVE";
              const isSubCompleting = idx === activeIndex && subStepStatus === "COMPLETED";
              const isSubCompleted = idx < activeIndex || isSubCompleting || state === "COMPLETING";
              const isSubUpcoming = idx > activeIndex && state === "ACTIVE";

              return (
                <div key={idx} className="relative z-10 flex items-center gap-3 mb-3 last:mb-0 w-full group">
                  {/* Branch connector */}
                  <div className="absolute left-0 top-1/2 w-3 h-[1.5px] bg-slate-100 -z-10"></div>
                  
                  {/* Icon Node */}
                  <div className="relative shrink-0 flex items-center justify-center w-[18px] h-[18px] bg-white">
                    {isSubCompleted ? (
                      <svg
                        className={`w-3.5 h-3.5 text-emerald-500 ${isSubCompleting ? "animate-[drawCheck_0.4s_ease-out_forwards]" : "opacity-100"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: 24,
                          strokeDashoffset: isSubCompleting ? 24 : 0,
                        }}
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isSubActive ? (
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"></div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 border border-slate-300"></div>
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className={`text-[11px] font-medium leading-tight transition-colors duration-300 ${
                    isSubCompleted ? "text-emerald-700" :
                    isSubActive ? "text-blue-700 font-bold" :
                    "text-slate-400"
                  }`}>
                    {stepText}
                  </div>
                </div>
              );
            })}
          </div>
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
