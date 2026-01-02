import React, { useEffect, useState } from 'react'
import checkoutImg from '../../assets/account.jpg'
import Address from '@/components/shopping-view/Address'
import { useDispatch, useSelector } from 'react-redux'
import CartItemsContent from '@/components/shopping-view/CartItemsContent'
import { Button } from '@/components/ui/button'
import { createNewOrder, verifyingOrder } from '@/store/shop/order-slice'
import { useToast } from '@/hooks/use-toast'
import { cashfree } from '@/utils/utiles'
import { BASE_CLIENT_URL } from '@/config'
import { deleteCartItems, updateToCart } from '@/store/shop/car-slice'

const ShoppingCheckoutPage = () => {
  const dispatch = useDispatch();

  const { cartItems } = useSelector(state => state.shopCardSlice);
  const { user } = useSelector(state => state.auth);
  const { toast } = useToast();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items.reduce((sum, currentItem) => sum + (currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price) * currentItem.quantity, 0) : 0;

  const handleCashFreePayment = async () => {
    if (!cartItems.items || cartItems.items.length <= 0) {
      toast({
        title: "Error",
        variant: 'destructive',
        description: "Your cart is empty, please add items to proceed",
      })
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Error",
        variant: 'destructive',
        description: "Please select an address to proceed",
      })
      return;
    }
    // Call API to make cash free payment and update order status
    const data = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(item => {
        return {
          productId: item.productId,
          title: item.title,
          image: item?.image,
          price: item?.salePrice > 0 ? item.salePrice : item.price,
          quantity: item.quantity,
        }
      }),
      address: {
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        country: currentSelectedAddress?.country,
        phoneNumber: currentSelectedAddress?.phoneNumber,
        pinCode: currentSelectedAddress?.pinCode,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: 'pending',
      paymentMethods: 'Cashfree',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    }
    try {
      const response = await dispatch(createNewOrder(data))
      const responseResult = response?.payload?.result?.orderData;
      if (response?.payload?.Success) {
        toast({
          title: "Order Placed Successfully",
          description: response?.payload?.message,
        })
        let checkoutOptions = {
          paymentSessionId: responseResult?.payment_session_id,
          redirectTarget: '_self',
          returnUrl: `${BASE_CLIENT_URL}/shop/payment-return`,
        }
        // console.log("responseResult: ",checkoutOptions);
        cashfree?.checkout(checkoutOptions).then(function (result) {
          if (result.error) {
            alert(result.error.message)
            setIsPaymentStart(false);
          }
          if (result.redirect) {
            console.log("Redirection: ")
            setIsPaymentStart(true);
          }
        });
      }
    } catch (error) {
      console.error(`Error creating order: `, error);
      setIsPaymentStart(false);
    }
  }
  const handleOnCartItemDelete = async (item) => {
    await dispatch(deleteCartItems({ userId: user.id, productId: item?.productId }));
  }
  const handleUpdateCartItemQuantity = async (item, updateAmount) => {
    console.log("All Cart Items : ", cartItems.items);
    let getCartItems = cartItems.items || [];
    const amount = updateAmount === "plus" ? item?.quantity + 1 : item?.quantity - 1;
    console.log(item?.totalStock)
    if (updateAmount === 'plus') {
      if (getCartItems.length > 0) {
        const indexOfProduct = getCartItems.findIndex(c => c.productId === item?.productId);
        if (indexOfProduct > -1) {
          const quantity = getCartItems[indexOfProduct].quantity;
          if (quantity + 1 > item?.totalStock) {
            toast({
              title: "Product Quantity Exceeded",
              variant: 'destructive',
              description: "You can't add more than available stock",
            });
            return;
          }
        }
      }

    }
    const updated = await dispatch(updateToCart({ userId: user.id, productId: item?.productId, quantity: amount }))
    if (updated?.payload?.Success) {
      toast({
        title: "Cart Item Updated Successfully",
        description: updated?.payload?.message,
      });
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <div className='relative h-[300px] w-full overflow-hidden'>
        <img
          src={checkoutImg}
          alt='checkoutImg'
          className='h-full w-full object-cover object-center'
        />
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <h1 className='text-4xl font-bold text-white'>Checkout</h1>
        </div>
      </div>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6'>
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress} currentSelectedAddress={currentSelectedAddress} />
        <div className='flex flex-col gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Order Summary</h2>
            {
              cartItems && cartItems?.items?.length > 0 ? (
                cartItems?.items.map((item) => (
                  <CartItemsContent key={`item_${item?.productId}`} item={item} handleOnCartItemDelete={handleOnCartItemDelete} handleUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              )
            }
            <div className='pt-4 border-t border-gray-200 space-y-4'>
              <div className='flex justify-between text-lg font-bold text-gray-900'>
                <span>Total</span>
                <span>₹{totalCartAmount}</span>
              </div>
            </div>
            <Button
              disabled={cartItems?.items?.length <= 0 || isPaymentStart}
              onClick={handleCashFreePayment}
              className="w-full btn-primary h-12 text-lg"
            >
              {isPaymentStart ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckoutPage