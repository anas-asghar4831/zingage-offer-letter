import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import { colors } from "@/lib/styles";
import { getAssetUrl } from "@/lib/assets";
import { ZingageLogoOrange as SharedZingageLogoOrange } from "./shared";

const styles = StyleSheet.create({
  page: {
    width: 1920,
    height: 1080,
    backgroundColor: colors.creamLight,
    position: "relative",
    overflow: "hidden",
  },
  logoContainer: {
    position: "absolute",
    left: 60,
    top: 48,
  },
  verticalLine: {
    position: "absolute",
    left: 845,
    top: 0,
    width: 1,
    height: 1080,
    backgroundColor: "#E5E5E5",
  },
  contentContainer: {
    position: "absolute",
    left: 60,
    top: 215,
    width: 725,
  },
  paragraph: {
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 1.5,
    color: colors.green,
  },
  link: {
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: 28,
    lineHeight: 1.5,
    color: colors.green,
    textDecoration: "underline",
  },
  // Image containers with borders - positions from Figma
  // image 3148: Slack chat - top right
  imageContainer1: {
    position: "absolute",
    left: 1344,
    top: 19,
    width: 488,
    height: 275,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3153: Senior Helpers - tall left image
  imageContainer2: {
    position: "absolute",
    left: 906,
    top: 19,
    width: 417,
    height: 818,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3143: Small testimonial - bottom area
  imageContainer3: {
    position: "absolute",
    left: 1344,
    top: 730,
    width: 558,
    height: 112,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3146: Wide testimonial - bottom
  imageContainer4: {
    position: "absolute",
    left: 906,
    top: 962,
    width: 978,
    height: 102,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3151: Amy testimonial
  imageContainer5: {
    position: "absolute",
    left: 1344,
    top: 311,
    width: 490,
    height: 161,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3144: Small image - LOL quote
  imageContainer6: {
    position: "absolute",
    left: 1529,
    top: 505,
    width: 373,
    height: 94,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3152: Victor, Great day - wide bar
  imageContainer7: {
    position: "absolute",
    left: 906,
    top: 856,
    width: 752,
    height: 88,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3145: Tall image - team photo
  imageContainer8: {
    position: "absolute",
    left: 1344,
    top: 482,
    width: 175,
    height: 233,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // image 3147: Small bar - Brian email
  imageContainer9: {
    position: "absolute",
    left: 1529,
    top: 611,
    width: 373,
    height: 84,
    borderRadius: 12,
    borderWidth: 5,
    borderColor: "#FF974D",
    borderStyle: "solid",
    overflow: "hidden",
  },
  // Image style to fill container
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 7,
  },
});

// Re-export for backwards compatibility and local use
const ZingageLogoOrange = SharedZingageLogoOrange;
export { ZingageLogoOrange };

interface Page7Props {
  baseUrl: string;
}

export default function Page7Vision({ baseUrl }: Page7Props) {
  // Testimonial/press images from Figma
  const images = {
    testimonialBg: getAssetUrl(baseUrl, "/assets/page7/testimonial-bg.png"),
    pressCollage: getAssetUrl(baseUrl, "/assets/page7/press-collage.png"),
    avatar1: getAssetUrl(baseUrl, "/assets/page7/avatar-01.png"),
    avatar2: getAssetUrl(baseUrl, "/assets/page7/avatar-02.png"),
    avatar3: getAssetUrl(baseUrl, "/assets/page7/avatar-03.png"),
    avatar4: getAssetUrl(baseUrl, "/assets/page7/avatar-04.png"),
    avatar5: getAssetUrl(baseUrl, "/assets/page7/avatar-05.png"),
    heroImage: getAssetUrl(baseUrl, "/assets/page7/hero-image.png"),
    iconSmall: getAssetUrl(baseUrl, "/assets/page7/icon-small.png"),
  };

  return (
    <Page size={[1920, 1080]} style={styles.page}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <ZingageLogoOrange width={260} height={69} />
      </View>

      {/* Vertical divider */}
      <View style={styles.verticalLine} />

      {/* Left side content */}
      <View style={styles.contentContainer}>
        <Text style={styles.paragraph}>
          We{"'"}re building more than a software company. We{"'"}re creating infrastructure for the Bedrock Economy: the essential, human-centered industries that keep society running.
        </Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>
          We started with healthcare because it{"'"}s where the need is most urgent. Millions of frontline caregivers work tirelessly with outdated tools and broken systems. They deserve better. The vulnerable people they care for deserve better.
        </Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>
          But our vision extends beyond healthcare to all industries built on frontline labor and human connection.
        </Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>
          Joining Zingage means: Betting your talent and energy on a mission to transform how essential work gets done—and improve millions of lives in the process.
        </Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>
          Read more about our vision:{" "}
          <Link src="https://armthehomefront.com" style={styles.link}>
            armthehomefront.com
          </Link>
        </Text>
      </View>

      {/* eslint-disable jsx-a11y/alt-text */}
      {/* Right side image grid - wrapped in Views for borders */}
      <View style={styles.imageContainer1}>
        <Image src={images.testimonialBg} style={styles.image} />
      </View>
      <View style={styles.imageContainer2}>
        <Image src={images.pressCollage} style={styles.image} />
      </View>
      <View style={styles.imageContainer3}>
        <Image src={images.avatar1} style={styles.image} />
      </View>
      <View style={styles.imageContainer4}>
        <Image src={images.avatar2} style={styles.image} />
      </View>
      <View style={styles.imageContainer5}>
        <Image src={images.avatar3} style={styles.image} />
      </View>
      <View style={styles.imageContainer6}>
        <Image src={images.avatar4} style={styles.image} />
      </View>
      <View style={styles.imageContainer7}>
        <Image src={images.avatar5} style={styles.image} />
      </View>
      <View style={styles.imageContainer8}>
        <Image src={images.heroImage} style={styles.image} />
      </View>
      <View style={styles.imageContainer9}>
        <Image src={images.iconSmall} style={styles.image} />
      </View>
      {/* eslint-enable jsx-a11y/alt-text */}
    </Page>
  );
}
