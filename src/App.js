import React, { useState, useRef } from 'react';
import Header from './components/layout/Header';
import NewItineraryModal from './components/modals/NewItineraryModal';
import TripInfoCard from './components/itinerary/TripInfoCard';
import ActivityForm from './components/itinerary/ActivityForm';
import ActivityList from './components/itinerary/ActivityList';
import { useItinerary } from './hooks/useItinerary';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { POPULAR_DESTINATIONS } from './data/destinations';
import { Icons } from './components/common/Icons';

function App() {
    const {
        itineraries,
        currentItinerary,
        setCurrentItinerary,
        createItinerary,
        deleteItinerary,
        addActivity,
        updateActivity,
        deleteActivity
    } = useItinerary();

    const {
        isLoaded: mapsLoaded,
        isLoading: mapsLoading,
        error: mapsError
    } = useGoogleMaps();

    const [showNewItinerary, setShowNewItinerary] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Refs for Google Maps integration
    const locationInputRef = useRef(null);

    const handleCreateTrip = () => {
        setShowNewItinerary(true);
    };

    const handleBack = () => {
        setCurrentItinerary(null);
    };

    const handleShowSuggestions = () => {
        setShowSuggestions(true);
    };

    const handleToggleMap = () => {
        setShowMap(!showMap);
    };

    // Home page - list of itineraries and popular destinations
    if (!currentItinerary) {
        return (
            <div className="min-h-screen bg-white">
                <Header
                    currentItinerary={null}
                    onCreateTrip={handleCreateTrip}
                />

                <div className="max-w-7xl mx-auto p-6">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Plan your perfect getaway
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover amazing destinations and create unforgettable itineraries with AI-powered suggestions
                        </p>
                    </div>

                    {/* Popular Destinations */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Popular destinations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {POPULAR_DESTINATIONS.map(dest => (
                                <div
                                    key={dest.name}
                                    onClick={() => handleCreateTrip()}
                                    className="destination-card cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative h-64">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h4 className="font-bold text-xl mb-1">
                                                {dest.name.split(',')[0]}
                                            </h4>
                                            <p className="text-sm opacity-90">
                                                {dest.description}
                                            </p>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                                                <Icons.Heart className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Your Trips Section */}
                    {itineraries.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Your trips
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {itineraries.map(itinerary => (
                                    <div
                                        key={itinerary.id}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={itinerary.image}
                                                alt={itinerary.destination}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteItinerary(itinerary.id);
                                                    }}
                                                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                                                >
                                                    <Icons.Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                            {itinerary.collaborators && itinerary.collaborators.length > 0 && (
                                                <div className="absolute top-4 left-4">
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                                                        <Icons.Users className="w-3 h-3 text-white" />
                                                        <span className="text-white text-xs">
                                                            {itinerary.collaborators.length + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="p-4"
                                            onClick={() => setCurrentItinerary(itinerary)}
                                        >
                                            <h4 className="font-bold text-lg text-gray-900 mb-1">
                                                {itinerary.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                                                <Icons.MapPin className="w-3 h-3" />
                                                {itinerary.destination}
                                            </p>
                                            {itinerary.startDate && itinerary.endDate && (
                                                <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                                                    <Icons.Calendar className="w-3 h-3" />
                                                    {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">
                                                    {itinerary.activities.length} activities
                                                </span>
                                                {itinerary.guestCount && (
                                                    <span className="text-gray-500 text-sm flex items-center gap-1">
                                                        <Icons.Users className="w-3 h-3" />
                                                        {itinerary.guestCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state for new users */}
                    {itineraries.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mb-6">
                                <Icons.MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No trips yet
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Start planning your next adventure by creating your first trip itinerary
                                </p>
                            </div>
                            <button
                                onClick={handleCreateTrip}
                                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <Icons.Plus className="w-4 h-4" />
                                Create Your First Trip
                            </button>
                        </div>
                    )}
                </div>

                <NewItineraryModal
                    isOpen={showNewItinerary}
                    onClose={() => setShowNewItinerary(false)}
                    onCreateItinerary={createItinerary}
                />
            </div>
        );
    }

    // Itinerary detail page
    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                currentItinerary={currentItinerary}
                onBack={handleBack}
                onShowSuggestions={handleShowSuggestions}
                onToggleMap={handleToggleMap}
                showMap={showMap}
                mapsLoaded={mapsLoaded}
            />

            <div className="max-w-6xl mx-auto p-6">
                <TripInfoCard
                    itinerary={currentItinerary}
                    showMap={showMap}
                />

                <ActivityForm
                    onAddActivity={addActivity}
                    locationInputRef={locationInputRef}
                />

                <ActivityList
                    activities={currentItinerary.activities}
                    onUpdateActivity={updateActivity}
                    onDeleteActivity={deleteActivity}
                    onShowSuggestions={handleShowSuggestions}
                />

                {mapsLoading && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-blue-700 flex items-center gap-2">
                            <Icons.Loading className="w-4 h-4" />
                            Loading Google Maps...
                        </p>
                    </div>
                )}

                {mapsError && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                        <p className="text-red-700">
                            Maps error: {mapsError}
                        </p>
                    </div>
                )}
            </div>

            {/* Temporary suggestions modal */}
            {showSuggestions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Suggestions Modal</h3>
                        <p className="text-gray-600 mb-4">
                            TripAdvisor suggestions modal will be implemented next
                        </p>
                        <button
                            onClick={() => setShowSuggestions(false)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;