import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from './ToastProvider';
import toast from 'react-hot-toast';
import { inProduction } from '../config';

// Create the context
const SettingContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type, message, appearDuration = 1000) => {
		const style = {
			border: '1px solid #fff',
			padding: '16px',
			color: '#ffffff',  // Make text white for better contrast
			backgroundColor: '#333',  // Darker background color
		}
		
		const iconTheme = {
			primary: '#fff',  // White icon color
			secondary: '#000',  // Dark secondary icon color
		};
		
		const ariaProps = {
			role: 'status',
			'aria-live': 'polite',
		};
		
		const removeDelay = 500;
		const position = 'top-center';

		if (!activeToast) {
			switch (type) {
				case "success":
					toast.success(message, {
						duration: appearDuration,
						position: position,
						style: style,
						iconTheme: iconTheme,
						ariaProps: ariaProps,
						removeDelay: removeDelay,
					});
					break;
				default:
					toast.error(message, {
						duration: appearDuration,
						position: position,
						style: style,
						iconTheme: iconTheme,
						ariaProps: ariaProps,
						removeDelay: removeDelay,
					});
					break;
			}
			showToast(message);
		}
	}

    
    useEffect(() => {
        if(inProduction){
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            return () => {
                document.removeEventListener('contextmenu', (e) => e.preventDefault());
            };
        }
    }, []);
    
    useEffect(() => {
        if(inProduction){
            const handleKeyPress = (event) => {
                if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                    event.preventDefault();
                    checkAndCreateToast("error",'Opening Developer Tools is not allowed!');
                }
            };
            
            window.addEventListener('keydown', handleKeyPress);
            
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, []);

    return (
        <SettingContext.Provider value={{ checkAndCreateToast}}>
            {children}
        </SettingContext.Provider>
    );
};

// Custom hook to use the Settings context
export const useSettingsContext = () => {
    return useContext(SettingContext);
};
