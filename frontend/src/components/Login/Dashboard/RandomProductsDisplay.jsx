import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react'
import SingleProduct from '../../Product/Single_product';
import { useServerWishList } from '../../../Contaxt/ServerWishListContext';

const RandomProductsDisplay = ({ label = '' }) => {
	const { randomProducts, RandomProductLoading } = useServerWishList();

	const sliderRef = useRef(null);

	const [dragState, setDragState] = useState({
		isDragging: false,
		startX: 0,
		startTouchX: 0,
		scrollLeft: 0,
	});


	// Mouse Down, Mouse Move, Mouse Up Handlers
	const handleMouseDown = (e) => {
		setDragState((prev) => ({
			...prev,
			isDragging: true,
			startX: e.clientX,
			scrollLeft: sliderRef.current.scrollLeft,
		}));
		e.preventDefault();
	};

	const handleMouseMove = (e) => {
		if (!dragState.isDragging) return;
		const moveX = e.clientX - dragState.startX;
		sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};

	const handleMouseUp = () => setDragState((prev) => ({ ...prev, isDragging: false }));
	const handleMouseLeave = () => setDragState((prev) => ({ ...prev, isDragging: false }));

	// Touch Start, Touch Move, Touch End Handlers
	const handleTouchStart = (e) => {
		setDragState((prev) => ({
			...prev,
			isDragging: true,
			startTouchX: e.touches[0].clientX,
			scrollLeft: sliderRef.current.scrollLeft,
		}));
	};

	const handleTouchMove = (e) => {
		if (!dragState.isDragging) return;
		const moveX = e.touches[0].clientX - dragState.startTouchX;
		sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};

	const handleTouchEnd = () => setDragState((prev) => ({ ...prev, isDragging: false }));

	// Scroll functionality for left and right arrows
	const scroll = (direction) => {
		const slider = sliderRef.current;
		const scrollAmount = 400; // Amount to scroll with each button click
		slider.scrollTo({
			left: slider.scrollLeft + direction * scrollAmount,
			behavior: 'smooth', // This makes the scroll smooth
		});
	};

	return (
		<div className="mt-2 mb-7 w-full pb-6 pt-4 px-4">
			<div className="w-full justify-center items-center flex px-1 py-2">
				<h1 className="flex text-center mt-4 uppercase font-semibold text-foreground">{label}</h1>
			</div>

			<div className="relative">
				<button
					onClick={() => scroll(-1)}
					className="absolute left-3 top-1/2 transform bg-primary -translate-y-1/2 text-primary-foreground hover:text-primary-foreground/80 hover:scale-105 opacity-90 hover:opacity-100 p-2 rounded-full z-10 py-3"
				>
					<ChevronLeft />
				</button>

				<div
					ref={sliderRef}
					className="justify-center items-start overflow-x-auto scrollbar-hide"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
				>
					{RandomProductLoading ? (
						<ul className='flex gap-4 py-2 sm:gap-2 md:gap-8 lg:gap-6'>
							{Array(10)
								.fill(0)
								.map((_, index) => (
									<div
										key={`skeleton_${index}`}
										className="m-2 md:h-[400px] md:w-[600px] p-2 h-[190px] w-[160px] 
												transform transition-transform duration-500 ease-in-out bg-muted rounded-lg animate-pulse"
									>
										<div className="h-[90%] w-[260px] bg-muted-foreground/20 rounded-md"></div>
									</div>
								))
							}
						</ul>
					) : (
						<ul className="flex gap-4 py-2 sm:gap-2 md:gap-8 lg:gap-6">
							{randomProducts && randomProducts.length > 0 && randomProducts.map((pro, index) => (
								<li key={pro?._id || index} className="flex-shrink-0 w-[200px] md:w-max lg:w-max">
									<SingleProduct pro={pro} />
								</li>
							))}
						</ul>

					)
					}
				</div>

				<button
					onClick={() => scroll(1)}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:text-primary-foreground/80 hover:scale-105 opacity-90 hover:opacity-100 p-2 rounded-full py-3 z-10"
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	);
};

export default RandomProductsDisplay
