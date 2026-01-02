import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import ReactPlayer from 'react-player';

const ProductImageView = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    const currentImage = images[currentIndex];

    return (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center md:p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-md md:rounded-2xl shadow-2xl w-full h-full md:max-w-6xl md:h-[85vh] flex flex-col md:flex-row relative overflow-hidden border-white/20">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Main Image Area */}
                <div className="flex-1 relative flex items-center justify-center bg-gray-50/50 p-4 md:p-6 min-h-0">
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 md:left-4 z-10 p-2 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="w-full h-full flex items-center justify-center">
                        {currentImage?.url?.match(/\.(mp4|mov|avi)$/) || currentImage?.url?.includes("video") ? (
                            <ReactPlayer
                                url={currentImage.url}
                                playing
                                controls
                                width="100%"
                                height="100%"
                                className="max-h-full rounded-lg overflow-hidden shadow-sm"
                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                            />
                        ) : (
                            <img
                                src={currentImage?.url || currentImage}
                                alt={`Product view ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain drop-shadow-md"
                            />
                        )}
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-4 z-10 p-2 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Thumbnails Sidebar */}
                <div className="h-[30vh] md:h-full md:w-80 bg-white/50 border-t md:border-t-0 md:border-l border-gray-100 p-4 overflow-y-auto shrink-0">
                    <h3 className="text-gray-900 font-semibold mb-3 text-sm md:text-base">
                        Gallery ({images.length})
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-3">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleThumbnailClick(idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx
                                    ? "border-gray-900 ring-1 ring-gray-900 shadow-md"
                                    : "border-transparent hover:border-gray-300"
                                    }`}
                            >
                                {img.url?.match(/\.(mp4|mov|avi)$/) || img.url?.includes("video") ? (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                            <div className="w-0 h-0 border-t-[5px] md:border-t-[6px] border-t-transparent border-l-[8px] md:border-l-[10px] border-l-gray-900 border-b-[5px] md:border-b-[6px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={img.url || img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductImageView;
