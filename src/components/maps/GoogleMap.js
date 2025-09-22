import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const GoogleMap = ({ activities = [], destination, className = "w-full h-96 rounded-xl border border-gray-200" }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [mapError, setMapError] = useState(null);

    const { isLoaded, createMap, addMarkers, geocodeAddress } = useGoogleMaps();

    // Initialize map when component mounts and Google Maps is loaded
    useEffect(() => {
        const initializeMap = async () => {
            if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

            try {
                setMapError(null);

                // Create map with default center
                const map = createMap(mapRef.current, {
                    zoom: 13,
                    center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
                    mapTypeId: 'roadmap'
                });

                mapInstanceRef.current = map;

                // Try to center on destination
                if (destination) {
                    try {
                        const location = await geocodeAddress(destination);
                        map.setCenter({ lat: location.lat, lng: location.lng });
                        map.setZoom(13);
                    } catch (error) {
                        console.warn('Could not geocode destination:', error);
                    }
                }

            } catch (error) {
                console.error('Failed to initialize map:', error);
                setMapError(error.message);
            }
        };

        initializeMap();
    }, [isLoaded, destination, createMap, geocodeAddress]);

    // Update markers when activities change
    useEffect(() => {
        const updateMarkers = async () => {
            if (!mapInstanceRef.current || !isLoaded) return;

            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // Add markers for activities with locations
            const locationsToMark = [];

            for (const activity of activities) {
                if (activity.location) {
                    try {
                        const location = await geocodeAddress(activity.location);
                        locationsToMark.push({
                            lat: location.lat,
                            lng: location.lng,
                            title: activity.title,
                            description: `${activity.time ? activity.time + ' - ' : ''}${activity.location}`
                        });
                    } catch (error) {
                        console.warn(`Could not geocode activity location: ${activity.location}`, error);
                    }
                }
            }

            if (locationsToMark.length > 0) {
                try {
                    const markers = addMarkers(mapInstanceRef.current, locationsToMark);
                    markersRef.current = markers;
                } catch (error) {
                    console.error('Failed to add markers:', error);
                }
            }
        };

        updateMarkers();
    }, [activities, isLoaded, addMarkers, geocodeAddress]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        };
    }, []);

    if (!isLoaded) {
        return (
            <div className={`${className} flex items-center justify-center bg-gray-100`}>
                <div className="text-center text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    if (mapError) {
        return (
            <div className={`${className} flex items-center justify-center bg-red-50 border-red-200`}>
                <div className="text-center text-red-600">
                    <p className="font-medium">Map Error</p>
                    <p className="text-sm">{mapError}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            className={className}
            style={{ minHeight: '384px' }}
        />
    );
};

export default GoogleMap;