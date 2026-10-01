import React from 'react';
import { Activity, X, Gauge, Clock, HardDrive, Loader2 } from 'lucide-react';
import type { DownloadParams, DownloadProgress, VideoInfo } from '../types/electron';

export interface ActiveTask {
  params: DownloadParams;
  info: VideoInfo;
  progress: DownloadProgress;
  startTime: number;
}

interface QueueTabProps {
  tasks: ActiveTask[];
  onCancelTask: (id: string) => void;
}

export const QueueTab: React.FC<QueueTabProps> = ({ tasks, onCancelTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center">
          <Activity className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-zinc-300">Queue is Empty</h3>
          <p className="text-[11px] text-zinc-500">Active media extractions will appear here in real-time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span>ACTIVE TASKS ({tasks.length})</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">LIVE MONITOR</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const { params, info, progress } = task;
          const isProcessing = progress.status === 'processing' || progress.percent >= 100;

          return (
            <div
              key={params.id}
              className="p-4 rounded-lg bg-[#111116] border border-white/[0.07] space-y-3"
            >
              <div className="flex items-start gap-3.5">
                {/* Thumbnail */}
                <div className="relative w-24 aspect-video rounded overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                  <img
                    src={info.thumbnail}
                    alt={info.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 py-0.2 bg-black/80 rounded text-zinc-300">
                    {params.type === 'video' ? `${params.quality}p` : `${params.audioFormat?.toUpperCase()}`}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-zinc-200 truncate" title={info.title}>
                      {info.title}
                    </h4>
                    <button
                      onClick={() => onCancelTask(params.id)}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      title="Cancel Task"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                    <span>{info.uploader}</span>
                    <span>•</span>
                    <span className="font-mono text-zinc-400">
                      {params.type === 'video' ? `MP4 • ${params.quality}p` : `${params.audioFormat?.toUpperCase()} • ${params.audioBitrate}kbps`}
                    </span>
                  </div>

                  {/* Telemetry info */}
                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-zinc-500" />
                      <span>{progress.speed || '...'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>ETA {progress.eta || '--:--'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-zinc-500" />
                      <span>{progress.totalSize || 'Calculating'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-zinc-300" />
                        <span className="text-zinc-200">Muxing Audio & Video (FFmpeg)...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Extracting Stream</span>
                      </>
                    )}
                  </span>
                  <span className="font-semibold text-zinc-200">
                    {progress.percent ? `${progress.percent.toFixed(1)}%` : '0%'}
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${Math.min(Math.max(progress.percent || 0, 1), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
