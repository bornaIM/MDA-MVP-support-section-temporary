import styles from './date-input.module.css'
import {
    getMonth,
    getYear,
} from 'date-fns';

interface CustomHeaderProps {
    date: Date;
    changeYear: (year: number) => void;
    changeMonth: (month: number) => void;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
    months: string[];
    years: number[];
}

export const DateInputCustomHeader: React.FC<CustomHeaderProps> = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    months,
    years
    }) => {
        return (
            <div
                style={{
                    margin: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 5,
                }}
            >
                <button 
                    className={styles.monthPrev}
                    onClick={decreaseMonth} 
                    disabled={prevMonthButtonDisabled}
                ><svg /></button>
                <select
                    className={styles.monthSelect}
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                    }
                >
                    {months.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
                <select
                    className={styles.yearSelect}
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(Number(value))}
                >
                    {years.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                    ))}
                </select>
                <button
                    className={styles.monthNext}
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled} 
                ><svg /></button>
            </div>
    )
}