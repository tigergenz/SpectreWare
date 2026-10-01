import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, Folder, Settings } from 'lucide-react';

interface TitleBarProps {
  onOpenFolder?: () => void;
  activeCount?: number;
  onOpenSettings?: () => void;
  isSettingsOpen?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenFolder,
  activeCount = 0,
  onOpenSettings,
  isSettingsOpen = false
}) => {
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    if (window.spectreAPI?.isMaximized) {
      window.spectreAPI.isMaximized().then(setIsMax).catch(() => {});
    }
  }, []);

  const handleMinimize = () => {
    window.spectreAPI?.minimizeWindow?.();
  };

  const handleMaximize = async () => {
    if (window.spectreAPI?.maximizeWindow) {
      const state = await window.spectreAPI.maximizeWindow();
      setIsMax(state);
    }
  };

  const handleClose = () => {
    window.spectreAPI?.closeWindow?.();
  };

  return (
    <div className="h-9 w-full bg-[#08090d] border-b border-white/[0.06] flex items-center justify-between px-3 drag-region z-40 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-1.5 font-sans pl-0.5">
        <span className="text-xs font-semibold tracking-tight text-zinc-200">
          SpectreWare
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">
          1.0
        </span>
      </div>

      {/* Middle Active Indicator */}
      <div className="hidden md:flex items-center">
        {activeCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[11px]">{activeCount} active</span>
          </div>
        )}
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-0.5 no-drag">
        {onOpenFolder && (
          <button
            onClick={onOpenFolder}
            title="Open Downloads Folder"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <Folder className="w-3.5 h-3.5" />
          </button>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            title="Preferences (Ctrl+,)"
            className={`p-1.5 rounded transition-colors ${
              isSettingsOpen
                ? 'text-white bg-zinc-800 border border-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="w-[1px] h-3 bg-white/[0.08] mx-1" />

        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Maximize */}
        <button
          onClick={handleMaximize}
          className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          title={isMax ? "Restore" : "Maximize"}
        >
          {isMax ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-rose-600/80 transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
