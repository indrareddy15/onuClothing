import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import pLimit from 'p-limit';


dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOptions = {
	resource_type: 'auto',
	crop: 'scale', // Scale the image down
	timeout: 120000, // Timeout for upload request
	fetch_format: 'auto',
	quality: 'auto'
};
const storage = new multer.memoryStorage();
/* const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
}); */

async function handleImageUpload(file){
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file, uploadOptions);
        return result; // Return the result which contains the image URL, public_id, etc.
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}
async function handleMultipleImageUpload(files) {
    try {
        
        // Set a limit for concurrent uploads (e.g., 5 concurrent uploads at a time)
        const limit = pLimit(10);
        
        // Map files to upload promises but limit the number of concurrent uploads
        const uploadPromises = files.map(file =>
            limit(() => cloudinary.uploader.upload(file, uploadOptions))
        );
        
        // Await all upload promises
        const results = await Promise.all(uploadPromises);
        return results; // Return the array with image URLs, public_ids, etc.
    } catch (error) {
        console.error('Error uploading multiple files to Cloudinary:', error);
        return { error: error.message }; // Return the error message if anything fails
    }
}

const upload = multer({storage,limits:{fileSize:process.env.MAX_FILE_SIZE || 52428800}});
export {handleImageUpload,handleMultipleImageUpload,upload};