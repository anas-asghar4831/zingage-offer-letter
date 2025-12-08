import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors } from "@/lib/styles";
import { getAssetUrl } from "@/lib/assets";
import { ZingageLogoOrange } from "./shared";

const styles = StyleSheet.create({
  page: {
    width: 1920,
    height: 1080,
    backgroundColor: colors.creamLight,
    position: "relative",
  },
  header: {
    position: "absolute",
    left: 52,
    top: 32,
    width: 1816,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 80,
    lineHeight: 1.2,
    letterSpacing: -3.2,
    color: colors.green,
  },
  horizontalLine: {
    position: "absolute",
    left: 52,
    top: 231,
    width: 1816,
    height: 1,
    backgroundColor: colors.borderDark,
  },
  horizontalLineBottom: {
    position: "absolute",
    left: 52,
    top: 961,
    width: 1816,
    height: 1,
    backgroundColor: colors.borderDark,
  },
  sidebar: {
    position: "absolute",
    left: 52,
    top: 231,
    width: 265,
  },
  sidebarItem: {
    paddingVertical: 32,
    paddingRight: 52,
    borderRight: `1.5px solid ${colors.borderDark}`,
    height: 182.5,
    justifyContent: "center",
  },
  sidebarItemShort: {
    paddingVertical: 32,
    paddingRight: 52,
    borderRight: `1.5px solid ${colors.borderDark}`,
    height: 147,
    justifyContent: "center",
  },
  sidebarLabel: {
    fontFamily: "Geist",
    fontWeight: 500,
    fontSize: 28,
    color: colors.green,
  },
  sidebarLabelUpper: {
    fontFamily: "Geist",
    fontWeight: 500,
    fontSize: 28,
    color: colors.green,
    textTransform: "uppercase",
  },
  buildersRow: {
    position: "absolute",
    left: 352,
    top: 263,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  gtmRow: {
    position: "absolute",
    left: 352,
    top: 458,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  experienceRow: {
    position: "absolute",
    left: 352,
    top: 670,
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
  },
  investorsRow: {
    position: "absolute",
    left: 352,
    top: 830,
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  companyLogo: {
    height: 46,
    objectFit: "contain",
  },
  investorLogo: {
    height: 60,
    objectFit: "contain",
  },
});

interface Page5Props {
  baseUrl: string;
}

export default function Page5Team({ baseUrl }: Page5Props) {
  // Team member avatars - Builders (10 avatars based on Figma design)
  const buildersAvatars = [
    getAssetUrl(baseUrl, "/assets/team/builder-01.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-02.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-03.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-04.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-05.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-06.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-07.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-08.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-09.png"),
    getAssetUrl(baseUrl, "/assets/team/builder-10.png"),
  ];

  // GTM/OPS avatars (5 avatars based on Figma design)
  const gtmAvatars = [
    getAssetUrl(baseUrl, "/assets/GTMOPS/gtmops-01.png"),
    getAssetUrl(baseUrl, "/assets/GTMOPS/gtmops-02.png"),
    getAssetUrl(baseUrl, "/assets/GTMOPS/gtmops-03.png"),
    getAssetUrl(baseUrl, "/assets/GTMOPS/gtmops-04.png"),
    getAssetUrl(baseUrl, "/assets/GTMOPS/gtmops-05.png"),
  ];

  // Company logos for Experience row (6 logos: Ramp, Tennr, Astorian, Pacvue, Datadog, Uber)
  const companyLogos = [
    { src: getAssetUrl(baseUrl, "/assets/Experience/ramp-logo.png"), width: 173, height: 46, name: "Ramp" },
    { src: getAssetUrl(baseUrl, "/assets/Experience/tennr-logo.png"), width: 164, height: 42, name: "Tennr" },
    { src: getAssetUrl(baseUrl, "/assets/Experience/astorian-logo.png"), width: 283, height: 40, name: "Astorian" },
    { src: getAssetUrl(baseUrl, "/assets/Experience/pacvue-logo.png"), width: 229, height: 40, name: "Pacvue" },
    { src: getAssetUrl(baseUrl, "/assets/Experience/datadog-logo.png"), width: 177, height: 44, name: "Datadog" },
    { src: getAssetUrl(baseUrl, "/assets/Experience/uber-logo.png"), width: 130, height: 44, name: "Uber" },
  ];

  // Investor logos (4 logos: Bessemer, TQ Ventures, South Park Commons, WndrCo)
  const investorLogos = [
    { src: getAssetUrl(baseUrl, "/assets/Investors/bessemer-logo.png"), width: 128, height: 55, name: "Bessemer" },
    { src: getAssetUrl(baseUrl, "/assets/Investors/tq-ventures-logo.png"), width: 57, height: 67, name: "TQ Ventures" },
    { src: getAssetUrl(baseUrl, "/assets/Investors/southpark-logo.png"), width: 59, height: 67, name: "South Park Commons" },
    { src: getAssetUrl(baseUrl, "/assets/Investors/wndrco-logo.png"), width: 194, height: 46, name: "WndrCo" },
  ];

  return (
    <Page size={[1920, 1080]} style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Zingage Team</Text>
        <ZingageLogoOrange width={272} height={73} />
      </View>

      {/* Horizontal lines */}
      <View style={styles.horizontalLine} />
      <View style={styles.horizontalLineBottom} />

      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarLabel}>Builders</Text>
        </View>
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarLabelUpper}>GTM/OPS</Text>
        </View>
        <View style={styles.sidebarItemShort}>
          <Text style={styles.sidebarLabel}>Experience</Text>
        </View>
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarLabel}>Investors</Text>
        </View>
      </View>

      {/* Builders Row */}
      <View style={styles.buildersRow}>
        {buildersAvatars.slice(0, 10).map((avatar, index) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image key={index} src={avatar} style={styles.avatar} />
        ))}
      </View>

      {/* GTM/OPS Row */}
      <View style={styles.gtmRow}>
        {gtmAvatars.map((avatar, index) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image key={index} src={avatar} style={styles.avatar} />
        ))}
      </View>

      {/* Experience Row - Company Logos */}
      <View style={styles.experienceRow}>
        {companyLogos.map((logo, index) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image
            key={index}
            src={logo.src}
            style={{ width: logo.width, height: logo.height, objectFit: "contain" }}
          />
        ))}
      </View>

      {/* Investors Row */}
      <View style={styles.investorsRow}>
        {investorLogos.map((logo, index) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image
            key={index}
            src={logo.src}
            style={{ width: logo.width, height: logo.height, objectFit: "contain" }}
          />
        ))}
      </View>
    </Page>
  );
}
