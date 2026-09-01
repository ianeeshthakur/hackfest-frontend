import React from 'react';
import { X, Activity, Battery, Package, AlertTriangle, Clock } from 'lucide-react';

export function FactoryDetails({ factory, onClose }) {
  if (!factory) return null;
  const isDown = factory.status === 'DOWN';

  return (
    <div className="absolute top-4 left-4 z-[2000] w-[340px] bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between bg-slate-50">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 leading-tight">{factory.name}</h2>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">{factory.id}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 font-body">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${isDown ? 'bg-red-50 text-red-600' : factory.status === 'WARNING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {factory.status}
          </span>
          {isDown && <span className="text-[12px] text-red-600 font-medium truncate" title={factory.disruption}>{factory.disruption}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailBlock label="Capacity" value={`${factory.capacity.toLocaleString()} units/day`} />
          <DetailBlock label="Current Load" value={`${factory.currentLoad}%`} />
          <DetailBlock label="Power" value={isDown ? 'Offline' : 'Online'} highlight={isDown ? 'text-red-600' : 'text-emerald-600'} icon={Battery} />
          <DetailBlock label={isDown ? 'Orders Affected' : 'Active Orders'} value={factory.orders} highlight={isDown ? 'text-red-600' : ''} icon={Package} />
        </div>

        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
          <DetailBlock label="Current Production" value={isDown ? '0/day' : `${Math.floor((factory.capacity * factory.currentLoad) / 100).toLocaleString()}/day`} icon={Activity} />
          <DetailBlock label="Utilization" value={isDown ? '0%' : `${factory.currentLoad}%`} />
        </div>

        {isDown && (
          <div className="pt-3 border-t border-slate-100 bg-red-50/50 p-3 rounded-lg border border-red-100">
            <div className="flex items-start gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[12px] font-bold mb-1">Recovery Status</div>
                <div className="text-[11px] mb-2">Maintenance team dispatched. Issue identified in primary processing unit.</div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold bg-white px-2 py-1 rounded inline-flex border border-red-100 shadow-sm">
                  <Clock className="w-3 h-3" />
                  Est. Recovery: 6 hours
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button onClick={onClose} className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-[12px] font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          Close Details
        </button>
      </div>
    </div>
  );
}

function DetailBlock({ label, value, highlight = 'text-slate-900', icon: Icon }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 mb-0.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className={`text-[13px] font-bold ${highlight}`}>{value}</div>
    </div>
  );
}
