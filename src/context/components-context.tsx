import { ChakraComponent } from '@dexcomit/web-ui-lib';
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import type { UseValidationType } from "./types/validationTypes";
import { AddressSelectRadioProps, IAddressContext, IAddressProvider } from "./types/addressTypes";
import { useDateInputFormFieldHelpersHook } from "./types/dateTypes";
import {
    FieldFormControlProps,
    FieldFormControlSelectProps,
} from "./types/formFilesTypes";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onClick: Dispatch<SetStateAction<number>>;
};

export interface InjectedComponents {
    Pagination: ({ currentPage, totalPages, onClick, }: PaginationProps) => JSX.Element;
    OpenChatbotTrigger: ChakraComponent<"div", {}>;
    RenderSlot: ({ id }: { id: string; }) => JSX.Element;
    FieldFormControlSelect({ i18nField, autoSubmit, options, ...props }: FieldFormControlSelectProps): JSX.Element,
    defaultLanguage: string;
    useDateInputFormFieldHelpers: useDateInputFormFieldHelpersHook;
    FieldFormControl: React.FC<FieldFormControlProps>;
    useValidation: UseValidationType;
    mapOptionalValues: (object: any, fields: string[]) => any;
    AddressContext: React.Context<IAddressContext>;
    AddressProvider: React.ComponentType<IAddressProvider>;
    useManualAddressValidation: ({ type }: { type: string }) => {
        validationFailures: string[];
        setCurrentAddressHandler: () => any;
        manageValidationFailures: () => any;
    };
    // address components
    NewAddressInputForm: React.ComponentType<any>,
    AddressFormProps: React.ComponentType<any>,
    MAX_ADDRESS_NUMBER: number,
    TooManyAddressesAlert: React.ComponentType<any>,
    AddressSelectRadio: React.ComponentType<AddressSelectRadioProps>,
    AddressValidationFailures: React.ComponentType<any>,
    useGetStateProvinceFromCode: () => any
}

const AddressContext = createContext<IAddressContext>({
    context: "",
    cancelLinkProps: {},
    i18nBase: "",
    loqateEnabled: false,
    loqateKey: "",
    schemaAddress: {},
    validationSchema: {},
    isLoqateOptionSelected: false,
    setIsLoqateOptionSelected: () => void 0,
    autoSubmit: false,
    runValidation: true,
});

export interface InjectedFunctions {
    useGetLocalizedUrl(): (fragment?: string) => string;
}

export interface SupportContextValue extends InjectedComponents, InjectedFunctions {}

const defaultContextValue: SupportContextValue = {
    Pagination: () => <></>,
    OpenChatbotTrigger: () => <></>,
    RenderSlot: () => <></>,
    FieldFormControl: () => <></>,
    FieldFormControlSelect: () => <></>,
    useGetLocalizedUrl: () => (fragment?: string) => '',
    defaultLanguage: "en-US",
    useDateInputFormFieldHelpers: {
        dateSimpleFormat: "",
        dateFormatLabel: "",
        formDateFormat: "",
        dateStandardFormat: "",
        dateStandardPattern: new RegExp(""),
        stringToDate: () => new Date(),
        dateToString: () => "",
        convertString: () => "",
        validateString: () => false,
        getWeekDayName: () => ""
    },
    useValidation: async () => null,
    mapOptionalValues: () => null,
    AddressContext,
    AddressProvider: () => null,
    useManualAddressValidation: (type) => ({
        validationFailures: [],
        setCurrentAddressHandler: () => null,
        manageValidationFailures: () => null,
    }),
    NewAddressInputForm: () => null,
    AddressFormProps: () => null,
    MAX_ADDRESS_NUMBER: 0,
    TooManyAddressesAlert: () => null,
    AddressSelectRadio: () => null,
    AddressValidationFailures: () => null,
    useGetStateProvinceFromCode: () => null
};

const SupportContext = createContext<SupportContextValue>(defaultContextValue);

export const SupportProvider: React.FC<{
    components?: Partial<InjectedComponents>;
    functions?: Partial<InjectedFunctions>;
    children: ReactNode
}> = ({ components = {}, functions = {}, children }) => {
    const value = {
        ...defaultContextValue,
        ...Object.fromEntries(Object.entries(components).filter(([_, v]) => v !== undefined)),
        ...Object.fromEntries(Object.entries(functions).filter(([_, v]) => v !== undefined))
    };
    return (
        <SupportContext.Provider value={value}>
            {children}
        </SupportContext.Provider>
    );
};

export const useProvider = () => useContext(SupportContext);
