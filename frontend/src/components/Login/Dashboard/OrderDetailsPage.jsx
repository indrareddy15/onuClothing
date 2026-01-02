import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchOrderById, sendOrderCancel, sendOrderReturn } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';
import Loader from '../../Loader/Loader';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice, ORDER_ENCRYPTION_SECREAT_KEY } from '../../../config';
import Footer from '../../Footer/Footer';
import BackToTopButton from '../../Home/BackToTopButton';
import { ChevronLeft, MapIcon, Phone, Mail } from 'lucide-react';
import WhatsAppButton from '../../Home/WhatsAppButton';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import ReturnsOptionsWindow from './ReturnsOptionsWindow';
import { fetchTermsAndCondition } from '../../../action/common.action';
import { IoIosCall } from 'react-icons/io';
import { FaWhatsapp } from 'react-icons/fa';
import RandomProductsDisplay from './RandomProductsDisplay';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useServerAuth } from '../../../Contaxt/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';

const OrderItem = ({ item }) => {
	const { encrypt } = useEncryptionDecryptionContext();
	const productEncryption = encrypt(item?.productId?._id);
	return (
		<div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border last:border-0">
			<Link to={`/products/${productEncryption}`} className="shrink-0">
				<LazyLoadImage
					effect='blur'
					useIntersectionObserver
					wrapperProps={{
						style: { transitionDelay: "1s" },
					}}
					placeholder={<div className="w-24 h-24 bg-muted animate-pulse rounded-md"></div>}
					loading='lazy'
					src={item?.color.images[0].url}
					alt="Product"
					className="w-24 h-24 object-cover rounded-md border border-border"
				/>
			</Link>
			<div className="flex-1 space-y-2">
				<div className="flex justify-between items-start">
					<h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary cursor-pointer transition-colors">
						<Link to={`/products/${productEncryption}`}>
							{capitalizeFirstLetterOfEachWord(item?.productId?.title)}
						</Link>
					</h3>
					<span className="font-bold text-foreground whitespace-nowrap">
						₹ {formattedSalePrice(item.productId?.salePrice || item.productId?.price)}
					</span>
				</div>

				<div className="flex flex-wrap gap-2 text-sm">
					<Badge variant="outline" className="flex items-center gap-1.5">
						Color:
						<span
							className="w-3 h-3 rounded-full border border-border"
							style={{ backgroundColor: item?.color?.name }}
						/>
						{item?.color?.name}
					</Badge>
					<Badge variant="outline">Size: {item.size}</Badge>
					<Badge variant="secondary">Qty: {item.quantity || 1}</Badge>
				</div>
			</div>
		</div>
	);
}

const getStatusColorClass = (status) => {
	const colors = {
		'Confirmed': 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
		'Processing': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
		'Shipped': 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200',
		'Delivered': 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
		'Cancelled': 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
		'Returned': 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
		'RTS': 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
		'Ready To Ship': 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
		'OFD': 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200',
		'Out For Delivery': 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200',
		'Out for Delivery': 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200',
	};
	return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

const AddressSection = ({ address }) => (
	<div className="space-y-3">
		<div className="flex items-center gap-2 text-muted-foreground">
			<MapIcon className="w-4 h-4" />
			<span className="text-sm font-medium">Shipping Address</span>
		</div>
		<div className="text-sm text-foreground space-y-1 pl-6">
			<p className="font-medium">{address.name}</p>
			<p>{address.address1}</p>
			{address.address2 && <p>{address.address2}</p>}
			<p>{address.city}, {address.state} - {address.pincode}</p>
			<p className="text-muted-foreground mt-1">{address.country}</p>
			<p className="text-muted-foreground flex items-center gap-2 mt-2">
				<Phone className="w-3 h-3" /> {address.phoneNumber}
			</p>
		</div>
	</div>
);

const OrderDetailsPage = () => {
	const { checkAuthUser, user, userLoading, isAuthentication } = useServerAuth();
	const [orderItems, setOrderItems] = useState([]);
	const scrollableDivRef = useRef(null);
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { termsAndCondition } = useSelector(state => state.TermsAndConditions);
	const [phoneNumber, setPhoneNumber] = useState('919326727797');
	const message = 'Hi!, I Have a Query?';
	const { decryptWithKey } = useEncryptionDecryptionContext();
	const { checkAndCreateToast } = useSettingsContext();
	const { orderbyid, loading } = useSelector(state => state.getOrderById);

	const [openReturnOptionWindow, setOpenReturnOptionWindow] = useState(false);
	useEffect(() => {
		if (!user && !userLoading && !isAuthentication) {
			navigate('/');
		}
	}, [user, userLoading, isAuthentication])
	useEffect(() => {
		if (params) {
			dispatch(fetchOrderById(decryptWithKey(params.orderId, ORDER_ENCRYPTION_SECREAT_KEY)))
		} else {
			navigate(-1);
		}
	}, [dispatch]);

	useEffect(() => {
		if (orderbyid) {
			setOrderItems(orderbyid.orderItems);
		}
	}, [orderbyid]);


	const createOrderReturn = async (refundOptionsData) => {
		if (!orderbyid?.IsReturning) {
			const response = await dispatch(sendOrderReturn({ orderId: orderbyid._id, refundOptionsData }));
			if (response) {
				await dispatch(fetchOrderById(decryptWithKey(params.orderId, ORDER_ENCRYPTION_SECREAT_KEY)));
				if (orderbyid?.IsReturning) {
					checkAndCreateToast("success", 'Order Returned Successfully');
				} else {
					checkAndCreateToast("success", 'Order Exchanged Successfully');
				}
			} else {
				checkAndCreateToast('error', 'Failed to Return Order')
			}
		} else {
			checkAndCreateToast('error', 'Order is already in return process');
		}
		setOpenReturnOptionWindow(false);
	}
	const createCancelOrder = async () => {
		if (!orderbyid?.IsCancelled) {
			const response = await dispatch(sendOrderCancel({ orderId: orderbyid._id }));
			await dispatch(fetchOrderById(decryptWithKey(params.orderId, ORDER_ENCRYPTION_SECREAT_KEY)));
			if (response) {
				if (orderbyid?.IsCancelled) {
					checkAndCreateToast("success", 'Order Cancelled Successfully');
				} else {
					checkAndCreateToast("success", 'Order Refunded Successfully');
				}
			} else {
				checkAndCreateToast('error', 'Failed to Cancel Order')
			}
		}
	}


	const handleBackButtonClick = () => {
		navigate(-1);
	};
	useEffect(() => {
		if (termsAndCondition) {
			setPhoneNumber(termsAndCondition?.phoneNumber);
		}
	}, [termsAndCondition])
	useEffect(() => {
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		dispatch(fetchTermsAndCondition());
	}, [])
	const handleOpenWhatsAppClick = () => {
		const checkedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
		const url = `https://wa.me/${checkedPhoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(url, '_blank');
	};

	return (
		<div ref={scrollableDivRef} className="w-full min-h-screen overflow-y-auto bg-background font-sans scrollbar overflow-x-hidden scrollbar-track-muted scrollbar-thumb-border">
			{!loading && orderbyid ? (
				<div className="max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-foreground">Order Details</h1>
							<p className="text-muted-foreground mt-1">
								Order ID: <span className="font-mono text-foreground">{orderbyid?._id}</span>
							</p>
						</div>
						<Button
							variant="ghost"
							onClick={handleBackButtonClick}
							className="gap-2"
						>
							<ChevronLeft className="w-4 h-4" />
							Back to Orders
						</Button>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column - Order Items & Status */}
						<div className="lg:col-span-2 space-y-6">
							{/* Order Status Card */}
							<Card>
								<CardHeader className="pb-4">
									<div className="flex justify-between items-center">
										<CardTitle>Delivery Status</CardTitle>
										<Badge variant="outline" className={`px-3 py-1 ${getStatusColorClass(orderbyid?.status)}`}>
											{orderbyid?.status}
										</Badge>
									</div>
									<CardDescription>
										Ordered on {new Date(orderbyid.createdAt).toDateString()}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<DeliveryStatus status={orderbyid?.status} />
									{orderbyid?.trackingUrl && (
										<div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
											<div className="flex items-center gap-2 text-sm">
												<MapIcon className="w-4 h-4 text-primary" />
												<span className="font-medium">Tracking Available</span>
											</div>
											<Button variant="link" asChild className="p-0 h-auto">
												<a href={orderbyid?.trackingUrl} target="_blank" rel="noopener noreferrer">
													Track Order
												</a>
											</Button>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Order Items Card */}
							<Card>
								<CardHeader>
									<CardTitle>Items in Order ({orderItems?.length})</CardTitle>
								</CardHeader>
								<CardContent className="p-0">
									<div className="px-6">
										{orderItems?.length > 0 && orderItems.map((item, index) => (
											<OrderItem key={item._id || index} item={item} />
										))}
									</div>
								</CardContent>
							</Card>

							{/* Payment Info */}
							<Card>
								<CardHeader>
									<CardTitle>Payment Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex flex-col sm:flex-row sm:justify-between gap-6">
										<div>
											<p className="text-sm text-muted-foreground mb-1">Payment Method</p>
											<p className="font-medium text-foreground">{orderbyid?.paymentMode}</p>
										</div>
										<div className="sm:text-right">
											<p className="text-sm text-muted-foreground mb-1">Total Amount</p>
											<p className="font-medium text-foreground">₹ {formattedSalePrice(orderbyid?.TotalAmount)}</p>
										</div>
									</div>
									{orderbyid?.etd && (
										<div>
											<p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
											<p className="font-medium text-foreground">{new Date(orderbyid?.etd).toDateString()}</p>
										</div>
									)}
								</CardContent>
							</Card>
						</div>

						{/* Right Column - Summary & Actions */}
						<div className="lg:col-span-1 space-y-6">
							{/* Order Summary Card */}
							<Card>
								<CardHeader>
									<CardTitle>Order Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{orderbyid?.address && (
										<>
											<AddressSection address={orderbyid.address} />
											<Separator />
										</>
									)}

									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Subtotal</span>
											<span>₹{formattedSalePrice(orderbyid?.TotalAmount - (orderbyid?.ConveenianceFees || 0))}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Shipping</span>
											<span className="text-green-600 font-medium">
												{orderbyid.ConveenianceFees > 0 ? `₹${formattedSalePrice(orderbyid?.ConveenianceFees)}` : "Free"}
											</span>
										</div>
										<Separator className="my-2" />
										<div className="flex justify-between font-bold text-lg">
											<span>Total</span>
											<span>₹{formattedSalePrice(orderbyid?.TotalAmount)}</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="flex flex-col gap-3">
									{orderbyid?.status === 'Delivered' ? (
										<Button
											disabled={!orderbyid || orderbyid?.IsReturning}
											onClick={() => setOpenReturnOptionWindow(!openReturnOptionWindow)}
											className="w-full"
											variant={orderbyid?.IsReturning ? "secondary" : "default"}
										>
											{orderbyid?.IsReturning ? "Return Request in Process" : "Return Order"}
										</Button>
									) : (
										<Button
											disabled={!orderbyid || orderbyid?.IsCancelled}
											onClick={createCancelOrder}
											className="w-full"
											variant={orderbyid?.IsCancelled ? "secondary" : "destructive"}
										>
											{orderbyid?.IsCancelled ? "Cancel Request in Process" : "Cancel Order"}
										</Button>
									)}
								</CardFooter>
							</Card>

							{/* Support Card */}
							<Card className="bg-muted/30 border-dashed">
								<CardHeader>
									<CardTitle className="text-lg">Need Help?</CardTitle>
									<CardDescription>
										If you have any issues with your order, please contact our support team.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button variant="outline" className="w-full justify-start gap-2" asChild>
										<Link to="/contact">
											<IoIosCall className="w-4 h-4" />
											Contact Support
										</Link>
									</Button>
									<Button variant="outline" className="w-full justify-start gap-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleOpenWhatsAppClick}>
										<FaWhatsapp className="w-4 h-4" />
										Chat on WhatsApp
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

			) : (
				<Loader />
			)}
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
			<Footer />
			{
				openReturnOptionWindow && <ReturnsOptionsWindow OnSubmit={(data) => {
					createOrderReturn(data);
				}} OnClose={() => setOpenReturnOptionWindow(false)} />
			}

		</div>
	);
};

export default OrderDetailsPage;
