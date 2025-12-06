import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OfferLetterDocument } from "@/components/pdf";
import { defaultOfferData } from "@/lib/types";
import { registerFonts } from "@/lib/fonts";
import type { OfferLetterData } from "@/lib/types";

// Register fonts on server startup
registerFonts();

// Helper function to create PDF document element
function createPdfDocument(data: OfferLetterData, baseUrl: string) {
  return <OfferLetterDocument data={data} baseUrl={baseUrl} />;
}

export async function POST(request: NextRequest) {
  // Parse request body first (can throw)
  let body: Partial<OfferLetterData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const data: OfferLetterData = {
    ...defaultOfferData,
    ...body,
  };

  // Construct baseUrl from request headers
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Create document outside try/catch
  const document = createPdfDocument(data, baseUrl);

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(document);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }

  // Convert Buffer to Uint8Array for NextResponse
  const uint8Array = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Offer-Letter-${data.firstName}.pdf"`,
    },
  });
}

export async function GET(request: NextRequest) {
  const data = defaultOfferData;

  // Construct baseUrl from request headers
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Create document outside try/catch
  const document = createPdfDocument(data, baseUrl);

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(document);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }

  // Convert Buffer to Uint8Array for NextResponse
  const uint8Array = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Offer-Letter-${data.firstName}.pdf"`,
    },
  });
}
