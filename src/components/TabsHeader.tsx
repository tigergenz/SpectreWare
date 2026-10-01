import React from 'react';
import { DownloadCloud, Activity, History, LayoutGrid, Settings } from 'lucide-react';

export type TabType = 'downloader' | 'queue' | 'history';

interface TabsHeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  queueCount: number;
  historyCount: number;
  onBackToHub?: () => void;
  onOpenSettings?: () => void;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  currentTab,
  onTabChange,
  queueCount,
  historyCount,
  onBackToHub,
  onOpenSettings
}) => {
  const tabs = [
    {
      id: 'downloader' as TabType,
      label: 'Extractor',
      icon: DownloadCloud,
    },
    {
      id: 'queue' as TabType,
      label: 'Queue',
      icon: Activity,
      badge: queueCount > 0 ? queueCount : undefined,
    },
    {
      id: 'history' as TabType,
      label: 'Library',
      icon: History,
      badge: historyCount > 0 ? historyCount : undefined,
    },
  ];

  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-[#0a0c12]">
      <div className="flex items-center gap-2.5">
        {onBackToHub && (
          <>
            <button
              onClick={onBackToHub}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              title="Return to Tools Hub"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tools Hub</span>
            </button>
            <div className="w-[1px] h-3.5 bg-white/[0.08]" />
          </>
        )}

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950 border border-white/[0.06]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? 'bg-zinc-700 text-zinc-200 border-zinc-600'
                        : 'bg-zinc-900 text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-[11px] text-zinc-500 font-mono pr-1">YOUTUBE EXTRACTOR</span>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            title="System Settings"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
