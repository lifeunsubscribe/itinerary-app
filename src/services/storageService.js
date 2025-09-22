// Local storage service for persisting data

const STORAGE_KEYS = {
    ITINERARIES: 'wanderly_itineraries',
    API_KEYS: 'wanderly_api_keys',
    USER_PREFERENCES: 'wanderly_preferences'
};

export const storageService = {
    // Itineraries
    saveItineraries: (itineraries) => {
        try {
            localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
            return true;
        } catch (error) {
            console.error('Failed to save itineraries:', error);
            return false;
        }
    },

    loadItineraries: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load itineraries:', error);
            return [];
        }
    },

    // API Keys
    saveApiKey: (service, key) => {
        try {
            const apiKeys = storageService.loadApiKeys();
            apiKeys[service] = key;
            localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(apiKeys));
            return true;
        } catch (error) {
            console.error('Failed to save API key:', error);
            return false;
        }
    },

    loadApiKeys: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.API_KEYS);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Failed to load API keys:', error);
            return {};
        }
    },

    getApiKey: (service) => {
        const apiKeys = storageService.loadApiKeys();
        return apiKeys[service] || process.env[`REACT_APP_${service.toUpperCase()}_API_KEY`] || '';
    },

    // User Preferences
    savePreferences: (preferences) => {
        try {
            localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('Failed to save preferences:', error);
            return false;
        }
    },

    loadPreferences: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Failed to load preferences:', error);
            return {};
        }
    },

    // Clear all data
    clearAll: () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
};