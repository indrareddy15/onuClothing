import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, getImagesArrayFromProducts } from '../../config';
import AutoSlidingCarousel from './AutoSlidingCarousel';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import { useDispatch } from 'react-redux';
import { createwishlist } from '../../action/orderaction';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

/**
 * SingleProduct Component
 * Enhanced product card following newCode design system
 * Features: Modern card layout, hover effects, wishlist integration
 */
const SingleProduct = React.memo(({ pro, user, showWishList = true, onChangeItems }) => {
    const { encrypt, decrypt } = useEncryptionDecryptionContext();
    const { updateRecentlyViewProducts, sessionData } = useSessionStorage();
    const { wishlist, fetchWishList } = useServerWishList();
    const { checkAndCreateToast } = useSettingsContext();
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check wishlist status
    useEffect(() => {
        if (user && wishlist?.orderItems) {
            setIsWishlisted(wishlist.orderItems.some(w => w.productId?._id === pro?._id));
        } else if (!user) {
            setIsWishlisted(sessionData.some(b => b.productId?._id === pro?._id));
        }
    }, [user, wishlist, pro, sessionData]);

    if (!pro || !imageArray?.length) {
        return (
            <div className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3 animate-pulse">
                    <Skeleton className="w-full h-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
            </div>
        );
    }

    const productTitle = pro?.title?.length > 40
        ? `${capitalizeFirstLetterOfEachWord(pro?.title.slice(0, 40))}...`
        : capitalizeFirstLetterOfEachWord(pro?.title);

    const { salePrice, price } = pro;
    const displayPrice = salePrice || price;
    const discount = salePrice ? calculateDiscountPercentage(price, salePrice) : 0;

    const handleNavigation = () => {
        const productEncryption = encrypt(pro._id);
        navigation(`/products/${productEncryption}`);
        updateRecentlyViewProducts(pro);
        if (onChangeItems) {
            onChangeItems();
        }
    };

    const handleWishlistToggle = async (e) => {
        e.stopPropagation();
        setIsLoading(true);

        try {
            if (user) {
                await dispatch(createwishlist({ productId: pro._id }));
                await fetchWishList();
                checkAndCreateToast('success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            } else {
                // Handle guest wishlist via session storage
                checkAndCreateToast('success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            }
        } catch (error) {
            checkAndCreateToast('error', 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const mainImage = imageArray[0]?.url || 'https://via.placeholder.com/500';

    return (
        <div
            className="group cursor-pointer"
            onClick={handleNavigation}
        >
            {/* Product Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <AutoSlidingCarousel pro={pro} user={user} showWishList={false} />

                {/* Discount Badge */}
                {discount > 0 && (
                    <Badge variant="destructive" className="absolute top-3 left-3 z-10">
                        {discount}% OFF
                    </Badge>
                )}

                {/* Out of Stock Overlay */}
                {pro.totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <Badge variant="secondary" className="font-semibold">
                            Out of Stock
                        </Badge>
                    </div>
                )}

                {/* Wishlist Button */}
                {showWishList && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg"
                            onClick={handleWishlistToggle}
                            disabled={isLoading}
                        >
                            <Heart
                                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                            />
                        </Button>
                    </div>
                )}

                {/* Quick Add Button */}
                {pro.totalStock > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                            className="w-full bg-gray-900 text-white hover:bg-gray-800 border border-gray-900 font-medium shadow-lg hover:shadow-xl transition-all"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation();
                            }}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Quick Add
                        </Button>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {productTitle}
                </h3>


                {/* Rating */}
                {(pro.average_rating !== undefined || pro.averageRating !== undefined || pro.rating !== undefined) && (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">
                            {(pro.average_rating || pro.averageRating || pro.rating || 0).toFixed(1)}
                        </span>
                        {(pro.review_count > 0 || pro.reviewCount > 0 || pro.reviews > 0) && (
                            <span className="text-sm text-gray-500">
                                ({pro.review_count || pro.reviewCount || pro.reviews || 0})
                            </span>
                        )}
                    </div>
                )}


                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                        ₹{formattedSalePrice(displayPrice)}
                    </span>
                    {salePrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{formattedSalePrice(price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

export default SingleProduct;
