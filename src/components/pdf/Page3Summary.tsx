"use client";

import { Page, View, Text, Svg, Path, StyleSheet } from "@react-pdf/renderer";
import { colors } from "@/lib/styles";
import type { OfferLetterData } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    width: 1920,
    height: 1080,
    backgroundColor: colors.cream,
    position: "relative",
  },
  title: {
    position: "absolute",
    left: 60,
    top: 59,
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: 100,
    lineHeight: 1.2,
    letterSpacing: -4,
    color: colors.green,
  },
  tableContainer: {
    position: "absolute",
    left: 60,
    top: 220,
    width: 1800,
  },
  row: {
    flexDirection: "row",
    borderBottom: `1px solid ${colors.border}`,
  },
  rowNoBorder: {
    flexDirection: "row",
  },
  labelCell: {
    width: 423,
    paddingVertical: 44,
    paddingRight: 32,
  },
  valueCell: {
    flex: 1,
    paddingVertical: 44,
    paddingHorizontal: 32,
  },
  label: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 32,
    letterSpacing: -0.32,
    color: colors.green,
  },
  value: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 32,
    letterSpacing: -0.32,
    color: colors.green,
  },
  subValue: {
    fontFamily: "Manrope",
    fontWeight: 500,
    fontSize: 28,
    letterSpacing: -0.28,
    color: colors.green,
    marginTop: 8,
  },
  decorativeShape: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 262,
    height: 265,
  },
});

// Decorative ellipses shape matching Figma design
function DecorativeShape() {
  return (
    <Svg width={262} height={265} viewBox="0 0 262 265">
      {/* Four interlocking ring shapes */}
      <Path
        fillRule="evenodd"
        d="M87.061 150.65C113.121 150.65 134.247 129.525 134.247 103.465C134.247 77.4045 113.121 56.2787 87.061 56.2787C61.001 56.2787 39.8751 77.4045 39.8751 103.465C39.8751 129.525 61.001 150.65 87.061 150.65ZM87.061 190.525C135.143 190.525 174.122 151.547 174.122 103.465C174.122 55.3821 135.143 16.4036 87.061 16.4036C38.9786 16.4036 0.00012207 55.3821 0.00012207 103.465C0.00012207 151.547 38.9786 190.525 87.061 190.525Z"
        fill="#FF8125"
        opacity={0.15}
      />
      <Path
        fillRule="evenodd"
        d="M140.438 85.5849C166.498 85.5849 187.623 64.4591 187.623 38.3991C187.623 12.3391 166.498 -8.78678 140.438 -8.78678C114.378 -8.78678 93.2518 12.3391 93.2518 38.3991C93.2518 64.4591 114.378 85.5849 140.438 85.5849ZM140.438 125.46C188.52 125.46 227.499 86.4815 227.499 38.3991C227.499 -9.68332 188.52 -48.6618 140.438 -48.6618C92.3553 -48.6618 53.3768 -9.68332 53.3768 38.3991C53.3768 86.4815 92.3553 125.46 140.438 125.46Z"
        fill="#FF8125"
        opacity={0.15}
      />
      <Path
        fillRule="evenodd"
        d="M261.183 224.368C287.243 224.368 308.369 203.243 308.369 177.182C308.369 151.122 287.243 129.997 261.183 129.997C235.123 129.997 213.997 151.122 213.997 177.182C213.997 203.243 235.123 224.368 261.183 224.368ZM261.183 264.243C309.265 264.243 348.244 225.265 348.244 177.182C348.244 129.1 309.265 90.1216 261.183 90.1216C213.101 90.1216 174.122 129.1 174.122 177.182C174.122 225.265 213.101 264.243 261.183 264.243Z"
        fill="#FF8125"
        opacity={0.15}
      />
      <Path
        fillRule="evenodd"
        d="M314.559 50.2468C340.619 50.2468 361.745 29.121 361.745 3.061C361.745 -22.999 340.619 -44.1249 314.559 -44.1249C288.499 -44.1249 267.373 -22.999 267.373 3.061C267.373 29.121 288.499 50.2468 314.559 50.2468ZM314.559 90.1219C362.641 90.1219 401.62 51.1434 401.62 3.061C401.62 -45.0214 362.641 -83.9999 314.559 -83.9999C266.477 -83.9999 227.498 -45.0214 227.498 3.061C227.498 51.1434 266.477 90.1219 314.559 90.1219Z"
        fill="#FF8125"
        opacity={0.15}
      />
    </Svg>
  );
}

interface Page3Props {
  data: OfferLetterData;
}

export default function Page3Summary({ data }: Page3Props) {
  return (
    <Page size={[1920, 1080]} style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Summary</Text>

      {/* Decorative Shape */}
      <View style={styles.decorativeShape}>
        <DecorativeShape />
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Role */}
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text style={styles.label}>Role:</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.value}>{data.title}</Text>
          </View>
        </View>

        {/* Base Salary */}
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text style={styles.label}>Base Salary</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.value}>{data.salary}</Text>
          </View>
        </View>

        {/* Total Stock Options */}
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text style={styles.label}>Total Stock Options</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.value}>{data.shares}</Text>
            <Text style={styles.subValue}>
              Implies {data.equityPercentage} stake, according to the last fundraise (June {"'"}25)
            </Text>
          </View>
        </View>

        {/* Vesting Schedule */}
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text style={styles.label}>Vesting Schedule:</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.value}>4 Years equal distribution, 1-Year Cliff</Text>
          </View>
        </View>

        {/* Start Date */}
        <View style={styles.rowNoBorder}>
          <View style={styles.labelCell}>
            <Text style={styles.label}>Start Date:</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.value}>{data.startDate}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
