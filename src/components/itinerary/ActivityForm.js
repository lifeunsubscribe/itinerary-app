import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';
import { Icons } from '../common/Icons';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const ActivityForm = ({ onAddActivity, locationInputRef }) => {
    const [formData, setFormData] = useState({
        title: '',
        time: '',
        location: '',
        description: '',
        date: ''
    });

    const { isLoaded: mapsLoaded, createAutocomplete } = useGoogleMaps();
    const autocompleteRef = useRef(null);

    // Initialize autocomplete when maps are loaded
    useEffect(() => {
        if (mapsLoaded && locationInputRef?.current && !autocompleteRef.current) {
            try {
                const autocomplete = createAutocomplete(locationInputRef.current, {
                    fields: ['formatted_address', 'geometry', 'name']
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place && place.formatted_address) {
                        setFormData(prev => ({
                            ...prev,
                            location: place.formatted_address
                        }));
                    }
                });

                autocompleteRef.current = autocomplete;
            } catch (error) {
                console.warn('Failed to initialize autocomplete:', error);
            }
        }
    }, [mapsLoaded, locationInputRef, createAutocomplete]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date) return;

        onAddActivity(formData);
        setFormData({
            title: '',
            time: '',
            location: '',
            description: '',
            date: ''
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Activity</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Activity title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        ref={locationInputRef}
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2 mb-4"
                    rows={3}
                />
                <Button
                    type="submit"
                    disabled={!formData.title || !formData.date}
                    className="flex items-center gap-2"
                >
                    <Icons.Plus className="w-4 h-4" />
                    Add Activity
                </Button>
            </form>
        </div>
    );
};

export default ActivityForm;