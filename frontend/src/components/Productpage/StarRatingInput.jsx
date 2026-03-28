import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRatingInput = ({ onChangeValue, value = 0 }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-2 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <div
                    key={star}
                    className="cursor-pointer transition-transform hover:scale-125 active:scale-95 p-1"
                    onClick={() => onChangeValue(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                >
                    <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                            star <= (hover || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                </div>
            ))}
            <span className="ml-2 text-sm font-bold text-gray-500">({value}/5)</span>
        </div>
    );
};

export default StarRatingInput;
