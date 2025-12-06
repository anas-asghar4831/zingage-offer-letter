"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import { OfferLetterDocument } from "./pdf";
import type { OfferLetterData } from "@/lib/types";
import { registerFonts } from "@/lib/fonts";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewerComponent = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B02] mx-auto mb-3"></div>
          <p className="text-[#2D6D4F]/70">Loading preview...</p>
        </div>
      </div>
    ),
  }
);

// Read offer data from localStorage (runs only on client)
function getStoredOfferData(): OfferLetterData | null {
  if (typeof window === "undefined") return null;
  const storedData = localStorage.getItem("offerLetterData");
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch {
      return null;
    }
  }
  return null;
}

// Get base URL (runs only on client)
function getBaseUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

interface PreviewClientProps {
  baseUrl: string;
}

export function PreviewHeaderActions() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  // Use lazy initializers to read values during initial render
  const [offerData] = useState<OfferLetterData | null>(getStoredOfferData);
  const [baseUrl] = useState<string>(getBaseUrl);
  const [isHydrated, setIsHydrated] = useState(false);

  // Register fonts and check for data
  useEffect(() => {
    registerFonts();
    // Redirect if no data
    if (!localStorage.getItem("offerLetterData")) {
      router.push("/");
    }
    // Hydration flag - intentional setState on mount for client-side detection
     
    setIsHydrated(true);
  }, [router]);

  const handleDownload = async () => {
    if (!offerData) return;

    setIsDownloading(true);
    try {
      const blob = await pdf(<OfferLetterDocument data={offerData} baseUrl={baseUrl} />).toBlob();
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
  // Use lazy initializer to read localStorage during initial render
  const [offerData] = useState<OfferLetterData | null>(getStoredOfferData);

  if (!offerData) {
    return (
      <p className="text-sm text-[#2D6D4F]/60 mt-1">Loading...</p>
    );
  }

  return (
    <p className="text-sm text-[#2D6D4F]/60 mt-1">
      {offerData.fullName || offerData.firstName} - {offerData.title}
    </p>
  );
}

export default function PreviewClient({ baseUrl }: PreviewClientProps) {
  const router = useRouter();
  // Use lazy initializer to read localStorage during initial render
  const [offerData] = useState<OfferLetterData | null>(getStoredOfferData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Register fonts and check for data
  useEffect(() => {
    registerFonts();
    // Redirect if no data
    if (!localStorage.getItem("offerLetterData")) {
      router.push("/");
    }
    // Hydration flag - intentional setState on mount for client-side detection
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, [router]);

  if (!isHydrated || !offerData) {
    return (
      <div className="flex items-center justify-center h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6B02] mx-auto mb-3"></div>
          <p className="text-[#2D6D4F]/70">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh]">
      <PDFViewerComponent
        style={{ width: "100%", height: "100%", border: "none" }}
        showToolbar={true}
      >
        <OfferLetterDocument data={offerData} baseUrl={baseUrl} />
      </PDFViewerComponent>
    </div>
  );
}
