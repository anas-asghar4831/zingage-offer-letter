/**
 * Transform utilities for converting spreadsheet input to PDF data format
 */

import type { OfferLetterInput } from "./input-schema";
import type { OfferLetterData } from "./types";
import { defaultOfferData } from "./types";

/**
 * Convert Excel serial date to readable date string
 * Excel serial date: days since December 30, 1899
 */
export function excelSerialToDate(serial: number): string {
  if (!serial || typeof serial !== "number") {
    return defaultOfferData.startDate;
  }

  // Excel's epoch is December 30, 1899
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);

  // Format as "Month Day, Year" (e.g., "January 15, 2026")
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Parse and format compensation amount
 * Handles: 160000, "160000", "170K", "$160,000"
 */
export function parseCompensation(value: number | string): string {
  if (!value) {
    return defaultOfferData.salary;
  }

  let amount: number;

  if (typeof value === "number") {
    amount = value;
  } else {
    // Remove $ and commas, handle "K" suffix
    const cleaned = value.replace(/[$,]/g, "").trim();

    if (cleaned.toUpperCase().endsWith("K")) {
      amount = parseFloat(cleaned.slice(0, -1)) * 1000;
    } else {
      amount = parseFloat(cleaned);
    }
  }

  if (isNaN(amount)) {
    return defaultOfferData.salary;
  }

  // Format as currency
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format share count with commas
 * 27985 -> "27,985 shares"
 */
export function formatShares(count: number): string {
  if (!count || typeof count !== "number") {
    return defaultOfferData.shares;
  }

  const formatted = new Intl.NumberFormat("en-US").format(count);
  return `${formatted} shares`;
}

/**
 * Parse and clean equity percentage string
 * Handles: 0.0025, "0.25%", "0.25%, $100K", "Implies 0.50% stake..."
 */
export function parseEquityPercentage(value: number | string): string {
  if (!value && value !== 0) {
    return "";
  }

  if (typeof value === "number") {
    // Convert decimal to percentage (0.0025 -> "0.25%")
    if (value < 1) {
      return `${(value * 100).toFixed(2)}%`;
    }
    // Already a percentage number (1 -> "1%")
    return `${value}%`;
  }

  // String - extract percentage
  const str = String(value).trim();

  // Try to find percentage pattern
  const percentMatch = str.match(/(\d+\.?\d*)%/);
  if (percentMatch) {
    return `${percentMatch[1]}%`;
  }

  // If it's just a decimal number as string
  const numMatch = str.match(/^(\d*\.?\d+)$/);
  if (numMatch) {
    const num = parseFloat(numMatch[1]);
    if (num < 1) {
      return `${(num * 100).toFixed(2)}%`;
    }
    return `${num}%`;
  }

  // Return empty if can't parse
  return "";
}

/**
 * Build vesting schedule string
 * Default: "4 Years equal distribution, 1-Year Cliff"
 */
export function buildVestingSchedule(
  years: number | string,
  cliffMonths: number | string
): string {
  const defaultVesting = "4 Years equal distribution, 1-Year Cliff";

  // Parse years
  let vestingYears = 4;
  if (years && typeof years === "number") {
    vestingYears = years;
  } else if (years && typeof years === "string" && !isNaN(parseFloat(years))) {
    vestingYears = parseFloat(years);
  }

  // Parse cliff months
  let cliff = 12;
  if (cliffMonths && typeof cliffMonths === "number") {
    cliff = cliffMonths;
  } else if (
    cliffMonths &&
    typeof cliffMonths === "string" &&
    !isNaN(parseFloat(cliffMonths))
  ) {
    cliff = parseFloat(cliffMonths);
  }

  // If both are default, return default string
  if (vestingYears === 4 && cliff === 12) {
    return defaultVesting;
  }

  // Build custom string
  const cliffYears = cliff / 12;
  const cliffStr =
    cliffYears === 1 ? "1-Year Cliff" : `${cliff}-Month Cliff`;

  return `${vestingYears} Years equal distribution, ${cliffStr}`;
}

/**
 * Main transform function - converts spreadsheet input to PDF data
 */
export function transformInput(input: OfferLetterInput): OfferLetterData {
  const fullName = input["What is the candidate's full name?"] || defaultOfferData.fullName;

  return {
    firstName: fullName.split(" ")[0] || defaultOfferData.firstName,
    fullName: fullName,
    introParagraph: defaultOfferData.introParagraph, // Always use default
    title: input["What is their title?"] || defaultOfferData.title,
    salary: parseCompensation(
      input["Base compensation amount (write your answer as: $xxx, xxx, e.g., $120,000)"]
    ),
    shares: formatShares(
      input["Offer letter share count - number of equity shares for the role. Simply write {number} Shares. E.g., 100,000 shares"]
    ),
    equityPercentage: parseEquityPercentage(
      input["Implies what percentage stake? Simply write the %:\n.03%\n.01%"]
    ),
    startDate: excelSerialToDate(input["What is their start date?"]),
    vestingSchedule: buildVestingSchedule(
      input["Total Vesting Years"],
      input["Cliff Months"]
    ),
  };
}

/**
 * Validate that required fields are present
 */
export function validateInput(input: Partial<OfferLetterInput>): string[] {
  const errors: string[] = [];

  if (!input["What is the candidate's full name?"]) {
    errors.push("Candidate full name is required");
  }

  if (!input["What is their title?"]) {
    errors.push("Job title is required");
  }

  if (!input["Base compensation amount (write your answer as: $xxx, xxx, e.g., $120,000)"]) {
    errors.push("Base compensation is required");
  }

  if (!input["Offer letter share count - number of equity shares for the role. Simply write {number} Shares. E.g., 100,000 shares"]) {
    errors.push("Share count is required");
  }

  if (!input["What is their start date?"]) {
    errors.push("Start date is required");
  }

  return errors;
}
