// Popular destinations with iconic photos
export const POPULAR_DESTINATIONS = [
    {
        name: "Paris, France",
        image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop",
        description: "City of Love and Lights"
    },
    {
        name: "Tokyo, Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
        description: "Modern metropolis meets tradition"
    },
    {
        name: "New York, NY",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
        description: "The city that never sleeps"
    },
    {
        name: "Rome, Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
        description: "Eternal city of history"
    },
    {
        name: "Bali, Indonesia",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        description: "Tropical paradise"
    },
    {
        name: "London, UK",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
        description: "Royal heritage and culture"
    }
];

// Fallback images based on country/region
export const DESTINATION_FALLBACKS = {
    'france': 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
    'japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    'italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    'spain': 'https://images.unsplash.com/photo-1544943905-6ad2c5b6e5e7?w=400&h=300&fit=crop',
    'greece': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop',
    'thailand': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop',
    'uk': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    'usa': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop'
};

// Default fallback image for unknown destinations
export const DEFAULT_DESTINATION_IMAGE = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';

// Helper function to get destination image
export const getDestinationImage = (destination) => {
    const popular = POPULAR_DESTINATIONS.find(dest =>
        destination.toLowerCase().includes(dest.name.toLowerCase().split(',')[0])
    );

    if (popular) return popular.image;

    for (const [country, image] of Object.entries(DESTINATION_FALLBACKS)) {
        if (destination.toLowerCase().includes(country)) {
            return image;
        }
    }

    return DEFAULT_DESTINATION_IMAGE;
};