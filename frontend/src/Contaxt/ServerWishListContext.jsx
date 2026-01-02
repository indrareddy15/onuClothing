import React, { createContext,  useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getbag, getwishlist } from '../action/orderaction';
import { getRandomArrayOfProducts } from '../action/productaction';
import { useServerAuth } from './AuthContext';

// Create the context
const ServerWishListContext = createContext();

// Provider component
export const SeverWishListProvider = ({ children }) => {
	const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
	const{user,userLoading} = useServerAuth();
	const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
	const { randomProducts, loading: RandomProductLoading, error: errorRandomProductLoading } = useSelector(state => state.RandomProducts);
	const dispatch = useDispatch();
	const fetchWishList = async () => {
		if(userLoading || !user){
			return;
		}
		if(!loadingWishList && !userLoading){
			dispatch(getwishlist());
		}
	}
	const fetchBag = async () => {
		if(userLoading || !user){
			return;
		}
		if(!bagLoading && !userLoading){
			dispatch(getbag());
		}
	}
	useEffect(()=>{
		fetchWishList();
		fetchBag();
		
	},[user,userLoading])
	useEffect(()=>{
		if(!RandomProductLoading){
			dispatch(getRandomArrayOfProducts());
		}
	},[])
	console.log("Wishlist: ",wishlist);
	return (
		<ServerWishListContext.Provider value={{ wishlist,loadingWishList,fetchWishList,bag,bagLoading,fetchBag,randomProducts,RandomProductLoading }}>
			{children}
		</ServerWishListContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerWishList = () => {
	return useContext(ServerWishListContext);
};
