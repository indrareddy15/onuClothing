import React, { Fragment, useEffect, useState, useRef } from 'react'
import { AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Allproduct as getproduct } from '../../action/productaction'
import { capitalizeFirstLetterOfEachWord, getSortingKeyValuePairs } from '../../config'
import { BsSortDown, BsSortUp } from 'react-icons/bs'
import { ArrowDown01, ArrowDown10, ArrowUpDown, Filter } from 'lucide-react'
import { FaPercent, FaSortAlphaDown, FaSortAlphaDownAlt } from 'react-icons/fa'
import { Slider } from '../../components/ui/slider'
import { Checkbox } from '../../components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

const MFilter = ({ product, sortvalue, handleSortChange, setSortValue, scrollableDivRef, handleResetFilter }) => {
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Gender');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    let lastScrollTop = 0;

    // Data processing
    let category = []
    let subcategory = []
    let specialCategory = []
    let discountedPercentageAmount = [];
    let size = []
    let gender = []
    let color = []
    let spARRAY = []
    let onSale = []

    if (product && product.length > 0) {
        product.forEach(p => {
            if (p.category) category.push(p.category);
            if (p.subCategory) subcategory.push(p.subCategory);
            if (p.specialCategory && p.specialCategory !== "none") specialCategory.push(p.specialCategory);
            if (p.size) p.size.forEach(s => size.push(s.label));
            if (p.gender) gender.push(p.gender);
            if (p.AllColors) p.AllColors.forEach(c => color.push(c));
            if (p.price) spARRAY.push(p.price);
            if (p.salePrice && p.salePrice > 0) {
                onSale.push(p.salePrice);
                const amount = Math.floor(p.DiscountedPercentage);
                discountedPercentageAmount.push(amount);
            }
        });
    }

    let Categorynewarray = [...new Set(category)];
    let specialCategoryNewArray = [...new Set(specialCategory)];
    let discountedPercentageAmountNewArray = [...new Set(discountedPercentageAmount)];
    let subCategoryNewArray = [...new Set(subcategory)];
    let gendernewarray = [...new Set(gender)];
    let colornewarray = [...new Map(color.map(item => [item.label, item])).values()];
    let sizenewArray = [...new Set(size)]
    let sp = [...new Set(spARRAY.sort((a, b) => a - b))];

    const [price, setPrice] = useState(GetPrice().length > 0 ? GetPrice() : [Math.floor(Math.min(...sp) || 0), Math.floor(Math.max(...sp) || 1000)])

    useEffect(() => {
        if (sp.length > 0 && GetPrice().length === 0) {
            setPrice([Math.floor(Math.min(...sp)), Math.floor(Math.max(...sp))])
        }
    }, [product])

    const priceHandler = (newPrice) => {
        setPrice(newPrice)
    }

    const applyPriceFilter = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$gte]', price[0]);
        url.searchParams.set('sellingPrice[$lte]', price[1]);
        window.history.replaceState(null, "", url.toString());
        dispatch(getproduct());
        setIsFilterOpen(false);
    }

    // Filter handlers
    const handleFilterChange = (key, value) => {
        let url = new URL(window.location.href);
        let selectedValues = url.searchParams.getAll(key);

        if (selectedValues.includes(value)) {
            selectedValues = selectedValues.filter(v => v !== value);
        } else {
            selectedValues.push(value);
        }

        url.searchParams.delete(key);
        selectedValues.forEach(v => url.searchParams.append(key, v));

        window.history.replaceState(null, "", url.toString());
        dispatch(getproduct());
    }

    const handleDiscountChange = (value) => {
        let url = new URL(window.location.href);
        let current = url.searchParams.get('discountedAmount');

        if (current === value.toString()) {
            url.searchParams.delete('discountedAmount');
        } else {
            url.searchParams.set('discountedAmount', value);
        }
        window.history.replaceState(null, "", url.toString());
        dispatch(getproduct());
    }

    const handleOnSaleChange = () => {
        let url = new URL(window.location.href);
        let onSaleData = url.searchParams.get('onSale');
        if (onSaleData === 'true') {
            url.searchParams.set("onSale", 'false');
        } else {
            url.searchParams.set("onSale", 'true');
        }
        window.history.replaceState(null, "", url.toString());
        dispatch(getproduct());
    }

    const clearAllFilters = () => {
        let url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState(null, "", url.toString());
        dispatch(getproduct());
        handleResetFilter();
        setIsFilterOpen(false);
    };

    // Scroll handling
    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            let currentScrollTop = 0;
            if (scrollableDivRef && scrollableDivRef.current) {
                currentScrollTop = scrollableDivRef.current.scrollTop;
            } else {
                currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            }

            if (currentScrollTop < lastScrollTop) {
                setIsScrollingUp(true);
                setIsVisible(true);
            } else {
                setIsScrollingUp(false);
                setIsVisible(false);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            setScrollPosition(currentScrollTop);
        };

        if (scrollableDivRef && scrollableDivRef.current) {
            const divElement = scrollableDivRef.current;
            divElement.addEventListener('scroll', handleScroll);
            return () => divElement.removeEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [scrollableDivRef]);

    const getIconsBySortingName = (name) => {
        switch (name) {
            case 'What`s New': return <AiOutlineFire className='text-xl mr-2' />
            case 'Popularity': return <AiOutlineStar className='text-xl mr-2' />
            case 'A-Z': return <FaSortAlphaDown className='text-xl mr-2' />
            case 'Z-A': return <FaSortAlphaDownAlt className='text-xl mr-2' />
            case 'Better Discount': return <FaPercent className='text-xl mr-2' />
            case 'Price: Low To High': return <BsSortUp className='text-xl mr-2' />
            case 'Price: High To Low': return <BsSortDown className='text-xl mr-2' />
            case 'Rating: High To Low': return <ArrowDown10 className='text-xl mr-2' />
            case 'Rating: Low To High': return <ArrowDown01 className='text-xl mr-2' />
            default: return null;
        }
    }

    const renderFilterContent = () => {
        const searchParams = new URLSearchParams(window.location.search);

        switch (activeCategory) {
            case 'Gender':
                return <FilterList items={gendernewarray} selectedItems={searchParams.getAll('gender')} onChange={(val) => handleFilterChange('gender', val)} getCount={(e) => gender.filter(g => g === e).length} />;
            case 'Categories':
                return <FilterList items={Categorynewarray} selectedItems={searchParams.getAll('category')} onChange={(val) => handleFilterChange('category', val)} getCount={(e) => category.filter(c => c === e).length} />;
            case 'Sub Categories':
                return <FilterList items={subCategoryNewArray} selectedItems={searchParams.getAll('subcategory')} onChange={(val) => handleFilterChange('subcategory', val)} getCount={(e) => subcategory.filter(s => s === e).length} />;
            case 'Size':
                return <FilterList items={sizenewArray} selectedItems={searchParams.getAll('size')} onChange={(val) => handleFilterChange('size', val)} getCount={(e) => size.filter(s => s === e).length} />;
            case 'Price':
                return (
                    <div className='p-6'>
                        <h3 className="text-sm font-medium mb-4">Price Range</h3>
                        <div className="px-2">
                            <Slider
                                defaultValue={price}
                                value={price}
                                min={Math.floor(Math.min(...sp) || 0)}
                                max={Math.floor(Math.max(...sp) || 1000)}
                                step={1}
                                onValueChange={priceHandler}
                                className="my-6"
                            />
                        </div>
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                            <span>₹{price[0]}</span>
                            <span>₹{price[1]}</span>
                        </div>
                    </div>
                );
            case 'Color':
                return <FilterList items={colornewarray} selectedItems={searchParams.getAll('color')} onChange={(val) => handleFilterChange('color', val.label)} type="color" getCount={(e) => color.filter(c => c.label === e.label).length} />;
            case 'Special Category':
                return <FilterList items={specialCategoryNewArray} selectedItems={searchParams.getAll('specialCategory')} onChange={(val) => handleFilterChange('specialCategory', val)} getCount={(e) => specialCategory.filter(s => s === e).length} />;
            case 'Discount':
                return <FilterList items={discountedPercentageAmountNewArray.sort((a, b) => a - b)} selectedItems={searchParams.getAll('discountedAmount').map(Number)} onChange={handleDiscountChange} getLabel={(e) => `Up to ${e}% OFF`} getCount={(e) => discountedPercentageAmount.filter(d => d === e).length} />;
            case 'On Sale':
                return (
                    <div className="p-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="onSale"
                                checked={searchParams.get('onSale') === 'true'}
                                onCheckedChange={handleOnSaleChange}
                            />
                            <Label htmlFor="onSale">On Sale Products Only</Label>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <Fragment>
            {/* Mobile Sort/Filter Bar */}
            <div className="lg:hidden font-sans absolute top-16 left-0 w-full z-30 bg-white transition-transform duration-300">
                <div className="flex bg-white shadow-sm border-b border-gray-200">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100" onClick={() => setIsSortOpen(true)}>
                        <ArrowUpDown size={16} />
                        <span>Sort</span>
                    </button>
                    <div className="w-px bg-gray-200 my-2"></div>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100" onClick={() => setIsFilterOpen(true)}>
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Sort Modal */}
            {isSortOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsSortOpen(false)}>
                    <div className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Sort By</h2>
                            <button onClick={() => setIsSortOpen(false)} className="text-gray-500 hover:text-gray-900">Close</button>
                        </div>
                        <div className="py-2">
                            {getSortingKeyValuePairs() && getSortingKeyValuePairs().map((item, index) => (
                                <button
                                    key={index}
                                    className={`w-full text-left py-3.5 px-6 flex items-center gap-3 active:bg-gray-50 ${item.key === sortvalue ? "bg-gray-50 text-blue-600" : "text-gray-700"}`}
                                    onClick={() => {
                                        handleSortChange(item.value);
                                        setSortValue(item.key);
                                        setIsSortOpen(false);
                                    }}
                                >
                                    {getIconsBySortingName(item.key)}
                                    <span className="text-sm font-medium">{item.key}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                        <h2 className="font-semibold text-lg">Filters</h2>
                        <button onClick={clearAllFilters} className="text-sm font-medium text-gray-600 hover:text-gray-900">Clear All</button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                            {['Gender', 'Categories', 'Sub Categories', 'Size', 'Price', 'Color', 'Special Category', 'Discount', 'On Sale'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-4 py-4 text-sm font-medium border-b border-gray-100 transition-colors ${activeCategory === cat ? 'bg-white text-black border-l-4 border-l-black' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Options */}
                        <div className="w-2/3 bg-white overflow-y-auto">
                            {renderFilterContent()}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4 bg-white flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => setIsFilterOpen(false)}>Close</Button>
                        <Button className="flex-1" onClick={applyPriceFilter}>Apply</Button>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

const FilterList = ({ items = [], selectedItems = [], onChange, type = 'text', getLabel = (e) => e, getCount = () => 0 }) => {
    return (
        <div className="divide-y divide-gray-100">
            {items.map((item, index) => {
                const value = type === 'color' ? item.label : item;
                const isSelected = selectedItems.includes(value.toString());

                return (
                    <div key={index} className="flex items-center justify-between px-4 py-3 active:bg-gray-50" onClick={() => onChange(item)}>
                        <div className="flex items-center gap-3">
                            <Checkbox checked={isSelected} onCheckedChange={() => onChange(item)} id={`filter-${index}`} />
                            {type === 'color' ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: item.label }}></div>
                                    <Label htmlFor={`filter-${index}`} className="text-sm capitalize cursor-pointer">{item.name}</Label>
                                </div>
                            ) : (
                                <Label htmlFor={`filter-${index}`} className="text-sm capitalize cursor-pointer">{capitalizeFirstLetterOfEachWord(getLabel(item))}</Label>
                            )}
                        </div>
                        <span className="text-xs text-gray-400">({getCount(item)})</span>
                    </div>
                )
            })}
        </div>
    )
}

const GetPrice = () => {
    const url = new URL(window.location.href);
    const urlMinPrice = url.searchParams.get('sellingPrice[$gte]');
    const urlMaxPrice = url.searchParams.get('sellingPrice[$lte]');
    if (urlMinPrice && urlMaxPrice) {
        return [Number(urlMinPrice), Number(urlMaxPrice)]
    }
    return [];
}

export default MFilter