import React, { useEffect, useState } from 'react'
import ProductFilter from './filtter'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowDownUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sortOptions } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredShopProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingViewProductTile from './ShoppingViewProductTile'
import { useSearchParams } from 'react-router-dom'
import ProductDetailsDialogue from '@/components/shopping-view/ProductDetails'
import { addToCart, fetchCartItems } from '@/store/shop/car-slice'
import { useToast } from '@/hooks/use-toast'
const createSearchParamsHelper = (filterParams) => {
    const queryParam = [];
    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(filterParams[key])) {
            queryParam.push(`${key}=${value.join(',')}`);
        }
    }
    return queryParam.join('&');
}
const ShoppingListing = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { products, ProductDetails } = useSelector(state => state.shopProductSlice)
    const { cartItems, isAddToCartUpdateLoading } = useSelector(state => state.shopCardSlice);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState('price-low-to-high');
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetails, setOpenDetails] = useState(false);
    const { toast } = useToast();


    useEffect(() => {
        // fetch Product List ---
        if (filters !== null && sort !== null) {
            //filtersParams,sortParams
            dispatch(fetchAllFilteredShopProducts({
                filtersParams: filters,
                sortParams: sort
            }));
        }
        // dispatch(fetchAllFilteredShopProducts());
    }, [dispatch, sort, filters])
    // fetch Product List ---
    const handleSort = (sortedValue) => {
        setSort(sortedValue);
    }
    const handleFilters = (getSectionId, getCurrentOptions) => {
        let copyFilters = { ...filters };
        const indexofCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);
        if (indexofCurrentSection === -1) {
            copyFilters = { ...copyFilters, [getSectionId]: [getCurrentOptions] }
        } else {
            const indexofCurrentOptions = copyFilters[getSectionId].indexOf(getCurrentOptions);
            if (indexofCurrentOptions === -1) copyFilters[getSectionId].push(getCurrentOptions);
            else copyFilters[getSectionId].splice(indexofCurrentOptions, 1);
        }
        setFilters(copyFilters);
        sessionStorage.setItem('filters', JSON.stringify(copyFilters));
    }

    const handleGetProductDetails = (id) => {
        // console.log(id);
        dispatch(fetchProductDetails(id));
    }

    const categorySearchParams = searchParams.get('category');
    useEffect(() => {
        setSort('price-low-to-high');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    }, [categorySearchParams])
    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const queryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(queryString))
        }
    }, [filters])
    useEffect(() => {
        if (ProductDetails) {
            setOpenDetails(true);
        }
    }, [ProductDetails])
    const handleAddToCart = async (productId, totalStock) => {
        let getCartItems = cartItems.items || [];
        if (getCartItems.length > 0) {
            const indexOfProduct = getCartItems.findIndex(item => item.productId === productId);
            if (indexOfProduct > -1) {
                const quantity = getCartItems[indexOfProduct].quantity;
                if (quantity + 1 > totalStock) {
                    toast({
                        title: "Product Quantity Exceeded",
                        variant: 'destructive',
                        description: "You can't add more than available stock",
                    });
                    return;
                }
            }

        }
        const result = await dispatch(addToCart({ userId: user?.id, productId: productId, quantity: 1 }))
        if (result?.payload?.Success) {
            await dispatch(fetchCartItems({ userId: user?.id }))
            toast({
                title: "Product Added to Cart Successfully",
                description: result?.payload?.message,
            });
        }
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6'>
            <ProductFilter filters={filters} handleFilters={handleFilters} />
            <div className='bg-white w-full rounded-lg shadow-sm border border-gray-200'>
                <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                    <h2 className='text-lg font-bold text-gray-900 mr-2'>
                        All Products
                    </h2>
                    <div className='flex items-center gap-3'>
                        <span className='text-gray-500'>{products?.length} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild >
                                <Button variant="outline" size="sm" className='flex items-center gap-1'>
                                    <ArrowDownUp className='w-4 h-4' />
                                    <span>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {
                                        sortOptions.map(options => (
                                            <DropdownMenuItem key={options.id} >
                                                <DropdownMenuRadioItem value={options?.id}>
                                                    {options?.label}
                                                </DropdownMenuRadioItem>

                                            </DropdownMenuItem>
                                        ))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
                    {
                        products && products.length && products.map((product, index) => (
                            <ShoppingViewProductTile key={index} product={product} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart} isLoading={isAddToCartUpdateLoading} />
                        ))
                    }
                </div>
            </div>
            <ProductDetailsDialogue open={openDetails} setOpen={setOpenDetails} ProductDetails={ProductDetails} handleAddToCart={handleAddToCart} />
        </div>
    )
}

export default ShoppingListing