import React from 'react';
import { Icons } from '../common/Icons';

const Header = ({
    currentItinerary,
    onBack,
    onCreateTrip,
    onShowSuggestions,
    onToggleMap,
    showMap,
    mapsLoaded
}) => {
    if (!currentItinerary) {
        // Home page header
        return (
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black">Wanderly</h1>
                    <button
                        onClick={onCreateTrip}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Icons.Plus className="w-4 h-4" />
                        Create Trip
                    </button>
                </div>
            </div>
        );
    }

    // Itinerary detail header
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-gray-600 hover:text-gray-800 text-lg"
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-bold text-black">
                        {currentItinerary.title}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onShowSuggestions}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Icons.Search className="w-4 h-4" />
                        Suggestions
                    </button>
                    {mapsLoaded && (
                        <button
                            onClick={onToggleMap}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showMap
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <Icons.Map className="w-4 h-4" />
                            {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;