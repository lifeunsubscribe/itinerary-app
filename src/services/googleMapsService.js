// Google Maps API service - isolated and testable

export const googleMapsService = {
    isLoaded: false,
    loadPromise: null,

    // Load Google Maps API with proper error handling
    loadGoogleMapsAPI: (apiKey) => {
        // Return existing promise if already loading
        if (googleMapsService.loadPromise) {
            return googleMapsService.loadPromise;
        }

        // Return resolved promise if already loaded
        if (window.google && window.google.maps) {
            googleMapsService.isLoaded = true;
            return Promise.resolve(window.google.maps);
        }

        // Create new loading promise
        googleMapsService.loadPromise = new Promise((resolve, reject) => {
            // Create script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;

            // Handle successful load
            script.onload = () => {
                if (window.google && window.google.maps) {
                    googleMapsService.isLoaded = true;
                    resolve(window.google.maps);
                } else {
                    reject(new Error('Google Maps API failed to initialize'));
                }
            };

            // Handle errors
            script.onerror = (error) => {
                googleMapsService.loadPromise = null;
                reject(new Error('Failed to load Google Maps API script'));
            };

            // Add script to document
            document.head.appendChild(script);

            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        });

        return googleMapsService.loadPromise;
    },

    // Initialize autocomplete for an input element
    initializeAutocomplete: (inputElement, options = {}) => {
        if (!googleMapsService.isLoaded || !window.google) {
            throw new Error('Google Maps API not loaded');
        }

        const defaultOptions = {
            fields: ['formatted_address', 'geometry', 'name'],
            ...options
        };

        try {
            // Use the new PlaceAutocompleteElement if available, fallback to old method
            if (window.google.maps.places.PlaceAutocompleteElement) {
                const autocompleteElement = new window.google.maps.places.PlaceAutocompleteElement(defaultOptions);
                inputElement.parentNode.insertBefore(autocompleteElement, inputElement);
                inputElement.style.display = 'none';
                return autocompleteElement;
            } else {
                // Fallback to legacy autocomplete
                const autocomplete = new window.google.maps.places.Autocomplete(inputElement, defaultOptions);
                return autocomplete;
            }
        } catch (error) {
            console.error('Failed to initialize autocomplete:', error);
            throw error;
        }
    },

    // Create a map instance
    createMap: (container, options = {}) => {
        if (!googleMapsService.isLoaded || !window.google) {
            throw new Error('Google Maps API not loaded');
        }

        const defaultOptions = {
            zoom: 13,
            center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            ...options
        };

        try {
            const map = new window.google.maps.Map(container, defaultOptions);
            return map;
        } catch (error) {
            console.error('Failed to create map:', error);
            throw error;
        }
    },

    // Add markers to a map
    addMarkers: (map, locations) => {
        if (!googleMapsService.isLoaded || !window.google) {
            throw new Error('Google Maps API not loaded');
        }

        const markers = [];
        const bounds = new window.google.maps.LatLngBounds();

        locations.forEach((location, index) => {
            if (location.lat && location.lng) {
                const marker = new window.google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    map: map,
                    title: location.title || `Location ${index + 1}`,
                    animation: window.google.maps.Animation.DROP
                });

                // Add info window if description provided
                if (location.description) {
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 4px 0; font-weight: bold;">${location.title || 'Location'}</h4>
                <p style="margin: 0; font-size: 12px;">${location.description}</p>
              </div>
            `
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                }

                markers.push(marker);
                bounds.extend(marker.getPosition());
            }
        });

        // Fit map to show all markers
        if (markers.length > 0) {
            map.fitBounds(bounds);

            // If only one marker, set a reasonable zoom level
            if (markers.length === 1) {
                map.setZoom(15);
            }
        }

        return markers;
    },

    // Geocode an address
    geocodeAddress: (address) => {
        if (!googleMapsService.isLoaded || !window.google) {
            throw new Error('Google Maps API not loaded');
        }

        return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng(),
                        formatted_address: results[0].formatted_address
                    });
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    },

    // Get current user location
    getCurrentLocation: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error(`Geolocation error: ${error.message}`));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000 // 10 minutes
                }
            );
        });
    },

    // Clean up - remove script and reset state
    cleanup: () => {
        const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        scripts.forEach(script => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        });

        // Reset state
        googleMapsService.isLoaded = false;
        googleMapsService.loadPromise = null;

        // Clean up global Google object
        if (window.google) {
            delete window.google;
        }
    }
};