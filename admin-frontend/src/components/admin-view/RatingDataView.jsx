import { Trash } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DialogContent, DialogTitle } from '../ui/dialog';
import { useSettingsContext } from '@/Context/SettingsContext';
import { Button } from '../ui/button';
import { findSlangsInComment } from '@/config';
import { IoMdAlert } from "react-icons/io";
const RatingDataView = ({ isOpen, onClose, ratings, onDeleteRating, addNewRating }) => {
    if (!isOpen) return null; // Don't render if the modal is not open
    return (
        <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogTitle>Total Ratings: <span>{ratings?.length}</span> </DialogTitle>
            <div className="flex flex-row space-y-4 bg-gray-100">
                {ratings && ratings.length > 0 && <ProductReviews reviews={ratings} onRemoveRating={onDeleteRating} />}
            </div>
            <StarRatingInput onChangeValue={(ratingData) => {
                console.log("Rating Setting: ", ratingData)
                if (addNewRating) {
                    addNewRating(ratingData);
                }
            }} />
        </DialogContent>
    );
};
const ProductReviews = ({ reviews, onRemoveRating }) => {
    const [showMore, setShowMore] = useState(false); // State to toggle the visibility of more reviews
    const containerRef = useRef(null);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const isDragging = useRef(false); // Track mouse drag status
    const initialClientY = useRef(0); // Store initial mouse Y position
    const initialScrollTop = useRef(0); // Store initial scroll position

    // For touch events
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY; // Capture initial touch position
    };

    const handleTouchMove = (e) => {
        if (containerRef.current) {
            const touchMoveY = e.touches[0].clientY;
            const touchDifference = touchStartY.current - touchMoveY;

            // Only apply scrolling if there is a significant touch movement
            if (Math.abs(touchDifference) > 5) {
                containerRef.current.scrollTop += touchDifference;
                touchStartY.current = touchMoveY; // Update touch start position
            }
        }
    };

    const handleTouchEnd = () => {
        touchEndY.current = touchStartY.current; // Update the end touch position
    };

    // For mouse events
    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default scrolling behavior
        isDragging.current = true;
        initialClientY.current = e.clientY; // Capture initial mouse Y position
        initialScrollTop.current = containerRef.current.scrollTop; // Capture initial scroll position
        containerRef.current.style.cursor = 'grabbing'; // Change cursor to grabbing
    };

    const handleMouseMove = (e) => {
        if (isDragging.current && containerRef.current) {
            const deltaY = e.clientY - initialClientY.current; // Calculate mouse movement
            containerRef.current.scrollTop = initialScrollTop.current - deltaY; // Update scroll position
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        containerRef.current.style.cursor = 'grab'; // Revert cursor back to default
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    const handleToggleReviews = () => {
        setShowMore(!showMore); // Toggle the state between true/false
    };

    return (
        <div
            ref={containerRef}
            className="min-w-full max-h-[260px] overflow-y-auto relative px-1 cursor-grab"
            style={{ userSelect: 'none' }} // Disable text selection during drag
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {/* Display only the first 3 reviews or more based on showMore */}
            {reviews.map((review, index) => {
                const randomStars = review.rating;
                const isSlange = findSlangsInComment(review.comment)
                return (
                    <div key={index} className="review-item mb-4 flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center">
                                <div className="stars">
                                    {[...Array(randomStars)].map((_, i) => (
                                        <span key={i} className="star text-black">★</span>
                                    ))}
                                    {[...Array(5 - randomStars)].map((_, i) => (
                                        <span key={i} className="star text-gray-700">★</span>
                                    ))}
                                </div>

                                <span className="ml-2 text-sm text-gray-700">{randomStars} Stars</span>
                            </div>
                            <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                        {isSlange ? <IoMdAlert size={20} color='Red' /> : null}
                        <Trash
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the event from bubbling up
                                if (onRemoveRating) {
                                    onRemoveRating(review._id);
                                }
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const StarRatingInput = ({ onChangeValue }) => {
    const { checkAndCreateToast } = useSettingsContext();
    const [ratingData, setRatingData] = useState({ comment: '', rating: 1 });

    const handleStarClick = (value) => {
        setRatingData({ ...ratingData, rating: value });
    };
    const handleSetRatingComment = (value) => {
        setRatingData({ ...ratingData, comment: value });
    }
    const handleSubmitRating = (e) => {
        e.preventDefault();
        if (ratingData.comment.trim() === '' || ratingData.rating < 1) {
            checkAndCreateToast('error', 'Please enter a valid review and select a rating');
            return;
        }
        /* if(findSlangsInComment(ratingData.comment)){
            checkAndCreateToast('warning', 'Your review contains slang. Please review and correct it.',3000);
            return;
        } */
        onChangeValue(ratingData);
        setRatingData({ comment: '', rating: 1 });
    }

    return (
        <div className='mb-4'>
            {/* Rating Stars */}
            <label htmlFor='reviewStars' className='block text-sm font-semibold text-gray-700'>Review Stars:</label>
            <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star, i) => (
                    <div

                        key={i}
                        className={`stars cursor-pointer w-10 h-10 text-3xl flex justify-center items-center ${ratingData.rating >= star ? 'text-black' : 'text-gray-300'
                            }`}
                        onClick={() => handleStarClick(star)}
                    >
                        <span className="star hover:-translate-y-1 duration-300 ease-in-out transition-transform">★</span>
                    </div>
                ))}
            </div>
            <label htmlFor='reviewText' className='block text-sm font-semibold text-gray-700'>Review Text:</label>
            <textarea
                onChange={(e) => handleSetRatingComment(e.target.value)}
                id='reviewText'
                name='reviewText'
                rows='4'
                placeholder='Write your review here...'
                className='mt-2 p-2 w-full border border-gray-300 rounded-md'
            />
            <Button
                // disabled={ratingData.comment.trim() === '' || ratingData.rating === 1}
                onClick={handleSubmitRating}
                className='mt-4 w-full text-white font-bold py-2 px-4 rounded-md'
            >
                Submit Review
            </Button>
        </div>
    );
}

export default RatingDataView