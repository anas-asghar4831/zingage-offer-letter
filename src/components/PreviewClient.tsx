"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { OfferLetterData } from "@/lib/types";

// Custom hook for hydration-safe localStorage access
function useOfferData() {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return localStorage.getItem("offerLetterData");
  }, []);

  const getServerSnapshot = useCallback(() => {
    return null;
  }, []);

  const storedData = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return storedData ? (() => {
    try {
      return JSON.parse(storedData) as OfferLetterData;
    } catch {
      return null;
    }
  })() : null;
}

// Hook to track hydration state using useSyncExternalStore
function useHydrated() {
  const subscribe = useCallback(() => {
    // No-op: hydration state doesn't change after mount
    return () => {};
  }, []);

  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function PreviewHeaderActions() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const offerData = useOfferData();
  const isHydrated = useHydrated();

  // Redirect if no data after hydration
  useEffect(() => {
    if (isHydrated && !offerData) {
      router.push("/");
    }
  }, [isHydrated, offerData, router]);

  const handleDownload = async () => {
    if (!offerData) return;

    setIsDownloading(true);
    try {
      // Use server-side generation for download
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Offer-Letter-${offerData.firstName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackToForm = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={handleBackToForm}
        className="px-3 sm:px-4 py-2 text-sm font-medium text-[#2D6D4F] hover:text-[#FF6B02] transition-colors cursor-pointer"
      >
        Edit Form
      </button>
      <button
        onClick={handleDownload}
        disabled={isDownloading || !isHydrated || !offerData}
        className="px-4 sm:px-6 py-2 rounded-lg bg-[#FF6B02] hover:bg-[#e55f00] disabled:bg-[#D6D4B6] disabled:cursor-not-allowed text-white font-medium text-sm flex items-center gap-2 cursor-pointer"
      >
        {isDownloading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span className="hidden sm:inline">Downloading...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </>
        )}
      </button>
    </div>
  );
}

export function PreviewInfo() {
  const offerData = useOfferData();
  const isHydrated = useHydrated();

  // Show consistent "Loading..." on both server and initial client render
  if (!isHydrated) {
    return (
      <p className="text-sm text-[#2D6D4F]/60 mt-1">Loading...</p>
    );
  }

  if (!offerData) {
    return (
      <p className="text-sm text-[#2D6D4F]/60 mt-1">No data found</p>
    );
  }

  return (
    <p className="text-sm text-[#2D6D4F]/60 mt-1">
      {offerData.fullName || offerData.firstName} - {offerData.title}
    </p>
  );
}

export default function PreviewClient() {
  const router = useRouter();
  const offerData = useOfferData();
  const isHydrated = useHydrated();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const etagRef = useRef<string | null>(null);

  // Redirect if no data after hydration
  useEffect(() => {
    if (isHydrated && !offerData) {
      router.push("/");
    }
  }, [isHydrated, offerData, router]);

  // Generate PDF via server API
  const loadPdfPreview = useCallback(async () => {
    if (!offerData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(etagRef.current && { "If-None-Match": etagRef.current }),
        },
        body: JSON.stringify(offerData),
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
  }, [offerData, pdfUrl]);

  // Load PDF when data is available
  useEffect(() => {
    if (offerData && isHydrated) {
      loadPdfPreview();
    }

    // Cleanup URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerData, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B02] mx-auto mb-3"></div>
          <p className="text-[#2D6D4F]/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!offerData) {
    return (
      <div className="flex items-center justify-center h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        <div className="text-center">
          <p className="text-[#2D6D4F]/70">No offer data found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh]">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B02] mx-auto mb-3"></div>
            <p className="text-[#2D6D4F]/70">Generating PDF preview...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadPdfPreview}
              className="px-4 py-2 bg-[#FF6B02] hover:bg-[#e55f00] text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      ) : pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title="PDF Preview"
          style={{
            backgroundColor: "#f5f5f5",
          }}
        />
      ) : null}
    </div>
  );
}
