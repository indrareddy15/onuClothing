import React, { createContext, useState, useContext } from 'react';

// Create the context
const ToastContext = createContext();

// Provider component
export const ToastProvider = ({ children }) => {
    const [activeToast, setActiveToast] = useState(null);

    const showToast = (message) => {
        // Prevent showing the toast if the message is already active
        if (activeToast === message) {
            return;
        }

        setActiveToast(message);
        // Reset activeToast after a certain time to allow new toasts
        setTimeout(() => {
            setActiveToast(null);
        }, 5000); // 5 seconds duration for toast visibility
    };

    return (
        <ToastContext.Provider value={{ activeToast, showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast context
export const useToast = () => {
    return useContext(ToastContext);
};
