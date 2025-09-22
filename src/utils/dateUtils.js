// Date utility functions for the itinerary app

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateRange = (startDate, endDate) => {
    if (!startDate) return 'Select dates';
    if (!endDate) return startDate.toLocaleDateString();
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

export const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const isDateInRange = (date, startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
};

export const isPastDate = (date) => {
    return date < new Date().setHours(0, 0, 0, 0);
};

export const sortActivitiesByDateTime = (activities) => {
    return activities.sort((a, b) =>
        new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00'))
    );
};

export const groupActivitiesByDate = (activities) => {
    return activities.reduce((groups, activity) => {
        const date = activity.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(activity);
        return groups;
    }, {});
};