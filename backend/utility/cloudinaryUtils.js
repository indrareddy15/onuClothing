import { v2 as cloudinary } from 'cloudinary';
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

async function handleImageUpload(file) {
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
        // Return null or throw error instead of returning an object
        throw new Error(`Multiple image upload failed: ${error.message}`);
    }
}

const maxFileSize = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 52428800;
const upload = multer({ storage, limits: { fileSize: maxFileSize } });

/* -------------------------------------------------------------------------- */
/*  Video uploads (short-form review reels)                                   */
/* -------------------------------------------------------------------------- */

// Upload a video directly from a Buffer (no base64 inflation). Requests eager
// transformations so a poster (jpg) and a web-optimized MP4 are pre-generated
// — the first viewer never pays transform latency.
async function handleVideoUpload(buffer, folder = 'video-reviews') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                folder,
                eager: [
                    { format: 'jpg', transformation: [{ width: 540, crop: 'scale' }] },
                    { format: 'mp4', transformation: [{ quality: 'auto:eco', video_codec: 'auto', fetch_format: 'auto' }] },
                ],
                eager_async: false,
                timeout: 180000,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

// Remove a Cloudinary video asset (call before deleting the DB record).
async function deleteVideoAsset(publicId) {
    if (!publicId) return null;
    return cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}

const ALLOWED_VIDEO_MIME = ['video/mp4', 'video/webm', 'video/quicktime'];
const maxVideoSize = process.env.VIDEO_MAX_FILE_SIZE
    ? parseInt(process.env.VIDEO_MAX_FILE_SIZE, 10)
    : 80 * 1024 * 1024; // 80MB default — ample for a 15–30s reel

const uploadVideo = multer({
    storage,
    limits: { fileSize: maxVideoSize },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_VIDEO_MIME.includes(file.mimetype)) return cb(null, true);
        cb(new Error('Unsupported file type. Allowed: MP4, WebM, MOV.'));
    },
});

export { handleImageUpload, handleMultipleImageUpload, upload, handleVideoUpload, deleteVideoAsset, uploadVideo };