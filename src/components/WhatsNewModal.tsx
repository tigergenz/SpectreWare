import React from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { RELEASE_HISTORY } from '../data/changelog';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentRelease = RELEASE_HISTORY[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-[#111116] border border-white/[0.09] shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Soft Ambient Glow in Modal */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 pointer-events-none -z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30, 85, 210, 0.20) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100">
                  What's New
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                  v{currentRelease.version}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {currentRelease.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Change Highlights List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {currentRelease.highlights.map((item, idx) => {
            const isNew = item.category === 'New';
            const isImproved = item.category === 'Improved';

            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-950/70 border border-white/[0.04]"
              >
                <span
                  className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                    isNew
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isImproved
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {item.category}
                </span>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="pt-2 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 transition-colors shadow-sm"
          >
            <span>Continue to SpectreWare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
