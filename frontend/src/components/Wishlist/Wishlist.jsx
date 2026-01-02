import React, { Fragment, useEffect, useRef, useState } from 'react';
import Single_product from '../Product/Single_product';
import { useDispatch } from 'react-redux';
import { deletewish } from '../../action/orderaction';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';
import Footer from '../Footer/Footer';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import Nowishlist from './Nowishlist';

const Wishlist = () => {
	const { encrypt } = useEncryptionDecryptionContext();
	const { sessionData, sessionRecentlyViewProducts, setWishListProductInfo } = useSessionStorage();
	const [currentWishListItem, setCurrentWishListItem] = useState([]);
	const { wishlist, loadingWishList, fetchWishList, randomProducts, RandomProductLoading } = useServerWishList();
	const { userLoading, user, isAuthentication, checkAuthUser } = useServerAuth();
	const scrollableDivRef = useRef(null);
	const navigation = useNavigate();
	const dispatch = useDispatch();
	const [state, setState] = useState(false);
	const [state1, setState1] = useState(false);

	const handleDelWish = async (e, productId, product) => {
		e.stopPropagation();
		if (isAuthentication && user) {
			await dispatch(deletewish({ deletingProductId: productId || product._id }));
			fetchWishList();
		} else {
			setWishListProductInfo(product, productId);
		}
	};

	useEffect(() => {
		if (!state1) {
			if (!user) {
				checkAuthUser();
			}
			setState1(true);
		}
		if (!state && !userLoading) {
			setState(true);
		}
	}, [dispatch, userLoading, user, state, state1]);

	useEffect(() => {
		if (isAuthentication) {
			setCurrentWishListItem(wishlist?.orderItems || []);
		} else {
			setCurrentWishListItem(sessionData);
		}
	}, [dispatch, sessionData, user, wishlist, isAuthentication]);

	return (
		<div ref={scrollableDivRef} className="min-h-screen bg-white font-kumbsan overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
				{loadingWishList ? (
					<div className="space-y-8">
						<div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{Array(8).fill().map((_, index) => (
								<ProductCardSkeleton key={index} />
							))}
						</div>
					</div>
				) : (
					<Fragment>
						{currentWishListItem && currentWishListItem.length > 0 ? (
							<div className="space-y-8">
								<div className="flex justify-between items-center">
									<div>
										<h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
										<p className="text-gray-500 mt-1">{currentWishListItem.length} items</p>
									</div>
								</div>

								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
									{currentWishListItem.map((pro) => {
										const active = pro?.productId;
										const productId = active?._id || active;
										const productEncryption = encrypt(productId);

										if (!active) return null;

										return (
											<div key={active?._id || active} className="group relative">
												<div onClick={() => navigation(`/products/${productEncryption}`)}>
													<Single_product
														pro={active}
														user={user}
														showWishList={false}
													/>
												</div>

												{/* Remove button */}
												<div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
													<Button
														size="icon"
														variant="secondary"
														className="rounded-full shadow-lg bg-white/90 hover:bg-white text-gray-700 hover:text-red-600"
														onClick={(e) => handleDelWish(e, active?._id || active, pro)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>

												{/* Mobile Remove Button (Always Visible) */}
												<div className="absolute top-3 right-3 z-10 md:hidden">
													<Button
														size="icon"
														variant="secondary"
														className="rounded-full shadow-lg bg-white/90 text-gray-700 h-8 w-8"
														onClick={(e) => handleDelWish(e, active?._id || active, pro)}
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						) : (
							<Nowishlist />
						)}
					</Fragment>
				)}

				{/* Recently Viewed Section */}
				{sessionRecentlyViewProducts && sessionRecentlyViewProducts.length > 0 && (
					<div className="mt-20 border-t pt-10">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recently Viewed</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{sessionRecentlyViewProducts.slice(0, 4).map((pro) => (
								<Single_product pro={pro} user={user} key={pro._id} />
							))}
						</div>
					</div>
				)}

				{/* Discover More Section */}
				{randomProducts && randomProducts.length > 0 && (
					<div className="mt-20 border-t pt-10 mb-10">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Discover More</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{RandomProductLoading ? (
								Array(4).fill().map((_, i) => <ProductCardSkeleton key={i} />)
							) : (
								randomProducts.slice(0, 8).map((pro) => (
									<Single_product pro={pro} user={user} key={pro._id} />
								))
							)}
						</div>
					</div>
				)}
			</div>
			<Footer />
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default Wishlist;
