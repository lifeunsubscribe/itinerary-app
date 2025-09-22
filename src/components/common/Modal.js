import React, { useEffect } from 'react';
import { Icons } from './Icons';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
    showCloseButton = true,
    closeOnOverlayClick = true
}) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div className={`bg-white rounded-2xl p-0 ${maxWidth} w-full max-h-[90vh] overflow-y-auto fade-in`}>
                {(title || showCloseButton) && (
                    <div className="flex justify-between items-center p-6 border-b">
                        {title && <h2 className="text-2xl font-semibold">{title}</h2>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl p-1"
                            >
                                <Icons.X className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;