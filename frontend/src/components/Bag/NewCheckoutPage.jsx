import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Plus, Check, Tag, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRazorpay } from "react-razorpay";

// Actions and Contexts
import { applyCouponToBag, deleteBag, getqtyupdate, removeCouponFromBag, create_order, fetchAllOrders } from '../../action/orderaction';
import { getAddress, getConvinceFees, removeAddress, updateAddress } from '../../action/useraction';
import { fetchAddressForm } from '../../action/common.action';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';

// Config and Utils
import { BASE_API_URL, BASE_CLIENT_URL, RAZERPAY_KEY, calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, headerConfig, removeSpaces } from '../../config';

// UI Components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

// Sub-components
import Footer from '../Footer/Footer';
import OrderButton from './OrderButton';

const CheckoutPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { checkAndCreateToast } = useSettingsContext();
	const { encrypt } = useEncryptionDecryptionContext();
	const { error: razorpayError, isLoading: razorpayLoading, Razorpay } = useRazorpay();

	// Redux State
	const { allAddresses } = useSelector(state => state.getAllAddress);
	const { formData } = useSelector(state => state.fetchFormBanners);

	// Context State
	const { user, userLoading, isAuthentication, checkAuthUser } = useServerAuth();
	const { bag, fetchBag, bagLoading } = useServerWishList();
	const { sessionBagData, updateBagQuantity, removeBagSessionStorage } = useSessionStorage();

	// Local State
	const [selectedAddressId, setSelectedAddressId] = useState(null);
	const [paymentMode, setPaymentMode] = useState('cod');
	const [couponCode, setCouponCode] = useState('');
	const [convenienceFees, setConvenienceFees] = useState(0);
	const [addressDialogOpen, setAddressDialogOpen] = useState(false);
	const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

	// Derived Data
	const [cartItems, setCartItems] = useState([]);
	const [totals, setTotals] = useState({
		subtotal: 0,
		discount: 0,
		shipping: 0,
		tax: 0,
		total: 0
	});

	// Initial Data Fetch
	useEffect(() => {
		if (user) {
			dispatch(getAddress());
			dispatch(fetchAddressForm());
			dispatch(fetchAllOrders());
		}
		dispatch(getConvinceFees()).then(fees => setConvenienceFees(fees));
	}, [dispatch, user]);

	// Redirect if not logged in
	useEffect(() => {
		if (!user && !userLoading) {
			navigate("/Login");
		}
	}, [user, userLoading, navigate]);

	// Handle Razorpay Error
	useEffect(() => {
		if (razorpayError) {
			checkAndCreateToast("error", `Payment Failed: ${razorpayError.message}`);
			setIsPaymentProcessing(false);
		}
	}, [razorpayError, checkAndCreateToast]);

	// Set Default Address
	useEffect(() => {
		if (allAddresses && allAddresses.length > 0 && !selectedAddressId) {
			setSelectedAddressId(allAddresses[0]);
		}
	}, [allAddresses, selectedAddressId]);

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
		let totalMRP = 0;
		let totalGST = 0;

		cartItems.forEach(item => {
			if (!item.isChecked) return;

			const product = user ? item.productId : item.ProductData;
			const quantity = item.quantity;
			const price = product.price;
			const salePrice = product.salePrice;

			totalMRP += price * quantity;

			// Calculate selling price for this item
			const sellingPrice = salePrice > 0 ? salePrice : price;
			subtotal += sellingPrice * quantity;

			// Discount
			if (salePrice && salePrice < price) {
				discount += (price - salePrice) * quantity;
			}

			totalGST += product.gst || 0;
		});

		// Apply Coupon Logic
		let couponDiscount = 0;
		if (bag?.Coupon) {
			const { CouponType, Discount, MinOrderAmount, FreeShipping } = bag.Coupon;

			if (subtotal >= MinOrderAmount) {
				if (CouponType === "Percentage") {
					couponDiscount = subtotal * (Discount / 100);
				} else {
					couponDiscount = Discount;
				}
			}
		}

		// Shipping / Convenience Fee
		let shipping = convenienceFees;
		if (bag?.Coupon?.FreeShipping && subtotal >= bag?.Coupon?.MinOrderAmount) {
			shipping = 0;
		} else if (shipping <= 0) {
			shipping = 0;
		}

		const total = subtotal - couponDiscount + shipping;

		setTotals({
			subtotal, // This is actually Total Selling Price before coupon
			totalMRP,
			discount, // Product level discount
			couponDiscount,
			shipping,
			tax: totalGST,
			total
		});

	}, [cartItems, user, bag, convenienceFees]);


	// Payment Handlers
	const handleRazerPayPayment = async () => {
		setIsPaymentProcessing(true);
		try {
			const userContact = user?.user?.phoneNumber;
			const userEmail = user?.user?.email;
			const userName = user?.user?.name || "User";
			const bagId = bag?._id;

			const orderItems = cartItems
				.filter(item => item.isChecked)
				.map(item => ({
					productId: item.productId,
					color: item.color,
					size: item.size.label,
					quantity: item.quantity,
					isChecked: item.isChecked
				}));

			// Request order creation from the backend
			const { data } = await axios.post(
				`${BASE_API_URL}/api/payment/razerypay/order`,
				{
					amount: totals.total,
					userId: user.id,
					contact: userContact,
					email: userEmail,
					callback_url: `${BASE_CLIENT_URL}/bag`,
				},
				headerConfig()
			);

			if (!data.success) {
				throw new Error("Failed to create order, please try again!");
			}

			const razorpayOptions = {
				key: RAZERPAY_KEY,
				amount: data.order.amount,
				currency: "INR",
				name: userName,
				image: user.user.profilePic,
				description: "Order Payment",
				order_id: data.order.id,
				handler: function (response) {
					const paymentData = {
						paymentMethod: "Prepaid",
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_order_id: response.razorpay_order_id,
						razorpay_signature: response.razorpay_signature,
						bagId,
						selectedAddress: selectedAddressId,
						totalAmount: totals.total,
						orderDetails: orderItems
					};

					sessionStorage.setItem("checkoutData", JSON.stringify(paymentData));
					checkAndCreateToast("success", "Payment Successful");
					window.open(`${BASE_CLIENT_URL}/bag/checkout/pending`, "_self");
				},
				prefill: {
					name: userName,
					email: userEmail,
					contact: userContact,
				},
				notes: {
					address: selectedAddressId._id,
				},
				theme: {
					color: "#000000",
				},
			};

			const razor = new Razorpay(razorpayOptions);
			razor.on("payment.failed", function (response) {
				checkAndCreateToast("error", response.error.description || "Payment Failed");
				setIsPaymentProcessing(false);
			});

			razor.open();

		} catch (error) {
			console.error("Payment Error:", error);
			checkAndCreateToast("error", error.message);
			setIsPaymentProcessing(false);
		}
	};

	const confirmPayment = async () => {
		if (!selectedAddressId) {
			checkAndCreateToast("error", 'Please select a delivery address');
			return;
		}

		if (!paymentMode) {
			checkAndCreateToast("error", "Please select a payment method");
			return;
		}

		if (paymentMode === "cod") {
			setIsPaymentProcessing(true);

			const orderItems = cartItems
				.filter(item => item.isChecked)
				.map(item => ({
					productId: item.productId,
					color: item.color,
					size: item.size.label,
					quantity: item.quantity,
					isChecked: item.isChecked
				}));

			if (orderItems.length === 0) {
				checkAndCreateToast("error", "No items selected for checkout");
				setIsPaymentProcessing(false);
				return;
			}

			const orderData = {
				bagId: bag?._id,
				ConvenienceFees: totals.shipping,
				orderItems: orderItems,
				paymentMode: "COD",
				TotalAmount: totals.total,
				Address: selectedAddressId,
				status: 'Order Confirmed'
			};

			try {
				const response = await dispatch(create_order(orderData));

				if (response?.success) {
					sessionStorage.setItem("checkoutData", JSON.stringify({
						paymentMethod: "COD",
					}));
					navigate('/bag/checkout/pending');
				} else {
					checkAndCreateToast("error", response?.message || "Failed to place order");
					navigate('/bag/checkout/failure');
				}
			} catch (error) {
				checkAndCreateToast("error", error?.message || "Failed to place order");
				navigate('/bag/checkout/failure');
			} finally {
				setIsPaymentProcessing(false);
			}

		} else {
			handleRazerPayPayment();
		}
	};

	// Other Handlers
	const handleApplyCoupon = async () => {
		if (!couponCode.trim()) {
			checkAndCreateToast("error", "Please enter a coupon code");
			return;
		}
		if (bag) {
			await dispatch(applyCouponToBag({ bagId: bag._id, couponCode: couponCode }));
			checkAndCreateToast("success", "Coupon Applied");
			setCouponCode('');
			window.location.reload();
		}
	};

	const handleRemoveCoupon = async () => {
		if (bag && bag.Coupon) {
			await dispatch(removeCouponFromBag({ bagId: bag._id, couponCode: bag.Coupon.CouponCode }));
			checkAndCreateToast("success", "Coupon Removed");
			window.location.reload();
		}
	};

	const handleSaveAddress = async (newAddress) => {
		await dispatch(updateAddress(newAddress));
		checkAuthUser();
		checkAndCreateToast("success", 'Address added successfully');
		setAddressDialogOpen(false);
		dispatch(getAddress());
	};

	const handleRemoveAddress = async (index) => {
		await dispatch(removeAddress(index));
		checkAndCreateToast("success", 'Address removed successfully');
		dispatch(getAddress());
		if (selectedAddressId === allAddresses[index]) {
			setSelectedAddressId(null);
		}
	};

	if (bagLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Skeleton className="h-8 w-48 mb-8" />
				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<Skeleton className="h-64" />
						<Skeleton className="h-64" />
					</div>
					<Skeleton className="h-96" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 font-kumbsan">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

				<div className="grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						{/* Delivery Address */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="w-5 h-5" />
									Delivery Address
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{allAddresses && allAddresses.length === 0 ? (
									<p className="text-gray-600 text-sm">No saved addresses. Please add one.</p>
								) : (
									<RadioGroup
										value={allAddresses?.indexOf(selectedAddressId).toString()}
										onValueChange={(val) => setSelectedAddressId(allAddresses[parseInt(val)])}
									>
										{allAddresses?.map((address, index) => (
											<div key={index} className={`flex items-start gap-3 p-4 border rounded-lg ${selectedAddressId === address ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
												<RadioGroupItem value={index.toString()} id={`addr-${index}`} className="mt-1" />
												<Label htmlFor={`addr-${index}`} className="flex-1 cursor-pointer">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-medium text-gray-900">{address.Name || address.fullName || "User"}</span>
															{index === 0 && (
																<Badge variant="secondary" className="text-xs">Default</Badge>
															)}
															<Badge variant="outline" className="text-xs capitalize">{address.addressType || "Home"}</Badge>
														</div>
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 text-gray-400 hover:text-red-500"
															onClick={(e) => {
																e.stopPropagation();
																handleRemoveAddress(index);
															}}
														>
															<Trash2 className="w-3 h-3" />
														</Button>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														{address.address1}, {address.address2 && `${address.address2}, `}
														{address.City}, {address.state} - {address.pincode}
													</p>
													<p className="text-sm text-gray-600">Phone: {address.phoneNumber}</p>
												</Label>
											</div>
										))}
									</RadioGroup>
								)}

								<Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
									<DialogTrigger asChild>
										<Button variant="outline" className="w-full">
											<Plus className="w-4 h-4 mr-2" />
											Add New Address
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
										<DialogHeader>
											<DialogTitle>Add New Address</DialogTitle>
										</DialogHeader>
										<AddAddressForm
											formData={formData}
											onSave={handleSaveAddress}
											onCancel={() => setAddressDialogOpen(false)}
										/>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>

						{/* Payment Mode */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="w-5 h-5" />
									Payment Method
								</CardTitle>
							</CardHeader>
							<CardContent>
								<RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
									<div className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMode === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
										<RadioGroupItem value="cod" id="cod" />
										<Label htmlFor="cod" className="flex-1 cursor-pointer">
											<span className="font-medium">Cash on Delivery</span>
											<p className="text-sm text-gray-600">Pay when you receive the product</p>
										</Label>
									</div>
									<div className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMode === 'prepaid' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
										<RadioGroupItem value="prepaid" id="prepaid" />
										<Label htmlFor="prepaid" className="flex-1 cursor-pointer">
											<span className="font-medium">Online Payment</span>
											<p className="text-sm text-gray-600">Pay via UPI, Cards, NetBanking</p>
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<div>
						<Card className="sticky top-24">
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Items Preview */}
								<div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
									{cartItems.map((item, i) => {
										if (!item.isChecked) return null;
										const product = user ? item.productId : item.ProductData;
										const image = item.color?.images?.[0]?.url || product.images?.[0]?.url;

										return (
											<div key={i} className="flex gap-3">
												<div className="w-16 h-16 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
													<img
														src={image}
														alt={product.title}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
													<p className="text-xs text-gray-500">
														Qty: {item.quantity} • Size: {item.size?.label}
													</p>
													<p className="text-xs text-gray-500">
														Color: {item.color?.name}
													</p>
												</div>
											</div>
										);
									})}
								</div>

								<Separator />

								{/* Coupon Section */}
								<div>
									<Label className="flex items-center gap-2 mb-2">
										<Tag className="w-4 h-4" />
										Have a Coupon?
									</Label>
									{!bag?.Coupon ? (
										<div className="flex gap-2">
											<Input
												value={couponCode}
												onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
												placeholder="Enter coupon code"
												className="uppercase"
											/>
											<Button onClick={handleApplyCoupon}>
												Apply
											</Button>
										</div>
									) : (
										<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-center gap-2">
												<Check className="w-4 h-4 text-green-600" />
												<div>
													<p className="text-sm font-medium text-green-900">{bag.Coupon.CouponCode}</p>
													<p className="text-xs text-green-600">
														{bag.Coupon.CouponType === 'Percentage'
															? `${bag.Coupon.Discount}% off`
															: `₹${bag.Coupon.Discount} off`}
													</p>
												</div>
											</div>
											<Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
												Remove
											</Button>
										</div>
									)}
								</div>

								<Separator />

								{/* Price Breakdown */}
								<div className="space-y-2 text-sm">
									<div className="flex justify-between text-gray-600">
										<span>Total MRP</span>
										<span>₹{formattedSalePrice(totals.totalMRP)}</span>
									</div>
									<div className="flex justify-between text-gray-600">
										<span>Discount on MRP</span>
										<span className="text-green-600">-₹{formattedSalePrice(totals.discount)}</span>
									</div>
									{totals.couponDiscount > 0 && (
										<div className="flex justify-between text-green-600 font-medium">
											<span>Coupon Discount</span>
											<span>-₹{formattedSalePrice(totals.couponDiscount)}</span>
										</div>
									)}
									<div className="flex justify-between text-gray-600">
										<span>Convenience Fee</span>
										<span className={totals.shipping === 0 ? 'text-green-600 font-medium' : ''}>
											{totals.shipping === 0 ? 'FREE' : `₹${formattedSalePrice(totals.shipping)}`}
										</span>
									</div>

									<Separator />
									<div className="flex justify-between text-lg font-bold text-gray-900">
										<span>Total Amount</span>
										<span>₹{formattedSalePrice(totals.total)}</span>
									</div>
								</div>

								<div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
									<ShieldCheck className="w-4 h-4" />
									100% Secure Payment
								</div>

								<OrderButton
									onClick={confirmPayment}
									disabled={!selectedAddressId || isPaymentProcessing}
									isLoading={isPaymentProcessing}
								/>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

// Internal Add Address Form Component
const AddAddressForm = ({ formData, onSave, onCancel }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [newAddress, setNewAddress] = useState({});
	const [error, setError] = useState('');

	const fetchStateAndCountry = async (pincode) => {
		try {
			const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
			const responseData = response.data.length > 0 ? response.data[0] : null;
			if (!responseData || responseData.PostOffice.length === 0) throw new Error("Invalid Pincode");

			const data = responseData?.PostOffice[0];
			if (data && data.State && data.Country && data.District) {
				setNewAddress(prev => ({
					...prev,
					state: data.State,
					City: data.District,
					country: data.Country
				}));
			} else {
				checkAndCreateToast('error', 'Invalid Pincode');
			}
		} catch (error) {
			checkAndCreateToast('error', 'Failed to fetch details');
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewAddress(prev => ({ ...prev, [name]: value }));

		if (name === 'pincode' && value.length === 6) {
			fetchStateAndCountry(value);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic Validation
		if (newAddress['address1']?.length > 30) return checkAndCreateToast('error', 'Address 1 too long');
		if (newAddress['phoneNumber']?.length !== 10) return checkAndCreateToast('error', 'Invalid Phone Number');
		if (newAddress['pincode']?.length !== 6) return checkAndCreateToast('error', 'Invalid Pincode');

		onSave(newAddress);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{formData && formData.filter(item => item).map((item, index) => {
				const key = removeSpaces(item);
				return (
					<div key={index} className="space-y-2">
						<Label htmlFor={key}>
							{capitalizeFirstLetterOfEachWord(item)}
							<span className="text-red-500">*</span>
						</Label>
						<Input
							id={key}
							name={key}
							value={newAddress[key] || ''}
							onChange={handleChange}
							placeholder={`Enter ${item}`}
							required
							type={key === 'phoneNumber' || key === 'pincode' ? 'number' : 'text'}
						/>
					</div>
				);
			})}

			<div className="flex gap-3 pt-4">
				<Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
					Save Address
				</Button>
			</div>
		</form>
	);
};

export default CheckoutPage;
