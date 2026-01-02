import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Ensure CSS is imported

const CarousalView = ({ b_banners, indicator, bannerLoading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Custom indicator style if not provided
  const customIndicator = (onClickHandler, isSelected, index, label) => {
    if (indicator) return indicator(onClickHandler, isSelected, index, label);
    return (
      <li
        className={`inline-block h-2 mx-2 rounded-full transition-all duration-500 cursor-pointer backdrop-blur-md border border-white/30 shadow-lg ${
          isSelected
            ? "w-12 bg-white/90 scale-110"
            : "w-3 bg-white/50 hover:bg-white/70 hover:scale-110"
        }`}
        onClick={onClickHandler}
        onKeyDown={onClickHandler}
        value={index}
        key={index}
        role="button"
        tabIndex={0}
        aria-label={`${label} ${index + 1}`}
      />
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden group rounded-3xl">
      {/* Gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-10 pointer-events-none" />
      <Carousel
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={true}
        autoPlay={true}
        interval={6000}
        transitionTime={1000}
        swipeable={true}
        emulateTouch={true}
        infiniteLoop={true}
        selectedItem={currentIndex}
        onChange={(index) => setCurrentIndex(index)}
        renderIndicator={customIndicator}
        className="h-full"
      >
        {bannerLoading ? (
          <div className="h-full w-full bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 animate-pulse flex items-center justify-center backdrop-blur-lg">
            <div className="text-neutral-400 text-2xl font-light tracking-[0.2em] uppercase animate-pulse">
              Loading Collection
            </div>
          </div>
        ) : (
          b_banners &&
          b_banners.map((b, index) => (
            <div
              key={`banner_${index}`}
              className="relative h-[calc(100vh-64px)] w-full group"
            >
              <Link to="/products" className="block h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/20 z-10 group-hover:from-transparent group-hover:to-black/10 transition-all duration-700" />
                <LazyLoadImage
                  effect="blur"
                  src={b}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  alt="Premium Banner"
                  wrapperClassName="h-full w-full block"
                />
                {/* Floating element for style */}
                <div className="absolute top-8 left-8 backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-4 py-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-white text-sm font-bold tracking-wider">
                    EXPLORE
                  </span>
                </div>
              </Link>
            </div>
          ))
        )}
      </Carousel>

      {/* Navigation Arrows - Modern Glass Design */}
      {!bannerLoading && b_banners && b_banners.length > 1 && (
        <Fragment>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 hover:shadow-2xl active:scale-95"
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + b_banners.length) % b_banners.length
              )
            }
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 hover:shadow-2xl active:scale-95"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % b_banners.length)
            }
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default CarousalView;
