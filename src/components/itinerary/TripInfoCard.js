import React from 'react';
import { Icons } from '../common/Icons';
import GoogleMap from '../maps/GoogleMap';

const TripInfoCard = ({ itinerary, showMap }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Icons.MapPin className="w-4 h-4" />
                        <span>{itinerary.destination}</span>
                    </div>
                    {itinerary.startDate && itinerary.endDate && (
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Icons.Calendar className="w-4 h-4" />
                            <span>
                                {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {itinerary.guestCount && (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Icons.Users className="w-4 h-4" />
                            <span>{itinerary.guestCount} guest{itinerary.guestCount > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
                {itinerary.collaborators && itinerary.collaborators.length > 0 && (
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Shared with:</p>
                        {itinerary.collaborators.slice(0, 3).map(email => (
                            <p key={email} className="text-xs text-gray-500">{email}</p>
                        ))}
                        {itinerary.collaborators.length > 3 && (
                            <p className="text-xs text-gray-500">+{itinerary.collaborators.length - 3} more</p>
                        )}
                    </div>
                )}
            </div>

            {showMap && (
                <div className="mt-6">
                    <GoogleMap
                        activities={itinerary.activities}
                        destination={itinerary.destination}
                    />
                </div>
            )}
        </div>
    );
};

export default TripInfoCard;