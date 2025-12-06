"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OfferLetterForm, { type FormData } from "./OfferLetterForm";
import type { OfferLetterData } from "@/lib/types";
import { registerFonts } from "@/lib/fonts";

// Read form data from localStorage (runs only on client)
function getStoredFormData(): FormData | null {
  if (typeof window === "undefined") return null;
  const storedFormData = localStorage.getItem("offerLetterFormData");
  if (storedFormData) {
    try {
      return JSON.parse(storedFormData);
    } catch {
      return null;
    }
  }
  return null;
}

export default function OfferFormClient() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  // Use lazy initializer to read localStorage during initial render
  const [initialFormData] = useState<FormData | null>(getStoredFormData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Register fonts on mount
  useEffect(() => {
    registerFonts();
    // Hydration flag - intentional setState on mount for client-side detection
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const handleFormSubmit = (data: OfferLetterData, formData: FormData) => {
    setIsGenerating(true);

    // Store both the processed data (for PDF) and raw form data (for editing)
    localStorage.setItem("offerLetterData", JSON.stringify(data));
    localStorage.setItem("offerLetterFormData", JSON.stringify(formData));

    // Navigate to preview page
    router.push("/preview");
  };

  // Show loading during SSR/hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B02]"></div>
      </div>
    );
  }

  return (
    <OfferLetterForm
      onSubmit={handleFormSubmit}
      isGenerating={isGenerating}
      initialData={initialFormData}
    />
  );
}
