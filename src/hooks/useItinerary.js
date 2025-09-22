import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { sortActivitiesByDateTime } from '../utils/dateUtils';
import { getDestinationImage } from '../data/destinations';

export const useItinerary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [currentItinerary, setCurrentItinerary] = useState(null);

    // Load itineraries from storage on mount
    useEffect(() => {
        const savedItineraries = storageService.loadItineraries();
        setItineraries(savedItineraries);
    }, []);

    // Save itineraries to storage whenever they change
    useEffect(() => {
        storageService.saveItineraries(itineraries);
    }, [itineraries]);

    // Create new itinerary
    const createItinerary = useCallback((itineraryData) => {
        const newItinerary = {
            id: Date.now(),
            title: itineraryData.title || `Trip to ${itineraryData.destination.split(',')[0]}`,
            destination: itineraryData.destination,
            startDate: itineraryData.startDate,
            endDate: itineraryData.endDate,
            guestCount: itineraryData.guestCount || 1,
            collaborators: itineraryData.collaborators || [],
            activities: [],
            image: getDestinationImage(itineraryData.destination),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setItineraries(prev => [...prev, newItinerary]);
        setCurrentItinerary(newItinerary);
        return newItinerary;
    }, []);

    // Update itinerary
    const updateItinerary = useCallback((itineraryId, updates) => {
        const updatedItinerary = {
            ...currentItinerary,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        setCurrentItinerary(updatedItinerary);
        setItineraries(prev =>
            prev.map(it => it.id === itineraryId ? updatedItinerary : it)
        );
        return updatedItinerary;
    }, [currentItinerary]);

    // Delete itinerary
    const deleteItinerary = useCallback((itineraryId) => {
        setItineraries(prev => prev.filter(it => it.id !== itineraryId));
        if (currentItinerary && currentItinerary.id === itineraryId) {
            setCurrentItinerary(null);
        }
    }, [currentItinerary]);

    // Add activity
    const addActivity = useCallback((activityData) => {
        if (!currentItinerary) return null;

        const newActivity = {
            id: Date.now(),
            ...activityData,
            source: activityData.source || 'manual',
            createdAt: new Date().toISOString()
        };

        const updatedActivities = sortActivitiesByDateTime([
            ...currentItinerary.activities,
            newActivity
        ]);

        const updatedItinerary = {
            ...currentItinerary,
            activities: updatedActivities,
            updatedAt: new Date().toISOString()
        };

        setCurrentItinerary(updatedItinerary);
        setItineraries(prev =>
            prev.map(it => it.id === currentItinerary.id ? updatedItinerary : it)
        );

        return newActivity;
    }, [currentItinerary]);

    // Update activity
    const updateActivity = useCallback((activityId, updates) => {
        if (!currentItinerary) return null;

        const updatedActivities = currentItinerary.activities.map(activity =>
            activity.id === activityId
                ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
                : activity
        );

        const sortedActivities = sortActivitiesByDateTime(updatedActivities);

        const updatedItinerary = {
            ...currentItinerary,
            activities: sortedActivities,
            updatedAt: new Date().toISOString()
        };

        setCurrentItinerary(updatedItinerary);
        setItineraries(prev =>
            prev.map(it => it.id === currentItinerary.id ? updatedItinerary : it)
        );

        return updatedActivities.find(a => a.id === activityId);
    }, [currentItinerary]);

    // Delete activity
    const deleteActivity = useCallback((activityId) => {
        if (!currentItinerary) return;

        const updatedActivities = currentItinerary.activities.filter(
            activity => activity.id !== activityId
        );

        const updatedItinerary = {
            ...currentItinerary,
            activities: updatedActivities,
            updatedAt: new Date().toISOString()
        };

        setCurrentItinerary(updatedItinerary);
        setItineraries(prev =>
            prev.map(it => it.id === currentItinerary.id ? updatedItinerary : it)
        );
    }, [currentItinerary]);

    // Add collaborator
    const addCollaborator = useCallback((email) => {
        if (!currentItinerary || currentItinerary.collaborators.includes(email)) {
            return false;
        }

        const updatedCollaborators = [...currentItinerary.collaborators, email];
        updateItinerary(currentItinerary.id, { collaborators: updatedCollaborators });
        return true;
    }, [currentItinerary, updateItinerary]);

    // Remove collaborator
    const removeCollaborator = useCallback((email) => {
        if (!currentItinerary) return;

        const updatedCollaborators = currentItinerary.collaborators.filter(
            c => c !== email
        );
        updateItinerary(currentItinerary.id, { collaborators: updatedCollaborators });
    }, [currentItinerary, updateItinerary]);

    return {
        itineraries,
        currentItinerary,
        setCurrentItinerary,
        createItinerary,
        updateItinerary,
        deleteItinerary,
        addActivity,
        updateActivity,
        deleteActivity,
        addCollaborator,
        removeCollaborator
    };
};