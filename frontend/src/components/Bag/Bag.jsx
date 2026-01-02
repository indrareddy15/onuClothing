import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { getqtyupdate, deleteBag } from '../../action/orderaction';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import Footer from '../Footer/Footer';

const Bag = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { checkAndCreateToast } = useSettingsContext();

    // Contexts
    const { user, isAuthentication } = useServerAuth();
    const { bag, bagLoading, fetchBag } = useServerWishList();
    const { sessionBagData, updateBagQuantity, removeBagSessionStorage } = useSessionStorage();

    // State
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({
        subtotal: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 0
    });

    // Normalize Cart Items
    useEffect(() => {
        if (user && bag?.orderItems) {
            setCartItems(bag.orderItems);
        } else if (!user && sessionBagData) {
            setCartItems(sessionBagData);
        } else {
            setCartItems([]);
        }
    }, [user, bag, sessionBagData]);

    // Calculate Totals
    useEffect(() => {
        let subtotal = 0;
        let discount = 0;

        cartItems.forEach(item => {
            const product = user ? item.productId : item.ProductData;
            const quantity = item.quantity;
            const price = product.price;
            const salePrice = product.salePrice;

            // Subtotal is based on MRP (original price)
            subtotal += price * quantity;

            // Discount is difference between MRP and Sale Price
            if (salePrice && salePrice < price) {
                discount += (price - salePrice) * quantity;
            }
        });

        const shipping = (subtotal - discount) > 5000 ? 0 : (subtotal === 0 ? 0 : 0); // Assuming free shipping for now or logic from backend
        // Note: The original code had convenience fees logic. For now, I'll simplify.
        // If needed, we can fetch convenience fees again.

        const total = subtotal - discount + shipping;

        setTotals({
            subtotal,
            discount,
            shipping,
            total
        });

    }, [cartItems, user]);

    // Handlers
    const handleUpdateQuantity = async (productId, change, size, color) => {
        const item = cartItems.find(i => {
            const pId = user ? i.productId._id : i.ProductData._id;
            return pId === productId && i.size._id === size._id && i.color._id === color._id;
        });

        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;
        if (newQuantity > item.size.quantity) {
            checkAndCreateToast("error", "Max quantity reached");
            return;
        }

        if (user) {
            await dispatch(getqtyupdate({ id: productId, size, color, qty: newQuantity }));
            fetchBag();
        } else {
            updateBagQuantity(productId, size, color, newQuantity);
        }
    };

    const handleRemoveItem = async (productId, itemId, size, color) => {
        if (user) {
            await dispatch(deleteBag({ productId, bagOrderItemId: itemId, size, color }));
            fetchBag();
        } else {
            removeBagSessionStorage(productId, size, color);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            checkAndCreateToast("error", "Your bag is empty");
            return;
        }
        navigate('/bag/checkout');
    };

    // Loading State
    if (bagLoading && user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Bag</h1>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                        </div>
                        <div className="lg:col-span-1">
                            <Skeleton className="h-64 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty State
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your bag yet.
                    Start shopping to fill it up!
                </p>
                <Button onClick={() => navigate('/products')} size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Bag</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <CartItem
                                key={index}
                                item={item}
                                isSession={!user}
                                updateQuantity={handleUpdateQuantity}
                                removeItem={handleRemoveItem}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            subtotal={totals.subtotal}
                            discount={totals.discount}
                            shipping={totals.shipping}
                            tax={totals.tax}
                            total={totals.total}
                            itemCount={cartItems.length}
                            onCheckout={handleCheckout}
                            loading={bagLoading}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Bag;