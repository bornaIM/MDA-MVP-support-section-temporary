import styles from '../date-input.module.css';
import { Box, FormControlInput, Button, IconButton } from '@dexcomit/web-ui-lib';
import { Field, FieldInputProps, FieldMetaProps, FormikBag } from 'formik';
import { ChakraProps } from '@chakra-ui/system/dist/system.types';
import { isDate, isValid } from 'date-fns';
import useTranslation from 'next-translate/useTranslation';
import { DATE_INPUT_MIN_DATE, DATE_INPUT_MAX_DATE } from './constants';
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';

type FormikFieldProps = {
    form: FormikBag<unknown, string>;
    field: FieldInputProps<string>;
    meta: FieldMetaProps<string>;
};

type DateInputManualProps = ChakraProps & {
    name: string;
    isDisabled?: boolean;
    onCalendarClick?: () => void;
    labelFunction?: (initialLabel: string) => string;
    readOnly?: boolean;
    errorMessages?: {
        invalidFormat?: string;
        outsideOfRange?: string;
    };
    showCalendarButton?: boolean;
    minDate?: Date;
    maxDate?: Date;
    validate?: (val: any) => string | undefined;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    label?: string;
};

export function DateInputManual({
    name,
    labelFunction,
    onCalendarClick,
    readOnly,
    isDisabled,
    showCalendarButton,
    errorMessages,
    maxDate = DATE_INPUT_MAX_DATE,
    minDate = DATE_INPUT_MIN_DATE,
    validate,
    onChange,
    value,
    label,
    ...props
}: DateInputManualProps) {
    const { t } = useTranslation();
    
    const { dateSimpleFormat, formDateFormat, dateFormatLabel, stringToDate } =
        useDateInputFormFieldHelpers();

    const dateValidator = (val: string) => {
        const date = stringToDate(val);
        const defaultError = t('common:dateInput.dateRangeError');
        if (!(isDate(date) && isValid(date)))
            return errorMessages?.invalidFormat || defaultError;
        if (maxDate && date > maxDate)
            return errorMessages?.outsideOfRange || defaultError;
        if (minDate && date < minDate)
            return errorMessages?.outsideOfRange || defaultError;
        return validate && validate(val);
    };

    const getLabel = () => {
        if(label) return label
        return labelFunction
        ? labelFunction(dateFormatLabel)
        : dateSimpleFormat
    }

    return (
        <Box position="relative" {...props}>
            <Field name={name} validate={(val:string) => dateValidator(val)}>
                {({ field, meta: { error } }: FormikFieldProps) => (
                    <>
                        <FormControlInput
                            value={value || field.value}
                            name={name || field.name}
                            key="date-input-manual"
                            onBlur={field.onBlur}
                            onChange={onChange || field.onChange}
                            isInvalid={!!error}
                            isReadOnly={readOnly}
                            isDisabled={isDisabled}
                            errorMessage={error}
                            format={formDateFormat}
                            placeholder={dateSimpleFormat.toUpperCase()}
                            mask="_"
                            label={getLabel()}
                            className={styles.dateInput}
                            type="text"
                            size="xs"
                        />
                        {showCalendarButton && (
                                <IconButton  
                                    aria-label='test'
                                    className={styles.calendarToggle}
                                    key="date-input-calendar-button"
                                    _active={{ boxShadow: 'none'}}
                                    _focus={{ boxShadow: 'none' }}
                                    _hover={{ boxShadow: 'none'}}
                                    w="1.2rem!important"
                                    position="absolute"
                                    top="1.2rem"
                                    right={{ base: '1.2rem' }}
                                    onClick={() => {
                                        if (!isDisabled) onCalendarClick?.();
                                    }} 
                                />
                        )}
                    </>
                )}
            </Field>
        </Box>
    );
}
