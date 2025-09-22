import { useState, useCallback } from 'react';
import { tripAdvisorService } from '../services/tripAdvisorService';
import { storageService } from '../services/storageService';

export const useTripAdvisor = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchSuggestions = useCallback(async (location, activityType) => {
        setLoading(true);
        setError(null);
        setSuggestions([]);

        try {
            const apiKey = storageService.getApiKey('tripadvisor');
            const results = await tripAdvisorService.searchSuggestions(location, activityType, apiKey);
            setSuggestions(results);
        } catch (err) {
            setError(err.message);
            console.error('TripAdvisor search failed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setError(null);
    }, []);

    return {
        suggestions,
        loading,
        error,
        searchSuggestions,
        clearSuggestions
    };
};