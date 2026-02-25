import { isInternationalPhone } from './phone-validators';

/**
 * Converts an international phone number in the format "+<digits>" to a North American (NA) phone number format.
 * The conversion removes the country code and formats the remaining phone number based on the number of available digits.
 *
 * @param {string} input - The international phone number in the format "+<digits>".
 *                         It should begin with a "+" sign followed by digits.
 * @return {string} The formatted North American phone number. Returns an empty string for invalid formats
 *                  or if the provided number does not have enough digits to format meaningfully.
 */
export function phoneInternationalToNorthAmerica(input: string): string {
    // Validate input format
    if (!isInternationalPhone(input)) {
        console.error(
            `Invalid international phone number format: "${input}". Expected format: +followed by digits`
        );
        return '';
    }

    try {
        // Extract digits after the + sign
        const digits = input.slice(1); // Remove the + sign

        // Remove the first digit (country code)
        if (digits.length < 1) {
            console.error(`Invalid phone number: no digits after country code`);
            return '';
        }

        const phoneDigits = digits.slice(1); // Remove country code

        // Take only the first 10 digits for formatting
        const digitsToFormat = phoneDigits.slice(0, 10);

        // Format based on available digits
        if (digitsToFormat.length >= 10) {
            // Full format: (xxx) xxx-xxxx
            return `(${digitsToFormat.slice(0, 3)}) ${digitsToFormat.slice(
                3,
                6
            )}-${digitsToFormat.slice(6, 10)}`;
        } else if (digitsToFormat.length >= 6) {
            // Partial format: (xxx) xxx-
            return `(${digitsToFormat.slice(0, 3)}) ${digitsToFormat.slice(3)}`;
        } else if (digitsToFormat.length >= 3) {
            // Partial format: (xxx)
            return `(${digitsToFormat})`;
        } else {
            // Not enough digits for any meaningful format
            return digitsToFormat;
        }
    } catch (error) {
        console.error(`Error processing international phone number: ${error}`);
        return '';
    }
}
