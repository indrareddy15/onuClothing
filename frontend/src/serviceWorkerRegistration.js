// src/serviceWorkerRegistration.js
// This is the file that registers your service worker

// This is the recommended way to register your service worker in React.
// See: https://bit.ly/CRA-PWA
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname === '127.0.0.1'
  );
  
export function register() {
    if (process.env.NODE_ENV === 'production') {
        // The URL is relative to the root of the app
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // Ensure service worker won't try to cache files that are served from a different origin.
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl);
            } else {
                // Register the service worker for production build
                registerValidSW(swUrl);
            }
        });
    }
}

function registerValidSW(swUrl) {
    navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('Service Worker registered: ', registration);
    }).catch((error) => {
        console.error('Error during service worker registration:', error);
    });
}
  
function checkValidServiceWorker(swUrl) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl).then((response) => {
        if (
            response.status === 404 ||
            response.headers.get('content-type').indexOf('javascript') === -1
        ) {
            // No service worker found. Probably a different app. Reload the page.
            navigator.serviceWorker.ready.then((registration) => {
                registration.unregister().then(() => {
                    window.location.reload();
                });
            });
        } else {
            // Service worker found. Proceed with registration.
            registerValidSW(swUrl);
        }
    })
    .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
    });
}
  