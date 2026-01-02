import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { formattedSalePrice } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';

const CartItem = ({ item, updateQuantity, removeItem, isSession }) => {
    const { encrypt } = useEncryptionDecryptionContext();

    // Normalize data structure between session and auth items
    const product = isSession ? item.ProductData : item.productId;
    const quantity = item.quantity;
    const size = item.size;
    const color = item.color;
    const price = product.salePrice || product.price;
    const productId = product._id;
    const itemId = isSession ? item._id : item.productId._id; // For session, we might use a different ID or just product ID if unique

    // Helper to check for video
    const isVideo = (url) => {
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', 'video'];
        return videoExtensions.some(ext => url?.toLowerCase().endsWith(ext));
    };

    // Get valid image
    const imagesOnly = color?.images?.filter((image) => image.url && !isVideo(image.url));
    const validImage = imagesOnly?.[0]?.url || product.images?.[0]?.url;
    const productLink = `/products/${encrypt(productId)}`;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex gap-4">
                {/* Product Image */}
                <Link to={productLink} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {validImage ? (
                            <LazyLoadImage
                                src={validImage}
                                alt={product.title}
                                effect="blur"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                    </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <Link to={productLink}>
                                <h3 className="font-semibold text-gray-900 truncate hover:text-gray-600 transition-colors">
                                    {product.title}
                                </h3>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 -mr-2 -mt-2"
                                onClick={() => removeItem(productId, item._id, size, color)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                            {size && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Size: {size.label}</span>}
                            {color && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                Color: {color.name}
                                <span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{ backgroundColor: color.label || color.name }}></span>
                            </span>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg bg-gray-50">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-lg hover:bg-gray-200"
                                onClick={() => updateQuantity(productId, -1, size, color)}
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-r-lg hover:bg-gray-200"
                                onClick={() => updateQuantity(productId, 1, size, color)}
                                disabled={quantity >= size?.quantity}
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <span className="font-bold text-gray-900">
                                ₹{formattedSalePrice(price * quantity)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
