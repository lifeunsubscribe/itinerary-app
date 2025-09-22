// Activity types for TripAdvisor API
export const ACTIVITY_TYPES = [
    { value: 'restaurants', label: 'Food & Dining', emoji: '🍽️' },
    { value: 'attractions', label: 'Attractions & Tours', emoji: '🎭' },
    { value: 'hotels', label: 'Hotels & Lodging', emoji: '🏨' },
    { value: 'geos', label: 'Places & Areas', emoji: '📍' },
    { value: 'activities', label: 'Activities & Entertainment', emoji: '🎪' }
];

// Map activity types to TripAdvisor API endpoints
export const ACTIVITY_TYPE_ENDPOINTS = {
    restaurants: 'restaurants',
    attractions: 'attractions',
    hotels: 'hotels',
    geos: 'geos',
    activities: 'attractions' // fallback to attractions
};