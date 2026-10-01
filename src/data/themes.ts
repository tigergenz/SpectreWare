export type GlowThemeId = 'cobalt' | 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber' | 'graphite';

export interface GlowTheme {
  id: GlowThemeId;
  name: string;
  label: string;
  hex: string;
  accent: string;
  rgbaCenter: string;
  rgbaEdge: string;
  boxShadow: string;
  description: string;
}

export const GLOW_THEMES: GlowTheme[] = [
  {
    id: 'cobalt',
    name: 'Cobalt Sapphire',
    label: 'Cobalt',
    hex: '#38bdf8',
    accent: '#0284c7',
    rgbaCenter: 'rgba(56, 189, 248, 0.16)',
    rgbaEdge: 'rgba(2, 132, 199, 0.03)',
    boxShadow: '0 0 12px rgba(56, 189, 248, 0.45)',
    description: 'Electric sapphire aura tuned for deep focus in obsidian dark spaces.',
  },
  {
    id: 'cyan',
    name: 'Glacier Cyan',
    label: 'Glacier',
    hex: '#06b6d4',
    accent: '#0891b2',
    rgbaCenter: 'rgba(6, 182, 212, 0.15)',
    rgbaEdge: 'rgba(8, 145, 178, 0.03)',
    boxShadow: '0 0 12px rgba(6, 182, 212, 0.45)',
    description: 'Crisp arctic luminescence with minimal optical fatigue.',
  },
  {
    id: 'violet',
    name: 'Obsidian Violet',
    label: 'Violet',
    hex: '#a855f7',
    accent: '#7e22ce',
    rgbaCenter: 'rgba(168, 85, 247, 0.15)',
    rgbaEdge: 'rgba(126, 34, 206, 0.03)',
    boxShadow: '0 0 12px rgba(168, 85, 247, 0.45)',
    description: 'Cyberpunk ultraviolet glow with rich atmospheric depth.',
  },
  {
    id: 'emerald',
    name: 'Tactical Emerald',
    label: 'Emerald',
    hex: '#34d399',
    accent: '#059669',
    rgbaCenter: 'rgba(52, 211, 153, 0.14)',
    rgbaEdge: 'rgba(5, 150, 105, 0.03)',
    boxShadow: '0 0 12px rgba(52, 211, 153, 0.45)',
    description: 'Calibrated tactical green providing clean contrast.',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    label: 'Crimson',
    hex: '#fb7185',
    accent: '#e11d48',
    rgbaCenter: 'rgba(251, 113, 133, 0.14)',
    rgbaEdge: 'rgba(225, 29, 72, 0.03)',
    boxShadow: '0 0 12px rgba(251, 113, 133, 0.45)',
    description: 'Subtle ruby bloom offering warm ambient mood lighting.',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    label: 'Amber',
    hex: '#fbbf24',
    accent: '#d97706',
    rgbaCenter: 'rgba(251, 191, 36, 0.13)',
    rgbaEdge: 'rgba(217, 119, 6, 0.03)',
    boxShadow: '0 0 12px rgba(251, 191, 36, 0.45)',
    description: 'Warm tungsten sunset glow reminiscent of studio analog gear.',
  },
  {
    id: 'graphite',
    name: 'Obsidian Stealth',
    label: 'Stealth',
    hex: '#94a3b8',
    accent: '#475569',
    rgbaCenter: 'rgba(255, 255, 255, 0.05)',
    rgbaEdge: 'rgba(255, 255, 255, 0.01)',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.15)',
    description: 'Zero chromatic tint. Pure monochromatic titanium elegance.',
  },
];
