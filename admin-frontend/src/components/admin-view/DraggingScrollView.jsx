import { X, XCircle } from 'lucide-react'
import React from 'react'

const DraggingScrollView = ({ images,item ,handleDeleteFeatureImage}) => {
    return (
        <div className="flex overflow-x-auto space-x-4 py-4">
            {images.map((image, index) => (
                <div key={index} className="flex-shrink-0 relative w-48 h-48 rounded-2xl bg-slate-100 p-1">
                    <img src={image} alt={`img-${index}`} className="w-full h-full object-contain rounded-2xl" />
                    <X onClick={()=> handleDeleteFeatureImage(item._id,index)} className='w-5 h-5 bg-slate-300 text-white rounded-full absolute top-0 right-5'/>
                </div>
            ))}
        </div>
    )
}

export default DraggingScrollView