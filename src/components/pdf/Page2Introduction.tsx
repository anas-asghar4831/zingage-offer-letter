/* eslint-disable jsx-a11y/alt-text */
import { Page, View, Text, Image, StyleSheet, Svg, Path, Defs, LinearGradient, Stop, G } from "@react-pdf/renderer";
import { colors } from "@/lib/styles";
import { getAssetUrl } from "@/lib/assets";
import type { OfferLetterData } from "@/lib/types";
import { ZingageLogoOrange } from "./shared";

// Waving hand emoji SVG component
function WaveEmoji({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Defs>
        <LinearGradient id="paint0_linear" x1="65.0704" y1="73.8405" x2="57.3943" y2="55.8565">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
        <LinearGradient id="paint1_linear" x1="66.5983" y1="61.3326" x2="50.4983" y2="42.1276">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
        <LinearGradient id="paint2_linear" x1="23.5643" y1="48.5465" x2="33.0518" y2="55.5328">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
        <LinearGradient id="paint3_linear" x1="20.1097" y1="30.055" x2="36.756" y2="47.4775">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
        <LinearGradient id="paint5_linear" x1="38.0895" y1="21.8354" x2="47.7495" y2="37.0154">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
        <LinearGradient id="paint6_linear" x1="28.118" y1="24.3572" x2="41.228" y2="42.0672">
          <Stop offset="0.00132565" stopColor="#FFCB4B" />
          <Stop offset="1" stopColor="#FFD748" />
        </LinearGradient>
      </Defs>
      <G>
        {/* Brown outline paths */}
        <Path d="M26.5009 61.621C26.453 61.621 26.4007 61.6123 26.3484 61.5992C21.1 59.9994 15.4158 54.2629 14.1822 49.324C14.1124 49.0451 14.2824 48.7661 14.557 48.6963C14.836 48.6266 15.115 48.7966 15.1848 49.0712C16.3225 53.6264 21.7888 59.1232 26.6491 60.6097C26.9238 60.6925 27.0763 60.9802 26.9935 61.2548C26.9281 61.4771 26.7232 61.621 26.5009 61.621Z" fill="#975500" />
        <Path d="M29.003 68.1292C28.9638 68.1292 28.9246 68.1249 28.8853 68.1161C24.5437 67.1048 19.4959 63.8617 15.0409 59.2149C10.8736 54.8733 8.17534 50.2526 8.00098 47.1577C7.98354 46.8743 8.20149 46.6259 8.48919 46.6128C8.77253 46.5954 9.021 46.8133 9.03408 47.101C9.19101 49.917 11.8413 54.3894 15.7863 58.5C20.1061 63.0073 24.9665 66.1415 29.1207 67.1092C29.3997 67.1746 29.5741 67.4536 29.5087 67.7325C29.452 67.9679 29.2384 68.1292 29.003 68.1292Z" fill="#975500" />
        <Path d="M51.2562 22.834C51.0252 22.834 50.8159 22.6815 50.7549 22.4504C50.0269 19.6868 46.7184 15.72 43.7063 14.9441C43.4317 14.8743 43.2616 14.591 43.3358 14.312C43.4099 14.033 43.6888 13.8674 43.9678 13.9415C47.3592 14.8177 50.9423 19.0939 51.7575 22.1889C51.8316 22.4635 51.666 22.7468 51.387 22.8209C51.3434 22.8297 51.2998 22.834 51.2562 22.834Z" fill="#975500" />
        <Path d="M57.7816 23.7536C57.5506 23.7536 57.3413 23.5967 57.2803 23.3656C55.3405 15.7285 48.087 9.76966 43.9459 9.02862C43.6625 8.97631 43.4794 8.71041 43.5274 8.42707C43.5797 8.14372 43.8456 7.96064 44.1289 8.00859C48.6406 8.81938 56.208 14.9613 58.2829 23.1084C58.3526 23.3874 58.187 23.6664 57.908 23.7362C57.8644 23.7492 57.8252 23.7536 57.7816 23.7536Z" fill="#975500" />

        {/* Main hand shape with gradient */}
        <Path d="M44.9005 37.3237C45.7331 38.2434 46.4829 39.4509 46.1646 39.7691C45.8464 40.0873 44.87 39.5119 44.1246 38.7621C43.3792 38.0167 41.5963 45.9503 41.422 46.3513C41.2912 46.6521 39.2163 49.0321 38.1309 51.2945C37.7691 52.0486 37.8214 54.3241 37.6862 54.4592C37.1414 55.0041 36.4483 54.9474 34.9531 53.6266C33.4579 52.3058 32.682 60.1739 34.4649 61.4163C37.5119 63.5435 43.6059 71.9958 51.6571 71.9958C60.9724 71.9958 69.5991 62.2794 69.5991 55.1479C69.5991 48.0165 67.5067 45.3138 67.6462 39.3375C67.7595 34.2767 71.4429 31.8617 71.4429 29.3335C71.4429 27.2062 68.2826 26.6875 67.2452 26.6875C65.4056 26.6875 60.6891 29.0458 60.6891 35.2531C60.6891 37.668 60.0004 39.8519 57.5288 39.8519C55.0572 39.8519 52.2979 36.4606 50.6283 33.8146" fill="url(#paint0_linear)" />
        <Path d="M71.4388 29.3335C71.4388 28.1784 70.5016 27.4983 69.4815 27.1147C70.7064 31.173 64.4948 31.3474 64.4948 45.1744C64.4948 59.0014 56.4435 63.0248 53.1088 63.7179C49.7741 64.4067 43.8981 64.6072 39.4257 59.1191C38.0526 57.4321 36.1913 55.6013 34.1207 53.8708C33.2445 55.3311 33.0571 60.4356 34.4651 61.4163C37.5121 63.5436 43.606 71.9958 51.6573 71.9958C56.1558 71.9959 60.4887 69.7335 63.7711 66.5906C60.9726 71.9958 69.5992 62.2794 69.5992 55.148C69.5992 48.0165 67.5069 45.3139 67.6464 39.3376C67.7597 34.2767 71.4388 31.8618 71.4388 29.3335Z" fill="url(#paint1_linear)" />
        <Path d="M34.9531 53.6267C33.458 52.3059 29.9227 48.5396 27.6212 46.6957C25.3196 44.8562 23.31 44.878 21.9282 46.9093C20.5464 48.9407 24.5742 52.5064 25.4939 53.4261C26.9019 54.8341 32.682 60.174 34.4649 61.4207" fill="url(#paint2_linear)" />
        <Path d="M41.422 46.351C41.2476 46.7521 40.075 47.031 37.7429 44.4941C35.9601 42.5543 31.1869 36.979 28.3709 34.4507C25.5549 31.9225 23.3667 30.885 21.5271 32.2102C19.6876 33.5353 20.7338 36.2903 22.7913 38.5919C25.337 41.4383 28.2663 44.3415 31.0692 47.1313C33.2618 49.3108 38.2268 53.9184 37.6819 54.4633" fill="url(#paint3_linear)" />
        <Path d="M50.624 33.819C48.9545 31.173 42.1107 22.6641 40.4455 20.2492C38.776 17.8342 36.5354 17.8342 34.9836 18.9284C33.4318 20.0225 32.9697 22.2064 36.4657 26.8488C38.6714 29.7781 40.5022 32.472 44.9049 37.328L50.0224 36.9706L50.624 33.819Z" fill="url(#paint5_linear)" />
        <Path d="M44.1247 38.7622C43.3793 38.0168 36.7666 30.1792 35.2714 28.4966C32.4686 25.3493 28.9159 18.6058 24.6789 21.6092C22.4514 23.1872 23.6589 25.4757 24.2909 26.3955C24.923 27.3153 33.1442 36.805 33.9506 37.6071C34.7571 38.4135 41.5965 45.946 41.4265 46.347" fill="url(#paint6_linear)" />
      </G>
    </Svg>
  );
}

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
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  const foundersImageUrl = getAssetUrl(baseUrl, "/assets/images/founder.png");

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
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Hey, {data.firstName}</Text>
          <WaveEmoji size={52} />
        </View>
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
