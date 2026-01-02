import React from 'react'
import { Button } from '../ui/button';
import { Minus, Plus, Trash } from 'lucide-react';

const CartItemsContent = ({item,handleOnCartItemDelete,handleUpdateCartItemQuantity}) => {
    console.log(item);
    return (
        <div className='flex items-center space-x-4'>
            <img 
                src={item?.image} 
                alt={item?.title} 
                className='w-20 h-20 object-cover rounded-r-sm'
            />
            <div className='flex-1'>
                <h3 className='font-extrabold'>{item?.title}</h3>
                <div className='flex items-center mt-1 gap-3'>
                    <Button disabled = {item?.quantity <= 1} onClick={()=>handleUpdateCartItemQuantity(item,"minus")} variant = "outline" className = "w-8 h-8 rounded-full" size = "icon">
                        <Minus  className='w-4 h-4'/>
                        <span className='sr-only'>Decrease</span>
                    </Button>
                    <span className='text-sm font-semibold'>{item?.quantity}</span>
                    <Button onClick = {()=> handleUpdateCartItemQuantity(item,"plus")} variant = "outline" className = "w-8 h-8 rounded-full" size = "icon">
                        <Plus className='w-4 h-4'/>
                        <span className='sr-only'>Decrease</span>
                    </Button>
                </div>
            </div>
            <div className='flex flex-col items-end'>
                <p className='font-semibold'>
                    ₹ {((item?.salePrice > 0 ? item?.salePrice: item?.price )* item?.quantity).toFixed(2)} 
                </p>
                <Trash onClick={()=> handleOnCartItemDelete(item)} className='cursor-pointer' size={20}/>
            </div>
        </div>
    )
}

export default CartItemsContent
