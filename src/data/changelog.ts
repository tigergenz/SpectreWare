export interface ChangeItem {
  category: 'New' | 'Improved' | 'Fixed';
  description: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  badge?: string;
  highlights: ChangeItem[];
}

export const CURRENT_APP_VERSION = '1.0.0';

export const RELEASE_HISTORY: ReleaseNote[] = [
  {
    version: '1.0.0',
    date: 'Initial Release',
    title: 'Core Engine & YouTube Media Extractor',
    badge: 'Latest',
    highlights: [
      {
        category: 'New',
        description: 'Universal YouTube & Shorts media extractor with up to 4K 60FPS video support.'
      },
      {
        category: 'New',
        description: 'Lossless audio ripper supporting 320 kbps MP3 & Apple AAC (M4A) formats.'
      },
      {
        category: 'New',
        description: 'Minimalist luxury matte dark interface with ambient electric blue backlight.'
      },
      {
        category: 'New',
        description: 'Bespoke custom dropdown controls replacing harsh native OS select boxes.'
      },
      {
        category: 'New',
        description: 'Tools & Modules Hub architecture ready for future utility expansion.'
      },
      {
        category: 'New',
        description: 'Pre-bundled standalone yt-dlp & FFmpeg GPL binaries in bin/ directory.'
      },
      {
        category: 'Improved',
        description: 'Optimized 880x620 desktop tool proportions for maximum visual balance.'
      }
    ]
  }
];
