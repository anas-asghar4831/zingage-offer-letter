import { NextRequest, NextResponse } from "next/server";
import { defaultOfferData } from "@/lib/types";
import { generatePDF, checkETagMatch } from "@/lib/pdf-generator";
import {
  getBaseUrl,
  createNotModifiedResponse,
  createPDFResponse,
} from "@/lib/request-utils";
import type { OfferLetterData } from "@/lib/types";

export async function POST(request: NextRequest) {
  // Parse request body
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

  const baseUrl = getBaseUrl(request);
  const ifNoneMatch = request.headers.get("if-none-match");

  // Return 304 if client has current version
  if (checkETagMatch(data, ifNoneMatch)) {
    return createNotModifiedResponse(ifNoneMatch!);
  }

  try {
    const result = await generatePDF(data, baseUrl);

    console.log(
      `PDF generated in ${result.duration}ms (${result.cached ? "CACHE HIT" : "CACHE MISS"})`
    );

    return createPDFResponse(result.buffer, {
      filename: `Offer-Letter-${data.firstName}.pdf`,
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

export async function GET(request: NextRequest) {
  const data = defaultOfferData;
  const baseUrl = getBaseUrl(request);
  const ifNoneMatch = request.headers.get("if-none-match");

  // Return 304 if client has current version
  if (checkETagMatch(data, ifNoneMatch)) {
    return createNotModifiedResponse(ifNoneMatch!);
  }

  try {
    const result = await generatePDF(data, baseUrl);

    console.log(
      `PDF generated in ${result.duration}ms (${result.cached ? "CACHE HIT" : "CACHE MISS"})`
    );

    return createPDFResponse(result.buffer, {
      filename: `Offer-Letter-${data.firstName}.pdf`,
      etag: result.etag,
      cached: result.cached,
      duration: result.duration,
      inline: true,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
