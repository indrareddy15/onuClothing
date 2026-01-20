import React, { useState } from 'react';
import { Loader2, Check, Package } from 'lucide-react';

const OrderButton = ({ onClick, disabled, isLoading }) => {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClick = async (e) => {
        if (disabled || isLoading || isSuccess) return;

        if (onClick) {
            try {
                await onClick(e);
                // Show success state for 2 seconds
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                }, 2000);
            } catch (error) {
                console.error('Order error:', error);
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || isLoading || isSuccess}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isSuccess
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isLoading
                            ? 'bg-gray-900 text-white cursor-wait'
                            : 'bg-gray-900 text-white hover:bg-black active:scale-95'
                }`}
        >
            {isSuccess ? (
                <>
                    <Check className="w-5 h-5 animate-pulse" />
                    <span>Order Placed Successfully</span>
                </>
            ) : isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                </>
            ) : (
                <>
                    <Package className="w-5 h-5" />
                    <span>Place Order</span>
                </>
            )}
        </button>
    );
};

export default OrderButton;
