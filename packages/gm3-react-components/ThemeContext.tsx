"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  themesGM3,
  type ThemeGM3,
  type ThemePaletteGM3,
} from '../gm3-styles';

type Theme = ThemeGM3;
type ThemePalette = ThemePaletteGM3;

interface ThemeContextType {
  themeKey: string;
  setThemeKey: React.Dispatch<React.SetStateAction<string>>;
  mode: "light" | "dark";
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  availableThemes: Theme[];
  themes: { [key: string]: Theme };
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Converts a hex color string to an RGB string "r, g, b".
 * @param hex - The hex color string (e.g., "#RRGGBB").
 * @returns The RGB string or null if the format is invalid.
 */
const hexToRgb = (hex: string): string | null => {
  if (!hex || hex.length !== 7 || hex[0] !== "#") return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `${r}, ${g}, ${b}`;
};

export const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const themes = themesGM3;
  const defaultThemeKey = "google";

  const [themeKey, setThemeKey] = useState(defaultThemeKey);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState<ThemePalette>(
    themes[themeKey]?.[mode] ?? themes[defaultThemeKey][mode],
  );

  useEffect(() => {
    let theme = themes[themeKey] as Theme | undefined;

    if (!theme) {
      setThemeKey(defaultThemeKey);
      theme = themes[defaultThemeKey];
    }

    const currentPalette: ThemePalette = theme[mode];
    setPalette(currentPalette);

    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");

    const lightHljsTheme = document.getElementById(
      "hljs-light-theme",
    ) as HTMLLinkElement | null;
    const darkHljsTheme = document.getElementById(
      "hljs-dark-theme",
    ) as HTMLLinkElement | null;
    if (lightHljsTheme && darkHljsTheme) {
      lightHljsTheme.disabled = mode === "dark";
      darkHljsTheme.disabled = mode === "light";
    }

    const generateCssBlock = (palette: ThemePalette): string => {
      let css = "";
      for (const [key, value] of Object.entries(palette)) {
        css += `${key}: ${value};`;
        // Auto-generate RGB variables for any hex color
        if (value.startsWith("#") && value.length === 7) {
          const rgb = hexToRgb(value);
          if (rgb) {
            css += `${key}-rgb: ${rgb};`;
          }
        }
      }
      return css;
    };

    const cssBlock = generateCssBlock(currentPalette);
    const modeSelector = mode === "dark" ? "html.dark" : ":root";

    let finalCss = `${modeSelector} { ${cssBlock} }`;

    let styleTag = document.getElementById("app-theme-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "app-theme-styles";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = finalCss;
  }, [themeKey, mode, themes]);

  const value = useMemo(
    () => ({
      themeKey,
      setThemeKey,
      mode,
      setMode,
      availableThemes: Object.values(themes),
      themes,
      palette,
    }),
    [themeKey, mode, themes, palette],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
