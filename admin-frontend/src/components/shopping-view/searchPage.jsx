import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { resetSearchResult, searchProductsByKeyWord } from '@/store/shop/search-slice';
import ShoppingViewProductTile from '@/pages/shoping-view/ShoppingViewProductTile';
import { fetchProductDetails } from '@/store/shop/product-slice';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/store/shop/car-slice';
import ProductDetailsDialogue from './ProductDetails';

const SearchPageView = () => {
	const {user} = useSelector(state => state.auth)
	const{cartItems} = useSelector(state => state.shopCardSlice);
	const{searchResult} = useSelector(state => state.shopSearch);
	const {ProductDetails} = useSelector(state => state.shopProductSlice)
	
	
	const{toast} = useToast();
	const dispatch = useDispatch();


	const [keyword,setKeywords]=useState('');
	const [searchParams,setSearchParams] = useSearchParams();
	const[openDetails,setOpenDetails] = useState(false);




	useEffect(()=>{
		if(keyword && keyword.trim('') && keyword.trim('').length >= 3){
			const id = setTimeout(() => {
				setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
				dispatch(searchProductsByKeyWord(keyword))
			}, 1000);
			return () => clearTimeout(id);  // cleanup on unmount of component to prevent memory leak
		}else{
            console.log('Clearing search results');
			dispatch(resetSearchResult());
		}
	},[keyword])
	console.log(searchResult);
	const handleGetProductDetails = (id)=>{
        console.log(id);
        dispatch(fetchProductDetails(id));
    }
	const handleAddToCart = async (productId,totalStock)=>{
        // console.log("All Cart Items : ",cartItems);
        let getCartItems = cartItems.items || [];
        if(getCartItems.length > 0){
            const indexOfProduct = getCartItems.findIndex(item => item.productId === productId);
            if(indexOfProduct > -1){
                const quantity = getCartItems[indexOfProduct].quantity;
                if(quantity + 1 > totalStock){
                    toast({
                        title: "Product Quantity Exceeded",
                        variant:'destructive',
                        description: "You can't add more than available stock",
                    });
                    return;
                }
            }
            
        }
        const result = await dispatch(addToCart({userId:user?.id,productId:productId,quantity:1}))
        if(result?.payload?.Success){
            await dispatch(fetchCartItems({userId:user?.id}))
            toast({
                title: "Product Added to Cart Successfully",
                description: result?.payload?.message,
            });
        }
    }
	useEffect(()=>{
        if(ProductDetails){
            setOpenDetails(true);
        }
    },[ProductDetails])
	return (
		<div className='container mx-auto md:px-6 px-4 py-8'>
			<div className='flex justify-center mb-8'>
				<div className='w-full flex items-center'>
					<Input
						value = {keyword}
						onChange = {(e) => setKeywords(e.target.value)}
                        type='text'
                        placeholder='Search products...'
                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary'
                    />

				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
				{
					searchResult && searchResult.length > 0 ? searchResult.map(product =>(
						<ShoppingViewProductTile key={product?._id} product={product} handleGetProductDetails = {handleGetProductDetails} handleAddToCart = {handleAddToCart}/>
					)):(
						<h1 className='font-bold text-[30px]'> No Result Found</h1>
					)
				}
			</div>
			<ProductDetailsDialogue open={openDetails} setOpen={setOpenDetails} ProductDetails={ProductDetails} handleAddToCart={handleAddToCart}/>
		</div>
	)
}

export default SearchPageView