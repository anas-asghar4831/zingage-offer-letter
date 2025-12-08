import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OfferLetterDocument } from "@/components/pdf";
import { registerFontsServer } from "@/lib/fonts";
import { pdfCache } from "@/lib/pdf-cache";
import type { OfferLetterData } from "@/lib/types";
import type { OfferLetterInput } from "@/lib/input-schema";
import { transformInput, validateInput } from "@/lib/transform-input";

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
  // Parse request body
  let body: OfferLetterInput | OfferLetterInput[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Handle both single object and array input
  let input: OfferLetterInput;
  if (Array.isArray(body)) {
    // Array - get specific index or first item
    const indexParam = request.nextUrl.searchParams.get("index");
    const index = indexParam ? parseInt(indexParam, 10) : 0;

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Array is empty" },
        { status: 400 }
      );
    }

    if (index < 0 || index >= body.length) {
      return NextResponse.json(
        { error: `Index ${index} out of range. Array has ${body.length} items.` },
        { status: 400 }
      );
    }

    input = body[index];
  } else {
    // Single object - use directly
    input = body;
  }

  // Validate required fields
  const errors = validateInput(input);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 }
    );
  }

  // Transform input to PDF data format
  const data = transformInput(input);

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
      `PDF generated in ${duration}ms (${cached ? "CACHE HIT" : "CACHE MISS"}) for ${data.fullName}`
    );

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(buffer);

    // Sanitize filename
    const safeName = data.fullName.replace(/[^a-zA-Z0-9]/g, "-");

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Offer-Letter-${safeName}.pdf"`,
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
