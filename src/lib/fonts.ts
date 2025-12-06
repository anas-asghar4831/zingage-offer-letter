import { Font } from "@react-pdf/renderer";

// Register fonts for PDF rendering
export const registerFonts = () => {
  // Manrope font family - using Google Fonts CDN
  Font.register({
    family: "Manrope",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-500-normal.ttf",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-600-normal.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-700-normal.ttf",
        fontWeight: 700,
        fontStyle: "normal",
      },
    ],
  });

  // Geist font family
  Font.register({
    family: "Geist",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-500-normal.ttf",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-600-normal.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
    ],
  });

  // Roboto Serif font family - for candidate name on cover page
  Font.register({
    family: "Roboto Serif",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-serif@latest/latin-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-serif@latest/latin-400-italic.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-serif@latest/latin-600-normal.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-serif@latest/latin-600-italic.ttf",
        fontWeight: 600,
        fontStyle: "italic",
      },
    ],
  });

  // Disable hyphenation
  Font.registerHyphenationCallback((word) => [word]);
};
