import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export const Carousel = React.forwardRef(({
    children,
    className = '',
    autoSlide = false,
    autoSlideInterval = 5000,
    showIndicators = true,
    showNavigation = true,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
    ...props
}, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoSlide);
    const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

    const childrenArray = React.Children.toArray(children);
    const totalItems = childrenArray.length;

    // Calculate max slides based on items to show
    const maxSlides = Math.max(0, totalItems - itemsToShow);

    // Update items to show based on screen size
    useEffect(() => {
        const updateItemsToShow = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsToShow(itemsPerView.mobile);
            } else if (width < 1024) {
                setItemsToShow(itemsPerView.tablet);
            } else {
                setItemsToShow(itemsPerView.desktop);
            }
        };

        updateItemsToShow();
        window.addEventListener('resize', updateItemsToShow);
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, [itemsPerView]);

    // Auto slide functionality
    useEffect(() => {
        if (!isAutoPlaying || totalItems <= itemsToShow) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev >= maxSlides ? 0 : prev + 1));
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [isAutoPlaying, autoSlideInterval, maxSlides, totalItems, itemsToShow]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(Math.min(Math.max(0, index), maxSlides));
    }, [maxSlides]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex(prev => prev <= 0 ? maxSlides : prev - 1);
    }, [maxSlides]);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => prev >= maxSlides ? 0 : prev + 1);
    }, [maxSlides]);

    // Handle mouse enter/leave for auto-play
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(autoSlide);

    // Calculate transform based on current index
    const getTransform = () => {
        const itemWidth = 100 / itemsToShow;
        return `translateX(-${currentIndex * itemWidth}%)`;
    };

    // Don't render navigation/indicators if all items are visible
    const showControls = totalItems > itemsToShow;

    if (totalItems === 0) return null;

    return (
        <div
            ref={ref}
            className={`relative w-full ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {/* Navigation Buttons */}
            {showNavigation && showControls && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200 hidden sm:flex"
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200 hidden sm:flex"
                        onClick={goToNext}
                        disabled={currentIndex === maxSlides}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </>
            )}

            {/* Carousel Content */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out -mx-3"
                    style={{ transform: getTransform() }}
                >
                    {childrenArray.map((child, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 px-3"
                            style={{
                                width: `${100 / itemsToShow}%`,
                                minWidth: 0 // Prevent flex items from overflowing
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicators */}
            {showIndicators && showControls && (
                <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: maxSlides + 1 }, (_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentIndex
                                    ? 'bg-gray-900'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Mobile Navigation Buttons */}
            {showNavigation && showControls && (
                <div className="flex justify-center space-x-4 mt-4 sm:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNext}
                        disabled={currentIndex === maxSlides}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
});

Carousel.displayName = 'Carousel';

// Individual carousel item wrapper
export const CarouselItem = React.forwardRef(({
    children,
    className = '',
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={`w-full ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

CarouselItem.displayName = 'CarouselItem';