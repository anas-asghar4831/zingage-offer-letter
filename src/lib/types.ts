export interface OfferLetterData {
  firstName: string;
  fullName: string;
  introParagraph: string;
  title: string;
  salary: string;
  shares: string;
  equityPercentage: string;
  startDate: string;
  vestingSchedule: string;
}

export const defaultOfferData: OfferLetterData = {
  firstName: "John",
  fullName: "John Smith",
  introParagraph: "Intro Paragraph",
  title: "Senior Software Engineer",
  salary: "$180,000",
  shares: "50,000",
  equityPercentage: "0.5%",
  startDate: "January 15, 2025",
  vestingSchedule: "4 Years equal distribution, 1-Year Cliff",
};
