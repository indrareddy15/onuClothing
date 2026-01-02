import { ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const BackToTopButton = ({ scrollableDivRef }) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollToTop = () => {
        // Scroll the div or window to the top smoothly
        if (scrollableDivRef && scrollableDivRef.current) {
            scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollableDivRef && scrollableDivRef.current) {
                setScrollPosition(scrollableDivRef.current.scrollTop);
            } else {
                setScrollPosition(window.pageYOffset);
            }
        };

        if (scrollableDivRef && scrollableDivRef.current) {
            const divElement = scrollableDivRef.current;
            divElement.addEventListener('scroll', handleScroll);
            return () => divElement.removeEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [scrollableDivRef]);

    // console.log("Scroll position: ", scrollPosition);

    return (
        <div>
            {/* Back to Top Button */}
            <button
                className={`fixed z-[90] right-6 md:right-10 p-3 bg-black/80 backdrop-blur-sm text-white rounded-full shadow-xl transition-all duration-300 hover:bg-black hover:scale-110 hover:-translate-y-1 ${scrollPosition > 300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
				bottom-20 md:bottom-10`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <ChevronUp size={24} strokeWidth={1.5} />
            </button>
        </div>
    );

};

export default BackToTopButton;
