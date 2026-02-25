import { convertPhoneFromInternational } from '@lib/common/phone-converters/phone-number-converters';

export function getInitialPhoneValue(
    existingValue: string | undefined,
    userPhone: string | undefined,
    useCustomPhoneFormat: boolean,
    locale: string
): string {
    const phoneValue = existingValue || userPhone || "";
    if (phoneValue === "") return "";
    if (!useCustomPhoneFormat) return phoneValue;
    return convertPhoneFromInternational(phoneValue, locale);
}

/**
 * Returns the initial phone value with an exception for custom format edge cases.
 * We can force it through `NEXT_PUBLIC_SIMULATE_INVALID_CAMS_PHONE`
 * for testing purposes
 *
 * @param {string | undefined} existingValue - Existing phone number.
 * @param {string | undefined} userPhone - alternate number fallback.
 * @param {boolean} useCustomPhoneFormat - try to apply custom formatting (US/CA)
 * @param {string} locale - selects the formatter
 * @returns {[string, boolean]} if we wanted to use custom format, but it failed
 * validation, we have to just pass it through
 * for more details, see https://dexcom-it.atlassian.net/browse/POLMDA-186
 */
export function getInitialPhoneValueWithException(
    existingValue: string | undefined,
    userPhone: string | undefined,
    useCustomPhoneFormat: boolean,
    locale: string
): [string, boolean] {
    if (process.env.NEXT_PUBLIC_SIMULATE_INVALID_CAMS_PHONE) {
        return [process.env.NEXT_PUBLIC_SIMULATE_INVALID_CAMS_PHONE, true]
    };
    const rawPhoneValue = existingValue || userPhone || "";
    const transformedPhoneValue = getInitialPhoneValue(existingValue, userPhone, useCustomPhoneFormat, locale);
    const exception = useCustomPhoneFormat && (!transformedPhoneValue?.length && !!rawPhoneValue?.length);
    return [
        exception ? rawPhoneValue : transformedPhoneValue,
        exception
    ]
}
