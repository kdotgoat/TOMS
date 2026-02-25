export const getMonthDateRange = (month) => {
    const year = new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month+1, 1);

    return {startDate, endDate};
};