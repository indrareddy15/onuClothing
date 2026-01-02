import React, { useEffect, Fragment, useState, useRef } from 'react';
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
import PincodeChecker from './PincodeChecker';
import SizeChartModal from './SizeChartModal';
import StarRatingInput from './StarRatingInput';
import ReactPlayer from 'react-player';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
	Heart,
	ShoppingCart,
	ShoppingBag,
	Star,
	Truck,
	Shield,
	RefreshCw,
	MessageCircle,
	Copy,
	Share2,
	RotateCw,
	Package,
	Headphones
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import Single_product from '../Product/Single_product';
import ProductImageView from './ProductImageView';
import { IoLogoWhatsapp } from 'react-icons/io';

const MPpage = () => {
	const { decrypt } = useEncryptionDecryptionContext();
	const { sessionData, sessionBagData, setWishListProductInfo, setSessionStorageBagListItem } = useSessionStorage();
	const { checkAndCreateToast } = useSettingsContext();
	const navigation = useNavigate();
	const param = useParams();
	const dispatch = useDispatch();

	const { wishlist, loadingWishList, bag, bagLoading, fetchBag, fetchWishList } = useServerWishList();
	const { product, loading, similar } = useSelector((state) => state.Sproduct);
	const { user } = useServerAuth();
	const { error: warning } = useSelector(state => state.wishlist);

	const [isInWishList, setIsInWishList] = useState(false);
	const [isInBagList, setIsInBagList] = useState(false);
	const [selectedSize, setSelectedSize] = useState(null);
	const [selectedColor, setSelectedColor] = useState([]);
	const [currentColor, setCurrentColor] = useState(null);
	const [currentSize, setCurrentSize] = useState(null);
	const [selectedSizeColorImageArray, setSelectedSizeColorImageArray] = useState([]);
	const [ratingData, setRatingData] = useState(null);
	const [hasPurchased, setHasPurchased] = useState(false);
	const [isPostingReview, setIsPostingReview] = useState(false);
	const [showImagePopup, setShowImagePopup] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const scrollContainerRef = useRef(null);

	// Initial Data Fetch
	useEffect(() => {
		dispatch(singleProduct(decrypt(param.id)));
		window.scrollTo(0, 0);
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

		const isAlreadyPresent = newSize.colors.find(item => item?.label === currentColor?.label);
		if (isAlreadyPresent) {
			setCurrentColor(isAlreadyPresent);
			setSelectedSizeColorImageArray(isAlreadyPresent.images);
		} else {
			const defaultColor = newSize.colors[0];
			if (defaultColor) {
				setCurrentColor(defaultColor);
				setSelectedSizeColorImageArray(defaultColor.images);
			} else {
				setCurrentColor(null);
			}
		}
	};

	const handleSetColorImages = (color) => {
		setCurrentColor(color);
		setSelectedSizeColorImageArray(color.images);
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

	if (loading || !product) {
		return <Loader />;
	}

	const discount = product.salePrice
		? Math.round(((product.price - product.salePrice) / product.price) * 100)
		: 0;

	return (
		<div ref={scrollContainerRef} className="min-h-screen bg-white pb-32">
			{/* Image Carousel */}
			<div className="relative aspect-[4/5] bg-gray-100">
				<Carousel
					showThumbs={false}
					showStatus={false}
					showArrows={false}
					showIndicators={true}
					swipeable={true}
					emulateTouch
					infiniteLoop
					className="h-full"
					onChange={(index) => setCurrentImageIndex(index)}
				>
					{selectedSizeColorImageArray?.map((im, i) => (
						<div
							key={i}
							className="h-full aspect-[4/5] flex items-center justify-center bg-gray-50 cursor-zoom-in"
							onClick={() => setShowImagePopup(true)}
						>
							{im.url?.match(/\.(mp4|mov|avi)$/) || im.url?.includes("video") ? (
								<ReactPlayer
									url={im.url}
									playing
									loop
									muted
									width="100%"
									height="100%"
									className="object-cover"
								/>
							) : (
								<LazyLoadImage
									src={im.url}
									alt={`product_${i}`}
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					))}
				</Carousel>
			</div>

			{showImagePopup && (
				<ProductImageView
					images={selectedSizeColorImageArray}
					initialIndex={currentImageIndex}
					onClose={() => setShowImagePopup(false)}
				/>
			)}

			<div className="px-4 py-6 space-y-6">
				{/* Product Header */}
				<div className="space-y-2">
					<div className="flex justify-between items-start">
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="capitalize">{product.gender}</Badge>
							{discount > 0 && <Badge className="bg-red-500">{discount}% OFF</Badge>}
						</div>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 leading-tight">
						{capitalizeFirstLetterOfEachWord(product.title)}
					</h1>
					<div className="flex items-center gap-2">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
								/>
							))}
						</div>
						<span className="text-sm text-gray-600">({product.Rating?.length || 0} reviews)</span>
					</div>
				</div>

				{/* Price */}
				<div className="flex items-baseline gap-3 pb-4 border-b">
					<span className="text-3xl font-bold text-gray-900">
						₹{formattedSalePrice(product.salePrice || product.price)}
					</span>
					{product.salePrice && (
						<span className="text-xl text-gray-400 line-through">
							₹{formattedSalePrice(product.price)}
						</span>
					)}
					<span className="text-green-600 text-sm font-medium">Inclusive of all taxes</span>
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
								className={`min-w-[3.5rem] h-12 px-4 rounded-lg font-medium border-2 transition-all relative ${currentSize?._id === size._id
									? "border-gray-900 bg-gray-900 text-white"
									: size.quantity <= 0
										? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
										: "border-gray-200 hover:border-gray-400 text-gray-900"
									}`}
							>
								{size.label}
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
								onClick={() => handleSetColorImages(color)}
								disabled={color.quantity <= 0}
								className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all relative ${currentColor?._id === color._id
									? "border-gray-900 scale-110"
									: "border-transparent hover:border-gray-300"
									}`}
							>
								<div
									className="w-full h-full rounded-full border border-gray-200 shadow-sm"
									style={{ backgroundColor: color.label || color.name }}
								/>
							</button>
						))}
					</div>
				</div>

				{/* Pincode */}
				<div className="py-4 border-t border-b border-gray-100">
					<PincodeChecker productId={decrypt(param.id)} />
				</div>

				{/* Product Details */}
				<div className="space-y-4">
					<h3 className="font-semibold text-lg">Product Details</h3>
					<p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

					{product.bulletPoints?.length > 0 && (
						<div className="space-y-2">
							{product.bulletPoints.map((point, i) => (
								<div key={i} className="text-sm">
									<span className="font-medium text-gray-900">{point.header}: </span>
									<span className="text-gray-600">{point.body}</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Features */}
				<div className="grid grid-cols-1 gap-3 py-6 border-t">
					<div className="flex items-center gap-3 text-sm text-gray-600">
						<RotateCw className="w-5 h-5" />
						<span>Return within 7 days of purchase. Duties & taxes are non-refundable.</span>
					</div>
					<div className="flex items-center gap-3 text-sm text-gray-600">
						<Package className="w-5 h-5" />
						<span>Track your order in real-time with detailed notifications.</span>
					</div>
					<div className="flex items-center gap-3 text-sm text-gray-600">
						<Headphones className="w-5 h-5" />
						<span>24/7 customer support for any shipping or delivery inquiries.</span>
					</div>
				</div>

				{/* Inline Buy Now Button */}
				{/* <div className="py-4">
					<Button
						className="w-full h-12 text-base font-semibold bg-gray-900 text-white"
						onClick={handleBuyNow}
					>
						<ShoppingBag className="w-5 h-5 mr-2" />
						BUY NOW
					</Button>
				</div> */}

				{/* Share */}
				<div className="flex items-center gap-4 py-4 border-t border-b">
					<span className="text-base font-medium text-gray-900">Share:</span>
					<div className="flex gap-4">
						<button onClick={() => handleShare('whatsapp')} className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
							<IoLogoWhatsapp className="w-6 h-6" />
						</button>
						<button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
							<Copy className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/* Reviews */}
				<div className="space-y-6 pt-6">
					<div className="flex justify-between items-center">
						<h3 className="font-semibold text-lg">Reviews</h3>
						{hasPurchased && !ratingData && (
							<Button variant="outline" size="sm" onClick={() => setRatingData({ rating: 5, comment: "" })}>
								Write Review
							</Button>
						)}
					</div>

					{ratingData && (
						<Card>
							<CardContent className="pt-4 space-y-4">
								<StarRatingInput
									onChangeValue={(val) => setRatingData({ ...ratingData, rating: val })}
									value={ratingData.rating}
								/>
								<Textarea
									value={ratingData.comment}
									onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
									placeholder="Write your review..."
									rows={3}
								/>
								<div className="flex gap-2">
									<Button size="sm" onClick={PostRating} disabled={isPostingReview}>Submit</Button>
									<Button size="sm" variant="ghost" onClick={() => setRatingData(null)}>Cancel</Button>
								</div>
							</CardContent>
						</Card>
					)}

					<div className="space-y-4">
						{product.Rating?.slice(0, 3).map((review, idx) => (
							<div key={idx} className="border-b pb-4 last:border-0">
								<div className="flex items-center gap-2 mb-1">
									<div className="flex text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
										))}
									</div>
									<span className="text-sm font-medium">{review.userName || "User"}</span>
								</div>
								<p className="text-sm text-gray-600">{review.comment}</p>
							</div>
						))}
					</div>
				</div>

				{/* Similar Products */}
				{similar?.length > 0 && (
					<div className="pt-6 border-t mb-20">
						<h3 className="font-semibold text-lg mb-4">You May Also Like</h3>
						<div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
							{similar.map((pro, index) => (
								<div key={index} className="w-[160px] flex-shrink-0">
									<Single_product
										pro={pro}
										user={user}
										onChangeItems={() => {
											dispatch(singleProduct(pro._id));
											window.scrollTo(0, 0);
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Sticky Bottom Bar */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-[100] flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-[calc(12px+env(safe-area-inset-bottom))]">
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
			</div>
		</div>
	);
};

export default MPpage;
