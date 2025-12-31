import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.65)",
    textMuted: "rgba(255, 255, 255, 0.45)",
    buttonText: "#FFFFFF",
    tabIconDefault: "rgba(255, 255, 255, 0.5)",
    tabIconSelected: "#8A704C",
    link: "#8A704C",
    primary: "#8A704C",
    primaryDark: "#6B5A3E",
    primaryLight: "rgba(138, 112, 76, 0.15)",
    secondary: "#151C55",
    success: "#4ADE80",
    successLight: "rgba(74, 222, 128, 0.15)",
    error: "#EF4444",
    errorLight: "rgba(239, 68, 68, 0.15)",
    backgroundRoot: "#0A0E2E",
    backgroundDefault: "#0F1340",
    backgroundSecondary: "#151C55",
    backgroundTertiary: "#1E2668",
    backgroundElevated: "#252F7A",
    surface1: "#1A2258",
    surface2: "#222B6B",
    surface3: "#2A357D",
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.06)",
    white: "#FFFFFF",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.65)",
    textMuted: "rgba(255, 255, 255, 0.45)",
    buttonText: "#FFFFFF",
    tabIconDefault: "rgba(255, 255, 255, 0.5)",
    tabIconSelected: "#8A704C",
    link: "#8A704C",
    primary: "#8A704C",
    primaryDark: "#6B5A3E",
    primaryLight: "rgba(138, 112, 76, 0.15)",
    secondary: "#151C55",
    success: "#4ADE80",
    successLight: "rgba(74, 222, 128, 0.15)",
    error: "#EF4444",
    errorLight: "rgba(239, 68, 68, 0.15)",
    backgroundRoot: "#0A0E2E",
    backgroundDefault: "#0F1340",
    backgroundSecondary: "#151C55",
    backgroundTertiary: "#1E2668",
    backgroundElevated: "#252F7A",
    surface1: "#1A2258",
    surface2: "#222B6B",
    surface3: "#2A357D",
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.06)",
    white: "#FFFFFF",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
  minTouchTarget: 44,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSubtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, monospace",
  },
});
