import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastProvider';
import toast from 'react-hot-toast';

// Create a context to hold session storage data
const LocationContext = createContext();

// Custom hook to access session storage context
export const useLocationContext = () => {
    return useContext(LocationContext);
};

// Provider component to wrap around the app
export const LocationContextProvider = ({ children }) => {
    const [position, setPosition] = useState(null);
    const [isPermissionGranted, setIsPermissionGranted] = useState(null);
    const [pincode, setPincode] = useState(null);  // State to store the pincode
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        const style = {
            border: '1px solid #fff',
            padding: '16px',
            color: '#713200',
        }
        const iconTheme = {
            primary: '#000',
            secondary: '#fff',
        };
        const ariaProps = {
            role: 'status',
            'aria-live': 'polite',
        };
        const removeDelay = 500;
        const appearDuratin = 1000;
        const position = 'top-center'
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "success":
                    toast.success(message,{
                        duration: appearDuratin,
                        position: position,
                      
                        // Styling
                        style: style,
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: iconTheme,
                      
                        // Aria
                        ariaProps: ariaProps,
                      
                        // Additional Configuration
                        removeDelay: removeDelay,
                    })
                    break;
                default:
                    toast.error(message,{
                        duration: appearDuratin,
                        position: position,
                      
                        // Styling
                        style: style,
                        // Change colors of success/error/loading icon
                        iconTheme: iconTheme,
                      
                        // Aria
                        ariaProps: ariaProps,
                      
                        // Additional Configuration
                        removeDelay: removeDelay,
                    })
                break;
            }
            showToast(message);
        }
    }
    // Function to request geolocation permission and get position
    const requestGeolocationPermission = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (success) => {
                    const { latitude, longitude } = success.coords;
                    setPosition([latitude, longitude]);
                    setIsPermissionGranted(true); // Mark permission as granted
                    fetchPincode(latitude, longitude);  // Fetch pincode after getting position
                    checkAndCreateToast("success", "Location permission granted");
                },
                (err) => {
                    // Handle error (e.g., user denied permission)
                    if (err.code === err.PERMISSION_DENIED) {
                        setIsPermissionGranted(false); // Mark permission as denied
                        checkAndCreateToast("error","Unable to retrieve location. Please enable location services.");
                    } else {
                        checkAndCreateToast("error","Please enable location services.");
                    }
                    console.log("GeoLocation Error: ",err);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            checkAndCreateToast("error","Geolocation is not available in this browser.");
        }
    };

    // Function to fetch pincode using reverse geocoding (OpenStreetMap API)
    const fetchPincode = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            // console.log("Data is Not Set Pincode: ",data);
            if (data && data.address && data.address.postcode) {
                setPincode(data.address.postcode);  // Set the pincode state
            } else {
                checkAndCreateToast("success","Pincode could not be retrieved.");
            }
        } catch (error) {
            console.error("Error fetching pincode:", error);
            checkAndCreateToast("error","An error occurred while retrieving the pincode.");
        }
    };

    // Check the current permission status using the Permissions API
    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
                if (permissionStatus.state === "granted") {
                    setIsPermissionGranted(true);
                    requestGeolocationPermission();  // If permission granted previously, fetch position
                } else if (permissionStatus.state === "denied") {
                    setIsPermissionGranted(false);
                    checkAndCreateToast("error","Geolocation permission denied");
                } else {
                    requestGeolocationPermission();  // If permission undetermined, request it
                }
            });
        } else {
            requestGeolocationPermission();  // If Permissions API is not supported, just request geolocation permission
        }
    }, []);
    return (
        <LocationContext.Provider value={{position,isPermissionGranted,pincode}}>
            {children}
        </LocationContext.Provider>
    );
};