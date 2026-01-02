import React, { Fragment, useEffect, useRef, useState } from 'react';
import Single_product from './Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { Allproduct as getproduct, clearErrors } from '../../action/productaction';
import MFilter from './MFilter';
import Footer from '../Footer/Footer';
import FilterView from './FilterView';
import { ChevronDown, X, Filter } from 'lucide-react';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import { getReverseSortingValueValues, getSortingKeyValuePairs } from '../../config';
import { useServerBanners } from '../../Contaxt/ServerBannerContext';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Button } from '../../components/ui/button';
import ProductCardSkeleton from './ProductCardSkeleton';

const maxAmountPerPage = 50;

const Allproductpage = ({ user }) => {
    const [state, setstate] = useState(false);
    const [state1, setstate1] = useState(false);
    const scrollableDivRef = useRef(null);
    const dispatch = useDispatch();
    const { product, pro, loading: productLoading, error, length } = useSelector(state => state.Allproducts);
    const { noFilterProducts, productAllProductsLoading, handleFetchFilter } = useServerBanners();
    const [sortvalue, setSortValue] = useState('What`s New');
    const [currentPage, setCurrentPage] = useState(1);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
        dispatch(getproduct(e));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const dispatchFetchAllProduct = () => {
        dispatch(getproduct(currentPage));
    };

    const handleSortChange = (newSortBy) => {
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);
        urlParams.set('sortBy', newSortBy);
        const newUrl = `${currentUrl.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
        dispatchFetchAllProduct();
    };

    const setTheCurrentSortValues = () => {
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);
        const sortBy = urlParams.get('sortBy');
        setSortValue(getReverseSortingValueValues(sortBy));
    }

    const getActiveFilters = () => {
        const params = new URLSearchParams(window.location.search);
        const filters = [];
        ['gender', 'category', 'subcategory', 'size', 'specialCategory', 'color'].forEach(key => {
            params.getAll(key).forEach(value => {
                filters.push({ key, value, label: value });
            });
        });
        if (params.get('onSale') === 'true') {
            filters.push({ key: 'onSale', value: 'true', label: 'On Sale' });
        }
        const discount = params.get('discountedAmount');
        if (discount) {
            filters.push({ key: 'discountedAmount', value: discount, label: `Up to ${discount}%` });
        }

        const minPrice = params.get('sellingPrice[$gte]');
        const maxPrice = params.get('sellingPrice[$lte]');
        if (minPrice && maxPrice) {
            filters.push({ key: 'price', value: `${minPrice}-${maxPrice}`, label: `₹${minPrice} - ₹${maxPrice}` });
        }

        return filters;
    };

    const removeFilter = (key, value) => {
        const url = new URL(window.location.href);
        if (key === 'discountedAmount' || key === 'onSale') {
            url.searchParams.delete(key);
        } else if (key === 'price') {
            url.searchParams.delete('sellingPrice[$gte]');
            url.searchParams.delete('sellingPrice[$lte]');
        } else {
            const values = url.searchParams.getAll(key);
            const newValues = values.filter(v => v !== value);
            url.searchParams.delete(key);
            newValues.forEach(v => url.searchParams.append(key, v));
        }
        window.history.replaceState(null, "", url.toString());
        dispatchFetchAllProduct();
    };

    const clearFilters = () => {
        handleFetchFilter();
    };

    useEffect(() => {
        if (state1 === false) {
            dispatch(getproduct());
            handleFetchFilter();
            setstate1(true);
        }

        if (error) {
            dispatch(clearErrors());
        }
        if (state === false) {
            if (productLoading === false) {
                if (window.scroll > 0) {
                    document.documentElement.scrollTo = 0;
                }
                setstate(true);
            }
        }
    }, [dispatch, error, state, productLoading, state1]);

    useEffect(() => {
        setTheCurrentSortValues();
    }, [])

    const totalPages = Math.ceil(length / maxAmountPerPage);

    return (
        <div className="min-h-screen bg-white">
            {(!productAllProductsLoading && noFilterProducts && noFilterProducts.length > 0) && (
                <MFilter
                    sortvalue={sortvalue}
                    setSortValue={setTheCurrentSortValues}
                    scrollableDivRef={scrollableDivRef}
                    product={noFilterProducts}
                    handleSortChange={handleSortChange}
                    handleResetFilter={handleFetchFilter}
                />
            )}
            <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header Section */}
                <div className='hidden lg:block mb-8'>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
                    <p className="text-gray-600 mb-6">
                        {productLoading ? 'Loading products...' : `${pro?.length || 0} products found`}
                    </p>

                    {/* Active Filters */}
                    {getActiveFilters().length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-gray-600 text-sm font-medium">Active Filters:</span>
                            {getActiveFilters().slice(0, 2).map((filter, idx) => (
                                <button
                                    key={`${filter.key}-${idx}`}
                                    onClick={() => removeFilter(filter.key, filter.value)}
                                    className="flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors"
                                >
                                    {filter.label}
                                    <X className="w-3 h-3" />
                                </button>
                            ))}
                            {getActiveFilters().length > 2 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                                    +{getActiveFilters().length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <SortingOptions sortvalue={sortvalue} handleSortChange={handleSortChange} setSortValue={setSortValue} />

                <div className="flex gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                            {!productAllProductsLoading && noFilterProducts && noFilterProducts.length > 0 && (
                                <FilterView
                                    product={noFilterProducts}
                                    dispatchFetchAllProduct={dispatchFetchAllProduct}
                                    handleResetFilter={handleFetchFilter}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {productLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : !pro || pro.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        ) : (
                            <div className='space-y-8'>
                                {/* Products Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {pro.map((p, index) => (
                                        <div key={`productId_${p._id}_${index}`}>
                                            <Single_product pro={p} user={user} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Section */}
                                {totalPages > 1 && (
                                    <div className="border-t border-gray-200 pt-6 mt-8">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => currentPage > 1 && setCurrentPageNo(currentPage - 1)}
                                                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>

                                                {/* Logic to show pages. Simplified for now, can be expanded for complex ranges */}
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const page = i + 1;
                                                    if (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationLink
                                                                    isActive={page === currentPage}
                                                                    onClick={() => setCurrentPageNo(page)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    } else if (
                                                        page === currentPage - 2 ||
                                                        page === currentPage + 2
                                                    ) {
                                                        return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                                                    }
                                                    return null;
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => currentPage < totalPages && setCurrentPageNo(currentPage + 1)}
                                                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* MFilter moved to top */}
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            <WhatsAppButton scrollableDivRef={scrollableDivRef} />
        </div>
    );
};

const SortingOptions = ({ sortvalue, handleSortChange, setSortValue }) => {
    return (
        <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-900 uppercase">Filters</div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[240px] justify-between">
                        <span className="text-sm text-gray-700">
                            Sort by: <span className="font-medium text-gray-900">{sortvalue}</span>
                        </span>
                        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                    {getSortingKeyValuePairs() && getSortingKeyValuePairs().map((value, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => {
                                handleSortChange(value.value);
                                setSortValue(value.key);
                            }}
                            className={value.key === sortvalue ? "bg-gray-100" : ""}
                        >
                            {value.key}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Allproductpage;
