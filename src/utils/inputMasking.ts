/**
 * Utility functions for input formatting & phone masking
 */

/**
 * Formats a phone or warranty search input string.
 * If user starts typing numeric digits (mobile number), it auto-masks to:
 * - 9823680863 -> "9823-680-863" or pure 10 digits
 * If user starts typing "WRN" or letters, allows official warranty code formatting.
 */
export const formatWarrantyInput = (value: string): string => {
  const trimmed = value.trim();

  // If starts with 'w' or 'W', format as warranty code (e.g., WRN-2026-0001)
  if (/^[a-zA-Z]/i.test(value)) {
    return value.toUpperCase().slice(0, 20);
  }

  // If numeric (mobile number), remove any non-digit characters and limit to 10 digits
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return digits;
};

/**
 * Format 10-digit mobile number with standard Nepal readability dashes (e.g. 9823-680-863 or 982-368-0863)
 */
export const maskMobileDisplay = (digits: string): string => {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length <= 4) return clean;
  if (clean.length <= 7) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 10)}`;
};
