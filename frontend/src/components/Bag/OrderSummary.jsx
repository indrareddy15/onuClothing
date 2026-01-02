import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { formattedSalePrice } from '../../config';

const OrderSummary = ({
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    onCheckout,
    loading
}) => {
    const navigate = useNavigate();

    return (
        <Card className="sticky top-24 border-gray-100 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({itemCount} items)</span>
                        <span className="font-medium text-gray-900">₹{formattedSalePrice(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{formattedSalePrice(discount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-gray-900'}>
                            {shipping === 0 ? 'FREE' : `₹${formattedSalePrice(shipping)}`}
                        </span>
                    </div>

                    {/* Tax section commented out as per original file */}
                    {/* <div className="flex justify-between text-gray-600">
                        <span>Tax (GST)</span>
                        <span>₹{formattedSalePrice(tax)}</span>
                    </div> */}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">₹{formattedSalePrice(total)}</span>
                </div>

                {total < 5000 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex flex-col gap-1">
                        <span className="font-semibold">Free Shipping?</span>
                        <span>Add <span className="font-bold">₹{formattedSalePrice(5000 - total)}</span> more to your cart.</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 h-11 text-base"
                    onClick={onCheckout}
                    disabled={loading || itemCount === 0}
                >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                    {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>

                <Button
                    variant="outline"
                    className="w-full h-11 text-base border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </Button>
            </CardFooter>
        </Card>
    );
};

export default OrderSummary;
