import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import type { MaintenanceStatus } from '../types/electron';

interface MaintenanceOverlayProps {
  status: MaintenanceStatus;
  onRefresh: () => Promise<void>;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({ status, onRefresh }) => {
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    setChecking(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setChecking(false), 500);
    }
  };

  const handleCloseApp = () => {
    window.spectreAPI?.closeWindow?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06080e]/95 backdrop-blur-md p-6 select-none animate-in fade-in duration-200">
      {/* Draggable header strip so user can reposition window while locked */}
      <div className="absolute top-0 left-0 right-0 h-9 drag-region" />

      {/* Subtle Amber Glow */}
      <div
        className="absolute w-[500px] h-[340px] pointer-events-none -z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.02) 60%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-[#0f1118] border border-amber-500/20 shadow-2xl text-center space-y-5 no-drag">
        {/* Status Pill & Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Maintenance Mode Active</span>
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">
            {status.title || 'System Under Maintenance'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto font-sans">
            {status.message || 'SpectreWare core services are currently undergoing scheduled maintenance. Please check back shortly.'}
          </p>
        </div>

        {/* Estimated Time Badge if exists */}
        {status.estimatedTime && (
          <div className="inline-block px-3 py-1 rounded-lg bg-zinc-950/80 border border-white/[0.05] text-[11px] text-zinc-400 font-mono">
            Estimated time: <span className="text-zinc-200">{status.estimatedTime}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-center gap-2.5">
          <button
            onClick={handleCheck}
            disabled={checking}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking...' : 'Check Status Again'}</span>
          </button>

          <button
            onClick={handleCloseApp}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>

        {status.updatedAt && (
          <div className="text-[10px] font-mono text-zinc-600">
            Updated: {status.updatedAt}
          </div>
        )}
      </div>
    </div>
  );
};
