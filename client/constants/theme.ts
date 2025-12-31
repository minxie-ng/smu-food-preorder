export const Colors = {
  light: {
    // SMU Brand Colors (anchors)
    primary: "#8A704C",        // SMU Gold - CTAs, highlights, key info
    primaryDark: "#6B5A3E",    // Darker gold for pressed states
    primaryLight: "rgba(138, 112, 76, 0.12)", // Gold tint for badges

    // Navy - Used ONLY for navigation bars and page background
    navy: "#151C55",           // SMU Navy - nav bars, tab bars, page bg
    navyLight: "#1E2766",      // Slightly lighter navy for subtle variation

    // Lighter Surfaces (derived from navy, but much lighter for cards/inputs)
    // These create a calm, welcoming feel while maintaining brand connection
    background: "#F5F6FA",     // Very light blue-grey page background
    surface1: "#FFFFFF",       // White cards - primary content containers
    surface2: "#F0F1F7",       // Light grey-blue for inputs, inner sections
    surface3: "#E8EAF2",       // Slightly darker for toggles, secondary areas

    // Text Colors
    text: "#1A1D3D",           // Near-black with navy tint for body text
    textSecondary: "#5A5F7A",  // Medium grey for secondary text
    textMuted: "#8B8FA6",      // Light grey for placeholders, hints
    white: "#FFFFFF",          // White text on dark surfaces

    // Semantic Colors
    success: "#22C55E",
    successLight: "rgba(34, 197, 94, 0.12)",
    error: "#EF4444",
    errorLight: "rgba(239, 68, 68, 0.12)",

    // Borders
    border: "#E2E4ED",         // Light border for cards
    borderDark: "#D1D4E0",     // Slightly darker border for emphasis

    // Tab/Navigation specific
    tabIconDefault: "#8B8FA6",
    tabIconSelected: "#8A704C", // Gold for selected tab

    // Legacy aliases for compatibility
    backgroundRoot: "#F5F6FA",
    backgroundElevated: "#FFFFFF",
  },
  dark: {
    // Dark mode keeps the current darker theme
    primary: "#8A704C",
    primaryDark: "#6B5A3E",
    primaryLight: "rgba(138, 112, 76, 0.15)",

    navy: "#151C55",
    navyLight: "#1E2766",

    background: "#0F1340",
    surface1: "#1A2258",
    surface2: "#222B6B",
    surface3: "#2A357D",

    text: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.65)",
    textMuted: "rgba(255, 255, 255, 0.45)",
    white: "#FFFFFF",

    success: "#4ADE80",
    successLight: "rgba(74, 222, 128, 0.15)",
    error: "#EF4444",
    errorLight: "rgba(239, 68, 68, 0.15)",

    border: "rgba(255, 255, 255, 0.1)",
    borderDark: "rgba(255, 255, 255, 0.15)",

    tabIconDefault: "rgba(255, 255, 255, 0.5)",
    tabIconSelected: "#8A704C",

    backgroundRoot: "#0A0E2E",
    backgroundElevated: "#1A2258",
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
    shadowColor: "#1A1D3D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#1A1D3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};
