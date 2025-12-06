import { StyleSheet } from "@react-pdf/renderer";

// Color palette from Figma design
export const colors = {
  cream: "#FCFBE9",
  creamLight: "#FFFDEB",
  green: "#2D6D4F",
  orange: "#FF6B02",
  orangeLight: "#FF974D",
  orangePeach: "#FFDABF",
  border: "#D6D4B6",
  borderDark: "#4E4E4E",
  white: "#FFFFFF",
};

// Base styles shared across pages
export const baseStyles = StyleSheet.create({
  page: {
    width: 1920,
    height: 1080,
    position: "relative",
    fontFamily: "Manrope",
  },
  pageCream: {
    backgroundColor: colors.cream,
  },
  pageCreamLight: {
    backgroundColor: colors.creamLight,
  },
  pageOrange: {
    backgroundColor: colors.orange,
  },
});

// Typography styles
export const typography = StyleSheet.create({
  h1: {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 100,
    lineHeight: 1.2,
    letterSpacing: -4,
    color: colors.green,
  },
  h2: {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 80,
    lineHeight: 1.2,
    letterSpacing: -3.2,
    color: colors.green,
  },
  h3: {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 52,
    lineHeight: 1.2,
    letterSpacing: -2.08,
    color: colors.green,
  },
  bodyLarge: {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 1.5,
    letterSpacing: -0.28,
    color: colors.green,
  },
  bodyMedium: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 28,
    lineHeight: 1.5,
    color: colors.green,
  },
  bodySmall: {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: 24,
    lineHeight: 1.5,
    color: colors.green,
  },
  label: {
    fontFamily: "Geist",
    fontWeight: 500,
    fontSize: 28,
    color: colors.green,
  },
  caption: {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: 38,
    lineHeight: 1,
    color: colors.green,
  },
});
