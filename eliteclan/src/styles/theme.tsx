import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

export type Theme = {
  colors: {
    base: string;
    surface: string;
    accent: string;
    accentSecondary: string;
    warning: string;
    text: string;
    textMuted: string;
    border: string;
    overlay: string;
  };
  fonts: {
    display: string;
    heading: string;
    body: string;
  };
  spacing: string[];
  radii: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  shadows: {
    soft: string;
    medium: string;
    strong: string;
    glass: string;
  };
  transitions: {
    subtle: string;
    bounce: string;
  };
  glass: {
    background: string;
    border: string;
    blur: string;
  };
};

export const theme: Theme = {
  colors: {
    base: '#0F1115',
    surface: '#111827',
    accent: '#10B981',
    accentSecondary: '#22D3EE',
    warning: '#F59E0B',
    text: 'rgba(255, 255, 255, 0.92)',
    textMuted: 'rgba(255, 255, 255, 0.64)',
    border: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(17, 24, 39, 0.72)',
  },
  fonts: {
    display: '"Anton", system-ui',
    heading: '"Urbanist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  spacing: ['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem', '2rem', '3rem', '4rem', '6rem'],
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  shadows: {
    soft: '0 4px 16px rgba(15, 17, 21, 0.35)',
    medium: '0 12px 40px rgba(15, 17, 21, 0.45)',
    strong: '0 20px 60px rgba(15, 17, 21, 0.55)',
    glass: '0 18px 50px rgba(34, 211, 238, 0.25)',
  },
  transitions: {
    subtle: 'all 220ms ease',
    bounce: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  glass: {
    background: 'rgba(17, 24, 39, 0.72)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    blur: '12px',
  },
};

const ThemeContext = createContext(theme);

const applyThemeToDocument = (value: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-base', value.colors.base);
  root.style.setProperty('--color-surface', value.colors.surface);
  root.style.setProperty('--color-accent', value.colors.accent);
  root.style.setProperty('--color-accent-secondary', value.colors.accentSecondary);
  root.style.setProperty('--color-warning', value.colors.warning);
  root.style.setProperty('--color-text', value.colors.text);
  root.style.setProperty('--color-text-muted', value.colors.textMuted);
  root.style.setProperty('--color-border', value.colors.border);
  root.style.setProperty('--color-overlay', value.colors.overlay);
  root.style.setProperty('--font-display', value.fonts.display);
  root.style.setProperty('--font-heading', value.fonts.heading);
  root.style.setProperty('--font-body', value.fonts.body);
  value.spacing.forEach((space, index) => {
    root.style.setProperty(`--space-${index}`, space);
  });
  root.style.setProperty('--radius-xs', value.radii.xs);
  root.style.setProperty('--radius-sm', value.radii.sm);
  root.style.setProperty('--radius-md', value.radii.md);
  root.style.setProperty('--radius-lg', value.radii.lg);
  root.style.setProperty('--radius-pill', value.radii.pill);
  root.style.setProperty('--shadow-soft', value.shadows.soft);
  root.style.setProperty('--shadow-medium', value.shadows.medium);
  root.style.setProperty('--shadow-strong', value.shadows.strong);
  root.style.setProperty('--shadow-glass', value.shadows.glass);
  root.style.setProperty('--transition-subtle', value.transitions.subtle);
  root.style.setProperty('--transition-bounce', value.transitions.bounce);
  root.style.setProperty('--glass-bg', value.glass.background);
  root.style.setProperty('--glass-border', value.glass.border);
  root.style.setProperty('--glass-blur', value.glass.blur);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => theme, []);

  useEffect(() => {
    applyThemeToDocument(value);
  }, [value]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
