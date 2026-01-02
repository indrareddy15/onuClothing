import React from 'react';
import FeatureImageSingleItem from './FeatureImageSingleItem';

const ImageUploadingRow = ({allImageUrls,handleDeleteFeatureImage}) => {
    /* const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false);
    const [allImageUrls, setAllImageUrls] = useState([]);
    const UploadNewFeatureImage = (e)=>{
        if(!uploadedImageUrl){
            return;
        }
        setAllImageUrls([...allImageUrls,uploadedImageUrl]);
        setUploadedImageUrl('');
        setImageFile(null);
    }
    const handleDeleteFeatureImage = (index)=>{
        console.log("Delete Feature Image: ",index);
        const updatedImages = allImageUrls.filter((_,i)=>i !== index);
        setAllImageUrls(updatedImages);
    }
    console.log("Feature Image Urls For",ImageHeaderCategory); */
    return (
        <div className='w-auto h-full bg-red-200 overflow-x-auto flex-row gap-x-7 flex justify-start items-center '>
            {allImageUrls.length > 0 && allImageUrls.map((url, index) => (
                <FeatureImageSingleItem key={index} index={index} imageUrl={url} handleDeleteFeatureImage = {handleDeleteFeatureImage}/>
            ))}
        </div>
    );
};

export default ImageUploadingRow;
