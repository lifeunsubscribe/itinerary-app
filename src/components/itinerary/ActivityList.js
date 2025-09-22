import React, { useState } from 'react';
import Button from '../common/Button';
import { Icons } from '../common/Icons';
import { formatDate, groupActivitiesByDate } from '../../utils/dateUtils';

const ActivityCard = ({ activity, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: activity.title,
        time: activity.time || '',
        location: activity.location || '',
        description: activity.description || ''
    });

    const handleSave = () => {
        onUpdate(activity.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            title: activity.title,
            time: activity.time || '',
            location: activity.location || '',
            description: activity.description || ''
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="time"
                        value={editData.time}
                        onChange={(e) => setEditData(prev => ({ ...prev, time: e.target.value }))}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={editData.location}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                />
                <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                        <Icons.Save className="w-3 h-3" />
                        Save
                    </Button>
                    <Button onClick={handleCancel} variant="secondary" size="sm">
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                    {activity.image && (
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-20 h-20 object-cover rounded-xl"
                        />
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">{activity.title}</h4>
                            {activity.source === 'tripadvisor' && (
                                <span className="activity-type-badge text-white text-xs px-2 py-1 rounded-full">
                                    TripAdvisor
                                </span>
                            )}
                            {activity.rating && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                    <Icons.Star className="w-3 h-3" />
                                    <span className="text-sm">{activity.rating}</span>
                                </div>
                            )}
                        </div>
                        {activity.time && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <Icons.Clock className="w-3 h-3" />
                                {activity.time}
                            </p>
                        )}
                        {activity.location && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <Icons.MapPin className="w-3 h-3" />
                                {activity.location}
                            </p>
                        )}
                        {activity.description && (
                            <p className="text-gray-700 mt-2 text-sm">
                                {activity.description.length > 200
                                    ? activity.description.substring(0, 200) + '...'
                                    : activity.description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                    >
                        <Icons.Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(activity.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                    >
                        <Icons.Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ActivityList = ({ activities, onUpdateActivity, onDeleteActivity, onShowSuggestions }) => {
    const activitiesByDate = groupActivitiesByDate(activities);

    if (Object.keys(activitiesByDate).length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Icons.MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No activities yet. Add your first activity or get suggestions!</p>
                <Button
                    onClick={onShowSuggestions}
                    className="flex items-center gap-2 mx-auto"
                >
                    <Icons.Search className="w-4 h-4" />
                    Get Suggestions
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {Object.keys(activitiesByDate).sort().map(date => (
                <div key={date} className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {formatDate(date)}
                    </h3>
                    <div className="space-y-4">
                        {activitiesByDate[date].map(activity => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onUpdate={onUpdateActivity}
                                onDelete={onDeleteActivity}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityList;