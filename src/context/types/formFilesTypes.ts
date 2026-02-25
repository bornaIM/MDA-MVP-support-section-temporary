import { FormControlInputProps, FormControlSelectProps } from '@dexcomit/web-ui-lib';
import { FieldHookConfig } from 'formik';

export type ControlType = 'input' | 'textarea';
export type FieldFormControlProps = {
    controlType?: ControlType;
    errorMessage?: string;
    i18nField: string;
    trim?: boolean;
    autoSubmit?: boolean;
    showIcons?: boolean;
    ignorePhoneHelpers?: boolean;
} & Omit<FormControlInputProps, 'name' | 'label' | 'validate'> &
FieldHookConfig<string>;

export type FieldFormControlSelectProps = Omit<
    FormControlSelectProps,
    'options'
> & {
    i18nField: string;
    autoSubmit?: boolean;
    options?: FormControlSelectProps['options'];
} & FieldHookConfig<string>;