/**
 * Regex to validate format: + followed by any number of digits.
 * @param phone Phone number to validate.
 * @returns Boolean if the phone is in international format or not.
 */
export const isInternationalPhone = (phone: string) => /^\+\d+$/.test(phone);

/**
 * Regex to validate the exact format: (123) 123-1232.
 * @param phone Phone numer to validate.
 * @returns Boolean if the phone is in US format or not.
 */
export const isUSPhone = (phone: string) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
