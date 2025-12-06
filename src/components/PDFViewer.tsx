"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import { OfferLetterDocument } from "./pdf";
import type { OfferLetterData } from "@/lib/types";
import { defaultOfferData } from "@/lib/types";
import { registerFonts } from "@/lib/fonts";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewerComponent = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <p>Loading PDF viewer...</p>
      </div>
    ),
  }
);

interface PDFViewerProps {
  data?: OfferLetterData;
}

export default function PDFViewer({ data = defaultOfferData }: PDFViewerProps) {
  const [isClient, setIsClient] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    registerFonts();
    setIsClient(true);
    setBaseUrl(window.location.origin);
  }, []);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<OfferLetterDocument data={data} baseUrl={baseUrl} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offer-Letter-${data.firstName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Offer Letter Preview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {data.firstName} - {data.title}
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Generating...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 p-4">
        <PDFViewerComponent
          style={{ width: "100%", height: "100%", border: "none" }}
          showToolbar={true}
        >
          <OfferLetterDocument data={data} baseUrl={baseUrl} />
        </PDFViewerComponent>
      </div>
    </div>
  );
}
