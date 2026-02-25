import { Address } from '@dexcomit/web-vendor-framework/account';
import type { SupportFormValues } from '@components/forms/support-form/select-shipping-address/support-address-form';
import type { FormikValues } from 'formik';
import { RefObject } from 'react';

export enum ViewMode {
    ReadOnly,
    RadioInput,
    ShowNewAddressForm,
}

export interface SupportSelectShippingAddressProps {
    onSelect: (address: Address | null) => void;
    onValidChange?: (isValid: boolean) => void;
    onValuesChange?: (values: SupportFormValues) => void;
    mode?: ViewMode;
    onModeChange?: (mode: ViewMode) => void;
    showSaveAddressCheckbox?: boolean;
    disableAutoSubmit?: boolean;
    setCurrentAddressHandler: (values: FormikValues) => void;
    validationFailures: string[]
    disableHeaders?: boolean;
    submitAddressButtonRef?: RefObject<HTMLButtonElement>;
    manageValidationFailures: (key: string, validator: () => boolean) => void
}

// need all fields for markup address displays
// if no address, return empty address so markup doesn't show
export const normalizeAddressForUI = (
    address: Address | null
): Partial<Address> => {
    return {
        address1: address?.address1 ?? '',
        address2: address?.address2 ?? '',
        address3: address?.address3 ?? '',
        city: address?.city ?? '',
        stateProvince: address?.stateProvince ?? '',
        postalCode: address?.postalCode ?? '',
    };
};
