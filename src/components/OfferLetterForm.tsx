
import { useState } from "react";
import type { OfferLetterData } from "@/lib/types";

// Form data interface for raw form values
export interface FormData {
  firstName: string;
  lastName: string;
  fullName: string;
  introParagraphs: string[];
  title: string;
  salary: string;
  shares: string;
  equityPercentage: string;
  startDate: string;
}

interface OfferLetterFormProps {
  onSubmit: (data: OfferLetterData, formData: FormData) => void;
  isGenerating: boolean;
  initialData?: FormData | null;
}

// Helper to get initial state values
function getInitialValues(initialData?: FormData | null) {
  const defaultParagraph = "We're thrilled to extend this offer to join Zingage as part of our founding team. This isn't just a job offer—it's an invitation to help shape the future of how essential work gets done.";

  if (!initialData) {
    return {
      firstName: "",
      lastName: "",
      fullNameOverride: null as string | null,
      introParagraphs: [defaultParagraph],
      title: "",
      salary: "",
      shares: "",
      equityPercentage: "",
      startDate: "",
    };
  }

  const combinedName = `${initialData.firstName || ""} ${initialData.lastName || ""}`.trim();
  const hasFullNameOverride = initialData.fullName && initialData.fullName !== combinedName;

  return {
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    fullNameOverride: hasFullNameOverride ? initialData.fullName : null,
    introParagraphs: initialData.introParagraphs?.length > 0 ? initialData.introParagraphs : [defaultParagraph],
    title: initialData.title || "",
    salary: initialData.salary || "",
    shares: initialData.shares || "",
    equityPercentage: initialData.equityPercentage || "",
    startDate: initialData.startDate || "",
  };
}

export default function OfferLetterForm({ onSubmit, isGenerating, initialData }: OfferLetterFormProps) {
  // Initialize all state from props using a helper function
  const initial = getInitialValues(initialData);

  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [fullNameOverride, setFullNameOverride] = useState<string | null>(initial.fullNameOverride);
  const [introParagraphs, setIntroParagraphs] = useState<string[]>(initial.introParagraphs);
  const [title, setTitle] = useState(initial.title);
  const [salary, setSalary] = useState(initial.salary);
  const [shares, setShares] = useState(initial.shares);
  const [equityPercentage, setEquityPercentage] = useState(initial.equityPercentage);
  const [startDate, setStartDate] = useState(initial.startDate);

  // Compute fullName: use override if set, otherwise combine first + last
  const fullName = fullNameOverride !== null
    ? fullNameOverride
    : `${firstName} ${lastName}`.trim();

  const handleFullNameChange = (value: string) => {
    setFullNameOverride(value);
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
  };

  const addParagraph = () => {
    if (introParagraphs.length < 5) {
      setIntroParagraphs([...introParagraphs, ""]);
    }
  };

  const removeParagraph = (index: number) => {
    if (introParagraphs.length > 1) {
      setIntroParagraphs(introParagraphs.filter((_, i) => i !== index));
    }
  };

  const updateParagraph = (index: number, value: string) => {
    const updated = [...introParagraphs];
    updated[index] = value;
    setIntroParagraphs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine paragraphs with double line breaks
    const combinedParagraphs = introParagraphs
      .filter((p) => p.trim() !== "")
      .join("\n\n");

    const formData: OfferLetterData = {
      firstName: firstName || "John",
      fullName: fullName || firstName || "John Smith",
      introParagraph: combinedParagraphs || "Intro Paragraph",
      title: title || "Software Engineer",
      salary: salary ? `$${salary.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "$150,000",
      shares: shares || "50,000",
      equityPercentage: equityPercentage ? `${equityPercentage.replace("%", "")}%` : "0.5%",
      startDate: startDate ? formatDate(startDate) : "January 15, 2025",
      vestingSchedule: "4 Years equal distribution, 1-Year Cliff",
    };

    // Raw form data for editing
    const rawFormData: FormData = {
      firstName,
      lastName,
      fullName,
      introParagraphs,
      title,
      salary,
      shares,
      equityPercentage,
      startDate,
    };

    onSubmit(formData, rawFormData);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            First Name <span className="text-[#FF6B02]">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            placeholder="John"
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            Last Name <span className="text-[#FF6B02]">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            placeholder="Smith"
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
          />
        </div>
      </div>

      {/* Full Name (Auto-filled but editable) */}
      <div>
        <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
          Full Name{" "}
          <span className="text-xs font-normal text-[#2D6D4F]/60">
            (auto-filled, but editable)
          </span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => handleFullNameChange(e.target.value)}
          placeholder="John Smith"
          className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
        />
      </div>

      {/* Role/Title */}
      <div>
        <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
          Role / Title <span className="text-[#FF6B02]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Senior Software Engineer"
          required
          className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
        />
      </div>

      {/* Salary and Stock Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            Base Salary <span className="text-[#FF6B02]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6D4F] font-medium">
              $
            </span>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value.replace(/[^0-9,]/g, ""))}
              placeholder="180,000"
              required
              className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            Total Stock Options <span className="text-[#FF6B02]">*</span>
          </label>
          <input
            type="text"
            value={shares}
            onChange={(e) => setShares(e.target.value.replace(/[^0-9,]/g, ""))}
            placeholder="50,000"
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
          />
        </div>
      </div>

      {/* Equity Percentage and Start Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            Equity Percentage <span className="text-[#FF6B02]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={equityPercentage}
              onChange={(e) => setEquityPercentage(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.5"
              required
              className="w-full px-4 pr-8 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D6D4F] font-medium">
              %
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2D6D4F] mb-2">
            Start Date <span className="text-[#FF6B02]">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] transition-colors"
          />
        </div>
      </div>

      {/* Intro Paragraphs - Dynamic */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-[#2D6D4F]">
            Introduction Paragraphs{" "}
            <span className="text-xs font-normal text-[#2D6D4F]/60">
              (appears on Page 2)
            </span>
          </label>
          {introParagraphs.length < 5 && (
            <button
              type="button"
              onClick={addParagraph}
              className="flex items-center gap-1 text-sm font-medium text-[#FF6B02] hover:text-[#FF974D] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Paragraph
            </button>
          )}
        </div>

        <div className="space-y-3">
          {introParagraphs.map((paragraph, index) => (
            <div key={index} className="paragraph-item relative">
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#FF6B02] text-white text-xs flex items-center justify-center mt-3">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                    placeholder={`Enter paragraph ${index + 1}...`}
                    rows={4}
                    className="paragraph-input w-full px-4 py-3 rounded-lg border-2 border-[#D6D4B6] bg-white text-[#2D6D4F] placeholder-[#2D6D4F]/40 transition-colors"
                  />
                </div>
                {introParagraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center mt-3 transition-colors cursor-pointer"
                    title="Remove paragraph"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {introParagraphs.length >= 5 && (
          <p className="text-xs text-[#2D6D4F]/60 mt-2">
            Maximum 5 paragraphs allowed
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="btn-primary w-full py-4 px-6 rounded-lg bg-[#FF6B02] hover:bg-[#e55f00] disabled:bg-[#D6D4B6] disabled:cursor-not-allowed text-white font-semibold text-lg flex items-center justify-center gap-3 cursor-pointer"
      >
        {isGenerating ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Offer Letter PDF
          </>
        )}
      </button>
    </form>
  );
}
