import React, { useState, useEffect, useRef, useMemo } from "react";
import { getImagesArrayFromProducts, hexToRgba } from "../../config";
import ReactPlayer from "react-player";
import { Heart } from "lucide-react";
import { createwishlist } from "../../action/orderaction";
import { useDispatch } from "react-redux";
import { useSessionStorage } from "../../Contaxt/SessionStorageContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useServerWishList } from "../../Contaxt/ServerWishListContext";
import "./Single_product.css";

const AutoSlidingCarousel = ({ pro, user, showWishList = true }) => {
    const { sessionData, sessionBagData, setWishListProductInfo } = useSessionStorage();
    const [isInWishList, setIsInWishList] = useState(false);
    const { checkAndCreateToast } = useSettingsContext();
    const { wishlist, fetchWishList } = useServerWishList();

    const [imageArray, setImageArray] = useState([]);
    const [slideIndex, setSlideIndex] = useState(1); // Default to the first slide
    const [videoInView, setVideoInView] = useState(new Array(imageArray.length).fill(false)); // Track video visibility
    const timerRef = useRef(null); // Ref to hold the timer for auto sliding
    const dispatch = useDispatch();

    useEffect(() => {
        setImageArray(getImagesArrayFromProducts(pro, true))
    }, [pro])

    // Function to change to a specific slide
    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    // Function to start auto sliding
    const startAutoSliding = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current); // Clear any existing interval
        }
        timerRef.current = setInterval(() => {
            // toast.info("Timer changed: ");
            setSlideIndex((prevIndex) => (prevIndex % imageArray.length) + 1); // Loop through slides
        }, 5000); // Change slide every 7 seconds
    };

    // Function to stop auto sliding
    const stopAutoSliding = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current); // Stop the auto sliding
        }
    };

    useEffect(() => {
        // Check if the user is logged in
        if (wishlist) {
            updateButtonStates();
        }
    }, [user, wishlist, pro, sessionData]);

    // Track visibility of video elements using IntersectionObserver
    const observer = useRef(
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = entry.target.dataset.index;
                setVideoInView((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[index] = entry.isIntersecting;
                    return updatedState;
                });
            });
        }, { threshold: 0.5 }) // 50% visibility before triggering play
    );
    const updateButtonStates = () => {
        if (user) {
            if (wishlist && wishlist?.orderItems) {
                setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === pro?._id));
            }
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === pro?._id));
        }
    };

    useEffect(() => {
        const videoElements = document.querySelectorAll(".video-element");
        videoElements.forEach((video) => {
            observer.current.observe(video);
        });

        return () => {
            videoElements.forEach((video) => {
                observer.current.unobserve(video);
            });
        };
    }, [imageArray]); // Re-run observer setup when imageArray changes

    // Calculate slide visibility and dot highlight based on slideIndex
    const slideStyle = (i) => ({
        display: i + 1 === slideIndex ? "block" : "none", // Show only the current slide
    });

    const dotStyle = (i) => ({
        backgroundColor: slideIndex === i + 1 ? hexToRgba('#1D1616', 0.5) : hexToRgba('#9AA6B2', 1),
    });

    // Memoize the media type for each image in the imageArray
    const mediaItems = useMemo(() => {
        return imageArray.map((im) => ({
            url: im.url,
            isVideo:
                im.url &&
                (im.url.includes("video") ||
                    im.url.endsWith(".mp4") ||
                    im.url.endsWith(".mov") ||
                    im.url.endsWith(".avi")),
        }));
    }, [imageArray]); // Recalculate only when imageArray changes

    const addToWishList = async (e) => {
        e.stopPropagation();
        if (user) {
            const response = await dispatch(createwishlist({ productId: pro._id }));
            await fetchWishList()
            checkAndCreateToast("success", "Wishlist Updated Successfully");
            setIsInWishList(response);
        } else {
            setWishListProductInfo(pro, pro._id);
            checkAndCreateToast("success", "Bag is Updated Successfully");
            updateButtonStates();
        }
    };
    useEffect(() => {
        updateButtonStates();
    }, [sessionData, sessionBagData, wishlist]);

    return (
        <div
            className="relative w-full h-full bg-gray-100 overflow-hidden"
            onMouseEnter={startAutoSliding}
            onMouseLeave={stopAutoSliding}
        >
            {pro ? (
                <div className="w-full h-full flex flex-col justify-center items-start">
                    {imageArray &&
                        imageArray.length > 0 &&
                        mediaItems.map((mediaItem, i) => (
                            <div
                                key={i}
                                className="fade w-full h-full"
                                style={slideStyle(i)}
                            >
                                {mediaItem.isVideo ? (
                                    <div
                                        className="media-item overflow-hidden video-element"
                                        data-index={i}
                                        style={{ position: "relative", width: "100%", height: "100%" }}
                                    >
                                        <div
                                            className="w-full h-full bg-gray-200 animate-pulse"
                                            style={{ position: "absolute", top: 0, left: 0 }}
                                        ></div>
                                        <ReactPlayer
                                            url={mediaItem.url}
                                            loop={true}
                                            className="w-full min-h-64 object-contain"
                                            muted={true}
                                            controls={false}
                                            loading="lazy"
                                            width="100%"
                                            height="100%"
                                            playing={videoInView[i]}
                                            light={false}
                                            onStart={() => setVideoInView((prev) => [...prev, true])}
                                            onEnded={() => setVideoInView((prev) => [...prev, false])}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="media-item w-full h-full"
                                        style={{ position: "relative" }}
                                    >
                                        <LazyLoadImage
                                            effect="blur"
                                            loading="lazy"
                                            useIntersectionObserver={true}
                                            src={mediaItem.url}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            width="100%"
                                            alt="product"
                                            wrapperProps={{
                                                style: { transitionDelay: "0.5s" },
                                            }}
                                            placeholder={<div className="w-full h-full bg-gray-200 animate-pulse"></div>}
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            )}

            {/* Wishlist Button - Modern Design */}
            {showWishList && (
                <button
                    className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                    onClick={addToWishList}
                    aria-label={isInWishList ? "Remove from wishlist" : "Add to wishlist"}
                >
                    {isInWishList ? (
                        <Heart
                            fill="red"
                            className="w-5 h-5 text-red-500 animate-pulse"
                        />
                    ) : (
                        <Heart
                            className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors"
                        />
                    )}
                </button>
            )}

            {/* Image Indicators - Modern dots */}
            {imageArray.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {imageArray.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => currentSlide(i + 1)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${slideIndex === i + 1
                                ? 'bg-gray-900 w-4'
                                : 'bg-gray-400 hover:bg-gray-600'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutoSlidingCarousel;
