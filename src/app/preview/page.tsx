import Link from "next/link";
import ZingageLogo from "@/components/ZingageLogo";
import PreviewClient, { PreviewHeaderActions, PreviewInfo } from "@/components/PreviewClient";

// This is a Server Component - the layout is server-rendered
export default function Preview() {
  return (
    <div className="min-h-screen bg-[#FCFBE9]">
      {/* Header - Server rendered layout with client actions */}
      <header className="sticky top-0 z-50 bg-[#FCFBE9]/95 backdrop-blur-sm border-b border-[#D6D4B6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3">
              <ZingageLogo className="h-8 sm:h-10 w-auto text-[#FF6B02]" />
            </Link>
            {/* Client component for interactive buttons */}
            <PreviewHeaderActions />
          </div>
        </div>
      </header>

      {/* Main Content - Server rendered layout with client PDF viewer */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="space-y-4">
          {/* Preview Header - Server rendered with client info */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D6D4F]">
              Offer Letter Preview
            </h2>
            {/* Client component for dynamic info */}
            <PreviewInfo />
          </div>

          {/* PDF Viewer Container - Server rendered, client PDF inside */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#D6D4B6] overflow-hidden">
            <PreviewClient />
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
