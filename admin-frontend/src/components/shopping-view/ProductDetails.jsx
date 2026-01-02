import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { StarIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { setProductsDetails } from '@/store/shop/product-slice'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '../ui/label'
import StarRating from './StarRating'
import { addReview, getReview } from '@/store/shop/review-slice'
import { useToast } from '@/hooks/use-toast'
import { getInitials } from '@/config'

const ProductDetailsDialogue = ({ProductDetails,open,setOpen,handleAddToCart}) => {
    const {user} = useSelector(state => state.auth);
    const {reviews} = useSelector(state => state.reviewProduct);

    const dispatch = useDispatch();
    const [reviewMsg,setReviewMessage] = useState('');
    const [rating,setRating] = useState(0);
    const{toast} = useToast();
    const handleRatingChange = (rating)=>{
        setRating(rating);
    }
    const handleDialogueClose = () => {
        setOpen(false);
        dispatch(setProductsDetails(null));
    }
    const handleSubmitRating = async (e)=>{
        e.preventDefault();
        // if(reviewMsg.trim() === ''){
        //     alert('Please fill all fields');
        //     return;
        // }
        try {
            await dispatch(addReview({
                productId:ProductDetails?._id,
                userId:user?.id,
                userName:user?.userName,
                rating:rating,
                message: reviewMsg
            }))
            fetchAllReviews();
            setRating(0);
            setReviewMessage('');
        } catch (error) {
            console.error("An error occurred while submitting the rating",error);
        }
    }
    const fetchAllReviews =async ()=>{
        try {
            await dispatch(getReview({productId:ProductDetails?._id}))
        } catch (error) {
            console.error("An error occurred while fetching");
        }
    }
    useEffect(()=>{
        fetchAllReviews();
    },[])
    return (
        <Dialog open = {open} onOpenChange={handleDialogueClose}>
            <DialogContent className = "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className='relative overflow-hidden rounded-lg'>
                    <img
                        src={ProductDetails?.image}
                        alt={ProductDetails?.title || "Product"}
                        width={600}
                        height={600}
                        className='aspect-square sm:block object-cover'
                    />
                    <p className='text-black font-semibold w-full h-auto'>{ProductDetails?.description}</p>
                </div>
                <div className=''>
                    <div>
                        <h3 className='text-2xl font-extrabold mb-6 mt-4'>
                            {ProductDetails?.title}
                        </h3>
                        
                    </div>
                    <div className='flex items-center justify-start'>
                        <p className={`${ProductDetails?.salePrice > 0 ? "line-through":''} text-primary text-3xl font-semibold`}>₹ {ProductDetails?.price}</p>
                        {ProductDetails?.salePrice && <p className='text-3xl ml-3 font-bold text-red-700'>₹ {ProductDetails?.salePrice}</p>}
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-0.5'>
                            <StarIcon className='w-5 h-5 fill-primary'/>
                            <StarIcon className='w-5 h-5 fill-primary'/>
                            <StarIcon className='w-5 h-5 fill-primary'/>
                            <StarIcon className='w-5 h-5 fill-primary'/>
                            <StarIcon className='w-5 h-5 fill-primary'/> 
                        </div>
                        <span className='text-muted-foreground mt-2'>{ProductDetails?.avgRating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className='mt-5 mb-5'>
                        {
                            ProductDetails?.totalStock > 0 ? (
                                <Button onClick = {()=>handleAddToCart(ProductDetails?._id,ProductDetails?.totalStock)} className = {"w-full bg-black"}>Add To Cart</Button>
                            ):(
                                <Button disabled className = "w-full">
                                    Out Of Stock
                                </Button>
                            )
                        }
                    </div>
                    <Separator/>
                    <div className='max-h-[350px] overflow-auto'>
                        <h2 className='text-xl font-bold mb-4'>
                            Reviews
                        </h2>
                        {
                            reviews && reviews.length > 0 && reviews.map((item,i) =>(
                                <div key={item?._id || i} className='grid gap-6 m-10'>
                                    <div className='flex gap-4'>
                                        <Avatar className = "w-10 h-10 border">
                                            <AvatarFallback className = {'w-full h-full text-black font-bold'}>{getInitials(item?.userName)}</AvatarFallback>
                                        </Avatar>
                                        <div className='grid gap-1'>
                                            <div className='flex items-center gap-2'>
                                                <h3 className='font-bold'>{item?.userName}</h3>
                                            </div>
                                            <div className='flex flex-row items-center gap-0.5'>
                                                <StarRating rating={item?.rating}/>
                                            </div>
                                            <p className='text-sm text-muted-foreground'>{item?.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='mt-10 flex gap-2 flex-col'>
                            <Label>Write a Review</Label>
                            <div className='flex'>
                                <StarRating rating={rating} handleRatingChange = {handleRatingChange} />
                            </div>
                            <Input
                                className = {"px-3"}
                                name = "reviewMsg" 
                                onChange = {(e)=> setReviewMessage(e.target.value)}
                                placeholder = "Write a Review...."
                            />
                            <Button onClick = {handleSubmitRating} disabled ={reviewMsg.trim() === ''}>Submit</Button>
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}
export default ProductDetailsDialogue