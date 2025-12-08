import { Font } from "@react-pdf/renderer";

// Track if fonts are registered to avoid duplicate registration
let fontsRegistered = false;

// Font configuration - single source of truth
const FONT_CONFIG = {
  manrope: {
    family: "Manrope",
    weights: [
      { weight: 400, file: "Manrope-Regular.ttf" },
      { weight: 500, file: "Manrope-Medium.ttf" },
      { weight: 600, file: "Manrope-SemiBold.ttf" },
    ],
    path: "manrope",
  },
  geist: {
    family: "Geist",
    weights: [
      { weight: 400, file: "Geist-Regular.ttf" },
      { weight: 500, file: "Geist-Medium.ttf" },
      { weight: 600, file: "Geist-SemiBold.ttf" },
    ],
    path: "geist",
  },
  robotoSerif: {
    family: "Roboto Serif",
    weights: [{ weight: 400, file: "RobotoSerif-Regular.ttf" }],
    path: "roboto-serif",
  },
} as const;

/**
 * Register a font family with the given base URL
 */
function registerFontFamily(
  config: (typeof FONT_CONFIG)[keyof typeof FONT_CONFIG],
  baseUrl: string
) {
  Font.register({
    family: config.family,
    fonts: config.weights.map((w) => ({
      src: `${baseUrl}/fonts/${config.path}/${w.file}`,
      fontWeight: w.weight,
      fontStyle: "normal" as const,
    })),
  });
}

/**
 * Core font registration logic - used by both client and server
 */
function registerAllFonts(baseUrl: string = "") {
  if (fontsRegistered) return;

  // Register all font families
  Object.values(FONT_CONFIG).forEach((config) => {
    registerFontFamily(config, baseUrl);
  });

  // Disable hyphenation
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
}

/**
 * Register fonts for client-side PDF rendering (uses relative paths)
 */
export const registerFonts = () => {
  registerAllFonts("");
};

/**
 * Register fonts for server-side PDF rendering (uses absolute URLs)
 */
export const registerFontsServer = (baseUrl: string) => {
  registerAllFonts(baseUrl);
};

/**
 * Reset font registration state (useful for testing)
 */
export const resetFontRegistration = () => {
  fontsRegistered = false;
};
