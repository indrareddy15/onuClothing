import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, X, ChevronLeft, ChevronRight, ShoppingBag, Quote } from "lucide-react";
import { useServerBanners } from "../../Contaxt/ServerBannerContext";
import { useEncryptionDecryptionContext } from "../../Contaxt/EncryptionContext";
import { formattedSalePrice } from "../../config";

/* Capability checks (evaluated once on the client) */
const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/*  Single reel card                                                   */
/* ------------------------------------------------------------------ */
const VideoCard = ({ video, index }) => {
    const navigate = useNavigate();
    const { encrypt } = useEncryptionDecryptionContext();
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const hoverable = canHover();
    const reduced = prefersReducedMotion();
    const product = video.productId && typeof video.productId === "object" ? video.productId : null;

    const safePlay = useCallback(() => {
        const el = videoRef.current;
        if (!el) return;
        const p = el.play();
        if (p && typeof p.then === "function") p.then(() => setIsPlaying(true)).catch(() => {});
    }, []);

    const stop = useCallback(() => {
        const el = videoRef.current;
        if (!el) return;
        el.pause();
        el.currentTime = 0;
        setIsPlaying(false);
    }, []);

    const handleClick = (e) => {
        if (!hoverable) {
            // Touch device / Mobile behavior
            if (!isPlaying) {
                e.preventDefault();
                e.stopPropagation();
                safePlay();
            } else if (product?._id) {
                navigate(`/products/${encrypt(product._id)}`);
            }
        } else if (product?._id) {
            // Desktop behavior
            navigate(`/products/${encrypt(product._id)}`);
        }
    };

    const hoverHandlers =
        hoverable && !reduced
            ? { onMouseEnter: safePlay, onMouseLeave: stop }
            : {};

    return (
        <div
            ref={containerRef}
            className="group relative min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-center cursor-pointer"
            onClick={handleClick}
            {...hoverHandlers}
        >
            {/* Media/Video Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    poster={video.posterUrl}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Subtle dark overlay for contrast */}
                <div className="pointer-events-none absolute inset-0 bg-black/5" />

                {/* Play affordance (hidden once playing) */}
                <span
                    className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 z-10 ${
                        isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Play size={20} className="fill-current ml-0.5 text-black" />
                    </span>
                </span>
            </div>

            {/* Review Info (matches ModernProductCard exactly) */}
            <div className="mt-4 space-y-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                    {video.title || "VIBE CHECK ⚡"}
                </h3>
                {product && (
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 line-clamp-1">
                            {product.title}
                        </p>
                        <div className="flex items-center gap-2">
                            {product.salePrice > 0 ? (
                                <>
                                    <span className="text-sm font-bold text-black">
                                        ₹{formattedSalePrice(product.salePrice)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                        ₹{formattedSalePrice(product.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm font-bold text-black">
                                    ₹{formattedSalePrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const VideoReviewsSection = () => {
    const { videoReviews } = useServerBanners();
    const sliderRef = useRef(null);

    const videos = Array.isArray(videoReviews) ? videoReviews.filter((v) => v && v.videoUrl) : [];
    if (videos.length === 0) return null;

    const scroll = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;
        const scrollAmount = 300; // smooth scroll amount
        slider.scrollTo({
            left: slider.scrollLeft + direction * scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-16 md:py-20 px-4 md:px-8 max-w-[1600px] mx-auto" aria-label="Video reviews">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-[1px] bg-purple-600" />
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600">AS seen ON U ✨</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 uppercase">
                        Drip in <span className="gen-z-gradient-text">Motion</span>
                    </h2>
                    <p className="mt-3 max-w-lg text-sm md:text-base text-gray-500 font-medium">
                        Unfiltered fits from the community. Hover or tap to vibe check and shop the look.
                    </p>
                </div>
            </div>

            <div className="relative group/section">
                {/* Scroll Left Button */}
                <button
                    onClick={() => scroll(-1)}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 backdrop-blur-md bg-white/70 border border-black/10 shadow-lg rounded-full text-black opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 hidden sm:flex items-center justify-center cursor-pointer"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Scroll Right Button */}
                <button
                    onClick={() => scroll(1)}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 backdrop-blur-md bg-white/70 border border-black/10 shadow-lg rounded-full text-black opacity-100 md:opacity-0 md:group-hover/section:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 hidden sm:flex items-center justify-center cursor-pointer"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Cards Container */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                    style={{
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    {videos.map((video, index) => (
                        <VideoCard key={video._id || index} video={video} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VideoReviewsSection;
