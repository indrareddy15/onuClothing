import React, { useEffect, useState } from 'react'
import banner1 from '../../assets/banner-1.webp';
import banner2 from '../../assets/banner-2.webp';
import banner3 from '../../assets/banner-3.webp';
import { Apple, BabyIcon, Clock2, CloudLightning, Images, ShirtIcon, Speaker, SquareChartGantt, WatchIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredShopProducts, fetchProductDetails } from '@/store/shop/product-slice';
import ShoppingViewProductTile from './ShoppingViewProductTile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/car-slice';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsDialogue from '@/components/shopping-view/ProductDetails';
import { getFeatureImage } from '@/store/common-slice';
import Carousel from './Carousel';
import HeroBanner from '@/components/shopping-view/HeroBanner';
import FeatureIcons from '@/components/shopping-view/FeatureIcons';
const ShoppingHome = () => {
    const { user } = useSelector(state => state.auth);
    const { featuresList } = useSelector(state => state.common);
    const { products, ProductDetails } = useSelector(state => state.shopProductSlice)
    const { isAddToCartUpdateLoading } = useSelector(state => state.shopCardSlice);
    const navigate = useNavigate();
    const { toast } = useToast();
    /* const category = [
        {id:'men', label:'Men',icon:ShirtIcon},
        {id:'women', label:'Women',icon:CloudLightning},
        {id:'kids', label:'Kids',icon:BabyIcon},
        {id:'watch', label:'Watch',icon:WatchIcon},
        {id:'footwear', label:'Footwear',icon:SquareChartGantt},
        {id:'clothing', label:'Clothing',icon:SquareChartGantt},
        {id:'electronics', label:'Electronics',icon:WatchIcon},
        {id:'footwear', label:'Footwear',icon:WatchIcon},
        
    ]
    const brands = [
        {id:'apple', label:'Apple',icon:Apple},
        {id:'samsung', label:'Samsung',icon:BabyIcon},
        {id:'huawei', label:'Huawei',icon:WatchIcon},
        {id:'xiaomi', label:'Xiaomi',icon:Images},
        {id:'oppo', label:'Oppo',icon:CloudLightning},
        {id:'puma', label:'Puma',icon:Speaker},
        {id:'rebook', label:'Rebook',icon:Clock2},
        {id:'h&m', label:'H&M',icon:ShirtIcon},
        
    ] */
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [banner1, banner2, banner3];
    const [openDetails, setOpenDetails] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAllFilteredShopProducts({ filtersParams: [], sortParams: 'price-low-to-high' }))
    }, [])
    /* useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer); // Cleanup on unmount
    }, [slides.length]); */
    useEffect(() => {
        if (ProductDetails) {
            setOpenDetails(true);
        }
    }, [ProductDetails])


    const handleGetProductDetails = (id) => {
        console.log(id);
        dispatch(fetchProductDetails(id));
    }
    const handleAddToCart = async (productId) => {
        const result = await dispatch(addToCart({ userId: user?.id, productId: productId, quantity: 1 }))
        if (result?.payload?.Success) {
            await dispatch(fetchCartItems({ userId: user?.id }))
            toast({
                title: "Product Added to Cart Successfully",
                description: result?.payload?.message,
            });
        }
    }
    const handleNavigateToListingPage = (item, section) => {
        sessionStorage.removeItem('filters');
        const currentFilters = {
            [section]: [item.id]
        }
        sessionStorage.setItem('filters', JSON.stringify(currentFilters));
        navigate(`/shop/listing`);
    }
    useEffect(() => {
        dispatch(getFeatureImage());
    }, [dispatch])
    console.log('feature Images Array: ', featuresList);
    return (
        <div className='flex flex-col w-full min-h-screen'>
            {/* Hero Banner */}
            <HeroBanner />

            {/* Carousel Section */}
            {
                featuresList && featuresList.length > 0 && <Carousel setCurrentSlide={setCurrentSlide} currentSlide={currentSlide} featuresList={featuresList} />
            }

            {/* Feature Icons Section */}
            <FeatureIcons />

            {/* Category Images Grid */}
            <div className='columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4 px-4'>
                {
                    featuresList && featuresList.length && featuresList.map((item, index) => (
                        <div key={index} onClick={() => handleNavigateToListingPage(item, 'category')} className='mb-4 cursor-pointer break-inside-avoid relative hover:opacity-95 transition-opacity'>
                            <img
                                src={item.image}
                                alt='features Images'
                                className='w-full object-cover rounded-lg shadow-sm'
                            />
                            <span className='absolute bottom-1/3 min-w-1.5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded font-medium'>{item?.category}</span>

                        </div>
                    ))
                }
            </div>

            <div className='mx-auto px-4 collage-container'>
                <h2 className='text-3xl font-bold text-center mb-8 text-gray-900'>Shop by Brands</h2>
            </div>
            <div className='columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4 px-4'>
                {
                    featuresList && featuresList.length && featuresList.map((item, index) => (
                        <div key={index} onClick={() => handleNavigateToListingPage(item, 'category')} className='mb-4 cursor-pointer break-inside-avoid relative hover:opacity-95 transition-opacity'>
                            <img
                                src={item.image}
                                alt='features Images'
                                className='w-full object-cover rounded-lg shadow-sm'
                            />
                            <span className='absolute bottom-1/3 min-w-1.5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded font-medium'>{item?.brand}</span>
                        </div>
                    ))
                }
            </div>
            <section className='py-12 bg-gray-50'>
                <div className='container mx-auto px-4'>
                    <h2 className='text-4xl font-bold text-center mb-12 text-gray-900'>Featured Products</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
                        {
                            products && products.length > 0 && products.slice(0, 8).map((product, index) => (
                                <div
                                    key={index}
                                    className='animate-fade-in-up opacity-0'
                                    style={{
                                        animationDelay: `${index * 100 + 400}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    <ShoppingViewProductTile
                                        product={product}
                                        handleGetProductDetails={handleGetProductDetails}
                                        handleAddToCart={handleAddToCart}
                                        isLoading={isAddToCartUpdateLoading}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <ProductDetailsDialogue
                open={openDetails}
                setOpen={setOpenDetails}
                ProductDetails={ProductDetails}
                handleAddToCart={handleAddToCart}
            />

        </div>
    )
}

export default ShoppingHome
