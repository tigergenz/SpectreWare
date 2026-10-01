import React from 'react';
import { DownloadCloud, Activity, History } from 'lucide-react';

export type TabType = 'downloader' | 'queue' | 'history';

interface TabsHeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  queueCount: number;
  historyCount: number;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  currentTab,
  onTabChange,
  queueCount,
  historyCount
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
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#090b10]">
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
  );
};
