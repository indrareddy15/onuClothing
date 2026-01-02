import React, { Fragment, useEffect, useState } from 'react'
import { Download } from 'lucide-react';
const PwaSetup = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault(); // Prevent the default install prompt
            setDeferredPrompt(event); // Store the event for later
        };

        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Listen for the 'beforeinstallprompt' event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Function to handle the install button click
    const handleInstallClick = () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                setDeferredPrompt(null); // Reset the deferred prompt
            });
        }
    };
    return (
        <Fragment>
            {/* Show the install button only if the app is not already installed */}
            {!isInstalled && deferredPrompt && (
                <button
                    className="w-full px-6 py-3 mb-4 flex justify-center items-center gap-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-900 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    onClick={handleInstallClick}
                    aria-label="Install app to home screen"
                >
                    <Download size={20} />
                    <span className="text-sm font-medium tracking-wide uppercase">Install App</span>
                </button>
            )}
        </Fragment>
    );
};

export default PwaSetup
