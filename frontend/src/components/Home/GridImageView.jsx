import React, { useState, useCallback, useMemo, memo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomItem } from '../../config';
import ReactPlayer from 'react-player';

const clothingItems = [
    "Half Shirt",
    "Casual Shirt",
    "Formal Shirt",
    "Joggers",
    "Jeans",
    "Cotton Pant",
    "T-shirt",
    "Cargo"
];

const GridImageView = memo(({ imageToShow, categoriesOptions = [], startPlaying = false, categoryName }) => {
    // const activeClothingItem = useMemo(() => getRandomItem(categoriesOptions) || getRandomItem(clothingItems), [categoriesOptions]);
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // console.log("Image to show: ", imageToShow);
    const fileExtension = imageToShow.split('.').pop();
    const isVideo = ['mp4', 'webm', 'ogg', 'video', 'mov', 'avi'].includes(fileExtension);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension);

    const handleMediaLoad = useCallback(() => setIsLoading(false), []);
    const handleError = useCallback(() => setIsError(true), []);
    const handleMoveToQuery = useCallback(() => {
        const queryParams = new URLSearchParams();
        if (categoryName) queryParams.set('category', categoryName.toLowerCase());
        const url = `/products?${queryParams.toString()}`;
        navigation(url);
    }, [categoryName, navigation]);

    return (
        <div onClick={handleMoveToQuery} className="group relative w-full h-full overflow-hidden cursor-pointer bg-gray-100">
            <div className="w-full h-full relative overflow-hidden">
                {isError ? (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-100 p-6 text-center border border-neutral-200">
                        <span className="text-neutral-400 text-sm font-medium uppercase tracking-widest mb-2">Media Unavailable</span>
                        <p className="text-neutral-400 text-xs">Please try again later</p>
                    </div>
                ) : (
                    <Fragment>
                        {isImage ? (
                            <div className="w-full h-full overflow-hidden">
                                <img
                                    src={imageToShow}
                                    alt="media_banner"
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    onLoad={handleMediaLoad}
                                    onError={handleError}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        ) : isVideo ? (
                            <div className="w-full h-full overflow-hidden">
                                <ReactPlayer
                                    url={imageToShow}
                                    className="w-full h-full object-cover !w-full !h-full scale-105 group-hover:scale-110 transition-transform duration-700"
                                    loop={true}
                                    controls={false}
                                    playing={true}
                                    muted
                                    width="100%"
                                    height="100%"
                                    light={false}
                                    onReady={handleMediaLoad}
                                    onError={handleError}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-neutral-100">
                                <p className="text-neutral-400 text-xs">Unsupported Format</p>
                            </div>
                        )}
                    </Fragment>
                )}

                {/* Overlay - Appears on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {categoryName && (
                    <div className="absolute bottom-6 left-6 z-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-black text-sm font-medium tracking-widest uppercase shadow-lg">
                            {categoryName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
})

export default GridImageView;
