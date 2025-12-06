# PDF Generation Performance Research

**Date:** 2025-12-07
**Context:** 7-page PDF at 1920x1080 landscape with many images
**Current Implementation:** @react-pdf/renderer v4.3.1

---

## Table of Contents

1. [@react-pdf/renderer Configuration & Optimization](#1-react-pdfrenderer-configuration--optimization)
2. [Alternative Libraries Comparison](#2-alternative-libraries-comparison)
3. [Performance Recommendations](#3-performance-recommendations)
4. [Implementation Guide](#4-implementation-guide)

---

## 1. @react-pdf/renderer Configuration & Optimization

### 1.1 Document-Level Props

The Document component supports these configuration options:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | String | undefined | PDF metadata title |
| `author` | String | undefined | PDF metadata author |
| `subject` | String | undefined | PDF metadata subject |
| `keywords` | String | undefined | PDF metadata keywords |
| `creator` | String | "react-pdf" | PDF metadata creator |
| `producer` | String | "react-pdf" | PDF metadata producer |
| `pdfVersion` | String | "1.3" | PDF version (1.3, 1.4, 1.5, 1.6, 1.7) |
| `language` | String | undefined | Default language |
| `pageMode` | PageMode | "useNone" | How document displays when opened |
| `pageLayout` | PageLayout | - | How viewers show pages |

**Current Implementation Analysis:**
Your current Document setup uses `title`, `author`, `subject`, and `creator` - which is good. Consider adding:
- `pdfVersion: "1.7"` for better compression support
- `language: "en"` for accessibility

### 1.2 Page Rendering Optimizations

| Option | Description | Performance Impact |
|--------|-------------|-------------------|
| `wrap={false}` | Disable automatic page wrapping | Reduces layout calculations |
| `fixed` | Render element on all pages (headers/footers) | Use sparingly |
| `debug={true}` | Show layout boundaries | Development only |
| `orphans` / `widows` | Text protection settings | Minor impact |

### 1.3 Image Component Options

```tsx
<Image
  src={{
    uri: "https://example.com/image.jpg",
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
    body: ""
  }}
  cache={true}  // Enable caching (default)
/>
```

**Key Image Optimizations:**
1. Use JPEG instead of PNG where possible (smaller file size)
2. Avoid WebP images (converted to PNG/JPEG, causing 10x size increase)
3. Pre-compress images before embedding
4. Use base64 for small, frequently-used images
5. Remove EXIF metadata from images (prevents Chrome lossless re-encoding)

### 1.4 Memory Management

**Known Issues:**
- Memory leaks reported when generating 50+ documents consecutively
- Mobile browsers (iOS Safari) have 256MB canvas limit
- Large datasets can cause memory overflow errors

**Mitigation Strategies:**
1. Use Web Workers for client-side generation
2. Implement server-side generation with `renderToBuffer` or `renderToStream`
3. Clean up URL objects in useEffect hooks
4. Restart worker threads periodically for batch processing

### 1.5 Compression Options

**Note:** @react-pdf/renderer does NOT have built-in image compression settings. The library uses pdfkit internally which applies zlib Flate compression to text and images by default.

**Workarounds:**
- Pre-compress images before adding to PDF
- Use lower resolution images (scale down from 1920x1080 if acceptable)
- Convert PNG to JPEG where transparency isn't needed

---

## 2. Alternative Libraries Comparison

### 2.1 Library Overview

| Library | Best For | Bundle Size | Server Support | Image Handling |
|---------|----------|-------------|----------------|----------------|
| @react-pdf/renderer | React-based PDFs | ~392kb gzipped | Yes | Good |
| pdf-lib | Programmatic PDF creation/editing | ~200kb | Yes | Limited |
| jsPDF | Simple document generation | ~300kb | Yes | Via plugins |
| Puppeteer | HTML-to-PDF | N/A (server) | Server only | Excellent |
| Playwright | HTML-to-PDF | N/A (server) | Server only | Excellent |

### 2.2 pdf-lib

**Pros:**
- Pure JavaScript, no native dependencies
- Works in browser and Node.js
- Can modify existing PDFs
- Good TypeScript support
- Smaller bundle size

**Cons:**
- No built-in image compression
- No React component syntax
- Manual layout positioning required
- Limited font support

**Best For:** Programmatic PDF manipulation, form filling, stamping

### 2.3 jsPDF

**Pros:**
- Long-established with large community
- Many plugins available (html2canvas integration)
- Good for simple reports

**Cons:**
- Can be slow with complex documents
- HTML-to-PDF via html2canvas adds overhead
- Limited styling accuracy

**Best For:** Simple invoices, receipts, basic reports

### 2.4 Puppeteer PDF Generation

**Pros:**
- Perfect CSS/HTML fidelity
- Full JavaScript rendering support
- Excellent image handling
- Can achieve 10k PDFs/day at p95 365ms on Lambda

**Cons:**
- Large container size (headless Chrome)
- High memory usage
- Server-side only
- Files >100MB can fail via CDP protocol
- WebP images cause 10x size increase
- EXIF metadata can cause file bloat (15mb photos -> 72mb PDF)

**Performance Tips:**
```javascript
// Use old headless mode for smaller/faster PDFs
const browser = await puppeteer.launch({
  headless: 'new',  // or true for old mode
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

// Reuse tabs instead of creating new ones
// Close and recreate tabs periodically to free memory

// Optimize page load
await page.goto(url, { waitUntil: 'networkidle0' });
await page.emulateMediaType('screen');
await page.pdf({
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true
});
```

### 2.5 Playwright PDF Generation

**Pros:**
- 20% faster than Puppeteer in cross-browser scenarios
- Lower memory usage than Puppeteer
- Better async handling
- Average 4.513s vs Puppeteer's 4.784s in benchmarks

**Cons:**
- PDF generation only works in Chromium
- Still requires headless browser
- Server-side only

**Note:** For Chrome-only tasks, Puppeteer is slightly faster.

---

## 3. Performance Recommendations

### 3.1 For Your Use Case (7 pages, 1920x1080, many images)

**Recommendation: Keep @react-pdf/renderer with optimizations**

**Reasoning:**
1. You're already using server-side `renderToBuffer` - optimal approach
2. 7 pages is not "large" (issues start at 30+ pages)
3. React component syntax matches your architecture
4. Switching to Puppeteer adds complexity without significant benefit

### 3.2 Optimization Priority List

#### High Impact:
1. **Pre-compress all images** - Most important optimization
   - Resize images to actual display size
   - Use JPEG at 80% quality instead of PNG
   - Strip EXIF metadata
   - Avoid WebP format

2. **Use renderToBuffer on server** - Already implemented, good

3. **Consider image caching** - If images don't change often:
   ```tsx
   // Pre-load and cache images as base64
   const imageCache = new Map<string, string>();
   ```

#### Medium Impact:
4. **Set PDF version to 1.7** for better compression
5. **Disable page wrapping** where not needed: `wrap={false}`
6. **Batch image loading** before PDF generation

#### Low Impact:
7. Add Web Worker for client-side preview (if needed)
8. Implement request-level caching for identical PDFs

### 3.3 When to Switch to Puppeteer

Consider Puppeteer/Playwright if:
- You need pixel-perfect HTML/CSS reproduction
- Complex layouts that @react-pdf/renderer handles poorly
- You're already running a Node server
- You need to generate PDFs from existing web pages

**Don't switch if:**
- Current approach works acceptably
- You want to minimize server resources
- You need client-side generation capability

---

## 4. Implementation Guide

### 4.1 Optimized Document Component

```tsx
import { Document } from "@react-pdf/renderer";

export default function OptimizedDocument({ data, baseUrl }) {
  return (
    <Document
      title={`Offer Letter - ${data.firstName}`}
      author="Zingage"
      subject="Employment Offer Letter"
      creator="Zingage Offer Letter Generator"
      producer="Zingage"
      pdfVersion="1.7"
      language="en"
    >
      {/* Pages with wrap={false} where appropriate */}
      <Page1Cover data={data} />
      {/* ... */}
    </Document>
  );
}
```

### 4.2 Image Optimization Script

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(1920, 1080, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .withMetadata({ orientation: undefined }) // Strip EXIF
    .toFile(outputPath);
}
```

### 4.3 Web Worker Setup (for client-side)

```typescript
// pdf.worker.ts
import { renderToBlob } from '@react-pdf/renderer';
import * as Comlink from 'comlink';

const api = {
  async generatePdf(documentElement: React.ReactElement) {
    return await renderToBlob(documentElement);
  }
};

Comlink.expose(api);
```

### 4.4 Performance Monitoring

```typescript
// Measure PDF generation time
const startTime = performance.now();
const pdfBuffer = await renderToBuffer(document);
const endTime = performance.now();
console.log(`PDF generated in ${endTime - startTime}ms`);
console.log(`PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
```

---

## 5. Benchmarks Summary

### Expected Performance (7-page PDF with images)

| Approach | Generation Time | Memory Usage | File Size |
|----------|----------------|--------------|-----------|
| @react-pdf/renderer (server) | 500-2000ms | Low-Medium | Varies by images |
| Puppeteer | 1000-3000ms | High | Larger (uncompressed) |
| Playwright | 900-2500ms | Medium-High | Larger (uncompressed) |

**Note:** Actual performance depends heavily on:
- Image sizes and formats
- Server resources
- Network latency for remote images
- Font loading time

---

## 6. Sources

### @react-pdf/renderer
- [Official Documentation](https://react-pdf.org/)
- [Advanced Features](https://react-pdf.org/advanced)
- [Components Reference](https://react-pdf.org/components)
- [usePDF Hook](https://react-pdf.org/hooks)
- [npm Package](https://www.npmjs.com/package/@react-pdf/renderer)
- [GitHub Issues - Image Compression Request](https://github.com/diegomura/react-pdf/issues/1444)
- [GitHub Issues - Memory Leak](https://github.com/diegomura/react-pdf/issues/718)

### Performance & Optimization
- [Creating PDF Files Without Slowing Down Your App - DEV Community](https://dev.to/simonhessel/creating-pdf-files-without-slowing-down-your-app-a42)
- [Generating PDFs with React on the Server - Prototyp Digital](https://prototyp.digital/blog/generating-pdfs-with-react-on-the-server)
- [How to Generate PDFs in 2025 - DEV Community](https://dev.to/michal_szymanowski/how-to-generate-pdfs-in-2025-26gi)

### Puppeteer & Playwright
- [Optimizing Puppeteer PDF generation](https://www.codepasta.com/2024/04/19/optimizing-puppeteer-pdf-generation)
- [7 Tips for Generating PDFs with Puppeteer - APITemplate.io](https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/)
- [Puppeteer vs Playwright Performance Comparison 2025 - Skyvern](https://www.skyvern.com/blog/puppeteer-vs-playwright-complete-performance-comparison-2025/)
- [Playwright vs Puppeteer - BrowserStack](https://www.browserstack.com/guide/playwright-vs-puppeteer)
- [HTML to PDF Renderers Comparison - FileForge](https://www.fileforge.com/blog/html-to-pdf-renderers-comparison-guide/)

### pdf-lib
- [GitHub - Is it possible to compress images in an existing PDF?](https://github.com/Hopding/pdf-lib/issues/71)
- [Stack Overflow - How to reduce pdf size with PDFLib](https://stackoverflow.com/questions/12346542/how-to-reduce-pdf-size-with-pdflib-with-heavy-images)

---

## 7. Conclusion

For your current use case (7-page offer letter PDF at 1920x1080 with images), **@react-pdf/renderer is the right choice**. Focus optimization efforts on:

1. **Image optimization** - Compress and resize images before embedding
2. **Use JPEG format** - Avoid PNG/WebP where possible
3. **Keep server-side rendering** - Your current `renderToBuffer` approach is correct
4. **Monitor performance** - Add timing logs to identify bottlenecks

Switching to Puppeteer/Playwright would add infrastructure complexity without significant benefits for a 7-page document. Consider them only if you need HTML/CSS fidelity that @react-pdf/renderer cannot achieve.
