// COMMENTED OUT: Developer tools restriction for development
// import { inProduction } from "@/config";
import { createContext, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


// Create the context
const SettingContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
    const { toast } = useToast();

    const checkAndCreateToast = (type, message, closeTime = 1000) => {
        // console.log("Log type: ", type, "message: ", message,);
        let variant = "default";
        if (type === "error") variant = "destructive";

        toast({
            variant: variant,
            title: message,
            duration: closeTime,
        });
    }

    useEffect(() => {
        // COMMENTED OUT: Developer tools restriction for development
        // if(inProduction){
        //     document.addEventListener('contextmenu', (e) => e.preventDefault());
        //     return () => {
        //         document.removeEventListener('contextmenu', (e) => e.preventDefault());
        //     };
        // }
    }, []);

    useEffect(() => {
        // COMMENTED OUT: Developer tools restriction for development
        // if(inProduction){
        //     const handleKeyPress = (event) => {
        //         if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        //             event.preventDefault();
        //             checkAndCreateToast("info",'Opening Developer Tools is not allowed!');
        //         }
        //     };
        //     
        //     window.addEventListener('keydown', handleKeyPress);
        //     
        //     return () => {
        //         window.removeEventListener('keydown', handleKeyPress);
        //     };
        // }
    }, []);

    return (
        <SettingContext.Provider value={{ checkAndCreateToast }}>
            {children}
        </SettingContext.Provider>
    );
};

export const useSettingsContext = () => {
    return useContext(SettingContext);
};
