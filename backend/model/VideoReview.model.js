import mongoose from 'mongoose';

/**
 * Short-form (15–30s) review/reel videos shown on the home page between the
 * Recently Viewed and Collections sections. Media is hosted on Cloudinary;
 * only metadata + delivery URLs live here.
 */
const videoReviewSchema = new mongoose.Schema({
    title: { type: String, trim: true, default: '' },
    videoUrl: { type: String, required: true },   // optimized MP4 (Cloudinary secure_url)
    posterUrl: { type: String, required: true },  // auto-generated thumbnail
    publicId: { type: String, required: true },   // Cloudinary public_id (needed for deletion)
    duration: { type: Number, default: 0 },        // seconds
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number },
    // Optional "shop this" link to a product
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', default: null },
    order: { type: Number, default: 0 },           // manual sort (lower = first)
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

videoReviewSchema.index({ isActive: 1, order: 1, createdAt: -1 });

const VideoReview = mongoose.model('videoReview', videoReviewSchema);
export default VideoReview;
