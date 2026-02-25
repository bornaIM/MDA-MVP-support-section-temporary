import type { ButtonProps, FormControlProps } from '@dexcomit/web-ui-lib';
import { JSONSchema7 } from 'json-schema';
import { ReactNode } from 'react';
import type { Address } from '@dexcomit/web-vendor-framework/account';
import { FormikErrors } from 'formik';

export type AddressValues = Required<
    Omit<Address, 'id' | 'isSubscriptionLocked' | 'type'>
>;

export type FormValues = {
    address: AddressValues;
    selectedAddress: string;
    saveAddress?: boolean;
};

export interface IAddressContext {
    context: string;
    cancelLinkProps: ButtonProps;
    i18nBase: string;
    loqateEnabled: boolean;
    loqateKey: string;
    schemaAddress?: JSONSchema7;
    validationSchema: any;
    isLoqateOptionSelected: boolean;
    setIsLoqateOptionSelected: (value: boolean) => void;
    autoSubmit: boolean
    runValidation: boolean
}

export interface IAddressProvider {
    children: ReactNode;
    context: string;
}

export enum RadioState {
    Saved = 'Saved',
    New = 'New',
}

export interface AddressSelectRadioProps {
    name: string;
    radioSelected: RadioState;
    addresses?: Address[];
    selectedAddressId: string | null;
    handleRadioChange: (value: RadioState) => void;
    handleSavedOptionChange: (value: string) => void;
    formControlProps?: FormControlProps;
}

// helper type to define Formik function type, copied from the source
type FormikFunction = (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<FormValues>>;

export interface NewAddressInputFormProps {
    country: string;
    disableSettingAsPrimary?: boolean;
    addressCount: number;
    setFieldValue: FormikFunction;
    setFieldTouched: FormikFunction;
    showSaveAddressCheckbox?: boolean;
    onLoqateError?: () => void;
}

export type AddressFormProps = {
    addresses?: Address[];
    addressCount: number;
    name: string;
    selectedAddressId?: Address['id'];
    submitDisabled?: boolean;
    type: Address['type'];
    submitAction?: (addressId: string) => void;
    disableSettingAsPrimary?: boolean;
};
