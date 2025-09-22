import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Icons } from '../common/Icons';
import { POPULAR_DESTINATIONS } from '../../data/destinations';
import { formatDateRange, getDaysInMonth, getFirstDayOfMonth, isDateInRange, isPastDate } from '../../utils/dateUtils';

const NewItineraryModal = ({ isOpen, onClose, onCreateItinerary }) => {
    const [currentStep, setCurrentStep] = useState('destination');
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [guestCount, setGuestCount] = useState(1);
    const [collaborators, setCollaborators] = useState([]);
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        destination: ''
    });

    const resetForm = () => {
        setCurrentStep('destination');
        setSelectedDates({ start: null, end: null });
        setGuestCount(1);
        setCollaborators([]);
        setNewCollaboratorEmail('');
        setFormData({ title: '', destination: '' });
        setCalendarMonth(new Date());
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleDestinationSelect = (destination) => {
        setFormData(prev => ({ ...prev, destination }));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);

        if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
            setSelectedDates({ start: clickedDate, end: null });
        } else if (clickedDate < selectedDates.start) {
            setSelectedDates({ start: clickedDate, end: selectedDates.start });
        } else {
            setSelectedDates({ ...selectedDates, end: clickedDate });
        }
    };

    const addCollaborator = () => {
        if (newCollaboratorEmail && !collaborators.includes(newCollaboratorEmail)) {
            setCollaborators([...collaborators, newCollaboratorEmail]);
            setNewCollaboratorEmail('');
        }
    };

    const removeCollaborator = (email) => {
        setCollaborators(collaborators.filter(c => c !== email));
    };

    const handleCreateTrip = () => {
        const tripData = {
            title: formData.title || `Trip to ${formData.destination.split(',')[0]}`,
            destination: formData.destination,
            startDate: selectedDates.start ? selectedDates.start.toISOString().split('T')[0] : '',
            endDate: selectedDates.end ? selectedDates.end.toISOString().split('T')[0] : '',
            guestCount,
            collaborators
        };

        onCreateItinerary(tripData);
        handleClose();
    };

    const canGoNext = () => {
        switch (currentStep) {
            case 'destination':
                return formData.destination.length > 0;
            case 'dates':
                return selectedDates.start !== null;
            case 'guests':
                return true;
            case 'sharing':
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep === 'destination' && canGoNext()) setCurrentStep('dates');
        else if (currentStep === 'dates' && canGoNext()) setCurrentStep('guests');
        else if (currentStep === 'guests') setCurrentStep('sharing');
        else if (currentStep === 'sharing') handleCreateTrip();
    };

    const handleBack = () => {
        if (currentStep === 'dates') setCurrentStep('destination');
        else if (currentStep === 'guests') setCurrentStep('dates');
        else if (currentStep === 'sharing') setCurrentStep('guests');
        else handleClose();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(calendarMonth);
        const firstDay = getFirstDayOfMonth(calendarMonth);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
            const isSelected = (selectedDates.start && date.getTime() === selectedDates.start.getTime()) ||
                (selectedDates.end && date.getTime() === selectedDates.end.getTime());
            const isInRange = isDateInRange(date, selectedDates.start, selectedDates.end);
            const isPast = isPastDate(date);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isPast ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={isPast ? null : () => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 'destination': return 'Where to?';
            case 'dates': return 'When?';
            case 'guests': return "Who's coming?";
            case 'sharing': return 'Share your trip';
            default: return 'Create Trip';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'destination':
                return (
                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder="Search destinations"
                            value={formData.destination}
                            onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                            className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {POPULAR_DESTINATIONS.map(dest => (
                                <div
                                    key={dest.name}
                                    onClick={() => handleDestinationSelect(dest.name)}
                                    className="destination-card cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
                                >
                                    <div className="relative h-32">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute bottom-2 left-2 text-white">
                                            <p className="font-semibold text-sm">{dest.name.split(',')[0]}</p>
                                            <p className="text-xs opacity-90">{dest.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'dates':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <Icons.ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-lg font-semibold">
                                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <Icons.ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <div key={index} className="p-2 text-center font-medium text-gray-500">
                                    {day.charAt(0)}
                                </div>
                            ))}
                            {renderCalendar()}
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Selected dates: {formatDateRange(selectedDates.start, selectedDates.end)}
                            </p>
                        </div>
                    </div>
                );

            case 'guests':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                                <h4 className="font-medium">Guests</h4>
                                <p className="text-sm text-gray-500">Ages 13 or above</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                >
                                    -
                                </button>
                                <span className="min-w-[2rem] text-center">{guestCount}</span>
                                <button
                                    onClick={() => setGuestCount(guestCount + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'sharing':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trip Title (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder={`Trip to ${formData.destination.split(',')[0]}`}
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invite Collaborators
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={newCollaboratorEmail}
                                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && addCollaborator()}
                                />
                                <Button onClick={addCollaborator} variant="secondary">
                                    Add
                                </Button>
                            </div>
                            {collaborators.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Collaborators:</p>
                                    {collaborators.map(email => (
                                        <div
                                            key={email}
                                            className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                                        >
                                            <span className="text-sm">{email}</span>
                                            <button
                                                onClick={() => removeCollaborator(email)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Trip Summary</h4>
                            <p className="text-sm text-blue-700">Destination: {formData.destination}</p>
                            {selectedDates.start && (
                                <p className="text-sm text-blue-700">
                                    Dates: {formatDateRange(selectedDates.start, selectedDates.end)}
                                </p>
                            )}
                            <p className="text-sm text-blue-700">Guests: {guestCount}</p>
                            {collaborators.length > 0 && (
                                <p className="text-sm text-blue-700">Collaborators: {collaborators.length}</p>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={getStepTitle()}
            maxWidth="max-w-2xl"
        >
            <div className="min-h-[400px]">
                {renderStepContent()}
            </div>

            <div className="flex justify-between items-center pt-6 border-t mt-6">
                <Button onClick={handleBack} variant="ghost">
                    {currentStep === 'destination' ? 'Cancel' : 'Back'}
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    variant="primary"
                >
                    {currentStep === 'sharing' ? 'Create Trip' : 'Next'}
                </Button>
            </div>
        </Modal>
    );
};

export default NewItineraryModal;