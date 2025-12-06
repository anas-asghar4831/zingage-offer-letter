
import { useState, useEffect, useCallback, useRef } from "react";
import type { OfferLetterData } from "@/lib/types";
import { defaultOfferData } from "@/lib/types";

interface PDFViewerProps {
  data?: OfferLetterData;
}

export default function PDFViewer({ data = defaultOfferData }: PDFViewerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const etagRef = useRef<string | null>(null);

  // Generate PDF URL for preview via server
  const loadPreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(etagRef.current && { "If-None-Match": etagRef.current }),
        },
        body: JSON.stringify(data),
      });

      // 304 Not Modified - use cached version
      if (response.status === 304) {
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate PDF preview");
      }

      // Store ETag for future requests
      const etag = response.headers.get("ETag");
      if (etag) {
        etagRef.current = etag;
      }

      const blob = await response.blob();

      // Revoke old URL to prevent memory leaks
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Error loading preview:", err);
      setError("Failed to load PDF preview");
    } finally {
      setIsLoading(false);
    }
  }, [data, pdfUrl]);

  // Load preview on mount and when data changes
  useEffect(() => {
    loadPreview();

    // Cleanup URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Download PDF via server (no client-side generation)
  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offer-Letter-${data.firstName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download PDF");
    } finally {
      setIsGenerating(false);
    }
  };

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

      {/* PDF Viewer - Using iframe for server-generated PDF */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-white rounded-lg shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF preview...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full bg-white rounded-lg shadow">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadPreview}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded-lg shadow bg-white"
            title="PDF Preview"
          />
        ) : null}
      </div>
    </div>
  );
}
