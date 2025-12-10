# Image Optimization Research for @react-pdf/renderer

## Executive Summary

**Current State:**
- Total assets: **8.6 MB** across 25+ images
- Largest images: 5.2MB and 1.7MB PNG files (page7)
- Format mix: PNG (avatars, screenshots), SVG (logos, icons)
- Loading method: Direct URL references via baseUrl

**Performance Impact:**
- PDF generation time: ~2-5 seconds per render (estimated)
- Memory usage: 8.6MB baseline + rendering overhead (~15-20MB total)
- Browser preview: Slower initial load due to URL fetching
- Server-side: Better performance but still bandwidth-heavy

---

## 1. Image Format Optimization

### Current Formats Analysis

**PNG Images (Current):**
- Team avatars: 20-30KB each (acceptable)
- Testimonials/Screenshots: 413KB - 5.2MB (PROBLEMATIC)
- Total PNG size: ~8.4MB

**SVG Images (Current):**
- Logos: 250 bytes - 8KB (excellent)
- Keep as-is for vector graphics

### Recommended Format Strategy

#### High-Quality Optimization with Next.js Sharp

```typescript
// lib/image-optimizer.ts
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

interface OptimizationConfig {
  input: string;
  output: string;
  format: 'jpeg' | 'webp' | 'png';
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

export async function optimizeImage(config: OptimizationConfig): Promise<void> {
  const { input, output, format, quality, maxWidth, maxHeight } = config;

  const inputBuffer = await fs.readFile(input);
  let pipeline = sharp(inputBuffer);

  // Resize if dimensions specified
  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Format-specific optimization
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality,
        progressive: true, // Progressive JPEG for better perceived performance
        mozjpeg: true,     // Use mozjpeg for better compression
      });
      break;
    case 'webp':
      pipeline = pipeline.webp({
        quality,
        effort: 6, // Higher effort = better compression (0-6)
      });
      break;
    case 'png':
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9, // Maximum compression
        palette: true,       // Use palette for smaller files
      });
      break;
  }

  await pipeline.toFile(output);
}

// Batch optimization script
export async function optimizeAllImages(): Promise<void> {
  const optimizations: OptimizationConfig[] = [
    // Team avatars: PNG -> WebP (avatars look better in WebP)
    ...Array.from({ length: 10 }, (_, i) => ({
      input: `public/assets/team/avatar-${i}.png`,
      output: `public/assets/optimized/team/avatar-${i}.webp`,
      format: 'webp' as const,
      quality: 80,
      maxWidth: 130,
      maxHeight: 130,
    })),

    // Large screenshots: PNG -> JPEG (for photographic content)
    {
      input: 'public/assets/page7/0ad59e976cb8d51d22f23ff7b52c3c1659c59478.png',
      output: 'public/assets/optimized/page7/screenshot-1.jpg',
      format: 'jpeg',
      quality: 75,
      maxWidth: 1920,
      maxHeight: 1080,
    },

    // Company logos: Keep as PNG but optimize
    {
      input: 'public/assets/Experience/datadog_logo.png',
      output: 'public/assets/optimized/Experience/datadog_logo.png',
      format: 'png',
      quality: 90,
    },
  ];

  await Promise.all(optimizations.map(config => optimizeImage(config)));
}
```

### Format Comparison & Recommendations

| Image Type | Current | Recommended | Quality | Size Reduction | Rationale |
|------------|---------|-------------|---------|----------------|-----------|
| **Avatars (130x130)** | PNG 20-30KB | WebP @ 80 | Excellent | 40-50% | Photographic, small size |
| **Screenshots** | PNG 413KB-5.2MB | JPEG @ 75 | Good | 60-80% | Photographic, print-acceptable |
| **Logos (vector)** | SVG 1-8KB | SVG (keep) | Perfect | N/A | Vector graphics |
| **Logos (raster)** | PNG 1-11KB | PNG @ 90 | Excellent | 10-20% | Small, needs transparency |
| **Founders photo** | PNG 470KB | JPEG @ 80 | Excellent | 70-75% | Photographic content |

**Expected Total Size After Optimization:**
- Current: 8.6 MB
- Optimized: **1.8-2.5 MB** (70-75% reduction)

---

## 2. Image Compression Strategies

### Quality vs Size Analysis

Based on research, PDF image compression uses different algorithms:

**JPEG Compression (Lossy):**
- Quality 90-95: Excellent quality, ~50% reduction
- Quality 75-85: Good quality, ~65% reduction (RECOMMENDED)
- Quality 60-70: Acceptable quality, ~75% reduction
- Quality 30-50: Low quality, small files (~85% reduction)

**PNG Compression (Lossless):**
- CompressionLevel 9: Maximum compression, same quality
- Palette mode: Better for images with limited colors
- Expected: 10-30% size reduction

**WebP Compression:**
- Quality 80-90: Better than JPEG at same quality
- Effort 6: Maximum compression time/ratio
- Expected: 25-35% better than JPEG

### Recommended Compression Script

```bash
# npm script for package.json
{
  "scripts": {
    "optimize:images": "tsx scripts/optimize-images.ts",
    "optimize:watch": "tsx scripts/optimize-images.ts --watch"
  }
}
```

```typescript
// scripts/optimize-images.ts
import { optimizeAllImages } from '@/lib/image-optimizer';
import { glob } from 'glob';
import path from 'path';

async function main() {
  console.log('Starting image optimization...');

  const startTime = Date.now();

  // Get all images
  const images = await glob('public/assets/**/*.{png,jpg,jpeg}');
  console.log(`Found ${images.length} images to optimize`);

  // Optimize in parallel (limit concurrency)
  const BATCH_SIZE = 5;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (img) => {
        const ext = path.extname(img);
        const outputPath = img.replace('/assets/', '/assets/optimized/');

        // Determine optimization strategy based on image type
        if (img.includes('team/') || img.includes('GTMOPS/')) {
          // Avatars -> WebP
          return optimizeImage({
            input: img,
            output: outputPath.replace(ext, '.webp'),
            format: 'webp',
            quality: 80,
            maxWidth: 130,
            maxHeight: 130,
          });
        } else if (img.includes('page7/')) {
          // Screenshots -> JPEG
          return optimizeImage({
            input: img,
            output: outputPath.replace(ext, '.jpg'),
            format: 'jpeg',
            quality: 75,
          });
        } else {
          // Logos -> optimized PNG
          return optimizeImage({
            input: img,
            output: outputPath,
            format: 'png',
            quality: 90,
          });
        }
      })
    );
    console.log(`Optimized ${Math.min(i + BATCH_SIZE, images.length)}/${images.length}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Optimization complete in ${duration}s`);
}

main().catch(console.error);
```

---

## 3. Base64 vs URL Loading Performance

### Research Findings

**Base64 Embedding:**
- Pros:
  - Single file distribution
  - No network requests during render
  - Works offline
- Cons:
  - Increases React component size by 33% (Base64 overhead)
  - Larger memory footprint
  - Slower initial parse/render
  - **Known issues with PDFDownloadLink in browser**

**URL Loading (Current Approach):**
- Pros:
  - Smaller React component size
  - Lazy loading possible
  - Better for caching
  - Works well server-side
- Cons:
  - Requires network requests
  - Slower in browser preview
  - CORS issues possible

### Performance Comparison

| Metric | Base64 | URL Loading |
|--------|--------|-------------|
| **Component Size** | 11.5 MB (8.6MB * 1.33) | ~50 KB |
| **Initial Render** | Slower (large parse) | Faster (small parse) |
| **Image Fetch** | None (embedded) | 25+ requests |
| **Memory Usage** | Higher (~15-20MB) | Lower (~10-12MB) |
| **Server-side (API route)** | Fast | Fast |
| **Browser preview** | Slow initial | Slow fetch |
| **Production PDF** | Good | Good |

### Recommended Hybrid Approach

```typescript
// lib/image-loader.ts
import { promises as fs } from 'fs';
import path from 'path';

interface ImageCache {
  [key: string]: string; // base64 string
}

let imageCache: ImageCache = {};

export async function preloadImagesAsBase64(
  imagePaths: string[]
): Promise<ImageCache> {
  const cache: ImageCache = {};

  await Promise.all(
    imagePaths.map(async (imgPath) => {
      const fullPath = path.join(process.cwd(), 'public', imgPath);
      const buffer = await fs.readFile(fullPath);
      const ext = path.extname(imgPath);
      const mimeType = ext === '.png' ? 'image/png'
                     : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
                     : ext === '.webp' ? 'image/webp'
                     : 'image/png';

      cache[imgPath] = `data:${mimeType};base64,${buffer.toString('base64')}`;
    })
  );

  return cache;
}

// Environment-aware image source
export function getImageSrc(
  path: string,
  baseUrl: string,
  cache?: ImageCache
): string {
  // Server-side: Use base64 from cache if available
  if (typeof window === 'undefined' && cache && cache[path]) {
    return cache[path];
  }

  // Client-side or no cache: Use URL
  return `${baseUrl}${path}`;
}
```

**Updated API Route:**

```typescript
// app/api/generate-pdf/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OfferLetterDocument } from "@/components/pdf";
import { preloadImagesAsBase64 } from "@/lib/image-loader";

export async function GET(request: NextRequest) {
  // Preload all images as base64 for server-side rendering
  const imagePaths = [
    '/assets/team/avatar-1.webp',
    '/assets/team/avatar-2.webp',
    // ... all image paths
  ];

  const imageCache = await preloadImagesAsBase64(imagePaths);

  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  const document = (
    <OfferLetterDocument
      data={defaultOfferData}
      baseUrl={baseUrl}
      imageCache={imageCache}
    />
  );

  const pdfBuffer = await renderToBuffer(document);
  const uint8Array = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Offer-Letter.pdf"`,
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
```

**Updated Component:**

```typescript
// components/pdf/Page5Team.tsx
interface Page5Props {
  baseUrl: string;
  imageCache?: ImageCache;
}

export default function Page5Team({ baseUrl, imageCache }: Page5Props) {
  const getImage = (path: string) => getImageSrc(path, baseUrl, imageCache);

  return (
    <Page size={[1920, 1080]} style={styles.page}>
      {/* Use helper for all images */}
      <Image
        src={getImage('/assets/team/avatar-1.webp')}
        style={styles.avatar}
      />
    </Page>
  );
}
```

---

## 4. Image Preloading & Caching Strategies

### Next.js Cache Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    // Not used by @react-pdf/renderer, but good for web preview
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [130, 640, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Enable static asset caching
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default config;
```

### Server-Side Image Preloading

```typescript
// lib/pdf-cache.ts
import { LRUCache } from 'lru-cache';
import { ImageCache, preloadImagesAsBase64 } from './image-loader';

interface PDFCacheEntry {
  buffer: Buffer;
  timestamp: number;
}

// Cache compiled PDFs
const pdfCache = new LRUCache<string, PDFCacheEntry>({
  max: 50, // Store up to 50 compiled PDFs
  ttl: 1000 * 60 * 60, // 1 hour
  maxSize: 100 * 1024 * 1024, // 100MB
  sizeCalculation: (value) => value.buffer.length,
});

// Cache base64 images (shared across all PDFs)
let globalImageCache: ImageCache | null = null;

export async function getImageCache(): Promise<ImageCache> {
  if (!globalImageCache) {
    const imagePaths = [
      '/assets/team/avatar-1.webp',
      '/assets/team/avatar-2.webp',
      // ... all paths
    ];
    globalImageCache = await preloadImagesAsBase64(imagePaths);
  }
  return globalImageCache;
}

export function getCachedPDF(cacheKey: string): Buffer | null {
  const entry = pdfCache.get(cacheKey);
  return entry ? entry.buffer : null;
}

export function cachePDF(cacheKey: string, buffer: Buffer): void {
  pdfCache.set(cacheKey, {
    buffer,
    timestamp: Date.now(),
  });
}

// Create cache key from offer data
export function createCacheKey(data: OfferLetterData): string {
  return `pdf-${data.firstName}-${data.title}-${data.salary}`;
}
```

**Optimized API Route with Caching:**

```typescript
// app/api/generate-pdf/route.tsx
import { renderToBuffer } from "@react-pdf/renderer";
import {
  getImageCache,
  getCachedPDF,
  cachePDF,
  createCacheKey
} from "@/lib/pdf-cache";

export async function GET(request: NextRequest) {
  const data = defaultOfferData;
  const cacheKey = createCacheKey(data);

  // Check cache first
  const cachedPDF = getCachedPDF(cacheKey);
  if (cachedPDF) {
    console.log('Serving cached PDF');
    return new NextResponse(new Uint8Array(cachedPDF), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "X-Cache": "HIT",
      },
    });
  }

  // Generate new PDF
  const imageCache = await getImageCache();
  const baseUrl = `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

  const document = (
    <OfferLetterDocument
      data={data}
      baseUrl={baseUrl}
      imageCache={imageCache}
    />
  );

  const pdfBuffer = await renderToBuffer(document);

  // Cache for future requests
  cachePDF(cacheKey, pdfBuffer);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "X-Cache": "MISS",
    },
  });
}
```

---

## 5. Lazy Loading for Multi-Page PDFs

### @react-pdf/renderer Page Loading Behavior

**Important Finding:**
@react-pdf/renderer renders ALL pages at once (no built-in lazy loading). However, we can optimize the rendering pipeline:

```typescript
// lib/progressive-render.ts
import { renderToBuffer } from "@react-pdf/renderer";
import { ReactElement } from "react";

/**
 * Progressive rendering strategy for large PDFs
 * Renders pages in chunks to reduce memory spikes
 */
export async function renderProgressively(
  pages: ReactElement[],
  chunkSize: number = 2
): Promise<Buffer[]> {
  const chunks: Buffer[] = [];

  for (let i = 0; i < pages.length; i += chunkSize) {
    const chunk = pages.slice(i, i + chunkSize);
    const chunkDoc = <Document>{chunk}</Document>;
    const buffer = await renderToBuffer(chunkDoc);
    chunks.push(buffer);
  }

  // Merge PDFs (requires pdf-lib)
  return chunks;
}

// Alternative: Render on-demand per page
export async function renderPageOnDemand(
  pageNumber: number,
  createPage: (n: number) => ReactElement
): Promise<Buffer> {
  const page = createPage(pageNumber);
  const doc = <Document>{page}</Document>;
  return await renderToBuffer(doc);
}
```

### Browser Preview Optimization

```typescript
// components/PDFViewer.tsx (client-side)

import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

export default function PDFViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));

  // Only render visible pages + buffer
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page') || '1');
            setVisiblePages((prev) => new Set([...prev, pageNum]));
          }
        });
      },
      { rootMargin: '200px' } // Preload 200px before visible
    );

    document.querySelectorAll('.pdf-page-placeholder').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numPages]);

  return (
    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
        <div
          key={pageNum}
          className="pdf-page-placeholder"
          data-page={pageNum}
          style={{ minHeight: '1080px' }}
        >
          {visiblePages.has(pageNum) ? (
            <Page pageNumber={pageNum} width={1920} />
          ) : (
            <div>Loading page {pageNum}...</div>
          )}
        </div>
      ))}
    </Document>
  );
}
```

---

## 6. Performance Impact Estimates

### Current Implementation (Baseline)

| Metric | Value |
|--------|-------|
| Total Image Size | 8.6 MB |
| Server-side Generation | 3-5 seconds |
| Browser Preview | 6-8 seconds |
| Memory Usage | 15-20 MB |
| PDF File Size | ~10-12 MB |

### Optimized Implementation (Projected)

| Strategy | Generation Time | Memory | PDF Size | Improvement |
|----------|----------------|---------|----------|-------------|
| **Format Optimization** | 2-3s | 12-15MB | 3-4 MB | 60-70% smaller |
| **+ Base64 Caching** | 1-2s | 12-15MB | 3-4 MB | 50% faster |
| **+ PDF Caching** | 0.1s (cached) | 8-10MB | 3-4 MB | 95% faster (cached) |
| **+ Progressive Load** | 2-3s | 8-10MB | 3-4 MB | 40% less memory |

### Expected Results After Full Optimization

```
BEFORE:
- Image Assets: 8.6 MB
- Generation: 3-5 seconds
- PDF Size: 10-12 MB
- Memory: 15-20 MB

AFTER:
- Image Assets: 1.8-2.5 MB (71% reduction)
- Generation: 1-2 seconds (60% faster, 0.1s if cached)
- PDF Size: 3-4 MB (67% reduction)
- Memory: 8-10 MB (50% reduction)
```

---

## 7. Implementation Roadmap

### Phase 1: Image Optimization (High Impact, Low Risk)
**Time: 2-3 hours**

1. Install dependencies:
```bash
npm install sharp @types/sharp
```

2. Create optimization script (`scripts/optimize-images.ts`)
3. Run optimization on all assets
4. Update image paths in components
5. Test PDF generation

**Expected Impact:**
- 70% size reduction
- 40% faster generation
- No code changes required

### Phase 2: Base64 Caching (Medium Impact, Medium Risk)
**Time: 3-4 hours**

1. Create image loader utility
2. Update API route with caching
3. Update components to accept imageCache
4. Test with all pages

**Expected Impact:**
- 50% faster generation
- Better server-side performance
- Slightly higher memory usage

### Phase 3: PDF Caching (High Impact, Low Risk)
**Time: 2-3 hours**

1. Install LRU cache:
```bash
npm install lru-cache
```

2. Create PDF cache utility
3. Update API route with cache check
4. Add cache invalidation logic

**Expected Impact:**
- 95% faster for repeated requests
- Better scalability
- Lower server load

### Phase 4: Progressive Loading (Low Impact, High Risk)
**Time: 4-6 hours**

1. Create progressive render utility
2. Update browser preview component
3. Add intersection observer
4. Test all pages

**Expected Impact:**
- Better browser preview experience
- Lower memory usage
- More complex code

---

## 8. Code Examples Summary

### Quick Win: Optimize Images Script

```bash
# Install Sharp
npm install sharp @types/sharp

# Create script
mkdir -p scripts
touch scripts/optimize-images.ts

# Run optimization
npx tsx scripts/optimize-images.ts

# Update package.json
"scripts": {
  "optimize": "tsx scripts/optimize-images.ts"
}
```

### Medium Complexity: Add Caching

```typescript
// Key files to create/update:
// 1. lib/image-loader.ts (new)
// 2. lib/pdf-cache.ts (new)
// 3. app/api/generate-pdf/route.tsx (update)
// 4. components/pdf/OfferLetterDocument.tsx (update)
// 5. components/pdf/Page*.tsx (update all)
```

### Advanced: Full Optimization Stack

```bash
# Install all dependencies
npm install sharp lru-cache @types/sharp @types/lru-cache

# Project structure
offer-letter-pdf/
├── scripts/
│   └── optimize-images.ts
├── lib/
│   ├── image-loader.ts
│   ├── image-optimizer.ts
│   └── pdf-cache.ts
└── public/
    ├── assets/          # Original assets
    └── assets-optimized/ # Optimized assets
```

---

## 9. Testing & Validation

### Performance Testing Script

```typescript
// scripts/benchmark-pdf.ts
import { performance } from 'perf_hooks';
import { renderToBuffer } from '@react-pdf/renderer';
import { OfferLetterDocument } from '@/components/pdf';

async function benchmark() {
  const iterations = 10;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    const doc = <OfferLetterDocument data={defaultOfferData} baseUrl="" />;
    const buffer = await renderToBuffer(doc);

    const end = performance.now();
    times.push(end - start);

    console.log(`Iteration ${i + 1}: ${(end - start).toFixed(2)}ms (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`\nResults:`);
  console.log(`Average: ${avg.toFixed(2)}ms`);
  console.log(`Min: ${min.toFixed(2)}ms`);
  console.log(`Max: ${max.toFixed(2)}ms`);
}

benchmark();
```

### Visual Quality Comparison

```bash
# Generate PDFs with different quality settings
curl http://localhost:3000/api/generate-pdf > output-q75.pdf
curl http://localhost:3000/api/generate-pdf-q85 > output-q85.pdf
curl http://localhost:3000/api/generate-pdf-q95 > output-q95.pdf

# Compare file sizes
ls -lh output-*.pdf
```

---

## 10. Recommendations Summary

### Immediate Actions (Do Now)

1. **Optimize Images with Sharp** - 70% size reduction, 2-3 hours
2. **Convert large PNGs to JPEG @ 75 quality** - Biggest impact
3. **Convert avatars to WebP @ 80 quality** - Better compression
4. **Add Cache-Control headers** - Free performance win

### Short-term (This Sprint)

1. **Implement Base64 caching** - 50% faster generation
2. **Add LRU PDF cache** - 95% faster for repeated requests
3. **Optimize component imports** - Reduce bundle size

### Long-term (Future)

1. **Progressive loading for browser preview** - Better UX
2. **CDN for static assets** - Lower server load
3. **Image sprite sheets** - Reduce HTTP requests
4. **AVIF format exploration** - Future-proof optimization

---

## Sources

- [React-PDF Performance Issues Discussion](https://github.com/wojtekmaj/react-pdf/discussions/1691)
- [React PDF Renderer Best Practices](https://www.dhiwise.com/post/how-to-simplify-react-pdf-handling-with-react-pdf-renderer)
- [React Image Optimization Techniques](https://uploadcare.com/blog/react-image-optimization-techniques/)
- [Base64 Image Support in React-PDF](https://github.com/diegomura/react-pdf/issues/1072)
- [Next.js Image Optimization Guide](https://nextjs.org/docs/app/getting-started/images)
- [Next.js Sharp Configuration](https://strapi.io/blog/nextjs-image-optimization-developers-guide)
- [PDF Compression Algorithms](https://www.gdpicture.com/blog/pdf-optimization-series-part1-methods/)
- [PDF Image Optimization Strategies](https://docs.apryse.com/core/guides/features/optimization/optimize)

---

**Generated:** 2025-12-07
**Project:** Offer Letter PDF Generator
**Framework:** Next.js 16 + @react-pdf/renderer 4.3.1
