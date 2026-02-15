import { format, parse, isValid } from 'date-fns';
import useTranslation from 'next-translate/useTranslation';

export default function useDateInputFormFieldHelpers() {
    const { t } = useTranslation();
    const dateSimpleFormat = t('support:dates.simpleFormat');
    const dateFormatLabel = t('support:dates.label') ?? dateSimpleFormat;
    const formDateFormat = dateSimpleFormat.replace(/[a-zA-Z]/g, '#');
    const dateStandardFormat = 'yyyy-MM-dd';
    const dateStandardPattern = /^(19[0-9]{2}|20[0-9]{2})-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$/;

    const stringToDate = (val: string, customFormat?: string) =>
        parse(val, customFormat || dateSimpleFormat, new Date());

    const dateToString = (newDate: Date, customFormat?: string) => {
        return format(newDate, customFormat || dateSimpleFormat);
    };
    
    const convertString = (
        str: string,
        currentFormat: string,
        newFormat: string
    ) => {
        const date = parse(str, currentFormat, new Date());
        return isValid(date) ? format(date, newFormat) : str;
    };

    const getWeekDayName = (weekDayNameInEnglish: string) => t(
        `common:dateInput.weekDayNames.${weekDayNameInEnglish.toLowerCase()}`
    );

    const validateString = (str: string, pattern: RegExp) =>
        pattern.test(str);

    return {
        dateSimpleFormat,
        dateFormatLabel,
        formDateFormat,
        dateStandardFormat,
        dateStandardPattern,
        stringToDate,
        dateToString,
        convertString,
        validateString,
        getWeekDayName
    };
}
