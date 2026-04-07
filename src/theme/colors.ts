export const Colors = {
  primary: {
    DEFAULT: '#1E3A5F',
    light: '#2D5A9E',
    dark: '#0F1F35',
  },
  accent: {
    DEFAULT: '#00BCD4',
    light: '#4DD0E1',
    dark: '#0097A7',
  },
  dark: {
    bg: '#0F1923',
    card: '#1A2535',
    cardAlt: '#1F2D42',
    border: '#2A3F5F',
    text: '#E2E8F0',
    muted: '#94A3B8',
    subtle: '#475569',
  },
  light: {
    bg: '#F0F4F8',
    card: '#FFFFFF',
    cardAlt: '#F8FAFC',
    border: '#E2E8F0',
    text: '#1E293B',
    muted: '#64748B',
    subtle: '#94A3B8',
  },
  csf: {
    Govern: '#8B5CF6',
    Identify: '#3B82F6',
    Protect: '#10B981',
    Detect: '#F59E0B',
    Respond: '#EF4444',
    Recover: '#06B6D4',
  },
  frameworks: {
    csf2: '#3B82F6',
    sp80053: '#8B5CF6',
    sp800171: '#10B981',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export function getFrameworkColor(framework: string): string {
  return Colors.frameworks[framework as keyof typeof Colors.frameworks] || Colors.primary.DEFAULT;
}

export function getCSFColor(func: string): string {
  return Colors.csf[func as keyof typeof Colors.csf] || Colors.primary.DEFAULT;
}
