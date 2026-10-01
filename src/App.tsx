import { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { TabsHeader } from './components/TabsHeader';
import type { TabType } from './components/TabsHeader';
import { GLOW_THEMES } from './data/themes';
import type { GlowThemeId } from './data/themes';
import { DownloaderTab } from './components/DownloaderTab';
import { QueueTab } from './components/QueueTab';
import type { ActiveTask } from './components/QueueTab';
import { HistoryTab } from './components/HistoryTab';
import type { HistoryItem } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import { MaintenanceOverlay } from './components/MaintenanceOverlay';
import type { DownloadParams, DownloadProgress, DownloadComplete, DownloadError, VideoInfo, MaintenanceStatus } from './types/electron';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    return new URLSearchParams(window.location.search).get('settings') === 'true';
  });

  // Theme & Lighting state
  const [glowTheme, setGlowTheme] = useState<GlowThemeId>(() => {
    return (localStorage.getItem('spectre_glow_theme') as GlowThemeId) || 'cobalt';
  });
  const [glowIntensity, setGlowIntensity] = useState<'subtle' | 'balanced' | 'vivid' | 'off'>(() => {
    return (localStorage.getItem('spectre_glow_intensity') as any) || 'subtle';
  });

  // Tool-specific tab
  const [currentTab, setCurrentTab] = useState<TabType>('downloader');
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('spectre_history');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [defaultOutputDir, setDefaultOutputDir] = useState<string>('');
  const [autoClipboard, setAutoClipboard] = useState<boolean>(() => {
    return localStorage.getItem('spectre_auto_clip') === 'true';
  });
  const [preferredQuality, setPreferredQuality] = useState<string>(() => {
    return localStorage.getItem('spectre_pref_quality') || '1080';
  });
  const [preferredAudioBitrate, setPreferredAudioBitrate] = useState<string>(() => {
    return localStorage.getItem('spectre_pref_audio_bitrate') || '320';
  });
  const [autoOpenFolderOnComplete, setAutoOpenFolderOnComplete] = useState<boolean>(() => {
    return localStorage.getItem('spectre_auto_open_folder') === 'true';
  });
  const [embedThumbnails, setEmbedThumbnails] = useState<boolean>(() => {
    return localStorage.getItem('spectre_embed_thumbnails') !== 'false';
  });

  const activeGlowTheme = GLOW_THEMES.find((t) => t.id === glowTheme) || GLOW_THEMES[0];

  // Hotkeys: Ctrl+, to toggle settings, Esc to close settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen]);

  // Real-time Maintenance / Killswitch state
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus | null>(null);

  const checkMaintenance = async () => {
    try {
      if (window.spectreAPI?.checkMaintenanceStatus) {
        const res = await window.spectreAPI.checkMaintenanceStatus();
        setMaintenanceStatus(res);
      }
    } catch (err) {
      console.error('Failed to check maintenance status:', err);
    }
  };

  // Poll maintenance mode on startup and periodically (every 30s)
  useEffect(() => {
    checkMaintenance();
    const timer = setInterval(checkMaintenance, 30000);
    return () => clearInterval(timer);
  }, []);

  // Load default output directory from Electron on startup
  useEffect(() => {
    const initApp = async () => {
      try {
        if (window.spectreAPI?.getDefaultDownloadPath) {
          const dir = await window.spectreAPI.getDefaultDownloadPath();
          setDefaultOutputDir(dir);
        }
      } catch (err) {
        console.error('Failed to get default path:', err);
      }
    };
    initApp();
  }, []);

  // Listen for real-time progress events from Electron
  useEffect(() => {
    if (!window.spectreAPI) return;

    const unsubProgress = window.spectreAPI.onDownloadProgress((data: DownloadProgress) => {
      setActiveTasks((prev) =>
        prev.map((task) => {
          if (task.params.id === data.id) {
            return {
              ...task,
              progress: {
                ...task.progress,
                ...data
              }
            };
          }
          return task;
        })
      );
    });

    const unsubComplete = window.spectreAPI.onDownloadComplete((data: DownloadComplete) => {
      setActiveTasks((prev) => {
        const finishedTask = prev.find((t) => t.params.id === data.id);
        if (finishedTask) {
          const newItem: HistoryItem = {
            id: finishedTask.params.id,
            title: finishedTask.info.title,
            thumbnail: finishedTask.info.thumbnail,
            uploader: finishedTask.info.uploader,
            filePath: data.filePath,
            outputDir: data.outputDir,
            type: finishedTask.params.type,
            quality: finishedTask.params.type === 'video' ? `${finishedTask.params.quality}p` : `${finishedTask.params.audioBitrate}k`,
            format: finishedTask.params.type === 'video' ? 'mp4' : (finishedTask.params.audioFormat || 'mp3'),
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setHistoryItems((hist) => {
            const updated = [newItem, ...hist];
            localStorage.setItem('spectre_history', JSON.stringify(updated));
            return updated;
          });

          if (autoOpenFolderOnComplete) {
            window.spectreAPI?.openFolder?.(data.outputDir);
          }
        }
        return prev.filter((t) => t.params.id !== data.id);
      });
    });

    const unsubError = window.spectreAPI.onDownloadError((data: DownloadError) => {
      console.error('Download error:', data);
      setActiveTasks((prev) => prev.filter((t) => t.params.id !== data.id));
    });

    return () => {
      unsubProgress?.();
      unsubComplete?.();
      unsubError?.();
    };
  }, [autoOpenFolderOnComplete]);

  // Trigger download action
  const handleStartDownload = async (params: DownloadParams, info: VideoInfo) => {
    const newTask: ActiveTask = {
      params,
      info,
      startTime: Date.now(),
      progress: {
        id: params.id,
        percent: 0,
        speed: 'Connecting...',
        eta: '--:--',
        totalSize: 'Analyzing...',
        status: 'downloading'
      }
    };

    setActiveTasks((prev) => [newTask, ...prev]);
    setCurrentTab('queue');

    try {
      if (window.spectreAPI?.startDownload) {
        await window.spectreAPI.startDownload(params);
      }
    } catch (err) {
      console.error('Failed to start download:', err);
      setActiveTasks((prev) => prev.filter((t) => t.params.id !== params.id));
    }
  };

  const handleCancelTask = async (id: string) => {
    try {
      if (window.spectreAPI?.cancelDownload) {
        await window.spectreAPI.cancelDownload(id);
      }
      setActiveTasks((prev) => prev.filter((t) => t.params.id !== id));
    } catch (err) {
      console.error('Failed to cancel task:', err);
    }
  };

  const handleOpenFolder = () => {
    window.spectreAPI?.openFolder?.(defaultOutputDir);
  };

  const handleSelectOutputDir = async () => {
    if (window.spectreAPI?.selectFolder) {
      const res = await window.spectreAPI.selectFolder();
      if (res) {
        setDefaultOutputDir(res);
      }
      return res;
    }
    return null;
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('spectre_history');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => {
      const updated = prev.filter((x) => x.id !== id);
      localStorage.setItem('spectre_history', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#06080e] text-zinc-100 overflow-hidden font-sans border border-white/[0.08]">
      {/* Top Title Bar */}
      <TitleBar
        onOpenFolder={handleOpenFolder}
        activeCount={activeTasks.length}
        onOpenSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        isSettingsOpen={isSettingsOpen}
      />

      {/* Segmented Navigation (Clean tabs, hidden when in preferences) */}
      {!isSettingsOpen && (
        <TabsHeader
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          queueCount={activeTasks.length}
          historyCount={historyItems.length}
        />
      )}

      {/* Main View Area with Dynamic Ambient Glow */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#06080e] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        {glowIntensity !== 'off' && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] pointer-events-none -z-0 transition-all duration-500 ease-in-out"
            style={{
              background: `radial-gradient(ellipse at center, ${activeGlowTheme.rgbaCenter} 0%, ${activeGlowTheme.rgbaEdge} 60%, transparent 80%)`,
              filter: glowIntensity === 'vivid' ? 'blur(56px)' : glowIntensity === 'balanced' ? 'blur(48px)' : 'blur(40px)',
              opacity: glowIntensity === 'vivid' ? 1.8 : glowIntensity === 'balanced' ? 1.2 : 0.8,
            }}
          />
        )}

        {isSettingsOpen ? (
          <SettingsTab
            onBack={() => setIsSettingsOpen(false)}
            backLabel="Back to Extractor"
            defaultOutputDir={defaultOutputDir}
            onSelectOutputDir={handleSelectOutputDir}
            onOpenFolder={handleOpenFolder}
            autoClipboard={autoClipboard}
            onToggleAutoClipboard={(v) => {
              setAutoClipboard(v);
              localStorage.setItem('spectre_auto_clip', String(v));
            }}
            preferredQuality={preferredQuality}
            onChangePreferredQuality={(v) => {
              setPreferredQuality(v);
              localStorage.setItem('spectre_pref_quality', v);
            }}
            preferredAudioBitrate={preferredAudioBitrate}
            onChangePreferredAudioBitrate={(v) => {
              setPreferredAudioBitrate(v);
              localStorage.setItem('spectre_pref_audio_bitrate', v);
            }}
            autoOpenFolderOnComplete={autoOpenFolderOnComplete}
            onToggleAutoOpenFolder={(v) => {
              setAutoOpenFolderOnComplete(v);
              localStorage.setItem('spectre_auto_open_folder', String(v));
            }}
            embedThumbnails={embedThumbnails}
            onToggleEmbedThumbnails={(v) => {
              setEmbedThumbnails(v);
              localStorage.setItem('spectre_embed_thumbnails', String(v));
            }}
            glowTheme={glowTheme}
            onChangeGlowTheme={(t) => {
              setGlowTheme(t);
              localStorage.setItem('spectre_glow_theme', t);
            }}
            glowIntensity={glowIntensity}
            onChangeGlowIntensity={(i) => {
              setGlowIntensity(i);
              localStorage.setItem('spectre_glow_intensity', i);
            }}
          />
        ) : (
          <>
            {currentTab === 'downloader' && (
              <DownloaderTab
                onStartDownload={handleStartDownload}
                defaultOutputDir={defaultOutputDir}
                onSelectOutputDir={handleSelectOutputDir}
                onOpenFolder={handleOpenFolder}
                preferredQuality={preferredQuality}
                preferredAudioBitrate={preferredAudioBitrate}
                embedThumbnails={embedThumbnails}
              />
            )}

            {currentTab === 'queue' && (
              <QueueTab tasks={activeTasks} onCancelTask={handleCancelTask} />
            )}

            {currentTab === 'history' && (
              <HistoryTab
                items={historyItems}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteHistoryItem}
              />
            )}
          </>
        )}
      </main>
      
      {/* Real-time Maintenance Mode Overlay */}
      {maintenanceStatus?.maintenance && (
        <MaintenanceOverlay status={maintenanceStatus} onRefresh={checkMaintenance} />
      )}
    </div>
  );
}

export default App;
