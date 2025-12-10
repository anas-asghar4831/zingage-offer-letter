/**
 * Input schema for offer letter data from spreadsheet/form
 */

export interface OfferLetterInput {
  "Timestamp": number;
  "What is the candidate's full name?": string;
  "What is the candidate's personal email?": string;
  "Remote or in-person?": string;
  "State they are located in": string;
  "Who is their manager?": string;
  "What is their title?": string;
  "What is their start date?": number; // Excel serial date
  "What is their start date? If we aren't sure, put your best guess / desired start date.": number; // Alternate field name
  "Do they have any direct reports? If so, who?": string;
  "Does this role require travel?": string;
  "Base compensation amount (write your answer as: $xxx, xxx, e.g., $120,000)": number | string;
  "Offer letter share count - number of equity shares for the role. Simply write {number} Shares. E.g., 100000": number;
  "Is there a signing bonus? If so, how much?": string;
  "Are there any other costs / bonuses to be aware of?": string;
  "A description of the employee's duties, as provided by the hiring manager, e.g. \"working with potential customers to help them sign up for our service.\"": string;
  "Agreement expiration date": string;
  "Cliff Months": number | string;
  "Number of months of monthly installments period": number | string;
  "Percentage of vested options / shares in the first installment": number | string;
  "Total Vesting Years": number | string;
  "What unique perspective or experience do they bring? (Note: this is for the first page of the Offer Letter PDF)": string;
  "Implies what percentage stake?  Simply write {percentage} E.g., 0.2% or 1.0% -- this will show up exactly as written on the OL": number | string;
}

// Short field name aliases for easier access
export type OfferInput = OfferLetterInput;
