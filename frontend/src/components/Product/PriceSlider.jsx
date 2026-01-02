import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';

/**
 * PriceSlider Component
 * Enhanced price filtering with modern UI, slider, and manual input support.
 */
const PriceSlider = ({ dispatchFetchAllProduct, className }) => {
    const [localMin, setLocalMin] = useState(0);
    const [localMax, setLocalMax] = useState(50000);

    // Constants for absolute limits
    const ABSOLUTE_MIN = 0;
    const ABSOLUTE_MAX = 100000; // Increased limit or make dynamic if needed

    // Load price range from URL on mount
    useEffect(() => {
        const url = new URL(window.location.href);
        const urlMinPrice = url.searchParams.get('sellingPrice[$gte]');
        const urlMaxPrice = url.searchParams.get('sellingPrice[$lte]');

        if (urlMinPrice && urlMaxPrice) {
            const min = Number(urlMinPrice);
            const max = Number(urlMaxPrice);
            setLocalMin(min);
            setLocalMax(max);
        }
    }, []);

    const updateUrl = (min, max) => {
        const url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$gte]', min);
        url.searchParams.set('sellingPrice[$lte]', max);
        window.history.replaceState(null, '', url.toString());

        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    const handleInputChange = (type, value) => {
        let newValue = Number(value);
        if (isNaN(newValue)) return;

        if (type === 'min') {
            setLocalMin(newValue);
        } else {
            setLocalMax(newValue);
        }
    };

    const handleInputBlur = () => {
        let newMin = Math.max(ABSOLUTE_MIN, Math.min(localMin, localMax));
        let newMax = Math.min(ABSOLUTE_MAX, Math.max(localMin, localMax));

        // Ensure min is not greater than max (swap if needed, or clamp)
        if (newMin > newMax) {
            const temp = newMin;
            newMin = newMax;
            newMax = temp;
        }

        setLocalMin(newMin);
        setLocalMax(newMax);
        updateUrl(newMin, newMax);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };

    return (
        <div className={cn("py-4 border-b border-gray-200", className)}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 uppercase text-sm">Price Range</h4>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Label htmlFor="minPrice" className="text-xs text-gray-500 mb-1.5 block">Min Price</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <Input
                            id="minPrice"
                            type="number"
                            value={localMin}
                            onChange={(e) => handleInputChange('min', e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            className="pl-6 h-9 text-sm"
                            min={ABSOLUTE_MIN}
                            max={ABSOLUTE_MAX}
                            placeholder="Min"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <Label htmlFor="maxPrice" className="text-xs text-gray-500 mb-1.5 block">Max Price</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <Input
                            id="maxPrice"
                            type="number"
                            value={localMax}
                            onChange={(e) => handleInputChange('max', e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            className="pl-6 h-9 text-sm"
                            min={ABSOLUTE_MIN}
                            max={ABSOLUTE_MAX}
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceSlider;
