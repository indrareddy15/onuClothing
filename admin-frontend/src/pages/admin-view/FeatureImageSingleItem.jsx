import { Button } from '@/components/ui/button'
import { XCircleIcon } from 'lucide-react'
import React from 'react'

const FeatureImageSingleItem = ({index,imageUrl,handleDeleteFeatureImage}) => {
    return (
        <div className='w-[200px] h-[200px] items-center justify-centers bg-slate-300 rounded-2xl'>
            <div className='w-full relative h-full flex justify-end items-center'>
                <img src={imageUrl} alt='uploadedImage' className='w-full h-full object-fill rounded-xl'/> 
                <div className='absolute right-6 top-2 h-5 w-5'>
                    <Button onClick={()=>handleDeleteFeatureImage(index)} className='w-full h-full bg-transparent hover:bg-slate-200 font-bold'>
                        <XCircleIcon size={10} color='black'/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FeatureImageSingleItem