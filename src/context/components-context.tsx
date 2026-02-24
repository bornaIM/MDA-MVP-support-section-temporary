import { ChakraComponent, FormControlInputProps, FormControlSelectProps } from '@dexcomit/web-ui-lib';
import { FieldHookConfig } from 'formik';
import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onClick: Dispatch<SetStateAction<number>>;
};
type ControlType = 'input' | 'textarea';
type FieldFormControlProps = {
    controlType?: ControlType;
    errorMessage?: string;
    i18nField: string;
    trim?: boolean;
    autoSubmit?: boolean;
    showIcons?: boolean;
    ignorePhoneHelpers?: boolean;
} & Omit<FormControlInputProps, 'name' | 'label' | 'validate'> & FieldHookConfig<string>;
export type FieldFormControlSelectProps = Omit<
    FormControlSelectProps,
    'options'
> & {
    i18nField: string;
    autoSubmit?: boolean;
    options?: FormControlSelectProps['options'];
} & FieldHookConfig<string>;

interface useDateInputFormFieldHelpersHook {
    dateSimpleFormat: string;
        dateFormatLabel: string;
        formDateFormat: string;
        dateStandardFormat: string;
        dateStandardPattern: RegExp;
        stringToDate: (val: string, customFormat?: string | undefined) => Date;
        dateToString: (newDate: Date, customFormat?: string | undefined) => string,
        convertString: (str: string, currentFormat: string, newFormat: string) => string,
        validateString: (str: string, pattern: RegExp) => boolean,
        getWeekDayName: (weekDayNameInEnglish: string) => string
}

export interface InjectedComponents {
    Pagination: ({ currentPage, totalPages, onClick, }: PaginationProps) => JSX.Element;
    OpenChatbotTrigger: ChakraComponent<"div", {}>;
    RenderSlot: ({ id }: { id: string; }) => JSX.Element;
    FieldFormControl: React.FC<FieldFormControlProps>;
    FieldFormControlSelect({ i18nField, autoSubmit, options, ...props }: FieldFormControlSelectProps): JSX.Element,
    defaultLanguage: string;
    useDateInputFormFieldHelpers: useDateInputFormFieldHelpersHook,
}

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
    }
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
