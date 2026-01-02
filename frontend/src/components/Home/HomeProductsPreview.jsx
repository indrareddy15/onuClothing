import { Heart, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { createwishlist } from '../../action/orderaction';
import { calculateDiscountPercentage } from '../../config';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useDispatch } from 'react-redux';

const HomeProductsPreview = ({ product, user, selectedColorImages = [] }) => {
    const dispatch = useDispatch();

    const { encrypt } = useEncryptionDecryptionContext();
    const navigation = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
    const [timer, setTimer] = useState(null);
    const { checkAndCreateToast } = useSettingsContext();
    const { sessionData, setWishListProductInfo } = useSessionStorage();
    const { wishlist, fetchWishList } = useServerWishList();
    const [isInWishList, setIsInWishList] = useState(false);

    const addToWishList = async (e) => {
        e.stopPropagation();
        if (user) {
            const response = await dispatch(createwishlist({ productId: product._id }));
            checkAndCreateToast("success", "Wishlist Updated Successfully");
            setIsInWishList(response);
            fetchWishList();
        } else {
            setWishListProductInfo(product, product._id);
            checkAndCreateToast("success", "Bag is Updated Successfully");
            updateButtonStates();
        }
    };

    // Handle mouse enter event
    const handleMouseEnter = (index) => {
        setIsHovered(true);
        setHoveredImageIndex(index);
        const newTimer = setInterval(() => {
            setHoveredImageIndex((prevIndex) => (prevIndex + 1) % selectedColorImages.length);
        }, 1000);
        setTimer(newTimer);
        clearInterval(newTimer);
    };

    useEffect(() => {
        // Check if the user is logged in
        if (wishlist) {
            updateButtonStates();
        }
    }, [user, wishlist, product, sessionData]);

    const updateButtonStates = () => {
        if (user) {
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === product?._id));
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === product?._id));
        }
    };

    // Handle mouse leave event
    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredImageIndex(0);
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
    };

    // Cleanup timer when component unmounts
    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    // Handle hover state
    const handleMediaLoad = () => {
        setIsMediaLoaded(true); // Set media as loaded when it's ready
    };
    const productEncryption = encrypt(product?._id);

    return (
        <div
            className="group w-full h-full relative flex flex-col bg-transparent"
            onMouseEnter={() => {
                setIsHovered(true);
                handleMouseEnter(0);
            }}
            onMouseLeave={handleMouseLeave}
        >
            {/* Product Image/Video Container */}
            <div className="w-full aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-100 border border-transparent group-hover:border-black/5 transition-all duration-300">
                {!isMediaLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}

                {selectedColorImages && selectedColorImages.length > 0 && (
                    <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                        <ProductImageVideoView
                            imageArray={selectedColorImages}
                            hoveredImageIndex={hoveredImageIndex}
                            product={product}
                            navigation={navigation}
                            onLoad={handleMediaLoad}
                        />
                    </div>
                )}

                {/* Discount Badge */}
                {product && product.salePrice > 0 && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
                            -{calculateDiscountPercentage(product.price, product.salePrice)}%
                        </span>
                    </div>
                )}

                {/* Floating Action Buttons (Right Side) */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <button
                        onClick={addToWishList}
                        className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors duration-200"
                        title="Add to Wishlist"
                    >
                        {isInWishList ? <Heart className="w-4 h-4 fill-red-500 text-red-500" /> : <Heart className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => navigation(`/products/${productEncryption}`)}
                        className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors duration-200"
                        title="View Product"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Quick Actions (Always visible on touch devices, hidden on desktop hover) */}
                <div className="lg:hidden absolute bottom-3 right-3 z-20 flex flex-col gap-2">
                    <button
                        onClick={addToWishList}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                    >
                        {isInWishList ? <Heart className="w-4 h-4 fill-red-500 text-red-500" /> : <Heart className="w-4 h-4 text-gray-900" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductImageVideoView = ({ imageArray, hoveredImageIndex, product, navigation, onLoad }) => {
    const { encrypt } = useEncryptionDecryptionContext();
    // State to track whether the media is loaded
    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    // Function to check if the file is a video based on URL
    const isVideo = useCallback((url) => {
        return (
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".avi") ||
            url.includes(".webm")
        );
    }, []);

    // Memoize selected media to avoid recalculating on each render
    const selectedMedia = useMemo(() => imageArray[hoveredImageIndex], [imageArray, hoveredImageIndex]);

    // Memoize media type check to avoid recalculating on each render
    const mediaIsVideo = useMemo(() => selectedMedia && selectedMedia.url && isVideo(selectedMedia.url), [selectedMedia, isVideo]);

    // Handle the navigation on click, memoized to avoid unnecessary re-renders
    const handleClick = useCallback(() => {
        const productEncryption = encrypt(product?._id);
        // const decrypted = decrypt(productEncryption);
        // console.log("Encrypted Product Id: ",productEncryption,"Decrypted: ",decrypted);
        if (product) {
            navigation(`/products/${productEncryption}`);
        }
    }, [navigation, product]);

    // Early return if there is no valid image array or selected media
    if (!imageArray || imageArray.length === 0 || !selectedMedia) {
        return null;
    }

    // Function to handle media load completion
    const handleMediaLoad = () => {
        setIsMediaLoaded(true);
        if (onLoad) {
            onLoad();
        }
    };

    return (
        <div
            onClick={handleClick}
            className="w-full h-full bg-gray-100 relative transition-opacity duration-500 ease-in-out cursor-pointer"
        >
            {/* Skeleton Loader */}
            {!isMediaLoaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse">
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                </div>
            )}
            <Fragment>
                {/* Check if the selected media is a video or an image */}
                {mediaIsVideo ? (
                    <ReactPlayer
                        className="w-full h-full object-contain"
                        url={selectedMedia.url}
                        playing
                        controls={false}
                        loading="lazy"
                        muted
                        width="100%"
                        height="100%"
                        light={false} // Show thumbnail before playing video
                        onReady={handleMediaLoad} // Trigger media load completion
                    />
                ) : (
                    <img
                        src={selectedMedia.url}
                        width="100%"
                        height="100%"
                        className="w-full h-full object-cover"
                        alt={`Product_${hoveredImageIndex}`}
                        onLoad={handleMediaLoad} // Trigger media load completion
                        onContextMenu={(e) => e.preventDefault()}
                    />
                )}
            </Fragment>
        </div>
    );
};

export default HomeProductsPreview;
