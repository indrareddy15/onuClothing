import React, { useState, useCallback, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ImageZoom = ({ imageSrc, zoomSize = 120, maxZoomSize = 200, minZoomSize = 50 }) => {
    const [zoomStyle, setZoomStyle] = useState({});
    const [showZoom, setShowZoom] = useState(false);
    const [currentZoomSize, setCurrentZoomSize] = useState(zoomSize);

    const handleMouseEnter = useCallback(() => {
        setShowZoom(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        const bgX = (x / width) * 100;
        const bgY = (y / height) * 100;

        setZoomStyle({
            top: `${y - currentZoomSize / 2}px`,
            left: `${x - currentZoomSize / 2}px`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: `${width * 2}px ${height * 2}px`,
        });
    }, [currentZoomSize, imageSrc]);

    const handleMouseLeave = useCallback(() => {
        setShowZoom(false);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden cursor-crosshair">
            <LazyLoadImage
                src={imageSrc}
                alt="Zoomable"
                effect="blur"
                className="w-full h-full object-cover"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => e.preventDefault()}
            />

            {showZoom && (
                <div
                    className="absolute pointer-events-none border-2 border-white/50 shadow-xl rounded-full bg-no-repeat z-10"
                    style={{
                        ...zoomStyle,
                        width: `${currentZoomSize}px`,
                        height: `${currentZoomSize}px`,
                    }}
                />
            )}
        </div>
    );
};

export default ImageZoom;
