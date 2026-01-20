import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useRef, Fragment } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

const DraggableImageSlider = ({
  images,
  headers,
  showArrows = true,
  bannerLoading,
}) => {
  const navigation = useNavigate();
  const sliderRef = useRef(null);

  // State to handle dragging and touch events
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startTouchX: 0,
    scrollLeft: 0,
  });

  // Mouse Down, Mouse Move, Mouse Up Handlers
  const handleMouseDown = (e) => {
    setDragState((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.clientX,
      scrollLeft: sliderRef.current.scrollLeft,
    }));
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging) return;
    const moveX = e.clientX - dragState.startX;
    sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
  };

  const handleMouseUp = () =>
    setDragState((prev) => ({ ...prev, isDragging: false }));
  const handleMouseLeave = () =>
    setDragState((prev) => ({ ...prev, isDragging: false }));

  // Touch Start, Touch Move, Touch End Handlers
  const handleTouchStart = (e) => {
    setDragState((prev) => ({
      ...prev,
      isDragging: true,
      startTouchX: e.touches[0].clientX,
      scrollLeft: sliderRef.current.scrollLeft,
    }));
  };

  const handleTouchMove = (e) => {
    if (!dragState.isDragging) return;
    const moveX = e.touches[0].clientX - dragState.startTouchX;
    sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
  };

  const handleTouchEnd = () =>
    setDragState((prev) => ({ ...prev, isDragging: false }));

  // Prevent dragging the image itself
  const handleDragStart = (e) => e.preventDefault();

  // Handle image click navigation only when not dragging
  const handleImageClick = (e) => {
    e.preventDefault();
    if (!dragState.isDragging) {
      navigation("/products");
    }
  };

  // Scroll functionality for left and right arrows
  const scroll = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = 400; // Amount to scroll with each button click
    slider.scrollTo({
      left: slider.scrollLeft + direction * scrollAmount,
      behavior: "smooth", // This makes the scroll smooth
    });
  };
  if (!images || images.length <= 0) return null;
  return (
    <div className="w-full max-w-screen-2xl mx-auto justify-self-center py-12">
      <div className="grid grid-cols-1 min-h-[200px] relative px-2 sm:px-4 md:px-14">
        {headers && (
          <div className="flex items-end justify-between mb-12 border-b border-white/20 pb-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 uppercase">
                {headers}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-[0.15em] hidden sm:block backdrop-blur-md bg-white/30 px-4 py-2 rounded-full border border-white/20">
              Collection
            </span>
          </div>
        )}

        <div className="relative w-full group">
          {/* Left and Right Arrow Buttons */}
          {showArrows && !bannerLoading && (
            <Fragment>
              <button
                onClick={() => scroll(-1)}
                className="absolute -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 backdrop-blur-md bg-white/30 border border-white/30 shadow-2xl rounded-2xl text-gray-900 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-white/50 active:scale-95 disabled:opacity-0"
                aria-label="Scroll left"
              >
                <ChevronLeft size={28} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scroll(1)}
                className="absolute -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 backdrop-blur-md bg-white/30 border border-white/30 shadow-2xl rounded-2xl text-gray-900 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-white/50 active:scale-95 disabled:opacity-0"
                aria-label="Scroll right"
              >
                <ChevronRight size={28} strokeWidth={1.5} />
              </button>
            </Fragment>
          )}

          {/* Slider Container */}
          <div className="w-full overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-3 sm:p-6">
            <ul
              ref={sliderRef}
              className="flex flex-row gap-4 sm:gap-6 md:gap-8 overflow-x-scroll scrollbar-hide pb-4 pt-2"
              style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {bannerLoading
                ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`skeleton_${index}`}
                      className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[340px] h-[420px] bg-gradient-to-br from-gray-100/60 to-gray-200/60 rounded-2xl animate-pulse backdrop-blur-md border border-white/20"
                    />
                  ))
                : images.map((image, index) => (
                  <li
                    key={`banner_${index}`}
                    onClick={handleImageClick}
                    className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[340px] relative group/card cursor-pointer"
                  >
                    <div className="overflow-hidden rounded-2xl backdrop-blur-md bg-white/30 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
                      <LazyLoadImage
                        effect="blur"
                        useIntersectionObserver
                        wrapperProps={{ style: { transitionDelay: "0.2s" } }}
                        placeholder={
                          <div className="w-full h-[420px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                        }
                        src={image}
                        alt={headers || "Collection Item"}
                        className="w-full h-[420px] object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                        onDragStart={handleDragStart}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/20 group-hover/card:from-black/5 group-hover/card:to-black/30 transition-all duration-500" />

                      {/* Hover overlay with modern design */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-6 py-3">
                          <span className="text-white text-sm font-bold tracking-wider uppercase">
                            View Collection
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableImageSlider;
