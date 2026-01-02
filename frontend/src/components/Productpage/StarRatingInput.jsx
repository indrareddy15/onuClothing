import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRatingInput = ({ onChangeValue, value = 0 }) => {
    const [rating, setRating] = useState(value);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(value);
    }, [value]);

    const handleStarClick = (val) => {
        setRating(val);
        onChangeValue(val);
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110 focus:outline-none"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                >
                    <Star
                        className={`w-8 h-8 ${star <= (hover || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;
