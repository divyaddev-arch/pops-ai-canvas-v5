"use client";

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export const ThemeSelector = () => {
  const { themeKey, setThemeKey, availableThemes } = useTheme();

  return (
    <div className="flex items-center gap-3" aria-label="Color theme selector">
      {availableThemes.map(theme => (
        <button
          key={theme.key}
          onClick={() => setThemeKey(theme.key)}
          title={theme.displayName}
          aria-label={`Select ${theme.displayName} theme`}
          aria-pressed={themeKey === theme.key}
          className={cn(
            "w-6 h-6 rounded-full transition-all duration-200 border-2",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container focus-visible:ring-primary",
            themeKey === theme.key ? 'border-primary scale-110' : 'border-outline hover:border-on-surface-variant'
          )}
          style={{ backgroundColor: theme.light['--color-primary'] }}
        />
      ))}
    </div>
  );
};
