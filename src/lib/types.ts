export interface OfferLetterData {
  firstName: string;
  fullName: string;
  introParagraph: string;
  title: string;
  salary: string;
  shares: string;
  equityPercentage: string;
  startDate: string;
}

export const defaultOfferData: OfferLetterData = {
  firstName: "John",
  fullName: "John Smith",
  introParagraph: `We're thrilled to extend this offer to join Zingage as part of our founding team. This isn't just a job offer—it's an invitation to help shape the future of how essential work gets done.

You've already impressed us with your skills, your thinking, and your drive. Now we want to give you the context you need to make an informed decision about joining us.

In the pages that follow, you'll find everything from compensation details to our vision for the company. We've tried to be as transparent as possible because we believe the best partnerships start with clarity.

Take your time reviewing this offer. Ask questions. Challenge assumptions. The goal is for you to feel as excited about joining us as we are about having you.`,
  title: "Senior Software Engineer",
  salary: "$180,000",
  shares: "50,000",
  equityPercentage: "0.5%",
  startDate: "January 15, 2025",
};
