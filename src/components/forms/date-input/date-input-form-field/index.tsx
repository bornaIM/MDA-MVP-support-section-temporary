import { useEffect, useMemo, useState } from 'react';
import { DateInputManual } from './date-input-manual';
import { DateInputCalendar } from './date-input-calendar';
import { ChakraProps } from '@chakra-ui/system/dist/system.types';
import { Field, FieldInputProps, FieldMetaProps, FormikBag } from 'formik';
import { isValid } from 'date-fns';
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';

type FormikFieldProps = {
    form: FormikBag<unknown, string>;
    field: FieldInputProps<string>;
    meta: FieldMetaProps<string>;
};

type DateInputFormFieldProps = ChakraProps & {
    name: string;
    labelFunction?: (initialLabel: string) => string;
    minDate?: Date;
    maxDate?: Date;
    validate?: (val: any) => string | undefined;
    isDisabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    label?: string;
    onManualModeChange?: (manualMode: boolean) => void;
    isDefaultDateToday?: boolean;
    onSubmit?: (values: { date: string }) => void;
    preventAutoSubmit?: boolean;
};

export function DateInputFormField({
    name,
    minDate,
    maxDate,
    onChange,
    value,
    isDefaultDateToday = true,
    label,
    isDisabled,
    onManualModeChange,
    onSubmit,
    preventAutoSubmit,
    ...props
}: DateInputFormFieldProps) {
    const [manualMode, toggleManualMode] = useState(true);
    const { stringToDate, dateToString } = useDateInputFormFieldHelpers();

    useEffect(() => {
        if (onManualModeChange) {
            onManualModeChange(manualMode);
        }
    }, [manualMode, onManualModeChange]);

    return (
        <>
            <Field name={name}>
                {({ meta, field, form }: FormikFieldProps) => {
                    const onCalendarChange = (newDate: Date | null) => {
                        if (!newDate || !isValid(newDate)) return;
                        const serializedNewDate = dateToString(newDate);
                        if (onChange) {
                            const dummyEvent = {
                                target: {
                                    name: field.name,
                                    value: serializedNewDate,
                                }
                            } as React.ChangeEvent<HTMLInputElement>;
                            onChange(dummyEvent);
                            form.setFieldValue(field.name, serializedNewDate);
                        } else if (form.setFieldValue) {
                            form.setFieldValue(field.name, serializedNewDate);
                            form.setFieldTouched(field.name, true, false);
                            form.validateField(field.name);
                            if(onSubmit && !preventAutoSubmit) {
                                onSubmit({date: serializedNewDate})
                            }
                        }
                        toggleManualMode(true);
                    };

                    useEffect(() => {
                        if (!meta.error && field.value) {
                            onCalendarChange(stringToDate(field.value));
                        } else if (isDefaultDateToday) {
                            onCalendarChange(maxDate || new Date());
                        }
                    }, []);
                    const selectedDate = useMemo(() => {
                        if (field.value) {
                            const valueAsDate = stringToDate(field.value);
                            if (!isNaN(valueAsDate.getTime())) {
                                return valueAsDate;
                            }
                        } 
                        return maxDate
                    }, [field.value, maxDate]);

                    function handleManualInputChange(event: React.ChangeEvent<any>) {
                        const value = event.target.value
                        if(isValid(new Date(value))) {
                            form.setFieldValue(field.name, value);
                            form.setFieldTouched(field.name, true, false);
                            form.validateField(field.name);
                            if(onChange) {onChange(event)}
                            if(onSubmit && !preventAutoSubmit) {
                                onSubmit({date: value}
                            )
                        }
                    }
}
                    return (
                        <>
                            <DateInputManual
                                showCalendarButton
                                readOnly={!manualMode}
                                onCalendarClick={() =>
                                    toggleManualMode((prev) => !prev)
                                }
                                name={name}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={handleManualInputChange}
                                value={value}
                                label={label}
                                isDisabled={isDisabled}
                                {...props}
                            />
                            {!manualMode && (
                                <DateInputCalendar
                                    value={selectedDate}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    onCalendarChange={onCalendarChange}
                                    onClickOutside={() => toggleManualMode(true)}
                                />
                            )}
                        </>
                    );
                }}
            </Field>
        </>
    );
}
