import { useState } from 'react';
import { Play, Folder, Trash2, Search, History } from 'lucide-react';

export interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  uploader: string;
  filePath: string;
  outputDir: string;
  type: 'video' | 'audio';
  quality: string;
  format: string;
  completedAt: string;
}

interface HistoryTabProps {
  items: HistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  items,
  onClearHistory,
  onDeleteItem
}) => {
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [missingFileId, setMissingFileId] = useState<string | null>(null);

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.uploader.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenFile = async (item: HistoryItem) => {
    if (window.spectreAPI?.openFile) {
      const opened = await window.spectreAPI.openFile(item.filePath);
      if (!opened) {
        setMissingFileId(item.id);
        setTimeout(() => setMissingFileId(null), 3500);
      }
    }
  };

  const handleOpenFolder = (dirPath: string) => {
    window.spectreAPI?.openFolder?.(dirPath);
  };

  const handleClearWithConfirm = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    } else {
      onClearHistory();
      setConfirmClear(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center">
          <History className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-zinc-300">No Downloads Yet</h3>
          <p className="text-[11px] text-zinc-500">Finished downloads will be recorded here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
      {/* Top Bar with Search & Clear */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library..."
            className="w-full bg-[#111116] border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-500"
          />
        </div>

        <button
          onClick={handleClearWithConfirm}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
            confirmClear
              ? 'text-rose-400 bg-rose-950/60 border border-rose-800/80 font-medium'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
          }`}
          title={confirmClear ? "Click again to confirm deleting all history" : "Clear History"}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{confirmClear ? 'Confirm Delete All?' : 'Clear History'}</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-[#111116] hover:bg-[#15151c] border border-white/[0.06] hover:border-zinc-700 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-16 aspect-video rounded overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono px-1 bg-black/80 rounded text-zinc-400">
                  {item.format.toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-medium text-zinc-200 truncate max-w-md" title={item.title}>
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>{item.uploader}</span>
                  <span>•</span>
                  <span className="font-mono text-zinc-400">{item.quality}</span>
                  <span>•</span>
                  <span className="text-[10px] text-zinc-600">{item.completedAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenFile(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-all"
                  title="Play Media"
                >
                  <Play className="w-3 h-3 fill-zinc-200 text-zinc-200" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => handleOpenFolder(item.outputDir)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Show in Folder"
                >
                  <Folder className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                  title="Remove from List"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {missingFileId === item.id && (
                <span className="text-[10px] text-rose-400 font-mono animate-in fade-in">
                  File moved or deleted
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
