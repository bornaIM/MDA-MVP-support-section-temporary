import { PURCHASEABLE_PRODUCT_SENSORS_FOR_COUNTRY } from '@lib/forms/support-form/support-form-dictionaries';

interface SentinelCommunicationPreference {
    accepted: boolean;
    channel: string;
    name: string;
    scope: string;
}

export interface SentinelProduct {
    serial_number: string;
    audit_time_stamp: string;
    product_type: string;
}

export interface SentinelUserData {
    weight: {
        value: string;
        unit: string;
    }
    connectedDevice: string;
    gender: string
}
export interface SentinelApiResponse {
    account_subtype: string;
    account_type: string;
    audit_time_stamp: string;
    billing_address: string;
    billing_address2: string | null;
    billing_address3: string | null;
    billing_address_id: string;
    billing_city: string;
    billing_countryCode: string;
    billing_is_primary: boolean;
    billing_postal_code: string;
    billing_state: string;
    cams_id: string;
    communication_preferences: SentinelCommunicationPreference[];
    country: string | null;
    country_code: string;
    created_at: string;
    customer_id_kind: string;
    dob: string;
    email: string;
    first_name: string;
    gca_id: string;
    gender: string;
    id: string;
    is_active: true;
    language_code: string;
    last_name: string;
    last_updated: string;
    mobile: string;
    nick_name: string;
    preferred_channel: string | null;
    preferred_language: string | null;
    product_type: string;
    pump_manufacturer: string;
    sentinel_journeys: object;
    serial_number_list?: SentinelProduct[];
    shipping_address: string;
    shipping_address2: null;
    shipping_address3: null;
    shipping_address_id: string;
    shipping_city: string;
    shipping_countryCode: string;
    shipping_is_primary: true;
    shipping_postal_code: string;
    shipping_state: string;
    stelo_health_status: string;
    stelo_order_subtype: string;
    system_of_origin: string;
    system_of_origin_id: string;
    tz: null;
    unchecked_email: string;
    username: string;
    xps: object;
}

export type SentinelSerialsMap = Map<string, SentinelProduct>;

export type SentinelReturnValue = {
    mapOfSerials: SentinelSerialsMap | [];
    userData?: SentinelUserData;
}

/**
 * Function which filters out all Sentinel products and checks if Sentinel products are mappable
 * so that they can be displayed to used.
 *
 * All products must have:
 *      1.) Insertion date must not be greater than date of issue
 *      2.) Insertion date must not be older than date of issue by more that 15 days
 *      3.) Product must be purchasable in a country for which request is send, if such list exists
 *      4.) Product must have Insertion Date and Serial Number fields
 *
 * It the product does not comply with condition number 3 empty Map will be returned
 */
const filterSentinelData = (
    retValue: SentinelApiResponse,
    date?: string,
    countryCode?: string
): SentinelSerialsMap => {
    try {
        const mapOfSerials: SentinelSerialsMap = new Map();

        let minDate: Date | null = null;
        let maxDate: Date | null = null;
        if (date) {
            maxDate = new Date(date);
            // set max date to date + 1 day to disregard difference in hours
            maxDate.setDate(maxDate.getDate() + 1);

            minDate = new Date(date);
            // product can be added 15 days before provided (selected) date
            minDate.setDate(minDate.getDate() - 15);
        }

        // if there are no products return empty map
        if (!retValue.serial_number_list) {
            console.log('There are not Sentinel products, return empty map');
            return mapOfSerials;
        }

        retValue.serial_number_list
            // check if all items have all required fields
            .forEach((item: SentinelProduct) => {
                const hasAllFields =
                    item.serial_number && item.audit_time_stamp;

                if (!hasAllFields) {
                    throw new Error(
                        'Sentinel product does not have all fields'
                    );
                }
            });

        retValue.serial_number_list
            // remove items which are too old
            .filter((item: SentinelProduct) => {
                // if min date is not provided return the item
                if (!date) {
                    return item;
                }
                const productDate = new Date(item.audit_time_stamp);
                const limitInThePast = minDate && productDate > minDate;
                const limitInTheFuture = maxDate && productDate <= maxDate;

                if (limitInThePast && limitInTheFuture) {
                    return item;
                }
            })
            // filter products by country code
            .filter((item: SentinelProduct) => {
                // if countryCode is not provided return the item
                if (!countryCode) {
                    return item;
                }

                const allowedProducts =
                    PURCHASEABLE_PRODUCT_SENSORS_FOR_COUNTRY[countryCode];

                if (
                    allowedProducts &&
                    allowedProducts.includes(item.product_type)
                ) {
                    return item;
                }
            })
            // remove duplicates
            .forEach((item: SentinelProduct) => {
                mapOfSerials.set(item.serial_number, {
                    ...item,
                    audit_time_stamp: new Date(
                        item.audit_time_stamp
                    ).toISOString(),
                });
            });

        console.log(
            `Number of Sentinel products that passed filtering: ${mapOfSerials.size}`
        );
        return mapOfSerials;
    } catch (error: any) {
        console.error(`Sentinel Error:  ${error.message}`);
        console.error('Returning empty map!');
        return new Map();
    }
};

const getDeviceData = (partnerData: string) => {
    if(!!partnerData){
        if(partnerData === 'Other') return 'None'
        return partnerData
    }
    return ''
}

export const getSentinelData = async (
    gcaid: string,
    date: string,
    countryCode: string,
    itgHost: string,
    token: string
): Promise<SentinelReturnValue> => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
    
    const request = `${itgHost}/v1/sentinel/customer/gca_id/${gcaid}?partners_source=pump`;

    console.log(`Fetching Sentinel products: ${request}`);

    const response = await fetch(request, requestOptions);
    if (response.ok) {
        console.log(`Data from sentinel for user ${gcaid} fetched`);
        const retValue = await response.json();
        let mapOfSerials: SentinelSerialsMap = new Map();

        if(!!retValue.serial_number_list){
            mapOfSerials = filterSentinelData(
            retValue,
            date,
            countryCode
        );
    }
        const connectedDevice = getDeviceData(retValue.partners_data?.[0].name);
        const userData = { weight: retValue.customer_weight ||  { unit: '', value: ''}, connectedDevice: connectedDevice || '', gender: retValue.gender || '' };
        return {mapOfSerials, userData};
    } else {
        throw new Error(`Fetch from sentinel for user ${gcaid} failed`);
    }
};
