export const formatDateString = (dateStr) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6) - 1;
    const day = dateStr.substring(6, 8);
    const date = new Date(year, month, day);

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];

    return `${dateStr}_${dayOfWeek}`


}