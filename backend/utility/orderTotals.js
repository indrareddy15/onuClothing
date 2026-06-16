import ProductModel from '../model/productmodel.js';
import Bag from '../model/bag.js';
import WebSiteModel from '../model/websiteData.model.js';
import logger from './loggerUtils.js';

/**
 * Canonical, server-side calculation of a bag's monetary totals.
 *
 * This is the single source of truth for what a customer must pay. It mirrors
 * the display logic in ordercontroller.getItemsData but is intentionally kept
 * here so that order/payment creation never trusts a client-supplied amount.
 *
 * Prices are always re-read from the Product documents in the DB. Coupon and
 * convenience-fee logic are applied exactly as the bag dictates.
 *
 * @param {object} bag - A Bag document populated with `orderItems.productId` and `Coupon`.
 * @param {object} [options]
 * @param {number} [options.convenienceFees] - Effective convenience fee to apply.
 *        When provided (e.g. the current global fee), it overrides the bag's
 *        stale snapshot so the charge matches what the storefront displays.
 * @returns {Promise<{totalProductSellingPrice:number,totalSP:number,totalDiscount:number,totalMRP:number,totalGst:number}>}
 */
export const computeBagTotals = async (bag, { convenienceFees } = {}) => {
    let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
    let totalMRP = 0, totalGst = 0;

    if (!bag || !Array.isArray(bag.orderItems)) {
        return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst };
    }

    // Effective convenience fee: prefer the explicit (live) value; fall back to
    // the bag's snapshot only when none is provided.
    const effectiveConvenienceFee = typeof convenienceFees === 'number'
        ? convenienceFees
        : (bag?.ConvenienceFees || 0);

    for (const item of bag.orderItems) {
        const { productId, quantity, isChecked } = item;
        if (!isChecked) continue;

        const idOfProduct = productId?._id || productId;
        try {
            const productData = await ProductModel.findById(idOfProduct);
            if (!productData) {
                logger.warn(`computeBagTotals: product not found ${idOfProduct}`);
                continue;
            }

            const { salePrice, price } = productData;
            const qty = Number(quantity) || 0;
            const sellingPrice = salePrice && salePrice > 0 ? salePrice : price;

            totalSP += sellingPrice * qty;
            totalProductSellingPrice += sellingPrice * qty;
            totalMRP += (price || 0) * qty;

            if (salePrice && price && price > 0) {
                totalDiscount += (price - salePrice) * qty;
            }
        } catch (error) {
            logger.error(`computeBagTotals: error reading product ${idOfProduct}: ${error.message}`);
        }
    }

    // Coupon
    let couponDiscountedAmount = 0;
    const applyCouponDiscount = () => {
        let discountedAmount = totalProductSellingPrice;
        if (typeof bag.Coupon?.Discount !== 'number' || bag.Coupon.Discount < 0) {
            return discountedAmount;
        }
        const { CouponType, Discount } = bag.Coupon;
        if (CouponType === 'Percentage') {
            if (totalProductSellingPrice > 0) {
                const discountAmount = discountedAmount * (Discount / 100);
                discountedAmount -= discountAmount;
                couponDiscountedAmount += discountAmount;
            }
        } else {
            if (discountedAmount > Discount) {
                discountedAmount -= Discount;
                couponDiscountedAmount += Discount;
            } else {
                couponDiscountedAmount += discountedAmount;
                discountedAmount = 0;
            }
        }
        return discountedAmount;
    };

    // Subtotal (selling price, pre-coupon) — used for coupon/free-shipping
    // eligibility exactly like the storefront does.
    const subtotalBeforeCoupon = totalProductSellingPrice;

    if (bag.Coupon) {
        const { MinOrderAmount } = bag.Coupon;
        if (MinOrderAmount > 0 && subtotalBeforeCoupon >= MinOrderAmount) {
            totalProductSellingPrice = applyCouponDiscount();
        } else if (!MinOrderAmount || MinOrderAmount <= 0) {
            totalProductSellingPrice = applyCouponDiscount();
        }
    }

    // Convenience fee mirrors the storefront: the fee applies UNLESS a
    // free-shipping coupon is active and its minimum-order threshold is met.
    // (It is never *subtracted* from the product subtotal.)
    const freeShipping = Boolean(bag?.Coupon?.FreeShipping);
    const minOrderAmount = bag?.Coupon?.MinOrderAmount || 0;
    let shipping = effectiveConvenienceFee > 0 ? effectiveConvenienceFee : 0;
    if (freeShipping && subtotalBeforeCoupon >= minOrderAmount) {
        shipping = 0;
    }
    totalProductSellingPrice += shipping;

    totalDiscount += couponDiscountedAmount;
    return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst };
};

/**
 * Loads the user's bag and returns the authoritative payable total (in rupees,
 * rounded to the nearest integer). Use this in every order/payment-creation
 * path instead of any client-supplied amount.
 *
 * @param {string} userId
 * @returns {Promise<{bag:object, totals:object, payable:number}|null>} null if no bag exists.
 */
export const computeAuthoritativeTotal = async (userId) => {
    const bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon');
    if (!bag) return null;
    // Use the CURRENT global convenience fee, not the (possibly stale) value
    // snapshotted on the bag at creation time.
    const feeDoc = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
    const liveConvenienceFees = feeDoc?.ConvenienceFees || 0;
    const totals = await computeBagTotals(bag, { convenienceFees: liveConvenienceFees });
    const payable = Math.max(0, Math.round(totals.totalProductSellingPrice || 0));
    return { bag, totals, payable };
};
