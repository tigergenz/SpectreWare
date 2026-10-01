export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  viewCount: number;
  webpageUrl: string;
  resolutions: number[];
  description: string;
}

export interface DownloadParams {
  id: string;
  url: string;
  type: 'video' | 'audio';
  quality: string;
  audioFormat?: 'mp3' | 'm4a';
  audioBitrate?: '320' | '256' | '192' | '128';
  outputDir?: string;
  title?: string;
  embedThumbnail?: boolean;
}

export interface DownloadProgress {
  id: string;
  percent: number;
  speed: string;
  eta: string;
  totalSize: string;
  status: 'downloading' | 'processing';
  line?: string;
}

export interface DownloadComplete {
  id: string;
  filePath: string;
  outputDir: string;
}

export interface DownloadError {
  id: string;
  message: string;
}

export interface SpectreAPI {
  minimizeWindow: () => Promise<boolean>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<boolean>;
  isMaximized: () => Promise<boolean>;

  getDefaultDownloadPath: () => Promise<string>;
  selectFolder: () => Promise<string | null>;
  openFolder: (dirPath?: string) => Promise<boolean>;
  openFile: (filePath: string) => Promise<boolean>;
  readClipboard: () => Promise<string>;

  fetchVideoInfo: (url: string) => Promise<VideoInfo>;
  startDownload: (params: DownloadParams) => Promise<{ success: boolean; message: string }>;
  cancelDownload: (id: string) => Promise<boolean>;

  onDownloadProgress: (callback: (data: DownloadProgress) => void) => () => void;
  onDownloadComplete: (callback: (data: DownloadComplete) => void) => () => void;
  onDownloadError: (callback: (data: DownloadError) => void) => () => void;
}

declare global {
  interface Window {
    spectreAPI?: SpectreAPI;
  }
}
