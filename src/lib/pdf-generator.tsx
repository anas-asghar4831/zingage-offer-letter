import { renderToBuffer } from "@react-pdf/renderer";
import { OfferLetterDocument } from "@/components/pdf";
import { registerFontsServer } from "@/lib/fonts";
import { pdfCache } from "@/lib/pdf-cache";
import type { OfferLetterData } from "@/lib/types";

export interface PDFGenerationResult {
  buffer: Buffer;
  etag: string;
  cached: boolean;
  duration: number;
}

/**
 * Generate PDF with caching support
 * Shared logic used by both API routes
 */
export async function generatePDF(
  data: OfferLetterData,
  baseUrl: string
): Promise<PDFGenerationResult> {
  const startTime = Date.now();
  const cacheKey = pdfCache.generateKey(data);

  // Check cache first
  const cached = pdfCache.get(cacheKey);
  if (cached) {
    return {
      buffer: cached.buffer,
      etag: cached.etag,
      cached: true,
      duration: Date.now() - startTime,
    };
  }

  // Register fonts with absolute URLs for server-side
  registerFontsServer(baseUrl);

  // Generate new PDF
  const document = <OfferLetterDocument data={data} baseUrl={baseUrl} />;
  const pdfBuffer = await renderToBuffer(document);

  // Cache it
  const entry = pdfCache.set(cacheKey, pdfBuffer);

  return {
    buffer: pdfBuffer,
    etag: entry.etag,
    cached: false,
    duration: Date.now() - startTime,
  };
}

/**
 * Check if client has a valid cached version
 */
export function checkETagMatch(
  data: OfferLetterData,
  ifNoneMatch: string | null
): boolean {
  if (!ifNoneMatch) return false;
  const cacheKey = pdfCache.generateKey(data);
  return pdfCache.validateETag(cacheKey, ifNoneMatch);
}

/**
 * Generate cache key for data
 */
export function getCacheKey(data: OfferLetterData): string {
  return pdfCache.generateKey(data);
}
