export type ThemeMode = 'matrix' | 'sakura' | 'cyberpunk' | 'dracula' | 'nord' | 'amber';

export interface ThemeColors {
  name: string;
  bg: string;
  terminalBg: string;
  headerBg: string;
  text: string;
  accent: string;
  accentHover: string;
  prompt: string;
  border: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  pinned: boolean;
  category: 'Streaming' | 'AI / Bots' | 'Web Apps' | 'Tools';
  features: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string; level: number; info?: string }[];
}

export interface HistoryItem {
  id: string;
  command: string;
  timestamp: string;
  output?: React.ReactNode;
}
