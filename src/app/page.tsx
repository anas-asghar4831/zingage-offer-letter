"use client";

import dynamic from "next/dynamic";

// Dynamically import LandingPage to avoid SSR issues with react-pdf
const LandingPage = dynamic(() => import("@/components/LandingPage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FCFBE9] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B02] mx-auto mb-4"></div>
        <p className="text-[#2D6D4F]/70">Loading application...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <LandingPage />;
}
