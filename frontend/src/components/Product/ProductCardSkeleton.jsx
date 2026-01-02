import React from 'react';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * ProductCardSkeleton Component
 * Modern skeleton loader following newCode design system
 * Provides smooth loading placeholder for product cards
 */
const ProductCardSkeleton = () => {
	return (
		<div className="space-y-3">
			{/* Image skeleton - using aspect ratio to match ProductCard */}
			<div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
				<Skeleton className="w-full h-full" />
			</div>

			{/* Text skeletons */}
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}

export default ProductCardSkeleton;