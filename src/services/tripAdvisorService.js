import { ACTIVITY_TYPE_ENDPOINTS } from '../data/activityTypes';

// TripAdvisor API service with fallback mock data
export const tripAdvisorService = {
    searchSuggestions: async (location, activityType, apiKey) => {
        try {
            // First, search for the location
            const locationData = await tripAdvisorService.searchLocation(location, apiKey);
            if (!locationData || !locationData.location_id) {
                throw new Error('Location not found');
            }

            // Then get suggestions for that location
            const suggestions = await tripAdvisorService.getSuggestions(
                locationData.location_id,
                activityType,
                apiKey
            );

            return suggestions;
        } catch (error) {
            console.warn('TripAdvisor API failed, using mock data:', error.message);
            return tripAdvisorService.getMockData(location, activityType);
        }
    },

    searchLocation: async (location, apiKey) => {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const searchUrl = `${proxyUrl}${encodeURIComponent(
            `https://api.content.tripadvisor.com/api/v1/location/search?key=${apiKey}&searchQuery=${encodeURIComponent(location)}&language=en`
        )}`;

        const response = await fetch(searchUrl);
        if (!response.ok) {
            throw new Error(`Location search failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            throw new Error('No location found');
        }

        return data.data[0];
    },

    getSuggestions: async (locationId, activityType, apiKey) => {
        const endpoint = ACTIVITY_TYPE_ENDPOINTS[activityType] || 'attractions';
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const suggestionsUrl = `${proxyUrl}${encodeURIComponent(
            `https://api.content.tripadvisor.com/api/v1/location/${locationId}/${endpoint}?key=${apiKey}&language=en&limit=10`
        )}`;

        const response = await fetch(suggestionsUrl);
        if (!response.ok) {
            throw new Error(`Suggestions failed: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    },

    getMockData: (location, activityType) => {
        const cityName = location.split(',')[0];

        const mockData = {
            restaurants: [
                {
                    location_id: `rest_${Date.now()}_1`,
                    name: `Local Bistro in ${cityName}`,
                    description: 'Authentic local cuisine with fresh ingredients and traditional recipes. Highly recommended by locals.',
                    rating: '4.5',
                    num_reviews: '1,234',
                    address: `${cityName} Historic District`,
                    photo: {
                        images: {
                            medium: {
                                url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
                            }
                        }
                    },
                    cuisine: [{ name: 'Local' }]
                },
                {
                    location_id: `rest_${Date.now()}_2`,
                    name: `Fine Dining Restaurant`,
                    description: 'Upscale dining experience with creative dishes and excellent service. Perfect for special occasions.',
                    rating: '4.7',
                    num_reviews: '856',
                    address: `Downtown ${cityName}`,
                    photo: {
                        images: {
                            medium: {
                                url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop'
                            }
                        }
                    },
                    cuisine: [{ name: 'International' }]
                }
            ],
            attractions: [
                {
                    location_id: `attr_${Date.now()}_1`,
                    name: `${cityName} Historic Center`,
                    description: 'Explore the rich history and culture of this beautiful destination with guided tours and stunning architecture.',
                    rating: '4.6',
                    num_reviews: '2,567',
                    address: `Central ${cityName}`,
                    photo: {
                        images: {
                            medium: {
                                url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop'
                            }
                        }
                    }
                },
                {
                    location_id: `attr_${Date.now()}_2`,
                    name: 'Local Museum',
                    description: 'Discover fascinating exhibits showcasing local art, history, and culture. Interactive displays for all ages.',
                    rating: '4.3',
                    num_reviews: '1,890',
                    address: `Museum District, ${cityName}`,
                    photo: {
                        images: {
                            medium: {
                                url: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=300&h=200&fit=crop'
                            }
                        }
                    }
                }
            ],
            hotels: [
                {
                    location_id: `hotel_${Date.now()}_1`,
                    name: `Luxury Hotel ${cityName}`,
                    description: 'Premium accommodation with world-class amenities, spa services, and exceptional hospitality.',
                    rating: '4.8',
                    num_reviews: '1,456',
                    address: `Luxury District, ${cityName}`,
                    photo: {
                        images: {
                            medium: {
                                url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop'
                            }
                        }
                    }
                }
            ]
        };

        return mockData[activityType] || mockData.attractions;
    }
};