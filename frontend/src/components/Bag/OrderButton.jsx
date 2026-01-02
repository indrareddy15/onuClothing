import React, { useState, useEffect } from 'react';
import './OrderButton.css';

const OrderButton = ({ onClick, disabled, isLoading }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e) => {
        if (disabled || isLoading || isAnimating) return;

        setIsAnimating(true);

        if (onClick) {
            onClick(e);
        }

        // Reset animation after 10 seconds
        setTimeout(() => {
            setIsAnimating(false);
        }, 10000);
    };

    return (
        <button
            className={`truck-order-button ${isAnimating ? 'animate' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleClick}
            disabled={disabled || isLoading}
        >
            <span className="default">Place Order</span>
            <span className="success">
                Order Placed
                <svg viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
            </span>
            <div className="box"></div>
            <div className="truck">
                <div className="back"></div>
                <div className="front">
                    <div className="window"></div>
                </div>
                <div className="light top"></div>
                <div className="light bottom"></div>
            </div>
            <div className="lines"></div>
        </button>
    );
};

export default OrderButton;
