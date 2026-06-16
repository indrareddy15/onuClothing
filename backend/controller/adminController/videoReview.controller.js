import VideoReview from '../../model/VideoReview.model.js';
import ProductModel from '../../model/productmodel.js';
import { handleVideoUpload, deleteVideoAsset } from '../../utility/cloudinaryUtils.js';
import logger from '../../utility/loggerUtils.js';

// Short-reel contract: clips must be roughly 15–30s. Allow a little slack.
const MIN_DURATION = 2;
const MAX_DURATION = 35;

/**
 * POST /admin/video-reviews/upload  (admin)
 * multipart/form-data: field "video" + optional title, productId.
 */
export const uploadVideoReview = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ Success: false, message: 'No video file provided' });
        }

        const { title = '', productId } = req.body;

        // Validate optional product link up-front.
        if (productId) {
            const product = await ProductModel.findById(productId).select('_id');
            if (!product) {
                return res.status(400).json({ Success: false, message: 'Linked product not found' });
            }
        }

        let result;
        try {
            result = await handleVideoUpload(req.file.buffer);
        } catch (uploadErr) {
            logger.error(`Video upload to Cloudinary failed: ${uploadErr.message}`);
            return res.status(500).json({ Success: false, message: 'Failed to upload video' });
        }

        // Trust Cloudinary's probe, not the client MIME.
        if (!result || result.resource_type !== 'video') {
            if (result?.public_id) await deleteVideoAsset(result.public_id).catch(() => {});
            return res.status(400).json({ Success: false, message: 'Uploaded file is not a valid video' });
        }

        // Enforce the short-reel duration contract server-side.
        const duration = Number(result.duration) || 0;
        if (duration < MIN_DURATION || duration > MAX_DURATION) {
            await deleteVideoAsset(result.public_id).catch(() => {});
            return res.status(400).json({
                Success: false,
                message: `Video must be between ${MIN_DURATION}s and ${MAX_DURATION}s (got ${Math.round(duration)}s)`,
            });
        }

        const posterUrl =
            result.eager?.find((e) => e.format === 'jpg')?.secure_url ||
            result.secure_url.replace(/\.(mp4|webm|mov)$/i, '.jpg');
        const optimizedUrl =
            result.eager?.find((e) => e.format === 'mp4')?.secure_url || result.secure_url;

        // New items go to the end of the list.
        const last = await VideoReview.findOne().sort({ order: -1 }).select('order');
        const nextOrder = (last?.order ?? -1) + 1;

        const doc = await VideoReview.create({
            title: String(title).slice(0, 120),
            videoUrl: optimizedUrl,
            posterUrl,
            publicId: result.public_id,
            duration,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            productId: productId || null,
            order: nextOrder,
            isActive: true,
        });

        res.status(201).json({ Success: true, message: 'Video review uploaded successfully', result: doc });
    } catch (error) {
        console.error('Error uploading video review:', error);
        logger.error(`Error uploading video review: ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

/** GET /admin/video-reviews/all  (admin) — every item, for management. */
export const getAllVideoReviews = async (req, res) => {
    try {
        const reviews = await VideoReview.find({})
            .sort({ order: 1, createdAt: -1 })
            .populate('productId', 'title price salePrice');
        res.status(200).json({ Success: true, message: 'All video reviews', result: reviews });
    } catch (error) {
        console.error('Error fetching video reviews:', error);
        logger.error(`Error fetching video reviews: ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

/** PUT /admin/video-reviews/:id  (admin) — edit title / productId / isActive. */
export const updateVideoReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, productId, isActive } = req.body;

        const update = {};
        if (title !== undefined) update.title = String(title).slice(0, 120);
        if (isActive !== undefined) update.isActive = Boolean(isActive);
        if (productId !== undefined) {
            if (productId) {
                const product = await ProductModel.findById(productId).select('_id');
                if (!product) return res.status(400).json({ Success: false, message: 'Linked product not found' });
                update.productId = productId;
            } else {
                update.productId = null;
            }
        }

        const doc = await VideoReview.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!doc) return res.status(404).json({ Success: false, message: 'Video review not found' });

        res.status(200).json({ Success: true, message: 'Video review updated', result: doc });
    } catch (error) {
        console.error('Error updating video review:', error);
        logger.error(`Error updating video review: ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

/** PATCH /admin/video-reviews/reorder  (admin) — body: { order: [{id, order}] }. */
export const reorderVideoReviews = async (req, res) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ Success: false, message: 'order array is required' });
        }
        await Promise.all(
            order
                .filter((o) => o && o.id)
                .map((o) => VideoReview.updateOne({ _id: o.id }, { $set: { order: Number(o.order) || 0 } }))
        );
        res.status(200).json({ Success: true, message: 'Reordered successfully' });
    } catch (error) {
        console.error('Error reordering video reviews:', error);
        logger.error(`Error reordering video reviews: ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

/** DELETE /admin/video-reviews/:id  (admin) — removes Cloudinary asset + record. */
export const deleteVideoReview = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await VideoReview.findById(id);
        if (!doc) return res.status(404).json({ Success: false, message: 'Video review not found' });

        try {
            await deleteVideoAsset(doc.publicId);
        } catch (assetErr) {
            // Don't block record deletion if the asset is already gone.
            logger.warn(`Cloudinary destroy failed for ${doc.publicId}: ${assetErr.message}`);
        }

        await doc.deleteOne();
        res.status(200).json({ Success: true, message: 'Video review deleted' });
    } catch (error) {
        console.error('Error deleting video review:', error);
        logger.error(`Error deleting video review: ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

/** GET /api/common/video-reviews  (public) — active items only, sorted. */
export const getActiveVideoReviews = async (req, res) => {
    try {
        const reviews = await VideoReview.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(12)
            .populate('productId', 'title price salePrice')
            .select('-publicId -bytes');
        res.status(200).json({ success: true, message: 'Active video reviews', result: reviews });
    } catch (error) {
        console.error('Error fetching active video reviews:', error);
        logger.error(`Error fetching active video reviews: ${error.message}`);
        res.status(500).json({ success: false, message: 'Internal Server Error', result: [] });
    }
};
