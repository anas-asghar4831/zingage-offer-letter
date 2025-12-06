import Link from "next/link";
import ZingageLogo from "@/components/ZingageLogo";
import OfferFormClient from "@/components/OfferFormClient";

// This is a Server Component - no "use client" directive
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFBE9]">
      {/* Header - Server rendered */}
      <header className="sticky top-0 z-50 bg-[#FCFBE9]/95 backdrop-blur-sm border-b border-[#D6D4B6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3">
              <ZingageLogo className="h-8 sm:h-10 w-auto text-[#FF6B02]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Server rendered layout with client form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
        <div className="max-w-2xl mx-auto">
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold mb-6 text-[#2D6D4F] text-center">Offer Letter Generator</h1>
          {/* Form Card - Server rendered container, client form inside */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#D6D4B6] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#D6D4B6]">
              <div className="w-10 h-10 rounded-full bg-[#FF6B02]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FF6B02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2D6D4F]">Candidate Details</h2>
                <p className="text-sm text-[#2D6D4F]/60">Enter the offer letter information</p>
              </div>
            </div>

            {/* Client Component - Only the interactive form */}
            <OfferFormClient />
          </div>
        </div>
      </main>

      {/* Footer - Server rendered */}
      <footer className="border-t border-[#D6D4B6] mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ZingageLogo className="h-6 w-auto text-[#2D6D4F]" />
              <span className="text-sm text-[#2D6D4F]/60">Offer Letter Generator</span>
            </div>
            <p className="text-sm text-[#2D6D4F]/60">
              Building the future of essential work
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
