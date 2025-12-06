import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OfferLetterDocument } from "@/components/pdf";
import { defaultOfferData } from "@/lib/types";
import { registerFontsServer } from "@/lib/fonts";
import { pdfCache } from "@/lib/pdf-cache";
import type { OfferLetterData } from "@/lib/types";

// Helper function to create PDF document element
function createPdfDocument(data: OfferLetterData, baseUrl: string) {
  return <OfferLetterDocument data={data} baseUrl={baseUrl} />;
}

// Helper to generate PDF with caching
async function generatePDFWithCache(
  data: OfferLetterData,
  baseUrl: string
): Promise<{ buffer: Buffer; etag: string; cached: boolean }> {
  const cacheKey = pdfCache.generateKey(data);

  // Check cache first
  const cached = pdfCache.get(cacheKey);
  if (cached) {
    return {
      buffer: cached.buffer,
      etag: cached.etag,
      cached: true,
    };
  }

  // Register fonts with absolute URLs for server-side
  registerFontsServer(baseUrl);

  // Generate new PDF
  const document = createPdfDocument(data, baseUrl);
  const pdfBuffer = await renderToBuffer(document);

  // Cache it
  const entry = pdfCache.set(cacheKey, pdfBuffer);

  return {
    buffer: pdfBuffer,
    etag: entry.etag,
    cached: false,
  };
}

export async function POST(request: NextRequest) {
  // Parse request body first (can throw)
  let body: Partial<OfferLetterData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: OfferLetterData = {
    ...defaultOfferData,
    ...body,
  };

  // Construct baseUrl from request headers
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Check If-None-Match header for conditional request
  const ifNoneMatch = request.headers.get("if-none-match");
  const cacheKey = pdfCache.generateKey(data);

  // Return 304 if client has current version
  if (ifNoneMatch && pdfCache.validateETag(cacheKey, ifNoneMatch)) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: ifNoneMatch,
        "Cache-Control": "private, max-age=3600, must-revalidate",
      },
    });
  }

  try {
    const startTime = Date.now();
    const { buffer, etag, cached } = await generatePDFWithCache(data, baseUrl);
    const duration = Date.now() - startTime;

    console.log(
      `PDF generated in ${duration}ms (${cached ? "CACHE HIT" : "CACHE MISS"})`
    );

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Offer-Letter-${data.firstName}.pdf"`,
        ETag: etag,
        "Cache-Control": "private, max-age=3600, must-revalidate",
        "X-Cache": cached ? "HIT" : "MISS",
        "X-Generation-Time": `${duration}ms`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const data = defaultOfferData;

  // Construct baseUrl from request headers
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Check If-None-Match header for conditional request
  const ifNoneMatch = request.headers.get("if-none-match");
  const cacheKey = pdfCache.generateKey(data);

  // Return 304 if client has current version
  if (ifNoneMatch && pdfCache.validateETag(cacheKey, ifNoneMatch)) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: ifNoneMatch,
        "Cache-Control": "private, max-age=3600, must-revalidate",
      },
    });
  }

  try {
    const startTime = Date.now();
    const { buffer, etag, cached } = await generatePDFWithCache(data, baseUrl);
    const duration = Date.now() - startTime;

    console.log(
      `PDF generated in ${duration}ms (${cached ? "CACHE HIT" : "CACHE MISS"})`
    );

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Offer-Letter-${data.firstName}.pdf"`,
        ETag: etag,
        "Cache-Control": "private, max-age=3600, must-revalidate",
        "X-Cache": cached ? "HIT" : "MISS",
        "X-Generation-Time": `${duration}ms`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
