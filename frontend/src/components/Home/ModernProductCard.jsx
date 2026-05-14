import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { formattedSalePrice } from "../../config";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEncryptionDecryptionContext } from "../../Contaxt/EncryptionContext";
import { useSessionStorage } from "../../Contaxt/SessionStorageContext";
import { useDispatch } from "react-redux";
import { createwishlist } from "../../action/orderaction";
import { useServerWishList } from "../../Contaxt/ServerWishListContext";
import { useServerAuth } from "../../Contaxt/AuthContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";

const ModernProductCard = ({ product }) => {
    const { encrypt } = useEncryptionDecryptionContext();
    const { updateRecentlyViewProducts, sessionData } = useSessionStorage();
    const { wishlist, fetchWishList } = useServerWishList();
    const { user } = useServerAuth();
    const { checkAndCreateToast } = useSettingsContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check wishlist status
    useEffect(() => {
        if (user && wishlist?.orderItems) {
            setIsWishlisted(wishlist.orderItems.some(w => w.productId?._id === product?._id));
        } else if (!user) {
            setIsWishlisted(sessionData.some(b => b.productId?._id === product?._id));
        }
    }, [user, wishlist, product, sessionData]);

    const handleProductClick = () => {
        const encryptedId = encrypt(product._id);
        updateRecentlyViewProducts(product);
        navigate(`/products/${encryptedId}`);
    };

    const handleWishlistToggle = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            if (user) {
                await dispatch(createwishlist({ productId: product._id }));
                await fetchWishList();
                checkAndCreateToast('success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            } else {
                checkAndCreateToast('warning', 'Please login to add items to wishlist');
            }
        } catch (error) {
            checkAndCreateToast('error', 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // Get images
    let images = product?.images;
    if (!images || images.length === 0) {
        if (product?.AllColors && product.AllColors.length > 0) {
            images = product.AllColors[0].images;
        }
    }

    const mainImage = images?.[0]?.url || "https://via.placeholder.com/400x500?text=No+Image";
    const hoverImage = images?.[1]?.url || mainImage;

    // Calculate discount
    const discount = product.salePrice > 0
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <div
            className="group relative w-full cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProductClick}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
                {/* Main Image */}
                <LazyLoadImage
                    src={mainImage}
                    alt={product.title}
                    className={`
            h-full w-full object-cover object-center transition-all duration-700 ease-in-out
            ${isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"}
          `}
                    wrapperClassName="w-full h-full"
                />

                {/* Hover Image (Background) */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${hoverImage})`,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "scale(1.1)" : "scale(1.0)"
                    }}
                />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {product.isNew && (
                        <span className="rounded-full bg-black px-2 py-1 text-xs font-bold text-white shadow-sm">
                            NEW
                        </span>
                    )}
                </div>

                {/* Quick Actions Overlay */}
                <div className={`
          absolute bottom-4 left-4 right-4 flex justify-center gap-3
          transition-all duration-300 transform
          ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-black hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(); }}
                        title="Add to Cart"
                    >
                        <ShoppingBag size={18} />
                    </button>
                    <button
                        className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors ${
                            isWishlisted ? "bg-red-500 text-white" : "bg-white text-black hover:bg-black hover:text-white"
                        }`}
                        onClick={handleWishlistToggle}
                        disabled={isLoading}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                    </button>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-black hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(); }}
                        title="Quick View"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2">
                    {product.salePrice > 0 ? (
                        <>
                            <span className="text-sm font-bold text-black">
                                ₹{formattedSalePrice(product.salePrice)}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                                ₹{formattedSalePrice(product.price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-black">
                            ₹{formattedSalePrice(product.price)}
                        </span>
                    )}
                </div>

                {/* Color Preview (Optional) */}
                {product.AllColors && product.AllColors.length > 0 && (
                    <div className="flex gap-1 pt-1">
                        {product.AllColors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="h-3 w-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.label }}
                            />
                        ))}
                        {product.AllColors.length > 4 && (
                            <span className="text-[10px] text-gray-500">+{product.AllColors.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernProductCard;
