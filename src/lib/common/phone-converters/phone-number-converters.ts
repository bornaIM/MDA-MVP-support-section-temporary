import { phoneNorthAmericaToInternational } from './north-america-to-international';
import { phoneInternationalToNorthAmerica } from '@lib/common/phone-converters/international-to-north-america';

const PHONE_CONVERTER_FROM_INTERNATIONAL_MAP: Record<
    string,
    (phone: string) => string
> = {
    'en-US': phoneInternationalToNorthAmerica,
    'es-US': phoneInternationalToNorthAmerica,
    'en-CA': phoneInternationalToNorthAmerica,
    'fr-CA': phoneInternationalToNorthAmerica,
} as const;

const PHONE_CONVERTER_TO_INTERNATIONAL_MAP: Record<
    string,
    (phone: string) => string
> = {
    'en-US': phoneNorthAmericaToInternational,
    'es-US': phoneNorthAmericaToInternational,
    'en-CA': phoneNorthAmericaToInternational,
    'fr-CA': phoneNorthAmericaToInternational,
} as const;

export function convertPhoneFromInternational(
    phone: string,
    locale: string
): string {
    const converter = PHONE_CONVERTER_FROM_INTERNATIONAL_MAP[locale];
    if (converter) {
        return converter(phone);
    }
    return phone;
}

export function convertPhoneToInternational(
    phone: string,
    locale: string
): string {
    const converter = PHONE_CONVERTER_TO_INTERNATIONAL_MAP[locale];
    if (converter) {
        return converter(phone);
    }
    return phone;
}
