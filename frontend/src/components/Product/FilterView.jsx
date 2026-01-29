import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../action/productaction';
import { ChevronUp, Filter } from 'lucide-react';
import { Slider } from '../../components/ui/slider';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import PriceSlider from './PriceSlider';
import { cn } from '../../lib/utils';

const FilterView = ({ product, dispatchFetchAllProduct, handleResetFilter }) => {

    const dispatch = useDispatch();
    const [colorul, setcolorul] = useState('max-h-80');

    // Helper function to deduplicate arrays case-insensitively
    const deduplicateCaseInsensitive = (arr) => {
        const seen = new Map();
        return arr.filter(item => {
            const key = String(item).toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.set(key, item);
            return true;
        });
    };

    // Helper to get case-insensitive count
    const getCaseInsensitiveCount = (item, sourceArray) => {
        const itemLower = String(item).toLowerCase();
        return sourceArray.filter(s => String(s).toLowerCase() === itemLower).length;
    };

    let AllProductsCategory = [];
    let AllProductsSubcategory = [];
    let size = []
    let AllProductsGender = [];
    let AllProductsColor = [];
    let specialCategory = [];
    let spARRAY = [];
    let discountedPercentageAmount = [];
    let onSale = []
    const n = 3
    const result = [[], [], []] //we create it, then we'll fill it    
    // Generate category, gender, color, and price arrays
    const categoriesarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                AllProductsCategory.push(p.category)
            });
        }
    };
    function SetOnSale() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if (p.salePrice && p.salePrice > 0) {
                    onSale.push(p.salePrice)
                }
            });
        }
    }
    function setDiscountedPercentage() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if (p.salePrice && p.salePrice > 0) {
                    const amount = Math.floor(p.DiscountedPercentage);
                    discountedPercentageAmount.push(amount)
                }
            });
        }
    }
    const specialCategoryArray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                specialCategory.push(p.specialCategory)
                if (p.specialCategory !== "none" && p.specialCategory !== undefined) {
                }
            });
        }
    };
    const subcategoryarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                AllProductsSubcategory.push(p.subCategory)
            });
        }
    };


    const genderarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                AllProductsGender.push(p.gender)
            });
        }
    };
    function sizearray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if (p) {
                    p.size.forEach(s => {
                        size.push(s.label);
                    })
                }
            });
        }
    }

    const colorarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                p.AllColors.forEach(c => {
                    AllProductsColor.push(c);
                })
            });
        }
    };

    const sparray = () => {
        product.forEach(p => {
            const currentPrice = p.price;
            if (!spARRAY.includes(currentPrice)) {
                spARRAY.push(currentPrice);
            }
        });
    };
    useEffect(() => {
        categoriesarray();
        subcategoryarray();
        genderarray();
        colorarray();
        sizearray();
        specialCategoryArray();
        sparray();
        SetOnSale();
        setDiscountedPercentage();
    }, [product, window.location.search])

    categoriesarray();
    subcategoryarray();
    genderarray();
    colorarray();
    sizearray();
    SetOnSale();
    specialCategoryArray();
    setDiscountedPercentage();
    sparray();

    // Remove duplicates and sort price array with case-insensitive deduplication
    let Categorynewarray = deduplicateCaseInsensitive(AllProductsCategory);
    let sizenewarray = deduplicateCaseInsensitive(size);
    let gendernewarray = deduplicateCaseInsensitive(AllProductsGender);
    let colornewarray = [
        ...new Map(AllProductsColor.map(item => [item.label, item])).values()
    ];
    let subcategorynewarray = deduplicateCaseInsensitive(AllProductsSubcategory);
    let specialCategorynewarray = deduplicateCaseInsensitive(specialCategory);
    let discountedPercentageAmountnewarray = [...new Set(discountedPercentageAmount)];
    let sp = [...new Set(spARRAY.sort((a, b) => a - b))];

    const setPriceFilter = () => {
        const wordsPerLine = Math.ceil(sp.length / 3)
        for (let line = 0; line < n; line++) {
            for (let i = 0; i < wordsPerLine; i++) {
                const value = sp[i + line * wordsPerLine]
                if (!value) continue //avoid adding "undefined" values
                result[line].push(value)
            }
        }
    }
    // Update the URL based on the selected category
    const categoryfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('category'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('category');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('category', sub);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const specialCategoryFun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSpecialCategory = url.searchParams.getAll('specialCategory'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectedSpecialCategory.includes(e);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSpecialCategory = selectedSpecialCategory.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSpecialCategory.push(e);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('specialCategory');
        selectedSpecialCategory.forEach(sub => {
            url.searchParams.append('specialCategory', sub);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const discountedAmountFun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'discountedAmount' value from the URL (if any)
        let selectedDiscountedAmount = url.searchParams.get('discountedAmount'); // This will return a single string, not an array

        // Set the new value for 'discountedAmount' query parameter
        if (selectedDiscountedAmount === e.toString()) {
            // If the selected value is already in the URL, remove it (deselect it)
            url.searchParams.delete('discountedAmount');
        } else {
            // Otherwise, set the selected value
            url.searchParams.set('discountedAmount', e);
        }

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    const onSaleFun = () => {
        let url = new URL(window.location.href);
        let onSaleData = url.searchParams.get('onSale');
        // Check if 'onSale' parameter is present in the URL
        if (onSaleData === null) {
            // If 'onSale' doesn't exist, set it to 'true'
            url.searchParams.append("onSale", 'true');
        } else if (onSaleData === 'true') {
            // If 'onSale' exists and is 'true', set it to 'false'
            url.searchParams.set("onSale", 'false');
        } else {
            // If 'onSale' exists and is not 'true', set it to 'true'
            url.searchParams.set("onSale", 'true');
        }

        // Update the URL without reloading the page
        window.history.replaceState(null, "", url.toString());

        // If dispatchFetchAllProduct is a function, call it
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    }
    const sizefun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('size'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('size');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('size', sub);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const subcategoryfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('subcategory'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('subcategory');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('subcategory', sub);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    const colorfun = (colorHex) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectColor = url.searchParams.getAll('color'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectColor.includes(colorHex);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectColor = selectColor.filter(col => col !== colorHex);
        } else {
            // If the subcategory is not selected, add it to the array
            selectColor.push(colorHex);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('color');
        selectColor.forEach(col => {
            url.searchParams.append('color', col);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Handle gender filter
    const genderfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('gender'); // This will return an array

        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);

        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }

        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('gender');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('gender', sub);
        });

        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());

        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    function sparraynew() {
        let filersp = spARRAY.filter((f) => f <= Math.max(...result[1]))
        let newfiltersp = filersp.filter((f) => f >= Math.min(...result[1]))
        return newfiltersp.length
    }

    // Function to clear all filters from the URL
    const clearAllFilters = () => {
        let url = new URL(window.location.href);
        url.search = ''; // This clears all the query parameters
        window.history.replaceState(null, "", url.toString());

        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct(); // Fetch all products without filters
        }
        handleResetFilter();
    };

    useEffect(() => {
        dispatch(fetchAllOptions());
    }, [dispatch])
    // Calculate active filter count
    const searchParams = new URLSearchParams(window.location.search);
    let activeCount = 0;
    ['gender', 'category', 'subcategory', 'size', 'specialCategory', 'color', 'onSale'].forEach(key => {
        activeCount += searchParams.getAll(key).length;
    });
    if (searchParams.get('discountedAmount')) activeCount++;

    return (
        <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-900" />
                    <h2 className="font-semibold text-gray-900">Filters</h2>
                    {activeCount > 0 && (
                        <span className="bg-gray-100 text-gray-900 text-xs font-medium px-2 py-0.5 rounded-full">
                            {activeCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Clear All
                </button>
            </div>
            <div className='space-y-1'>
                <FilterGroup
                    title="Gender"
                    name="gender"
                    items={gendernewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("gender")}
                    onChange={genderfun}
                    getCount={(e) => getCaseInsensitiveCount(e, AllProductsGender)}
                />

                <FilterGroup
                    title="Categories"
                    name="category"
                    items={Categorynewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("category")}
                    onChange={categoryfun}
                    getCount={(e) => getCaseInsensitiveCount(e, AllProductsCategory)}
                />

                <FilterGroup
                    title="Subcategories"
                    name="subcategory"
                    items={subcategorynewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("subcategory")}
                    onChange={subcategoryfun}
                    getCount={(e) => getCaseInsensitiveCount(e, AllProductsSubcategory)}
                />

                <FilterGroup
                    title="Size"
                    name="size"
                    items={sizenewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("size")}
                    onChange={sizefun}
                    getCount={(e) => getCaseInsensitiveCount(e, size)}
                />

                <FilterGroup
                    title="Special Category"
                    name="specialCategory"
                    items={specialCategorynewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("specialCategory")}
                    onChange={specialCategoryFun}
                    getCount={(e) => getCaseInsensitiveCount(e, specialCategory)}
                />

                <FilterGroup
                    title="Discount"
                    name="discountedAmount"
                    type="radio"
                    items={discountedPercentageAmountnewarray.sort((a, b) => a - b)}
                    selectedValues={[parseInt(new URLSearchParams(window.location.search).get("discountedAmount"))]}
                    onChange={discountedAmountFun}
                    getLabel={(e) => `UpTo ${e} %`}
                    getCount={(e) => discountedPercentageAmount.filter((f) => f === e).length}
                />
                <PriceSlider dispatchFetchAllProduct={dispatchFetchAllProduct} />
                <FilterGroup
                    title="Color"
                    name="color"
                    type="checkbox"
                    specialType="color"
                    items={colornewarray}
                    selectedValues={new URLSearchParams(window.location.search).getAll("color")}
                    onChange={(color) => colorfun(color)}
                    getValue={(e) => e.label}
                    getLabel={(e) => e.name}
                    getCount={(e) => getCaseInsensitiveCount(e.label, AllProductsColor.map(c => c.label))}
                    maxDisplay={5}
                    showToggle={true}
                    expanded={colorul === 'max-h-max'}
                    onToggleExpand={() => setcolorul(colorul === 'max-h-max' ? 'max-h-80' : 'max-h-max')}
                />

                {onSale.length > 0 && (
                    <FilterGroup
                        title="On Sale"
                        name="onSale"
                        items={["true"]}
                        selectedValues={new URLSearchParams(window.location.search).getAll("onSale")}
                        onChange={onSaleFun}
                        getLabel={() => "On Sale"}
                        getCount={() => onSale.length}
                    />
                )}
            </div>
        </div>
    );
};



const FilterGroup = ({
    title,
    items,
    type = "checkbox", // 'checkbox' | 'radio' | 'color'
    specialType,
    name,
    selectedValues = [],
    onChange,
    getValue = (item) => item,
    getLabel = (item) => item,
    getCount = (item) => 0,
    maxDisplay = Infinity,
    showToggle = false,
    expanded = true,
    onToggleExpand
}) => {
    const displayItems = expanded ? items : items.slice(0, maxDisplay);

    return (
        <div className='border-b border-gray-200 py-4'>
            <h3 className='text-sm font-semibold text-gray-900 mb-3 uppercase'>{title}</h3>
            <div className='space-y-2'>
                {type === 'radio' ? (
                    <RadioGroup value={selectedValues[0]?.toString()} onValueChange={onChange}>
                        {displayItems.map((item, i) => {
                            const value = getValue(item);
                            const label = getLabel(item);
                            return (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value={value.toString()} id={`${name}_${value}`} />
                                        <Label htmlFor={`${name}_${value}`} className="text-sm font-normal cursor-pointer">
                                            {label}
                                        </Label>
                                    </div>
                                    <span className='text-xs text-gray-500'>({getCount(item)})</span>
                                </div>
                            )
                        })}
                    </RadioGroup>
                ) : (
                    displayItems.map((item, i) => {
                        const value = getValue(item);
                        const label = getLabel(item);
                        const isChecked = selectedValues.includes(value);

                        return (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${name}_${value}`}
                                        checked={isChecked}
                                        onCheckedChange={() => onChange(value)}
                                    />
                                    {specialType === "color" ? (
                                        <>
                                            <div className='w-6 h-6 border border-gray-300 rounded-md mx-2' style={{ backgroundColor: value }} />
                                            <Label htmlFor={`${name}_${value}`} className="text-sm text-gray-700 capitalize cursor-pointer">
                                                {label}
                                            </Label>
                                        </>
                                    ) : (
                                        <Label htmlFor={`${name}_${value}`} className='text-sm text-gray-700 capitalize cursor-pointer'>
                                            {label}
                                        </Label>
                                    )}
                                </div>
                                <span className='text-xs text-gray-500'>({getCount(item)})</span>
                            </div>
                        );
                    })
                )}
            </div>

            {showToggle && items.length > maxDisplay && (
                <div className='flex justify-center mt-3'>
                    <button
                        onClick={onToggleExpand}
                        className="text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                    >
                        {expanded ? 'Show Less' : `Show More (${items.length - maxDisplay})`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterView;
