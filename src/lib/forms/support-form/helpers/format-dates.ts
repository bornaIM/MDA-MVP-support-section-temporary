function getYear(date: Date) {
    return date.getFullYear();
}
function getMonth(date: Date) {
    return String(date.getMonth() + 1).padStart(2, '0');
}
function getDay(date: Date) {
    return String(date.getDate()).padStart(2, '0');
}

export function getFormattedDate(date: Date) {
    return `${getYear(date)}-${getMonth(date)}-${getDay(date)}`;
}

export function trimISOString(date: string) {
    return date.split('T')[0];
}