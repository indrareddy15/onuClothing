import { Button } from '@/components/ui/button';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const Carousel = ({ featuresList, setCurrentSlide, currentSlide }) => {
    const handleSwipe = (direction) => {
        if (direction === 'left') {
            setCurrentSlide((prev) => (prev + 1) % featuresList.length);
        } else if (direction === 'right') {
            setCurrentSlide((prev) => (prev - 1 + featuresList.length) % featuresList.length);
        }
    };

    // Swipeable handlers configuration
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            console.log('Swiped Left');  // Debugging swipe left
            handleSwipe('left');
        },
        onSwipedRight: () => {
            console.log('Swiped Right');  // Debugging swipe right
            handleSwipe('right');
        },
        trackMouse: true, // Enables swipe support with a mouse
        preventDefaultTouchmoveEvent: true, // Prevent touchmove for mobile devices (optional)
        // onSwiping: (eventData) => console.log('Swiping...', eventData),  // Debugging swiping
    });
    return (
        <div
            {...swipeHandlers}  // Attach swipe handlers here
            className="relative w-full max-w-[90%] h-[600px] mx-auto flex items-center justify-center overflow-hidden"
        >
            {/* Carousel Slides */}
            {featuresList && featuresList.length > 0 && featuresList.map((slide, index) => (
                <img
                    key={index}
                    src={slide?.image}
                    alt={`Slide ${index + 1}`}
                    draggable={false}
                    className={`cursor-grab absolute top-0 left-0 w-full h-full object-cover rounded-[30px] transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        } hover:scale-110 transform transition-transform `}
                />
            ))}

            {/* Left Navigation Button */}
            <Button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + featuresList.length) % featuresList.length)}
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center"
            >
                <ChevronsLeftIcon className="w-6 h-6" />
            </Button>

            {/* Right Navigation Button */}
            <Button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % featuresList.length)}
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center"
            >
                <ChevronsRightIcon className="w-6 h-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 flex space-x-2">
                {featuresList.map((_, dotIndex) => (
                    <div
                        key={dotIndex}
                        onClick={() => setCurrentSlide(dotIndex)}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${currentSlide === dotIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
