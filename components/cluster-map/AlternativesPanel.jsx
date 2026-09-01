import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import Link from 'next/link';

function getDistance(lat1, lon1, lat2, lon2) {
  // Simple approx distance in km for simulation
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

export function AlternativesPanel({ disruptedFactory, allFactories, onClose }) {
  const [accepted, setAccepted] = useState(false);
  
  if (!disruptedFactory) return null;

  const alternatives = allFactories
    .filter(f => f.type === disruptedFactory.type && f.id !== disruptedFactory.id)
    .map(f => {
       const dist = getDistance(disruptedFactory.latitude, disruptedFactory.longitude, f.latitude, f.longitude);
       return { ...f, distance: dist };
    })
    .sort((a, b) => {
       if (a.status !== b.status) return a.status === 'OPERATIONAL' ? -1 : 1;
       return a.distance - b.distance;
    });

  const recommendation = alternatives.length > 0 ? alternatives[0] : null;
  const otherAlts = alternatives.slice(1, 4);

  if (accepted && recommendation) {
    return (
      <div className="absolute top-4 right-4 bottom-4 z-[2000] w-[380px] bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-emerald-50/30">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-[18px] font-bold text-slate-900 mb-2">Alternative Secured</h2>
          <p className="text-[13px] text-slate-600 mb-6 max-w-[240px]">
            {disruptedFactory.orders} affected orders successfully reassigned.
          </p>
          
          <div className="w-full bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
              <span>From</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
              <span>To</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold text-slate-900">{disruptedFactory.id}</div>
              <div className="text-[14px] font-bold text-emerald-600">{recommendation.token}</div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">Production Impact</div>
              <div className="text-[12px] font-bold text-amber-600">+0.5 day</div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">Shipment Route</div>
              <div className="text-[12px] font-bold text-slate-900">Recalculated</div>
            </div>
          </div>

          <div className="w-full flex gap-3">
             <Link href="/global-logistics" className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-[13px] font-medium rounded-lg hover:bg-slate-800 transition-colors text-center shadow-sm">
               View Shipment Impact
             </Link>
             <button onClick={onClose} className="px-4 py-2.5 bg-white text-slate-700 text-[13px] font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm">
               Close
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 bottom-4 z-[2000] w-[380px] bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Find Alternatives
        </h2>
        <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-red-50/50 border-b border-red-100 flex-shrink-0">
        <div className="text-[13px] text-slate-800 leading-snug">
          Factory <strong>{disruptedFactory.id}</strong> is currently down.<br/>
          <span className="text-red-600 font-semibold">{disruptedFactory.orders} orders</span> are potentially affected.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
        {recommendation ? (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-200 rounded-xl p-4 shadow-sm relative overflow-hidden bg-white">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 mb-3">
               <Sparkles className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
               AI Recommendation
             </div>
             <div className="flex justify-between items-start mb-3">
               <div>
                 <div className="text-[15px] font-bold text-slate-900">{recommendation.token}</div>
                 <div className="text-[11px] text-slate-500 mt-0.5">Process: {recommendation.type}</div>
               </div>
               <div className="text-right">
                  <div className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">94% Match</div>
               </div>
             </div>
             
             <ul className="text-[11px] text-slate-700 space-y-1.5 mb-4 pl-1">
               <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Same {recommendation.type.toLowerCase()} capability</li>
               <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {Math.floor(recommendation.capacity * (100 - recommendation.currentLoad) / 100).toLocaleString()} units/day available</li>
               <li className="flex gap-2"><Navigation className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {recommendation.distance} km away</li>
               <li className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Can absorb all affected orders</li>
             </ul>

             <button onClick={() => setAccepted(true)} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg transition-colors shadow-sm">
               Accept Alternative
             </button>
          </div>
        ) : (
          <div className="text-[12px] text-slate-500 text-center py-4">No alternative factories found.</div>
        )}

        {otherAlts.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-3 ml-1">Other Options</div>
            <div className="space-y-3">
              {otherAlts.map((alt, idx) => (
                 <div key={alt.id} className="border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors bg-white shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                     <div className="text-[13px] font-bold text-slate-900">Alternative 0{idx+2}</div>
                     <div className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 rounded">{alt.token}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                     <div>
                       <div className="text-slate-400">Available</div>
                       <div className="font-semibold text-slate-700">{Math.floor(alt.capacity * (100 - alt.currentLoad) / 100).toLocaleString()} / day</div>
                     </div>
                     <div>
                       <div className="text-slate-400">Distance</div>
                       <div className="font-semibold text-slate-700">{alt.distance} km</div>
                     </div>
                   </div>
                   <div className="flex gap-2 items-center text-[11px] text-slate-600 mb-3">
                     {alt.status === 'OPERATIONAL' ? (
                       <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" /> Operational</span>
                     ) : (
                       <span className="flex items-center gap-1 text-amber-600"><ShieldAlert className="w-3 h-3" /> Warning</span>
                     )}
                     <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> Same process</span>
                   </div>
                   <button className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md hover:bg-slate-50 transition-colors shadow-sm">
                     Select Alternative
                   </button>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
