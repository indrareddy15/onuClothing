import React from 'react';

/**
 * LoadingSpinner Component
 * Modern loading spinner following newCode design system
 * Uses Tailwind CSS design tokens and smooth animations
 */
const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="flex flex-col justify-center items-center space-y-4">
                {/* Modern spinner with smooth animation */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
                </div>

                {/* Optional loading text */}
                <p className="text-sm text-gray-600 font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
