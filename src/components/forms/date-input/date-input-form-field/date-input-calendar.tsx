import DatePicker from 'react-datepicker';
// import './react-datepicker.module.css'
import { getYear } from 'date-fns';
import { range } from 'lodash';
import styles from '../date-input.module.css';
import { Box } from '@dexcomit/web-ui-lib';
import useTranslation from 'next-translate/useTranslation';
import { DateInputCustomHeader } from '../date-input-custom-header';
import { DATE_INPUT_MIN_DATE, DATE_INPUT_MAX_DATE } from './constants';
import useDateInputFormFieldHelpers from '@/utils/use-date-input-form-field-helpers';

type DateInputCalendarProps = {
    minDate?: Date;
    maxDate?: Date;
    value?: Date | null;
    onCalendarChange: (newDate: Date | null) => void;
    onClickOutside: () => void;
};

export function DateInputCalendar({
    minDate = DATE_INPUT_MIN_DATE,
    maxDate = DATE_INPUT_MAX_DATE,
    onCalendarChange,
    onClickOutside,
    value
}: DateInputCalendarProps) {
    const { t } = useTranslation();
    const years = range(
        getYear(minDate),
        getYear(maxDate) + 1,
        1
    );

    const { getWeekDayName } = useDateInputFormFieldHelpers();
    
    const months = Array.from({ length: 12 }, (_, i) =>
        t(`common:dateInput.months.${i + 1}`)
    );

    return (
        <Box position="relative">
            <DatePicker
                inline
                selected={value}
                minDate={minDate}
                maxDate={maxDate}
                onSelect={onCalendarChange}
                showPopperArrow={false}
                wrapperClassName={styles.datepickerWrapper}
                calendarClassName={styles.calendar}
                dayClassName={() => styles.datepickerDay}
                weekDayClassName={() => styles.datepickerWeek}
                onClickOutside={onClickOutside}
                renderCustomHeader={(props) => (
                    <DateInputCustomHeader
                        {...props}
                        months={months}
                        years={years}
                    />
                )}
                formatWeekDay={getWeekDayName}
            />
        </Box>
    );
}
