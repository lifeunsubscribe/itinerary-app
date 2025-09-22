import React from 'react';
import {
    Plus,
    MapPin,
    Clock,
    Calendar,
    Trash2,
    Edit3,
    Save,
    X,
    Map,
    Search,
    Star,
    Filter,
    Image,
    Users,
    Share,
    Heart,
    ChevronLeft,
    ChevronRight,
    Loader
} from 'lucide-react';

// Icon wrapper component for consistent styling
const IconWrapper = ({ children, className = "w-4 h-4", ...props }) => {
    return React.cloneElement(children, { className, ...props });
};

// Export all icons we use in the app
export const Icons = {
    Plus: (props) => <IconWrapper {...props}><Plus /></IconWrapper>,
    MapPin: (props) => <IconWrapper {...props}><MapPin /></IconWrapper>,
    Clock: (props) => <IconWrapper {...props}><Clock /></IconWrapper>,
    Calendar: (props) => <IconWrapper {...props}><Calendar /></IconWrapper>,
    Trash2: (props) => <IconWrapper {...props}><Trash2 /></IconWrapper>,
    Edit3: (props) => <IconWrapper {...props}><Edit3 /></IconWrapper>,
    Save: (props) => <IconWrapper {...props}><Save /></IconWrapper>,
    X: (props) => <IconWrapper {...props}><X /></IconWrapper>,
    Map: (props) => <IconWrapper {...props}><Map /></IconWrapper>,
    Search: (props) => <IconWrapper {...props}><Search /></IconWrapper>,
    Star: (props) => <IconWrapper {...props}><Star /></IconWrapper>,
    Filter: (props) => <IconWrapper {...props}><Filter /></IconWrapper>,
    Image: (props) => <IconWrapper {...props}><Image /></IconWrapper>,
    Users: (props) => <IconWrapper {...props}><Users /></IconWrapper>,
    Share: (props) => <IconWrapper {...props}><Share /></IconWrapper>,
    Heart: (props) => <IconWrapper {...props}><Heart /></IconWrapper>,
    ChevronLeft: (props) => <IconWrapper {...props}><ChevronLeft /></IconWrapper>,
    ChevronRight: (props) => <IconWrapper {...props}><ChevronRight /></IconWrapper>,
    Loading: (props) => <IconWrapper className="w-4 h-4 animate-spin" {...props}><Loader /></IconWrapper>
};