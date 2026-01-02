import React, { useEffect, Fragment, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPurchasesProductToRate, postRating, singleProduct } from '../../action/productaction';
import { createbag, createwishlist, clearErrors } from '../../action/orderaction';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, clothingSizeChartData, formattedSalePrice, getLocalStorageBag } from '../../config';
import Loader from '../Loader/Loader';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import ImageZoom from './ImageZoom';
import PincodeChecker from './PincodeChecker';
import SizeChartModal from './SizeChartModal';
import StarRatingInput from './StarRatingInput';
import ReactPlayer from 'react-player';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-hot-toast';
import {
    Heart,
    ShoppingCart,
    ShoppingBag,
    Star,
    Truck,
    Shield,
    RefreshCw,
    Minus,
    Plus,
    Share2,
    Copy,
    MessageCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import Single_product from '../Product/Single_product';

import ProductImageView from './ProductImageView';

const Ppage = () => {
    const { decrypt } = useEncryptionDecryptionContext();
    const { sessionData, sessionBagData, setWishListProductInfo, setSessionStorageBagListItem } = useSessionStorage();
    const { checkAndCreateToast } = useSettingsContext();
    const navigation = useNavigate();
    const param = useParams();
    const dispatch = useDispatch();

    const { wishlist, loadingWishList, bag, bagLoading, fetchBag, fetchWishList } = useServerWishList();
    const { product, loading: productLoading, similar } = useSelector(state => state.Sproduct);
    const { user, isAuthentication } = useServerAuth();
    const { error: warning } = useSelector(state => state.wishlist);

    const [isInWishList, setIsInWishList] = useState(false);
    const [isInBagList, setIsInBagList] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentColor, setCurrentColor] = useState(null);
    const [currentSize, setCurrentSize] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [ratingData, setRatingData] = useState(null);
    const [isPostingReview, setIsPostingReview] = useState(false);
    const [selectedSize_color_Image_Array, setSelectedSizeColorImageArray] = useState([]);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const scrollableDivRef = useRef(null);

    // Initial Data Fetch
    useEffect(() => {
        dispatch(singleProduct(decrypt(param.id)));
    }, [dispatch, param.id]);

    // Handle Warnings
    useEffect(() => {
        if (warning) {
            checkAndCreateToast("warning", warning);
            dispatch(clearErrors());
        }
    }, [warning, dispatch]);

    // Initialize Selection
    useEffect(() => {
        if (product) {
            const availableSize = product.size.find(item => item.quantity > 0) || product.size[0];
            if (availableSize) {
                handleSetNewImageArray(availableSize);
            }
            checkFetchedIsPurchased();
        }
    }, [product]);

    // Update Button States
    useEffect(() => {
        if (!loadingWishList && !bagLoading) {
            updateButtonStates();
        }
    }, [user, wishlist, bag, product, loadingWishList, sessionData, sessionBagData, currentSize, currentColor]);

    const handleSetNewImageArray = (newSize) => {
        setSelectedSize(newSize);
        setCurrentSize(newSize);
        setSelectedColor(newSize.colors);

        // Try to keep the same color if available in the new size
        const isAlreadyPresent = newSize.colors.find(item => item?.label === currentColor?.label);
        if (isAlreadyPresent) {
            setCurrentColor(isAlreadyPresent);
            setSelectedSizeColorImageArray(isAlreadyPresent.images);
            if (!selectedImage) setSelectedImage(isAlreadyPresent.images[0]);
        } else {
            const defaultColor = newSize.colors[0];
            if (defaultColor) {
                setCurrentColor(defaultColor);
                setSelectedSizeColorImageArray(defaultColor.images);
                setSelectedImage(defaultColor.images[0]);
            } else {
                setCurrentColor(null);
            }
        }
    };

    const handelSetColorImages = (color) => {
        setCurrentColor(color);
        setSelectedSizeColorImageArray(color.images);
        setSelectedImage(color.images[0]);
    };

    const checkFetchedIsPurchased = async () => {
        const didPurchased = await dispatch(checkPurchasesProductToRate({ productId: product?._id }));
        setHasPurchased(didPurchased?.success || false);
    };

    const updateButtonStates = () => {
        const productId = product?._id;
        if (!productId) return;

        if (user) {
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === productId));
            const similarProductsInBag = bag?.orderItems?.filter(item => item.productId?._id === productId);

            if (similarProductsInBag?.length > 0) {
                if (currentSize && currentColor) {
                    const matchingItem = similarProductsInBag.find(item =>
                        item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
                    );
                    setIsInBagList(!!matchingItem);
                } else {
                    setIsInBagList(similarProductsInBag.some(item => item.isChecked));
                }
            } else {
                setIsInBagList(false);
            }
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === productId));
            const similarProductsInBag = getLocalStorageBag().filter(item => item.productId === productId);

            if (similarProductsInBag?.length > 0) {
                if (currentSize && currentColor) {
                    const matchingItem = similarProductsInBag.find(item =>
                        item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
                    );
                    setIsInBagList(!!matchingItem);
                } else {
                    setIsInBagList(similarProductsInBag.some(item => item.isChecked));
                }
            } else {
                setIsInBagList(false);
            }
        }
    };

    const addToBag = async () => {
        if (isInBagList) {
            navigation("/bag");
            return;
        }
        if (!currentColor) return checkAndCreateToast("error", "No Color Selected");
        if (!currentSize) return checkAndCreateToast("error", "No Size Selected");
        if (currentSize.quantity <= 0) return checkAndCreateToast("error", "Size Out of Stock");
        if (currentColor.quantity <= 0) return checkAndCreateToast("error", "Color Out of Stock");

        const orderData = {
            productId: decrypt(param.id),
            quantity: 1,
            color: currentColor,
            size: currentSize,
            isChecked: true,
            ...(user ? { userId: user.id } : { ProductData: product })
        };

        if (user) {
            const response = await dispatch(createbag(orderData));
            if (response) {
                await fetchBag();
                checkAndCreateToast("success", "Added to Bag");
            } else {
                checkAndCreateToast("error", "Failed to add to bag");
            }
            setIsInBagList(response);
        } else {
            setSessionStorageBagListItem(orderData, decrypt(param.id));
            checkAndCreateToast("success", "Added to Bag");
            updateButtonStates();
        }
    };

    const addToWishList = async () => {
        if (user) {
            const response = await dispatch(createwishlist({ productId: decrypt(param.id) }));
            await fetchWishList();
            checkAndCreateToast("success", response ? "Added to Wishlist" : "Removed from Wishlist");
            setIsInWishList(response);
        } else {
            setWishListProductInfo(product, decrypt(param.id));
            checkAndCreateToast("success", "Wishlist Updated");
            updateButtonStates();
        }
    };

    const handleBuyNow = async () => {
        if (!currentColor) return checkAndCreateToast("error", "No Color Selected");
        if (!currentSize) return checkAndCreateToast("error", "No Size Selected");

        const orderData = {
            productId: decrypt(param.id),
            quantity: 1,
            color: currentColor,
            size: currentSize,
            ...(user ? { userId: user.id } : { ProductData: product })
        };

        if (user) {
            const response = await dispatch(createbag(orderData));
            if (response) {
                await fetchBag();
                navigation("/bag/checkout");
            }
        } else {
            setSessionStorageBagListItem(orderData, decrypt(param.id));
            navigation("/bag/checkout");
        }
    };

    const PostRating = async (e) => {
        e.preventDefault();
        if (ratingData && user && product) {
            setIsPostingReview(true);
            try {
                await dispatch(postRating({ productId: product?._id, ratingData }));
                dispatch(singleProduct(decrypt(param.id)));
                toast.success("Review Submitted");
                setRatingData(null);
            } catch (error) {
                checkAndCreateToast("error", "Error Posting Review");
            } finally {
                setIsPostingReview(false);
            }
        }
    };

    const handleShare = (type) => {
        const url = window.location.href;
        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=Check%20out%20this%20product!%20${encodeURIComponent(url)}`, "_blank");
        } else if (type === 'copy') {
            navigator.clipboard.writeText(url);
            toast.success("Link Copied!");
        }
    };

    if (productLoading || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    const discount = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <div ref={scrollableDivRef} className="min-h-screen bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column: Images */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border relative">
                            {selectedImage && (
                                selectedImage.url?.match(/\.(mp4|mov|avi)$/) || selectedImage.url?.includes("video") ? (
                                    <ReactPlayer
                                        url={selectedImage.url}
                                        playing
                                        loop
                                        muted
                                        width="100%"
                                        height="100%"
                                        className="object-cover"
                                    />
                                ) : (
                                    <ImageZoom imageSrc={selectedImage.url || selectedImage} />
                                )
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {selectedSize_color_Image_Array?.slice(0, 3).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    {img.url?.match(/\.(mp4|mov|avi)$/) || img.url?.includes("video") ? (
                                        <video src={img.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <LazyLoadImage
                                            src={img.url}
                                            alt={`View ${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </button>
                            ))}

                            {selectedSize_color_Image_Array?.length > 3 && (
                                <button
                                    onClick={() => setShowImagePopup(true)}
                                    className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 relative group"
                                >
                                    {selectedSize_color_Image_Array[3].url?.match(/\.(mp4|mov|avi)$/) || selectedSize_color_Image_Array[3].url?.includes("video") ? (
                                        <video src={selectedSize_color_Image_Array[3].url} className="w-full h-full object-cover" />
                                    ) : (
                                        <LazyLoadImage
                                            src={selectedSize_color_Image_Array[3].url}
                                            alt="More"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-colors">
                                        <span className="text-white font-semibold text-lg">
                                            +{selectedSize_color_Image_Array.length - 3}
                                        </span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {showImagePopup && (
                        <ProductImageView
                            images={selectedSize_color_Image_Array}
                            initialIndex={0}
                            onClose={() => setShowImagePopup(false)}
                        />
                    )}

                    {/* Right Column: Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="capitalize">
                                    {product.gender}
                                </Badge>
                                {discount > 0 && (
                                    <Badge className="bg-red-500">{discount}% OFF</Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {capitalizeFirstLetterOfEachWord(product.title)}
                            </h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.round(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({product.Rating?.length || 0} reviews)
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">
                                    ₹{formattedSalePrice(product.salePrice || product.price)}
                                </span>
                                {product.salePrice && (
                                    <span className="text-2xl text-gray-400 line-through">
                                        ₹{formattedSalePrice(product.price)}
                                    </span>
                                )}
                            </div>
                            <p className="text-green-600 text-sm mt-1 font-medium">Inclusive of all taxes</p>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">Size: <span className="font-normal">{currentSize?.label}</span></h3>
                                <SizeChartModal sizeChartData={clothingSizeChartData} />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.size?.map((size, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSetNewImageArray(size)}
                                        disabled={size.quantity <= 0}
                                        className={`min-w-[3.5rem] h-14 px-4 rounded-lg font-medium border-2 transition-all relative ${currentSize?._id === size._id
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : size.quantity <= 0
                                                ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                                                : "border-gray-200 hover:border-gray-400 text-gray-900"
                                            }`}
                                    >
                                        {size.label}
                                        {size.quantity <= 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                Sold Out
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Color: <span className="font-normal">{currentColor?.name}</span></h3>
                            <div className="flex flex-wrap gap-3">
                                {selectedColor?.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handelSetColorImages(color)}
                                        disabled={color.quantity <= 0}
                                        className={`w-12 h-12 rounded-full border-2 p-1 transition-all relative ${currentColor?._id === color._id
                                            ? "border-gray-900 scale-110"
                                            : "border-transparent hover:border-gray-300"
                                            }`}
                                        title={color.name}
                                    >
                                        <div
                                            className="w-full h-full rounded-full border border-gray-200 shadow-sm"
                                            style={{ backgroundColor: color.label || color.name }}
                                        />
                                        {color.quantity <= 0 && (
                                            <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
                                                <div className="w-full h-0.5 bg-red-500 rotate-45" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pincode Checker */}
                        <div className="py-4 border-t border-b border-gray-100">
                            <PincodeChecker productId={decrypt(param.id)} />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 h-14">
                                <Button
                                    className="flex-1 h-full text-base font-semibold bg-gray-900 hover:bg-gray-800"
                                    onClick={addToBag}
                                    disabled={bagLoading}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {isInBagList ? "GO TO CART" : "ADD TO CART"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-full aspect-square"
                                    onClick={addToWishList}
                                    disabled={loadingWishList}
                                >
                                    <Heart className={`w-6 h-6 ${isInWishList ? "fill-red-500 text-red-500" : ""}`} />
                                </Button>
                            </div>
                            <Button
                                className="h-14 w-full text-base font-semibold text-gray-900"
                                onClick={handleBuyNow}
                                variant="outline"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                BUY NOW
                            </Button>
                        </div>

                        {/* Share */}
                        <div className="flex items-center gap-4 pt-4">
                            <span className="text-sm font-medium text-gray-500">Share:</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleShare('whatsapp')} className="hover:text-green-600">
                                    <MessageCircle className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleShare('copy')} className="hover:text-blue-600">
                                    <Copy className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            <div className="text-center">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-xs text-gray-600">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-xs text-gray-600">Easy Returns</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <p className="text-xs text-gray-600">Secure Payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="material">Material & Care</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>

                                {product.bulletPoints?.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-medium mb-3">Highlights</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                            {product.bulletPoints.map((point, i) => (
                                                <li key={i}>
                                                    <span className="font-medium text-gray-900">{point.header}: </span>
                                                    {point.body}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.specification && (
                                    <div className="mt-6">
                                        <h4 className="font-medium mb-3">Specifications</h4>
                                        <p className="text-gray-600">{product.specification}</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="material" className="space-y-6">
                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-4">Material & Care</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-medium mb-2">Material</h4>
                                        <p className="text-gray-600">{product.material || "N/A"}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Care Instructions</h4>
                                        <p className="text-gray-600">{product.careInstructions || "Machine wash cold. Tumble dry low."}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                                {hasPurchased && !ratingData && (
                                    <Button onClick={() => setRatingData({ rating: 5, comment: "" })}>
                                        Write a Review
                                    </Button>
                                )}
                            </div>

                            {ratingData && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <h4 className="font-semibold mb-4">Write Your Review</h4>
                                        <form onSubmit={PostRating} className="space-y-4">
                                            <div>
                                                <Label>Rating</Label>
                                                <div className="mt-2">
                                                    <StarRatingInput
                                                        onChangeValue={(val) => setRatingData({ ...ratingData, rating: val })}
                                                        value={ratingData.rating}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Review</Label>
                                                <Textarea
                                                    value={ratingData.comment}
                                                    onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                                                    placeholder="Share your thoughts..."
                                                    className="mt-2"
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={isPostingReview}>
                                                    {isPostingReview ? "Submitting..." : "Submit Review"}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={() => setRatingData(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-6">
                                {product.Rating?.length > 0 ? (
                                    product.Rating.map((review, idx) => (
                                        <div key={idx} className="border-b pb-6 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-medium text-gray-900">{review.userName || "User"}</span>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Similar Products */}
                {similar?.length > 0 && (
                    <div className="mt-20 border-t pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {similar.map((pro, index) => (
                                <Single_product
                                    key={index}
                                    pro={pro}
                                    user={user}
                                    onChangeItems={() => {
                                        dispatch(singleProduct(pro._id));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            <WhatsAppButton scrollableDivRef={scrollableDivRef} />

            {/* Sticky Bottom Bar for Mobile/Tablet (Hidden on Desktop) */}
            {/* Sticky Bottom Bar for Mobile/Tablet (Visible on all sizes if needed, or adjust breakpoint) */}
            {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-[100] flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
                <Button
                    variant="outline"
                    className="aspect-square h-12 rounded-xl border-gray-300"
                    onClick={addToWishList}
                    disabled={loadingWishList}
                >
                    <Heart className={`w-6 h-6 ${isInWishList ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </Button>
                <Button
                    className="flex-1 h-12 rounded-xl text-sm font-semibold border-2 border-gray-900 text-gray-900 hover:bg-gray-50 bg-transparent"
                    onClick={addToBag}
                    disabled={bagLoading}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isInBagList ? "GO TO BAG" : "ADD TO CART"}
                </Button>
                <Button
                    className="flex-1 h-12 rounded-xl text-sm font-semibold text-white"
                    variant="default"
                    onClick={handleBuyNow}
                >
                    BUY NOW
                </Button>
            </div> */}
        </div>
    );
};

export default Ppage;