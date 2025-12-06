/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors } from "@/lib/styles";
import type { OfferLetterData } from "@/lib/types";
import { ZingageLogoOrange } from "./Page7Vision";

const styles = StyleSheet.create({
  page: {
    width: 1920,
    height: 1080,
    backgroundColor: colors.cream,
    position: "relative",
  },
  leftColumn: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1361,
    height: 1080,
    borderRight: `1px solid ${colors.borderDark}`,
  },
  header: {
    padding: "32px 52px",
  },
  content: {
    position: "absolute",
    left: 52,
    top: 152,
  },
  greeting: {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 52,
    lineHeight: 1.2,
    letterSpacing: -2.08,
    color: colors.green,
  },
  introParagraph: {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 1.5,
    letterSpacing: -0.28,
    color: colors.green,
    width: 1022,
    marginTop: 62,
    textAlign: "justify",
  },
  rightColumn: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 559,
    height: 1080,
    paddingLeft: 32,
    paddingRight: 34,
  },
  foundersImage: {
    position: "absolute",
    left: 1397,
    top: 75,
    width: 484,
    height: 581,
  },
  founderNames: {
    position: "absolute",
    right: 34,
    top: 679,
    textAlign: "right",
  },
  founderNamesLeft: {
    position: "absolute",
    left: 1393,
    top: 679,
    textAlign: "left",
  },
  founderName: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 28,
    lineHeight: 1.5,
    color: colors.green,
    textTransform: "uppercase",
  },
  founderTitle: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 28,
    lineHeight: 1.5,
    color: colors.green,
    textTransform: "uppercase",
  },
  quote: {
    position: "absolute",
    left: 1393,
    top: 865,
    width: 493,
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: 24,
    lineHeight: 1.5,
    color: colors.green,
    textAlign: "justify",
  },
});

interface Page2Props {
  data: OfferLetterData;
  baseUrl: string;
}

export default function Page2Introduction({ data, baseUrl }: Page2Props) {
  const foundersImageUrl = `${baseUrl}/assets/images/founder.png`;

  return (
    <Page size={[1920, 1080]} style={styles.page}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <ZingageLogoOrange width={222} height={60} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Hey, {data.firstName} </Text>
        <Text style={styles.introParagraph}>{data.introParagraph}</Text>
      </View>

      {/* Right Column - Founders */}
      <Image src={foundersImageUrl} style={styles.foundersImage} />

      {/* Victor Hunt - Left side name */}
      <View style={styles.founderNamesLeft}>
        <Text style={styles.founderName}>VICTOR HUNT</Text>
        <Text style={styles.founderTitle}>CEO</Text>
      </View>

      {/* Daniel Tian - Right side name */}
      <View style={styles.founderNames}>
        <Text style={styles.founderName}>DANIEL TIAN</Text>
        <Text style={styles.founderTitle}>CTO / PRESIDENT</Text>
      </View>

      {/* Quote */}
      <Text style={styles.quote}>
        &quot;The best teams are built on trust, clarity, and shared conviction.&quot;
      </Text>
    </Page>
  );
}
