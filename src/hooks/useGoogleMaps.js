import { useState, useEffect, useCallback } from 'react';
import { googleMapsService } from '../services/googleMapsService';
import { storageService } from '../services/storageService';

export const useGoogleMaps = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load Google Maps API
    const loadMaps = useCallback(async () => {
        if (isLoaded || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const apiKey = storageService.getApiKey('google_maps');
            if (!apiKey) {
                throw new Error('Google Maps API key not found');
            }

            await googleMapsService.loadGoogleMapsAPI(apiKey);
            setIsLoaded(true);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load Google Maps:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoaded, isLoading]);

    // Initialize on mount
    useEffect(() => {
        loadMaps();
    }, [loadMaps]);

    // Create autocomplete
    const createAutocomplete = useCallback((inputElement, options) => {
        if (!isLoaded) {
            throw new Error('Google Maps not loaded');
        }
        return googleMapsService.initializeAutocomplete(inputElement, options);
    }, [isLoaded]);

    // Create map
    const createMap = useCallback((container, options) => {
        if (!isLoaded) {
            throw new Error('Google Maps not loaded');
        }
        return googleMapsService.createMap(container, options);
    }, [isLoaded]);

    // Add markers
    const addMarkers = useCallback((map, locations) => {
        if (!isLoaded) {
            throw new Error('Google Maps not loaded');
        }
        return googleMapsService.addMarkers(map, locations);
    }, [isLoaded]);

    // Geocode address
    const geocodeAddress = useCallback(async (address) => {
        if (!isLoaded) {
            throw new Error('Google Maps not loaded');
        }
        return googleMapsService.geocodeAddress(address);
    }, [isLoaded]);

    // Get current location
    const getCurrentLocation = useCallback(async () => {
        return googleMapsService.getCurrentLocation();
    }, []);

    // Retry loading
    const retryLoad = useCallback(() => {
        setError(null);
        setIsLoaded(false);
        setIsLoading(false);
        loadMaps();
    }, [loadMaps]);

    return {
        isLoaded,
        isLoading,
        error,
        createAutocomplete,
        createMap,
        addMarkers,
        geocodeAddress,
        getCurrentLocation,
        retryLoad
    };
};