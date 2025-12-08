import { NextRequest, NextResponse } from "next/server";
import type { OfferLetterInput } from "@/lib/input-schema";
import { transformInput, validateInput } from "@/lib/transform-input";
import { generatePDF, checkETagMatch } from "@/lib/pdf-generator";
import {
  getBaseUrl,
  createNotModifiedResponse,
  createPDFResponse,
  sanitizeFilename,
} from "@/lib/request-utils";

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
      return NextResponse.json({ error: "Array is empty" }, { status: 400 });
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
  const baseUrl = getBaseUrl(request);
  const ifNoneMatch = request.headers.get("if-none-match");

  // Return 304 if client has current version
  if (checkETagMatch(data, ifNoneMatch)) {
    return createNotModifiedResponse(ifNoneMatch!);
  }

  try {
    const result = await generatePDF(data, baseUrl);
    const safeName = sanitizeFilename(data.fullName);

    console.log(
      `PDF generated in ${result.duration}ms (${result.cached ? "CACHE HIT" : "CACHE MISS"}) for ${data.fullName}`
    );

    return createPDFResponse(result.buffer, {
      filename: `Offer-Letter-${safeName}.pdf`,
      etag: result.etag,
      cached: result.cached,
      duration: result.duration,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
