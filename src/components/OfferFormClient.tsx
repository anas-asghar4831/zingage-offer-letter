"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import OfferLetterForm, { type FormData } from "./OfferLetterForm";
import type { OfferLetterData } from "@/lib/types";
import { registerFonts } from "@/lib/fonts";

// Subscribe function for useSyncExternalStore (no-op)
function subscribe() {
  return () => {};
}

// Get initial form data from localStorage
function getFormDataSnapshot(): FormData | null {
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

function getFormDataServerSnapshot(): FormData | null {
  return null;
}

export default function OfferFormClient() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  // Use useSyncExternalStore to get initial form data from localStorage
  const initialFormData = useSyncExternalStore(subscribe, getFormDataSnapshot, getFormDataServerSnapshot);

  // Register fonts on client side (doesn't set state, safe in useEffect)
  useEffect(() => {
    registerFonts();
  }, []);

  const handleFormSubmit = (data: OfferLetterData, formData: FormData) => {
    setIsGenerating(true);

    // Store both the processed data (for PDF) and raw form data (for editing)
    localStorage.setItem("offerLetterData", JSON.stringify(data));
    localStorage.setItem("offerLetterFormData", JSON.stringify(formData));

    // Navigate to preview page
    router.push("/preview");
  };

  return (
    <OfferLetterForm
      onSubmit={handleFormSubmit}
      isGenerating={isGenerating}
      initialData={initialFormData}
    />
  );
}
