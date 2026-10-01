import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  ArrowLeft,
  Palette,
  Sliders,
  DownloadCloud,
  FolderOpen,
  Film,
  Music,
} from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';
import { GLOW_THEMES } from '../data/themes';
import type { GlowThemeId } from '../data/themes';

export type SettingsSection = 'appearance' | 'general' | 'extractor' | 'system';

interface SettingsTabProps {
  onBack: () => void;
  backLabel?: string;
  initialSection?: SettingsSection;
  defaultOutputDir: string;
  onSelectOutputDir: () => void;
  onOpenFolder: () => void;
  autoClipboard: boolean;
  onToggleAutoClipboard: (val: boolean) => void;
  preferredQuality: string;
  onChangePreferredQuality: (val: string) => void;
  preferredAudioBitrate: string;
  onChangePreferredAudioBitrate: (val: string) => void;
  autoOpenFolderOnComplete: boolean;
  onToggleAutoOpenFolder: (val: boolean) => void;
  embedThumbnails: boolean;
  onToggleEmbedThumbnails: (val: boolean) => void;
  glowTheme: GlowThemeId;
  onChangeGlowTheme: (themeId: GlowThemeId) => void;
  glowIntensity: 'subtle' | 'balanced' | 'vivid' | 'off';
  onChangeGlowIntensity: (intensity: 'subtle' | 'balanced' | 'vivid' | 'off') => void;
  onOpenWhatsNew?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onBack,
  backLabel = 'Back',
  initialSection = 'appearance',
  defaultOutputDir,
  onSelectOutputDir,
  onOpenFolder,
  autoClipboard,
  onToggleAutoClipboard,
  preferredQuality,
  onChangePreferredQuality,
  preferredAudioBitrate,
  onChangePreferredAudioBitrate,
  autoOpenFolderOnComplete,
  onToggleAutoOpenFolder,
  embedThumbnails,
  onToggleEmbedThumbnails,
  glowTheme,
  onChangeGlowTheme,
  glowIntensity,
  onChangeGlowIntensity,
  onOpenWhatsNew
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);
  const selectedTheme = GLOW_THEMES.find((t) => t.id === glowTheme) || GLOW_THEMES[0];

  const sections: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'appearance', label: 'Appearance & Aura', icon: Palette },
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'extractor', label: 'Media Extractor', icon: DownloadCloud },
    { id: 'system', label: 'System & Engines', icon: Cpu },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in duration-200">
      {/* Global Settings Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </button>
          <div className="w-[1px] h-3.5 bg-white/[0.08]" />
          <div>
            <h1 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider font-mono">
              System Preferences
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.06]">
            GLOBAL APP SETTINGS
          </span>
        </div>
      </div>

      {/* Pro Category Segmented Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950/80 border border-white/[0.06]">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
              <span className="truncate">{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. APPEARANCE & AURA SECTION */}
      {activeSection === 'appearance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Live Aura Canvas Preview Box */}
          <div className="relative w-full h-24 rounded-xl bg-[#090b10] border border-white/[0.08] overflow-hidden flex items-center justify-between px-5 shadow-inner">
            {glowIntensity !== 'off' && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out"
                style={{
                  background: `radial-gradient(circle at 45% 50%, ${selectedTheme.rgbaCenter} 0%, ${selectedTheme.rgbaEdge} 65%, transparent 85%)`,
                  filter: glowIntensity === 'vivid' ? 'blur(28px)' : glowIntensity === 'balanced' ? 'blur(32px)' : 'blur(36px)',
                  opacity: glowIntensity === 'vivid' ? 2.4 : glowIntensity === 'balanced' ? 1.6 : 1.0,
                }}
              />
            )}

            <div className="relative z-10 flex items-center gap-3.5">
              <div
                className="w-4 h-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: selectedTheme.hex,
                  boxShadow: glowIntensity !== 'off' ? `0 0 16px ${selectedTheme.hex}` : 'none'
                }}
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-100 font-mono tracking-wide">
                    {selectedTheme.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-white/[0.08]">
                    {selectedTheme.hex.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 max-w-sm leading-relaxed">
                  {selectedTheme.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 hidden sm:flex flex-col items-end gap-1 font-mono text-[10px]">
              <span className="text-zinc-500 uppercase tracking-widest">Active Mode</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/[0.06] capitalize">
                {glowIntensity}
              </span>
            </div>
          </div>

          {/* Minimal Swatch Selector */}
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.07] space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-zinc-200">Ambient Accent Hue</span>
                <p className="text-[11px] text-zinc-500">Select a calibrated chromatic profile for the background aura.</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{selectedTheme.label}</span>
            </div>

            {/* Circular Swatches Bar */}
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-white/[0.05] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3.5 flex-wrap">
                {GLOW_THEMES.map((theme) => {
                  const isSelected = glowTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onChangeGlowTheme(theme.id)}
                      title={`${theme.name} (${theme.hex})`}
                      className={`relative w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e1017] scale-110 shadow-lg'
                          : 'opacity-70 hover:opacity-100 hover:scale-105 border border-white/[0.1]'
                      }`}
                      style={{
                        backgroundColor: theme.hex,
                        boxShadow: isSelected ? `0 0 12px ${theme.hex}60` : 'none'
                      }}
                    >
                      {/* Ultra-minimal luminous micro-dot when selected */}
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-in zoom-in-50 duration-150" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Intensity Segmented Controller */}
              <div className="flex items-center p-0.5 rounded-md bg-zinc-900 border border-white/[0.06]">
                {(
                  [
                    { id: 'subtle', label: 'Subtle' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'vivid', label: 'Vivid' },
                    { id: 'off', label: 'Off' },
                  ] as const
                ).map((lvl) => {
                  const isCur = glowIntensity === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => onChangeGlowIntensity(lvl.id)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                        isCur
                          ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Aesthetic Engine Details */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.05] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Obsidian Matte Dark UI (#06080e) Active</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Hardware-accelerated CSS Filter</span>
          </div>
        </div>
      )}

      {/* 2. GENERAL SETTINGS SECTION */}
      {activeSection === 'general' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Storage Directory */}
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.07] space-y-3">
            <div>
              <span className="text-xs font-medium text-zinc-200">Primary Output Folder</span>
              <p className="text-[11px] text-zinc-500">Default destination path where extracted media files are stored.</p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-950 border border-white/[0.06]">
              <span className="flex-1 font-mono text-[11px] text-zinc-300 truncate pl-2" title={defaultOutputDir}>
                {defaultOutputDir || 'C:\\Users\\...\\Downloads\\SpectreWare'}
              </span>
              <button
                onClick={onSelectOutputDir}
                className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                Browse...
              </button>
              <button
                onClick={onOpenFolder}
                className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition-colors flex items-center gap-1"
                title="Open in Windows Explorer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Open</span>
              </button>
            </div>
          </div>

          {/* Automation Switches */}
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.07] space-y-3.5">
            <span className="text-xs font-medium text-zinc-200">System Automation</span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-zinc-300">Auto-Detect Clipboard URLs</span>
                  <p className="text-[11px] text-zinc-500">Automatically inspect clipboard on window focus and pre-populate media links.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoClipboard}
                    onChange={(e) => onToggleAutoClipboard(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-200"></div>
                </label>
              </div>

              <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-zinc-300">Reveal File in Explorer</span>
                  <p className="text-[11px] text-zinc-500">Automatically open output directory in Windows Explorer when a download completes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoOpenFolderOnComplete}
                    onChange={(e) => onToggleAutoOpenFolder(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-200"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MEDIA EXTRACTOR MODULE SECTION */}
      {activeSection === 'extractor' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.07] space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold text-zinc-100">YouTube & Media Extractor Module</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-white/[0.06]">
                  Module v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 pt-0.5">
                Configure extraction profiles, quality priority, and container post-processing.
              </p>
            </div>

            {/* Quality Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                  <Film className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Default Video Resolution</span>
                </div>
                <CustomDropdown
                  value={preferredQuality}
                  onChange={onChangePreferredQuality}
                  options={[
                    { value: '2160', label: '4K (2160p)', badge: 'UHD' },
                    { value: '1440', label: '2K (1440p)', badge: 'QHD' },
                    { value: '1080', label: 'Full HD (1080p)', badge: 'FHD' },
                    { value: '720', label: 'HD (720p)', badge: 'HD' },
                  ]}
                  size="sm"
                />
                <p className="text-[10px] text-zinc-500">Highest stream priority if available on source.</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                  <Music className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Default Audio Bitrate</span>
                </div>
                <CustomDropdown
                  value={preferredAudioBitrate}
                  onChange={onChangePreferredAudioBitrate}
                  options={[
                    { value: '320', label: '320 kbps', badge: 'Max' },
                    { value: '256', label: '256 kbps', badge: 'High' },
                    { value: '192', label: '192 kbps', badge: 'Std' },
                    { value: '128', label: '128 kbps', badge: 'Lite' },
                  ]}
                  size="sm"
                />
                <p className="text-[10px] text-zinc-500">Constant audio encoding bitrate for MP3.</p>
              </div>
            </div>

            {/* Embed Thumbnails */}
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-zinc-300">Embed ID3 Cover Art</span>
                <p className="text-[11px] text-zinc-500">Inject original video thumbnail directly into MP3 file metadata.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={embedThumbnails}
                  onChange={(e) => onToggleEmbedThumbnails(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-zinc-200"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 4. SYSTEM & SUBSYSTEMS SECTION */}
      {activeSection === 'system' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl bg-[#111116] border border-white/[0.07] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-200">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>ACTIVE PLATFORM BINARIES</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase">SUITE CORE</div>
                <div className="text-zinc-100 font-bold">Spectre 1.0.0</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase">EXTRACTOR</div>
                <div className="text-zinc-100 font-bold">yt-dlp 2026.08</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase">MUX ENGINE</div>
                <div className="text-zinc-100 font-bold">FFmpeg GPL 7.x</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/[0.04] space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase">RUNTIME</div>
                <div className="text-zinc-100 font-bold">Electron 41.x</div>
              </div>
            </div>

            {onOpenWhatsNew && (
              <div className="pt-2 flex justify-between items-center border-t border-white/[0.04]">
                <div>
                  <span className="text-xs text-zinc-300 font-medium">Release Information</span>
                  <p className="text-[11px] text-zinc-500">View changelogs and new feature updates.</p>
                </div>
                <button
                  onClick={onOpenWhatsNew}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>What's New</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
