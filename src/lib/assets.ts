// Asset URL helper - works on both client and server
// Images use URL paths which @react-pdf/renderer loads automatically

// Helper to get image source URL
export function getAssetUrl(baseUrl: string, assetPath: string): string {
  // Simply construct the full URL - react-pdf handles the loading
  return `${baseUrl}${assetPath}`;
}

// Pre-defined asset paths for type safety
export const assetPaths = {
  // Team avatars (Builders)
  team: {
    builder1: "/assets/team/builder-01.png",
    builder2: "/assets/team/builder-02.png",
    builder3: "/assets/team/builder-03.png",
    builder4: "/assets/team/builder-04.png",
    builder5: "/assets/team/builder-05.png",
    builder6: "/assets/team/builder-06.png",
    builder7: "/assets/team/builder-07.png",
    builder8: "/assets/team/builder-08.png",
    builder9: "/assets/team/builder-09.png",
    builder10: "/assets/team/builder-10.png",
  },

  // GTM/OPS avatars
  gtmops: {
    avatar1: "/assets/GTMOPS/gtmops-01.png",
    avatar2: "/assets/GTMOPS/gtmops-02.png",
    avatar3: "/assets/GTMOPS/gtmops-03.png",
    avatar4: "/assets/GTMOPS/gtmops-04.png",
    avatar5: "/assets/GTMOPS/gtmops-05.png",
  },

  // Company logos (Experience)
  experience: {
    ramp: "/assets/Experience/ramp-logo.png",
    tennr: "/assets/Experience/tennr-logo.png",
    astorian: "/assets/Experience/astorian-logo.png",
    pacvue: "/assets/Experience/pacvue-logo.png",
    datadog: "/assets/Experience/datadog-logo.png",
    uber: "/assets/Experience/uber-logo.png",
  },

  // Investor logos
  investors: {
    bessemer: "/assets/Investors/bessemer-logo.png",
    tqVentures: "/assets/Investors/tq-ventures-logo.png",
    southPark: "/assets/Investors/southpark-logo.png",
    wndrco: "/assets/Investors/wndrco-logo.png",
  },

  // Page 7 assets
  page7: {
    decorationSvg1: "/assets/page7/decoration-01.svg",
    testimonialBg: "/assets/page7/testimonial-bg.png",
    pressCollage: "/assets/page7/press-collage.png",
    avatar1: "/assets/page7/avatar-01.png",
    avatar2: "/assets/page7/avatar-02.png",
    avatar3: "/assets/page7/avatar-03.png",
    avatar4: "/assets/page7/avatar-04.png",
    avatar5: "/assets/page7/avatar-05.png",
    heroImage: "/assets/page7/hero-image.png",
    iconSmall: "/assets/page7/icon-small.png",
    decorationSvg2: "/assets/page7/decoration-02.svg",
    decorationSvg3: "/assets/page7/decoration-03.svg",
    unionShape: "/assets/page7/union-shape.png",
  },

  // Founders image
  founders: "/assets/images/founder.png",
};
