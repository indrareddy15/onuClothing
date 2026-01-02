import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice, getImagesArrayFromProducts, calculateDiscountPercentage } from '../../config';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';

/**
 * SideBarBagProductItem Component
 * Enhanced sidebar product display following newCode design patterns
 * Used in shopping bag, wishlist, and recommendation views
 */
const SideBarBagProductItem = memo(({ pro, user, refreshTwice = false, OnPress }) => {
	const { encrypt } = useEncryptionDecryptionContext();
	const { updateRecentlyViewProducts } = useSessionStorage();
	const navigation = useNavigate();
	const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

	if (!pro || !imageArray?.length || imageArray.length === 0) {
		return (
			<div className="group cursor-pointer">
				{/* Skeleton Image */}
				<div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
					<Skeleton className="w-full h-full" />
				</div>

				{/* Skeleton Details */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
					<Skeleton className="h-4 w-1/3" />
				</div>
			</div>
		);
	}

	const productTitle = capitalizeFirstLetterOfEachWord(pro?.title);
	const productSubCategory = capitalizeFirstLetterOfEachWord(pro?.subCategory);
	const { salePrice, price } = pro;
	const displayPrice = salePrice || price;
	const discount = salePrice ? calculateDiscountPercentage(price, salePrice) : 0;

	const handleNavigation = () => {
		const productEncryption = encrypt(pro._id);
		navigation(`/products/${productEncryption}`);
		updateRecentlyViewProducts(pro);
		if (OnPress) {
			OnPress();
		}
	};

	return (
		<div
			onClick={handleNavigation}
			className="group cursor-pointer hover:shadow-md transition-shadow duration-300 rounded-lg"
		>
			{/* Product Image */}
			<div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
				<MediaDisplay imageArray={imageArray} />

				{/* Discount Badge if applicable */}
				{discount > 0 && (
					<Badge variant="destructive" className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5">
						{discount}% OFF
					</Badge>
				)}
			</div>

			{/* Product Details */}
			<div className="space-y-1">
				<h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-600 transition-colors">
					{productTitle}
				</h4>

				<p className="text-xs text-gray-500 truncate">
					{productSubCategory}
				</p>

				{/* Price Section */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900">
						₹{formattedSalePrice(displayPrice)}
					</span>
					{salePrice > 0 && (
						<span className="text-xs text-gray-400 line-through">
							₹{formattedSalePrice(price)}
						</span>
					)}
				</div>
			</div>
		</div>
	);
});

/**
 * MediaDisplay Component
 * Handles lazy loading of product images
 */
const MediaDisplay = ({ imageArray }) => {
	const isVideo = (url) => {
		const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', 'video'];
		return videoExtensions.some(ext => url.toLowerCase().includes(ext));
	};

	const imageUrls = imageArray.filter(image => !isVideo(image.url));
	const mediaUrl = imageUrls[0]?.url;

	if (!mediaUrl) {
		return (
			<div className="w-full h-full bg-gray-200 flex items-center justify-center">
				<p className="text-xs text-gray-400">No image</p>
			</div>
		);
	}

	return (
		<div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
			<LazyLoadImage
				effect="blur"
				useIntersectionObserver
				wrapperProps={{
					style: { transitionDelay: "0.3s" },
				}}
				placeholder={<Skeleton className="w-full h-full" />}
				loading="lazy"
				src={mediaUrl}
				alt="Product"
				className="w-full h-full object-cover"
				style={{ maxWidth: '100%', maxHeight: '100%' }}
			/>
		</div>
	);
};

export default SideBarBagProductItem;
