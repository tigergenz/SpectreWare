import React, { useState, useEffect } from 'react';
import {
  ClipboardPaste,
  Film,
  Music,
  Download,
  Folder,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Search,
  X
} from 'lucide-react';
import type { VideoInfo, DownloadParams } from '../types/electron';
import { formatDuration, formatViews } from '../utils/formatters';
import { CustomDropdown } from './CustomDropdown';

interface DownloaderTabProps {
  onStartDownload: (params: DownloadParams, info: VideoInfo) => void;
  defaultOutputDir: string;
  onSelectOutputDir: () => Promise<string | null>;
  onOpenFolder: () => void;
  preferredQuality?: string;
  preferredAudioBitrate?: string;
  embedThumbnails?: boolean;
}

export const DownloaderTab: React.FC<DownloaderTabProps> = ({
  onStartDownload,
  defaultOutputDir,
  onSelectOutputDir,
  onOpenFolder,
  preferredQuality = '1080',
  preferredAudioBitrate = '320',
  embedThumbnails = true
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  // Download options
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
  const [selectedQuality, setSelectedQuality] = useState<string>(preferredQuality);
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'm4a'>('mp3');
  const [audioBitrate, setAudioBitrate] = useState<'320' | '256' | '192' | '128'>(
    (preferredAudioBitrate as any) || '320'
  );
  const [outputDir, setOutputDir] = useState(defaultOutputDir);

  useEffect(() => {
    if (defaultOutputDir) {
      setOutputDir(defaultOutputDir);
    }
  }, [defaultOutputDir]);

  // Auto-detect clipboard on mount
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (window.spectreAPI?.readClipboard) {
          const clipText = await window.spectreAPI.readClipboard();
          if (clipText && clipText.startsWith('http') && !url) {
            setUrl(clipText);
          }
        }
      } catch (_) {}
    };
    checkClipboard();
  }, []);

  const handlePaste = async () => {
    try {
      if (window.spectreAPI?.readClipboard) {
        const clipText = await window.spectreAPI.readClipboard();
        if (clipText) {
          setUrl(clipText);
          handleAnalyze(clipText);
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        handleAnalyze(text);
      }
    } catch (_) {}
  };

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) {
      setError('Please paste a valid video URL first');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      if (!window.spectreAPI?.fetchVideoInfo) {
        throw new Error('SpectreAPI not found. Running in standalone browser mode?');
      }

      const info = await window.spectreAPI.fetchVideoInfo(targetUrl);
      setVideoInfo(info);

      if (info.resolutions && info.resolutions.length > 0) {
        const prefQ = parseInt(preferredQuality || '1080');
        if (info.resolutions.includes(prefQ)) {
          setSelectedQuality(String(prefQ));
        } else if (info.resolutions.includes(1080)) {
          setSelectedQuality('1080');
        } else {
          setSelectedQuality(String(info.resolutions[0]));
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to fetch video information. Ensure URL is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFolder = async () => {
    const selected = await onSelectOutputDir();
    if (selected) {
      setOutputDir(selected);
    }
  };

  const handleTriggerDownload = () => {
    if (!videoInfo) return;

    const id = `${videoInfo.id}_${Date.now()}`;
    const params: DownloadParams = {
      id,
      url: videoInfo.webpageUrl || url,
      type: downloadType,
      quality: selectedQuality,
      audioFormat,
      audioBitrate,
      outputDir: outputDir || defaultOutputDir,
      title: videoInfo.title,
      embedThumbnail: embedThumbnails
    };

    onStartDownload(params, videoInfo);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
      {/* Top Search / URL Bar with YouTube Icon */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#111116] border border-white/[0.08] focus-within:border-zinc-500 transition-colors shadow-sm">
        <div className="pl-2.5 text-[#ff2e2e] shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          placeholder="Paste YouTube video or Shorts link here..."
          className="flex-1 bg-transparent px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none font-sans"
        />

        {/* Quick Clear Button */}
        {url && (
          <button
            onClick={() => {
              setUrl('');
              setError(null);
            }}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Clear URL"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Paste Button */}
        <button
          onClick={handlePaste}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.06] transition-all"
          title="Paste from clipboard"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Paste</span>
        </button>

        {/* Inspect Button */}
        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !url.trim()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-900 border border-rose-900/50 text-rose-300 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <div className="flex-1 font-mono text-[11px]">{error}</div>
          <button onClick={() => setError(null)} className="text-zinc-500 hover:text-zinc-300">✕</button>
        </div>
      )}

      {/* Main Video Analysis Layout */}
      {videoInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 animate-in fade-in duration-200">
          {/* Left Column: Video Info & Thumbnail */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="relative group rounded-lg overflow-hidden border border-white/[0.08] bg-zinc-950">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-zinc-300">
                {formatDuration(videoInfo.duration)}
              </div>

              {/* Watch Online Button */}
              {videoInfo.webpageUrl && (
                <a
                  href={videoInfo.webpageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-2 right-2 p-1.5 rounded bg-black/60 hover:bg-black/90 text-zinc-400 hover:text-white transition-colors"
                  title="Open in Browser"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="p-3 rounded-lg bg-[#111116] border border-white/[0.06] space-y-1.5">
              <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-snug">
                {videoInfo.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                <div className="flex items-center gap-1 text-zinc-300 truncate pr-2">
                  <CheckCircle2 className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span className="truncate">{videoInfo.uploader}</span>
                </div>
                <div className="font-mono text-[10px] text-zinc-500 shrink-0">
                  {formatViews(videoInfo.viewCount)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Download Setup */}
          <div className="md:col-span-7 space-y-3">
            <div className="p-4 rounded-lg bg-[#111116] border border-white/[0.07] space-y-3.5">
              {/* Type Switcher: Video vs Audio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                  <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
                  <span>Format</span>
                </div>

                <div className="flex p-0.5 rounded-lg bg-zinc-950 border border-white/[0.06]">
                  <button
                    onClick={() => setDownloadType('video')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      downloadType === 'video'
                        ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    <span>Video (MP4)</span>
                  </button>

                  <button
                    onClick={() => setDownloadType('audio')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      downloadType === 'audio'
                        ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Music className="w-3 h-3" />
                    <span>Audio Only</span>
                  </button>
                </div>
              </div>

              {/* Video Resolution Dropdown */}
              {downloadType === 'video' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>RESOLUTION</span>
                    <span className="text-[10px] text-zinc-500">Auto Muxing</span>
                  </div>

                  <CustomDropdown
                    className="w-full"
                    size="md"
                    value={selectedQuality}
                    onChange={setSelectedQuality}
                    options={[
                      { value: '2160', label: '4K Ultra HD (2160p)', badge: 'UHD', description: '60fps maximum resolution' },
                      { value: '1440', label: '1440p 2K Quad HD', badge: 'QHD', description: 'Crisp high resolution' },
                      { value: '1080', label: '1080p Full HD', badge: 'FHD', description: 'Recommended standard' },
                      { value: '720', label: '720p HD', badge: 'HD', description: 'Balanced download' },
                      { value: '480', label: '480p Standard', badge: 'SD', description: 'Small file size' },
                      { value: '360', label: '360p Low', badge: 'LOW', description: 'Compact format' },
                    ].map(opt => ({
                      ...opt,
                      disabled: videoInfo.resolutions?.length > 0 && !videoInfo.resolutions.includes(parseInt(opt.value))
                    }))}
                  />
                </div>
              ) : (
                /* Audio Options with Dropdowns */
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="text-[11px] text-zinc-400 font-mono">AUDIO ENCODER</div>
                    <CustomDropdown
                      className="w-full"
                      size="md"
                      value={audioFormat}
                      onChange={(v) => setAudioFormat(v as any)}
                      options={[
                        { value: 'mp3', label: 'MP3 (MPEG Audio)', description: 'Universal compatibility' },
                        { value: 'm4a', label: 'M4A (AAC Audio)', description: 'Apple & high fidelity' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] text-zinc-400 font-mono">BITRATE</div>
                    <CustomDropdown
                      className="w-full"
                      size="md"
                      value={audioBitrate}
                      onChange={(v) => setAudioBitrate(v as any)}
                      options={[
                        { value: '320', label: '320 kbps', badge: 'Studio', description: 'Highest fidelity' },
                        { value: '256', label: '256 kbps', badge: 'High', description: 'High quality' },
                        { value: '192', label: '192 kbps', badge: 'Standard', description: 'Balanced' },
                        { value: '128', label: '128 kbps', badge: 'Compact', description: 'Smallest file' },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Destination Directory */}
              <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono">DESTINATION</span>
                  <button
                    onClick={onOpenFolder}
                    className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <Folder className="w-3 h-3" />
                    <span>Open</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-950 border border-white/[0.06]">
                  <Folder className="w-3.5 h-3.5 text-zinc-500 pl-1 shrink-0" />
                  <span className="flex-1 font-mono text-[10px] text-zinc-300 truncate" title={outputDir}>
                    {outputDir}
                  </span>
                  <button
                    onClick={handleChangeFolder}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  >
                    Browse
                  </button>
                </div>
              </div>

              {/* Execute Download Button */}
              <button
                onClick={handleTriggerDownload}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs tracking-wide text-zinc-950 bg-white hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  DOWNLOAD {downloadType === 'video' ? `${selectedQuality}p MP4` : `${audioFormat.toUpperCase()} ${audioBitrate}k`}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Compact Hero State with YouTube Icon */
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-[#ff2e2e]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          <div className="space-y-1 max-w-sm">
            <h2 className="text-xs font-semibold text-zinc-200">
              YouTube Media Extractor
            </h2>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Paste any YouTube video or Shorts link above to inspect metadata and select format.
            </p>
          </div>

          {/* Compact Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md w-full pt-1">
            {[
              { title: '4K 60FPS', desc: 'Hardware Mux' },
              { title: '320kbps MP3', desc: 'Studio Audio' },
              { title: 'Shorts & VOD', desc: 'All Formats' },
              { title: 'Local yt-dlp', desc: 'Fast & Private' }
            ].map((f, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-zinc-900/50 border border-white/[0.04] text-center space-y-0.5"
              >
                <div className="text-[10px] font-medium text-zinc-300 font-mono">{f.title}</div>
                <div className="text-[9px] text-zinc-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
