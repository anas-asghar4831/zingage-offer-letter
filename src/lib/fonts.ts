import { Font } from "@react-pdf/renderer";

// Track if fonts are registered to avoid duplicate registration
let fontsRegistered = false;

// Register fonts for PDF rendering - using local files for performance
export const registerFonts = () => {
  // Prevent duplicate registration
  if (fontsRegistered) return;

  // Manrope font family - local files (only weights actually used)
  Font.register({
    family: "Manrope",
    fonts: [
      {
        src: "/fonts/manrope/Manrope-Regular.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "/fonts/manrope/Manrope-Medium.ttf",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "/fonts/manrope/Manrope-SemiBold.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
      // Bold (700) removed - not used in PDF
    ],
  });

  // Geist font family - local files
  Font.register({
    family: "Geist",
    fonts: [
      {
        src: "/fonts/geist/Geist-Regular.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "/fonts/geist/Geist-Medium.ttf",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "/fonts/geist/Geist-SemiBold.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
    ],
  });

  // Roboto Serif font family - for candidate name on cover page (only regular used)
  Font.register({
    family: "Roboto Serif",
    fonts: [
      {
        src: "/fonts/roboto-serif/RobotoSerif-Regular.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      // Italic and SemiBold variants removed - not used in PDF
    ],
  });

  // Disable hyphenation
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
};

// Server-side font registration with absolute paths
export const registerFontsServer = (baseUrl: string) => {
  if (fontsRegistered) return;

  // Manrope font family (only weights actually used)
  Font.register({
    family: "Manrope",
    fonts: [
      {
        src: `${baseUrl}/fonts/manrope/Manrope-Regular.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: `${baseUrl}/fonts/manrope/Manrope-Medium.ttf`,
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: `${baseUrl}/fonts/manrope/Manrope-SemiBold.ttf`,
        fontWeight: 600,
        fontStyle: "normal",
      },
    ],
  });

  // Geist font family
  Font.register({
    family: "Geist",
    fonts: [
      {
        src: `${baseUrl}/fonts/geist/Geist-Regular.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: `${baseUrl}/fonts/geist/Geist-Medium.ttf`,
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: `${baseUrl}/fonts/geist/Geist-SemiBold.ttf`,
        fontWeight: 600,
        fontStyle: "normal",
      },
    ],
  });

  // Roboto Serif font family (only regular used)
  Font.register({
    family: "Roboto Serif",
    fonts: [
      {
        src: `${baseUrl}/fonts/roboto-serif/RobotoSerif-Regular.ttf`,
        fontWeight: 400,
        fontStyle: "normal",
      },
    ],
  });

  // Disable hyphenation
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
};
