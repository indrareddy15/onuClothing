import React, { createContext,  useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featchallbanners, fetchAllCategoryBanners } from '../action/banner.action';
import { allProductsFilter, getOptionsByType } from '../action/productaction';

// Create the context
const ServerBannersContext = createContext();

// Provider component
export const SeverBannersProvider = ({ children }) => {
	const dispatch = useDispatch();
	const { banners,loading:bannerLoading} = useSelector(state => state.banners)
	const { categoryBanners,loading:CategoryBannerLoading} = useSelector(state => state.categoryBanners)
	const { noFilterProducts,loading:productAllProductsLoading} = useSelector(state => state.AllProductNoFilter);
	const [categoriesOptions,setCategoryOptions] = useState([]);
	const getSingleOptions = async (type)=>{
		try {
			const catResponse = await dispatch(getOptionsByType({type}))
			if(catResponse){
				setCategoryOptions(catResponse.map(c => c.value));
			}
		} catch (error) {
			console.error("Error getting: ", error);
		}
	}
	const handleFetchFilter = ()=>{
		dispatch(allProductsFilter())
	}
	useEffect(()=>{
		dispatch(featchallbanners());
		dispatch(fetchAllCategoryBanners());
		handleFetchFilter();
		getSingleOptions('category');
	},[])
	
	return (
		<ServerBannersContext.Provider value={{
				banners,
				categoryBanners,
				bannerLoading,
				CategoryBannerLoading,
				categoriesOptions,
				getSingleOptions,
				noFilterProducts,
				productAllProductsLoading,
				handleFetchFilter 
			}}>
			{children}
		</ServerBannersContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerBanners = () => {
	return useContext(ServerBannersContext);
};
