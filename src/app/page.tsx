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
            <span className="text-lg sm:text-xl font-semibold text-[#2D6D4F] self-center">Offer Letter Generator</span>
          </div>
        </div>
      </header>

      {/* Main Content - Server rendered layout with client form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">

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

          {/* Features - Server rendered */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF6B02]/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#FF6B02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#2D6D4F] mb-1">Instant Generation</h3>
              <p className="text-sm text-[#2D6D4F]/60">Generate beautiful PDFs in seconds</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF6B02]/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#FF6B02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#2D6D4F] mb-1">7 Page Design</h3>
              <p className="text-sm text-[#2D6D4F]/60">Professional multi-page layout</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF6B02]/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#FF6B02]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#2D6D4F] mb-1">Customizable</h3>
              <p className="text-sm text-[#2D6D4F]/60">Add multiple intro paragraphs</p>
            </div>
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
