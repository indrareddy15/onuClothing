import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageZoom = ({ imageSrc }) => {
	const [zoomStyle, setZoomStyle] = useState({});
	const [showZoom, setShowZoom] = useState(false);

	const handleMouseEnter = () => {
		setShowZoom(true);
	};

	const handleMouseMove = (e) => {
		const rect = e.target.getBoundingClientRect(); // Get the position of the image
		const x = e.clientX - rect.left; // Mouse position relative to the image
		const y = e.clientY - rect.top;

		const width = rect.width;
		const height = rect.height;

		const zoomSize = 100; // Size of the zoomed square
		const bgX = (x / width) * 100; // Calculate background position as percentage
		const bgY = (y / height) * 100;

		setZoomStyle({
			top: `${y - zoomSize / 2}px`,
			left: `${x - zoomSize / 2}px`,
			backgroundPosition: `${bgX}% ${bgY}%`,
			backgroundImage: `url(${imageSrc})`,
			backgroundSize: `${width * 2}px ${height * 2}px`, // Adjust zoom level
		});
	};

	const handleMouseLeave = () => {
		setShowZoom(false);
	};

	return (
		<div className="relative h-full w-full border-[0.5px] overflow-hidden">
		{/* Main Image */}
		<LazyLoadImage
			src={imageSrc}
			alt="Zoomable"
			className="w-full h-full object-cover"
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		/>

			{/* Zoom Square */}
			{showZoom && (
				<div
				className="absolute pointer-events-none border-2 border-gray-300 rounded"
				style={{
					...zoomStyle,
					width: "200px", // Size of zoomed square
					height: "200px",
				}}
				></div>
			)}
		</div>
	);
};

export default ImageZoom;
