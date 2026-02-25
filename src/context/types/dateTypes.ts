export interface useDateInputFormFieldHelpersHook {
    dateSimpleFormat: string;
    dateFormatLabel: string;
    formDateFormat: string;
    dateStandardFormat: string;
    dateStandardPattern: RegExp;
    stringToDate: (val: string, customFormat?: string | undefined) => Date;
    dateToString: (newDate: Date, customFormat?: string | undefined) => string;
    convertString: (
        str: string,
        currentFormat: string,
        newFormat: string,
    ) => string;
    validateString: (str: string, pattern: RegExp) => boolean;
    getWeekDayName: (weekDayNameInEnglish: string) => string;
}
