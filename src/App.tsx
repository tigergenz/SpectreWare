import { useState, useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { TabsHeader } from './components/TabsHeader';
import type { TabType } from './components/TabsHeader';
import { ToolsHub } from './components/ToolsHub';
import type { ToolId } from './components/ToolsHub';
import { SplashScreen } from './components/SplashScreen';
import { WhatsNewModal } from './components/WhatsNewModal';
import { CURRENT_APP_VERSION } from './data/changelog';
import { GLOW_THEMES } from './data/themes';
import type { GlowThemeId } from './data/themes';
import { DownloaderTab } from './components/DownloaderTab';
import { QueueTab } from './components/QueueTab';
import type { ActiveTask } from './components/QueueTab';
import { HistoryTab } from './components/HistoryTab';
import type { HistoryItem } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import type { SettingsSection } from './components/SettingsTab';
import type { DownloadParams, DownloadProgress, DownloadComplete, DownloadError, VideoInfo } from './types/electron';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [hasUnreadChangelog, setHasUnreadChangelog] = useState(false);

  // Theme & Lighting state
  const [glowTheme, setGlowTheme] = useState<GlowThemeId>(() => {
    return (localStorage.getItem('spectre_glow_theme') as GlowThemeId) || 'cobalt';
  });
  const [glowIntensity, setGlowIntensity] = useState<'subtle' | 'balanced' | 'vivid' | 'off'>(() => {
    return (localStorage.getItem('spectre_glow_intensity') as any) || 'subtle';
  });

  // Global Navigation: 'hub' | 'media-extractor' | 'settings'
  const [currentView, setCurrentView] = useState<'hub' | 'media-extractor' | 'settings'>('hub');
  const [previousView, setPreviousView] = useState<'hub' | 'media-extractor'>('hub');
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('appearance');

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

  // Check version on startup
  useEffect(() => {
    const lastVersion = localStorage.getItem('spectre_last_version');
    if (lastVersion !== CURRENT_APP_VERSION) {
      setHasUnreadChangelog(true);
    }
  }, []);

  // Global hotkeys: Ctrl+, (Settings), Esc (Close Settings/Modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        handleOpenSettings('appearance');
      } else if (e.key === 'Escape') {
        if (isWhatsNewOpen) {
          setIsWhatsNewOpen(false);
        } else if (currentView === 'settings') {
          setCurrentView(previousView);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, previousView, isWhatsNewOpen]);

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

          // Optional auto-open folder
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

  const handleFinishSplash = () => {
    setIsLoading(false);
    const lastVersion = localStorage.getItem('spectre_last_version');
    if (lastVersion !== CURRENT_APP_VERSION) {
      setIsWhatsNewOpen(true);
    }
  };

  const handleCloseWhatsNew = () => {
    setIsWhatsNewOpen(false);
    setHasUnreadChangelog(false);
    localStorage.setItem('spectre_last_version', CURRENT_APP_VERSION);
  };

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
    setCurrentTab('queue'); // Auto-switch to live queue tab

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

  const handleToggleAutoClipboard = (val: boolean) => {
    setAutoClipboard(val);
    localStorage.setItem('spectre_auto_clip', String(val));
  };

  const handleChangePreferredQuality = (val: string) => {
    setPreferredQuality(val);
    localStorage.setItem('spectre_pref_quality', val);
  };

  const handleChangePreferredAudioBitrate = (val: string) => {
    setPreferredAudioBitrate(val);
    localStorage.setItem('spectre_pref_audio_bitrate', val);
  };

  const handleToggleAutoOpenFolder = (val: boolean) => {
    setAutoOpenFolderOnComplete(val);
    localStorage.setItem('spectre_auto_open_folder', String(val));
  };

  const handleToggleEmbedThumbnails = (val: boolean) => {
    setEmbedThumbnails(val);
    localStorage.setItem('spectre_embed_thumbnails', String(val));
  };

  const handleChangeGlowTheme = (themeId: GlowThemeId) => {
    setGlowTheme(themeId);
    localStorage.setItem('spectre_glow_theme', themeId);
  };

  const handleChangeGlowIntensity = (intensity: 'subtle' | 'balanced' | 'vivid' | 'off') => {
    setGlowIntensity(intensity);
    localStorage.setItem('spectre_glow_intensity', intensity);
  };

  const handleSelectTool = (toolId: ToolId) => {
    if (toolId === 'media-extractor') {
      setCurrentView('media-extractor');
      setCurrentTab('downloader');
    }
  };

  const handleGoToHub = () => {
    setCurrentView('hub');
  };

  const handleOpenSettings = (section: SettingsSection = 'appearance') => {
    if (currentView === 'settings' && settingsSection === section) {
      setCurrentView(previousView);
    } else {
      if (currentView !== 'settings') {
        setPreviousView(currentView);
      }
      setSettingsSection(section);
      setCurrentView('settings');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#06080e] text-zinc-100 overflow-hidden font-sans border border-white/[0.08]">
      {/* Minimal Splash Loading Overlay on Startup with Dynamic Glow */}
      {isLoading && (
        <SplashScreen onFinish={handleFinishSplash} glowTheme={glowTheme} />
      )}

      {/* What's New / Release Notes Modal */}
      <WhatsNewModal isOpen={isWhatsNewOpen} onClose={handleCloseWhatsNew} />

      {/* Frameless Top Bar */}
      <TitleBar
        onOpenFolder={handleOpenFolder}
        activeCount={activeTasks.length}
        onGoToHub={handleGoToHub}
        currentToolTitle={
          currentView === 'media-extractor'
            ? 'Media Extractor'
            : currentView === 'settings'
            ? 'Settings'
            : undefined
        }
        onOpenWhatsNew={() => setIsWhatsNewOpen(true)}
        hasUnreadChangelog={hasUnreadChangelog}
        onOpenSettings={() => handleOpenSettings('appearance')}
        isSettingsOpen={currentView === 'settings'}
      />

      {/* When inside Media Extractor, render its tool-specific tabs */}
      {currentView === 'media-extractor' && (
        <TabsHeader
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          queueCount={activeTasks.length}
          historyCount={historyItems.length}
          onBackToHub={handleGoToHub}
          onOpenSettings={() => handleOpenSettings('extractor')}
        />
      )}

      {/* Main View Area with Dynamic Ambient Glow */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#06080e] relative overflow-hidden">
        {/* Dynamic Ambient Glow Layer */}
        {glowIntensity !== 'off' && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[740px] h-[450px] pointer-events-none -z-0 transition-all duration-500 ease-in-out"
            style={{
              background: `radial-gradient(ellipse at center, ${activeGlowTheme.rgbaCenter} 0%, ${activeGlowTheme.rgbaEdge} 60%, transparent 80%)`,
              filter: glowIntensity === 'vivid' ? 'blur(60px)' : glowIntensity === 'balanced' ? 'blur(52px)' : 'blur(45px)',
              opacity: glowIntensity === 'vivid' ? 2.2 : glowIntensity === 'balanced' ? 1.6 : 1.0,
            }}
          />
        )}

        {currentView === 'settings' ? (
          <SettingsTab
            onBack={() => setCurrentView(previousView)}
            backLabel={previousView === 'hub' ? 'Back to Hub' : 'Back to Extractor'}
            initialSection={settingsSection}
            defaultOutputDir={defaultOutputDir}
            onSelectOutputDir={handleSelectOutputDir}
            onOpenFolder={handleOpenFolder}
            autoClipboard={autoClipboard}
            onToggleAutoClipboard={handleToggleAutoClipboard}
            preferredQuality={preferredQuality}
            onChangePreferredQuality={handleChangePreferredQuality}
            preferredAudioBitrate={preferredAudioBitrate}
            onChangePreferredAudioBitrate={handleChangePreferredAudioBitrate}
            autoOpenFolderOnComplete={autoOpenFolderOnComplete}
            onToggleAutoOpenFolder={handleToggleAutoOpenFolder}
            embedThumbnails={embedThumbnails}
            onToggleEmbedThumbnails={handleToggleEmbedThumbnails}
            glowTheme={glowTheme}
            onChangeGlowTheme={handleChangeGlowTheme}
            glowIntensity={glowIntensity}
            onChangeGlowIntensity={handleChangeGlowIntensity}
            onOpenWhatsNew={() => setIsWhatsNewOpen(true)}
          />
        ) : currentView === 'hub' ? (
          <ToolsHub
            onSelectTool={handleSelectTool}
            activeDownloadsCount={activeTasks.length}
            onOpenSettings={() => handleOpenSettings('appearance')}
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
    </div>
  );
}

export default App;
