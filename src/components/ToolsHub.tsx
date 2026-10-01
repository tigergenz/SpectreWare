import React from 'react';
import { ArrowRight, Plus, Settings } from 'lucide-react';

export type ToolId = 'media-extractor';

interface ToolsHubProps {
  onSelectTool: (toolId: ToolId) => void;
  activeDownloadsCount: number;
  onOpenSettings?: () => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({
  onSelectTool,
  activeDownloadsCount,
  onOpenSettings
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-xl mx-auto w-full animate-in fade-in duration-200">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span>SpectreWare Suite</span>
            </div>
            <h1 className="text-base font-semibold text-zinc-100 tracking-tight">
              Tools & Modules
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select an active tool to begin media acquisition and extraction.
            </p>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.06] transition-colors shrink-0"
              title="Global Settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          )}
        </div>

        {/* Featured YouTube Extractor Card */}
        <div className="p-4 rounded-xl bg-[#111116] hover:bg-[#14141a] border border-white/[0.08] hover:border-zinc-600/60 transition-all shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* YouTube Official Logo Badge */}
              <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-white/[0.08] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#ff2e2e]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-zinc-100">
                    YouTube Media Extractor
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                    v1.0 • Ready
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Universal video downloader & lossless audio ripper
                </p>
              </div>
            </div>

            {activeDownloadsCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-white/[0.1] animate-pulse shrink-0">
                {activeDownloadsCount} Active
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Extract up to 4K 60FPS video streams with hardware-level FFmpeg muxing, or rip 320 kbps high-fidelity MP3/M4A audio directly from YouTube and Shorts.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {['4K UHD / 1080p', 'MP3 320kbps', 'Shorts Support', 'yt-dlp Core', 'FFmpeg Mux'].map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-white/[0.05] text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Launch Action */}
          <div className="pt-2 border-t border-white/[0.04]">
            <button
              onClick={() => onSelectTool('media-extractor')}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 transition-colors shadow-sm group"
            >
              <span>Launch Media Extractor</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Subtle Placeholder for Future Tools */}
        <div className="p-3.5 rounded-xl border border-dashed border-white/[0.06] bg-zinc-950/40 flex items-center justify-between text-zinc-500 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-zinc-600" />
            <span>Additional modules will appear here in future updates</span>
          </div>
          <span className="text-[10px] text-zinc-600">v1.1+</span>
        </div>
      </div>
    </div>
  );
};
