import { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, Folder, Ghost, LayoutGrid, Sparkles, Settings } from 'lucide-react';

interface TitleBarProps {
  onOpenFolder?: () => void;
  activeCount?: number;
  onGoToHub?: () => void;
  currentToolTitle?: string;
  onOpenWhatsNew?: () => void;
  hasUnreadChangelog?: boolean;
  onOpenSettings?: () => void;
  isSettingsOpen?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenFolder,
  activeCount = 0,
  onGoToHub,
  currentToolTitle,
  onOpenWhatsNew,
  hasUnreadChangelog = false,
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
    <div className="h-10 w-full bg-[#0a0a0d] border-b border-white/[0.06] flex items-center justify-between px-3.5 drag-region z-40 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onGoToHub}
          className="flex items-center gap-2.5 no-drag hover:opacity-80 transition-opacity"
          title="Go to Tools Hub"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded bg-zinc-900 border border-white/[0.08]">
            <Ghost className="w-3 h-3 text-zinc-300" />
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs font-semibold tracking-wider text-zinc-200 uppercase">
              SpectreWare
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.06]">
              1.0
            </span>
          </div>
        </button>

        {currentToolTitle && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500 pl-1 border-l border-white/[0.08]">
            <span>/</span>
            <span className="text-zinc-400">{currentToolTitle}</span>
          </div>
        )}
      </div>

      {/* Middle Active Indicator */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono">
        {activeCount > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/[0.1] text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px]">Tasks Active ({activeCount})</span>
          </div>
        ) : (
          <span className="text-[11px] text-zinc-500">Core Subsystems Operational</span>
        )}
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-0.5 no-drag">
        {onOpenWhatsNew && (
          <button
            onClick={onOpenWhatsNew}
            title="What's New / Release Notes"
            className="relative p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {hasUnreadChangelog && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        )}

        {onGoToHub && (
          <button
            onClick={onGoToHub}
            title="Tools Hub"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            title="System Settings"
            className={`p-1.5 rounded transition-colors ${
              isSettingsOpen
                ? 'text-white bg-zinc-800 border border-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        {onOpenFolder && (
          <button
            onClick={onOpenFolder}
            title="Open Downloads Folder"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <Folder className="w-3.5 h-3.5" />
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
