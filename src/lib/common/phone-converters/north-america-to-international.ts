import { isUSPhone } from "./phone-validators";

/**
 * Converts a North American phone number in the format (123) 123-1232 to its international format (+11231231232).
 *
 * @param {string} input - The North American phone number to be converted. The expected format is (123) 123-1232.
 * @return {string} The phone number in international format (+1 followed by the digits). Returns an empty string if the input is invalid or an error occurs.
 */
export function phoneNorthAmericaToInternational(input: string): string {
    // Validate input format
    if (!isUSPhone(input)) {
        console.error(
            `Invalid phone number format: "${input}". Expected format: (123) 123-1232`
        );
        return '';
    }

    try {
        // Extract only the digits from the input
        const digitsOnly = input.replace(/\D/g, '');

        // Return in +1########## format (prepend country code 1)
        return `+1${digitsOnly}`;
    } catch (error) {
        console.error(`Error processing phone number: ${error}`);
        return '';
    }
}
