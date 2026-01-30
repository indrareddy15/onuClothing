export function capitalizeFirstLetterOfEachWord(str) {
	if (!str) {
		return "NO TEXT"
	}
	return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export function getRandomItems(array, numItems) {
	if (!Array.isArray(array) || array.length === 0 || numItems <= 0) {
		return [];
	}

	const shuffled = array.slice().sort(() => Math.random() - 0.5); // Shuffle the array
	return shuffled.slice(0, numItems); // Return the first `numItems` elements
}
// Removed unused filterImageFiles function to clean up warnings
export const getSortingValues = (OriginalName) => {
	switch (OriginalName) {
		case 'What`s New':
			return 'newest'
		case 'Popularity':
			return 'popularity'
		case 'A-Z':
			return 'a-z'
		case 'Z-A':
			return 'z-a';
		case 'Better Discount':
			return 'discount'
		case 'Price: High To Low':
			return 'price-high-to-low'
		case 'Price: Low To High':
			return 'price-low-to-high'
		case 'Rating: High To Low':
			return 'rating-high-to-low'
		case 'Rating: Low To High':
			return 'rating-low-to-high'
		default:
			return 'newest'
	}
}
const sortingUrlToValueMap = {
	"What`s New": 'newest',
	"Popularity": 'popularity',
	"A-Z": 'a-z',
	"Z-A": 'z-a',
	"Better Discount": 'discount',
	"Price: High To Low": 'price-high-to-low',
	"Price: Low To High": 'price-low-to-high',
	"Rating: High To Low": 'rating-high-to-low',
	"Rating: Low To High": 'rating-low-to-high',
};
const valueToSortingUrlMap = Object.fromEntries(
	Object.entries(sortingUrlToValueMap).map(([key, value]) => [value, key])
);
export const getSortingKeyValuePairs = (key = null) => {
	if (key) {
		// If a specific key is passed, return the value of that key
		return sortingUrlToValueMap[key] || null; // Return null if key doesn't exist
	} else {
		// If no key is passed, return all key-value pairs as an array of objects
		return Object.entries(sortingUrlToValueMap).map(([key, value]) => ({ key, value }));
	}
};
export const getReverseSortingValueValues = (sortingUrlValue) => {
	// If the sortingUrlValue is from the sorting URL to value map
	if (sortingUrlToValueMap[sortingUrlValue]) {
		return sortingUrlToValueMap[sortingUrlValue];
	} else if (valueToSortingUrlMap[sortingUrlValue]) {
		return valueToSortingUrlMap[sortingUrlValue];
	}
	return 'What`s New';
}
export function getStatusDescription(statusNumber) {
	const statusMap = {
		1: "New",
		2: 'Invoiced',
		3: "Ready To Ship",
		4: "Pickup Scheduled",
		6: 'Shipped',
		7: 'Delivered',
		8: 'Canceled',
		9: 'RTO Initiated',
		10: 'RTO Delivered',
		12: 'Lost',
		13: 'Pickup Error',
		14: 'RTO Acknowledged',
		15: 'Pickup Rescheduled',
		16: 'Cancellation Requested',
		17: 'Out For Delivery',
		18: 'In Transit',
		19: 'Out For Pickup',
		20: 'Pickup Exception',
		21: 'Undelivered',
		22: 'Delayed',
		23: 'Partial Delivered',
		24: 'Destroyed',
		25: 'Damaged',
		26: 'Fulfilled',
		27: 'Pickup Booked',
		38: 'Reached at Destination Hub',
		39: 'Misrouted',
		40: 'RTO NDR',
		41: 'RTO OFD',
		42: 'Picked Up',
		43: 'Self Fulfilled',
		44: 'Disposed Off',
		45: 'Cancelled Before Dispatched',
		46: 'RTO In Transit',
		47: 'QC Failed',
		48: 'Reached Warehouse',
		49: 'Custom Cleared',
		50: 'In Flight',
		51: 'Handover to Courier',
		52: 'Shipment Booked',
		54: 'In Transit Overseas',
		55: 'Connection Aligned',
		56: 'Reached Overseas Warehouse',
		57: 'Custom Cleared Overseas',
		59: 'Box Packing',
		68: 'Processed at Warehouse',
		60: 'FC Allocated',
		61: 'Picklist Generated',
		62: 'Ready to Pack',
		63: 'Packed',
		67: 'FC Manifest Generated',
		71: 'Handover Exception',
		72: 'Packed Exception',
		75: 'RTO Lock',
		76: 'Untraceable',
		77: 'Issue Related to the Recipient',
		78: 'Reached Back at Seller City',
		79: 'Rider Assigned',
		80: 'Rider Unassigned',
		81: 'Rider Assigned',
		82: 'Rider Reached at Drop',
		83: 'Searching for Rider'
	};

	return statusMap[statusNumber] || 'Unknown Status';
}
export function getImagesArrayFromProducts(product, getFirstColorOnly = false) {
	// Helper function to check if a file is a video based on its extension
	// console.log("all colors",product)
	const isVideoFile = (fileName) => {
		// Check if fileName and fileName.url exist before calling toLowerCase
		if (!fileName || !fileName.url || typeof fileName.url !== 'string') {
			return false;
		}
		const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'];
		return videoExtensions.some(extension => fileName.url.toLowerCase().endsWith(extension));
	};

	// Function to collect images, excluding video files
	const getImagesFromProduct = (product) => {
		let images = [];

		// Check if product exists and has the expected structure
		if (!product || !product.size || !Array.isArray(product.size)) {
			return images;
		}

		// If we only want first color images (for product cards/listings)
		if (getFirstColorOnly) {
			// Find the first size with colors that have images
			for (const size of product.size) {
				if (size && size.colors && Array.isArray(size.colors) && size.colors.length > 0) {
					// Get the first color with images
					const firstColor = size.colors[0];
					if (firstColor && firstColor.images && Array.isArray(firstColor.images)) {
						images = firstColor.images.filter(image => image && !isVideoFile(image));
						if (images.length > 0) break; // Stop once we have images from first color
					}
				}
			}
		} else {
			// Get all unique images from all colors (for detailed views)
			product.size.forEach(s => {
				// Iterate over the colors for each size
				if (s && s.colors && Array.isArray(s.colors)) {
					s.colors.forEach(c => {
						// Filter out video files from color images
						if (c && c.images && Array.isArray(c.images)) {
							const filteredImages = c.images.filter(image => image && !isVideoFile(image));
							images = [...images, ...filteredImages];
						}
					});
				}
			});
		}

		return images;
	};

	// Get and return filtered images
	return getImagesFromProduct(product);
}



export function getRandomItem(array) {
	if (!Array.isArray(array) || array.length === 0) {
		return null; // Return null for invalid or empty arrays
	}

	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}
export function hexToRgba(hex, alpha = 1) {
	// Remove '#' if present in hex string
	hex = hex.replace('#', '');

	// Parse the red, green, and blue values
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// Return the rgba string
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export const calculateDiscount = (originalPrice, salePrice) => {
	// Ensure prices are valid (greater than 0)
	if (originalPrice <= 0 || salePrice < 0) {
		throw new Error("Invalid price values");
	}

	// Calculate the discount amount
	const discountAmount = originalPrice - salePrice;

	// Calculate the discount percentage
	const discountPercentage = ((discountAmount / originalPrice) * 100).toFixed(0);

	return {
		discountAmount,
		discountPercentage,
	};
};
export const generateArrayOfRandomItems = (array, numItems) => {
	if (!Array.isArray(array) || array.length === 0 || numItems <= 0) {
		return [];
	}

	// Fisher-Yates Shuffle algorithm
	const shuffled = [...array]; // Create a copy of the original array
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // Get a random index from 0 to i
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap the elements
	}

	return shuffled.slice(0, numItems); // Return the first `numItems` elements
}
export const extractSpecificWord = (inputString) => {
	if (inputString == null) {
		return "-"
	}
	// Regular expression to match uppercase words or phrases like "ON U"
	const regex = /\b[A-Z]+(?:-[A-Z]+)*\b/g;

	// Find matches
	const matches = inputString.match(regex);
	return matches ? matches[0] : null; // Return the first match or null if no match is found
};
export const headerConfig = () => {
	const token = localStorage.getItem("token");
	// console.log("Header Token: ",token);
	const headers = {
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${token}`,
			"Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
		},
	}
	return headers;
}

export const cleanupInvalidTokens = () => {
	const token = localStorage.getItem("token");

	// Remove invalid tokens from localStorage
	if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
		localStorage.removeItem("token");
		console.log("Cleaned up invalid token from localStorage");
	}
}
export const removeSpaces = (inputString) => {
	return inputString.replace(/\s+/g, '');
}

export const getLocalStorageBag = () => {
	const bag = JSON.parse(localStorage.getItem("bagItem")) || [];
	return bag;
}
export const getLocalStorageWishListItem = () => {
	const wishList = JSON.parse(localStorage.getItem("wishListItem")) || [];
	return wishList;
}
export const setSessionStorageBagListItem = (orderData, productId) => {
	let bagItem = JSON.parse(localStorage.getItem("bagItem"));
	if (!bagItem) {
		bagItem = [];
	}
	let index = bagItem?.findIndex((item) => item.productId === productId);
	if (index !== -1) {
		if (bagItem[index].size._id === orderData.size._id && bagItem[index].color._id === orderData.color._id) {
			bagItem[index].quantity += 1;
		} else {
			bagItem.push(orderData);
		}

	} else {
		bagItem.push(orderData);
	}
	localStorage.setItem("bagItem", JSON.stringify(bagItem));
}
export const setWishListProductInfo = (product, productId) => {
	const wishListData = {
		productId: { ...product },
	};
	let wishListItem = JSON.parse(localStorage.getItem("wishListItem"));
	if (!wishListItem) {
		wishListItem = [];
	}
	// console.log("bag: ",b)
	let index = wishListItem?.findIndex((item) => item.productId?._id === productId);
	if (index === -1) {
		wishListItem.push(wishListData);
		localStorage.setItem("wishListItem", JSON.stringify(wishListItem));
	} else {
		wishListItem.splice(index, 1);
		localStorage.setItem("wishListItem", JSON.stringify(wishListItem));
	}
}

export const formattedSalePrice = (price) => {
	return price && price > 0 ? Math.round(price) : "";
}
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
	if (originalPrice > 0 && salePrice > 0) {
		return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
	}
	return 0; // Return 0 if the prices are invalid or zero
};
export function getOriginalAmount(gstRate, amountWithGST) {
	// Calculate the original amount before GST
	const originalAmount = amountWithGST / (1 + (gstRate / 100));
	return originalAmount;
}

export const DevMode = true;
export const BYPASS_AUTH_IN_DEV = true; // Set to false to enable auth in development

// Mock user for development bypassing authentication
export const DEV_MOCK_USER = {
	_id: 'dev_user_123',
	name: 'Development User',
	email: 'dev@example.com',
	phoneNumber: '1234567890',
	role: 'user',
	gender: 'other'
};

// export const BASE_API_URL = DevMode ? process.env.REACT_APP_API_URL : "https://api.theonu.in";
export const BASE_API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
// export const BASE_CLIENT_URL = DevMode ? process.env.REACT_APP_CLIENT_URL : "https://theonu.in";

// new Updated...
export const footWearSizeChartData = [
	{ size: '6', footLength: '9.25"', ukSize: '5', eurSize: '38' },
	{ size: '7', footLength: '9.625"', ukSize: '6', eurSize: '39' },
	{ size: '8', footLength: '9.9375"', ukSize: '7', eurSize: '40' },
	{ size: '9', footLength: '10.25"', ukSize: '8', eurSize: '41' },
	{ size: '10', footLength: '10.5"', ukSize: '9', eurSize: '42' },
	{ size: '11', footLength: '10.9375"', ukSize: '10', eurSize: '43' },
	{ size: '12', footLength: '11.25"', ukSize: '11', eurSize: '44' },
	{ size: '13', footLength: '11.5625"', ukSize: '12', eurSize: '45' },
	{ size: '14', footLength: '11.875"', ukSize: '13', eurSize: '46' },
];
export const clothingSizeChartData = [
	{ size: 'XS', chest: '32-34"', waist: '26-28"', hips: '34-36"' },
	{ size: 'S', chest: '34-36"', waist: '28-30"', hips: '36-38"' },
	{ size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"' },
	{ size: 'L', chest: '42-44"', waist: '36-38"', hips: '40-42"' },
	{ size: 'XL', chest: '46-48"', waist: '40-42"', hips: '42-44"' },
	{ size: 'XXL', chest: '50-52"', waist: '44-46"', hips: '44-46"' },
	{ size: '3XL', chest: '54-56"', waist: '48-50"', hips: '46-48"' },
	{ size: '4XL', chest: '58-60"', waist: '52-54"', hips: '48-50"' },
	{ size: '5XL', chest: '62-64"', waist: '56-58"', hips: '50-52"' },
	{ size: '6XL', chest: '66-68"', waist: '60-62"', hips: '52-54"' },
];
export const sanitizeInput = (input) => {
	return input.replace(/[^a-zA-Z0-9]/g, ''); // Removes anything that's not alphanumeric
};
export const BASE_CLIENT_URL = import.meta.env.VITE_CLIENT_URL;
export const inProduction = import.meta.env.REACT_APP_NODE_ENV === 'production' ? true : false;


export const SECREAT_KEY = import.meta.env.REACT_APP_SECREAT_KEY || '53fdb688706c681b8742ce4ee16291be301396612e9b6c5772ca9d4a8803fedc';
export const ORDER_ENCRYPTION_SECREAT_KEY = import.meta.env.REACT_APP_ORDER_ENCRYPTION_SECREAT_KEY || 'c41909436dc9d80b70e601d70c66f9776c0b88cd4af5aa2c2e6c21a5e33619e8';
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || import.meta.env.REACT_APP_RAZORPAY_KEY;


