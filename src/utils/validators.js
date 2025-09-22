// Form validation utilities

export const validators = {
    // Required field validation
    required: (value, fieldName = 'Field') => {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            return `${fieldName} is required`;
        }
        return null;
    },

    // Email validation
    email: (value) => {
        if (!value) return null; // Allow empty if not required
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },

    // Date validation
    date: (value, fieldName = 'Date') => {
        if (!value) return null;
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return `Please enter a valid ${fieldName.toLowerCase()}`;
        }
        return null;
    },

    // Date range validation
    dateRange: (startDate, endDate) => {
        if (!startDate || !endDate) return null;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return 'End date must be after start date';
        }
        return null;
    },

    // Future date validation
    futureDate: (value, fieldName = 'Date') => {
        if (!value) return null;
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            return `${fieldName} cannot be in the past`;
        }
        return null;
    },

    // String length validation
    length: (value, min = 0, max = Infinity, fieldName = 'Field') => {
        if (!value) return null;
        const length = value.toString().length;

        if (length < min) {
            return `${fieldName} must be at least ${min} characters long`;
        }
        if (length > max) {
            return `${fieldName} must be no more than ${max} characters long`;
        }
        return null;
    },

    // Number validation
    number: (value, fieldName = 'Number') => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) {
            return `${fieldName} must be a valid number`;
        }
        return null;
    },

    // Positive number validation
    positiveNumber: (value, fieldName = 'Number') => {
        const numberError = validators.number(value, fieldName);
        if (numberError) return numberError;

        if (Number(value) <= 0) {
            return `${fieldName} must be greater than 0`;
        }
        return null;
    },

    // URL validation
    url: (value, fieldName = 'URL') => {
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return `Please enter a valid ${fieldName.toLowerCase()}`;
        }
    }
};

// Validate multiple fields
export const validateForm = (fields) => {
    const errors = {};
    let isValid = true;

    Object.entries(fields).forEach(([fieldName, validations]) => {
        for (const validation of validations) {
            const error = validation();
            if (error) {
                errors[fieldName] = error;
                isValid = false;
                break; // Stop at first error for this field
            }
        }
    });

    return { errors, isValid };
};