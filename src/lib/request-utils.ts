import { NextRequest, NextResponse } from "next/server";

/**
 * Extract base URL from Next.js request headers
 */
export function getBaseUrl(request: NextRequest): string {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}

/**
 * Create a 304 Not Modified response with cache headers
 */
export function createNotModifiedResponse(etag: string): NextResponse {
  return new NextResponse(null, {
    status: 304,
    headers: {
      ETag: etag,
      "Cache-Control": "private, max-age=3600, must-revalidate",
    },
  });
}

/**
 * Create a PDF response with proper headers
 */
export function createPDFResponse(
  buffer: Buffer,
  options: {
    filename: string;
    etag: string;
    cached: boolean;
    duration: number;
    inline?: boolean;
  }
): NextResponse {
  const { filename, etag, cached, duration, inline = false } = options;
  const uint8Array = new Uint8Array(buffer);
  const disposition = inline ? "inline" : "attachment";

  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      ETag: etag,
      "Cache-Control": "private, max-age=3600, must-revalidate",
      "X-Cache": cached ? "HIT" : "MISS",
      "X-Generation-Time": `${duration}ms`,
    },
  });
}

/**
 * Sanitize a string for use in filenames
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "-");
}
