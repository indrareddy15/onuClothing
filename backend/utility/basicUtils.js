


export const calculateGst= (originalPrice,gst)=>{
    return originalPrice * (1 + (gst / 100)).toFixed(1)
}
export function getOriginalAmount(gstRate, amountWithGST) {
    // Calculate the original amount before GST
    const originalAmount = amountWithGST / (1 + (gstRate / 100));
    return originalAmount;
}
export const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
export function getStatusDescription(statusNumber) {
  const statusMap = {
    1:"New",
    2:'Invoiced',
    3:"Ready To Ship",
    4:"Pickup Scheduled",
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

  return statusMap[statusNumber] || 'Processing';
}

// Utility method to find slangs in a comment
export const findSlangsInComment = (comment) => {
	const SLANGS = [
		"crap",
		"sucks",
		"lame",
		"horrible",
		"terrible",
		"awful",
		"shit",
		"badass",
		"freaking",
		"hella",
		"screwed",
		"idiot",
		"loser",
		"bullshit",
		"broke"
	];
    // Convert comment to lowercase for case-insensitive comparison
    const lowerCaseComment = comment.toLowerCase();

    // Filter and return all slangs found in the comment
    return SLANGS.filter(slang => lowerCaseComment.includes(slang));
};

export function getBestCourierPartners(available_courier_companies) {
	// Filter out couriers with missing or zero values for important attributes
	const filteredCouriers = available_courier_companies.filter(courier => {
		return courier.tracking_performance && courier.pickup_performance && courier.pickup_availability && courier.etd_hours && courier.cod_charges;
	});

	// Sort the filtered couriers based on a weighted score of key attributes
	const sortedCouriers = filteredCouriers.sort((a, b) => {
		// Calculate the score for each courier based on tracking performance, pickup performance, and other factors
		const scoreA = (a.tracking_performance * 0.4) + (a.pickup_performance * 0.3) + (a.pickup_availability === '2' ? 0.2 : 0) + (1 / (a.etd_hours || 1)) * 0.1 - (a.cod_charges * 0.1);
		const scoreB = (b.tracking_performance * 0.4) + (b.pickup_performance * 0.3) + (b.pickup_availability === '2' ? 0.2 : 0) + (1 / (b.etd_hours || 1)) * 0.1 - (b.cod_charges * 0.1);

		return scoreB - scoreA;  // Sort descending by score
	});

	return sortedCouriers;
}
export const handleSort = (sortBy) => {
	// Create a default sort object
	let sort = {};
	
	switch (sortBy) {
		case "newest":
			// Sort by creation date (newest first)
			sort.createdAt = -1;
			break;
		
		case "popularity":
			// Assuming you want to sort by a custom popularity field
			sort.averageRating = -1;  // Descending order for most popular
			break;
		case "a-z":
			// Assuming you want to sort by a custom popularity field
			sort.title = 1;  // Descending order for most popular
			break;
		case "z-a":
			// Assuming you want to sort by a custom popularity field
			sort.title = -1;  // Descending order for most popular
			break;
	
		case "discount":
			// Assuming you have a discount field, you can sort based on that
			sort.salePrice = -1; // Descending order for higher discounts
			break;  
		case "price-high-to-low":
			// Sort by price in descending order
			sort.price = -1;  // Highest price first
			break;
	
		case "price-low-to-high":
			// Sort by price in ascending order
			sort.price = 1;   // Lowest price first
			break;
		case "rating-high-to-low":
			// Sort by price in descending order
			sort.averageRating = -1;  // Highest price first
			break;
	
		case "rating-low-to-high":
			// Sort by price in ascending order
			sort.averageRating = 1;   // Lowest price first
			break;
		default:
			// Default sorting (e.g., by price if no valid `sortBy` provided)
			if (sortBy === "low-to-high") {
				sort.price = 1;  // Default to ascending price sorting
			} else {
				// If no sortBy parameter is given or an unknown value, default to creation date
				sort.createdAt = -1; // Newest first
			}
		break;
	}
	
	return sort;
};
export function getHexValue(inputString) {
    const regex = /hex:(.*)/;
    const match = inputString.match(regex);
    if (match) {
        return match[1].trim();  // Return everything after "hex:" and remove any leading/trailing spaces
    } else {
        return null;  // Return null if "hex:" is not found in the string
    }
}

export function CheckIsPhoneNumber(input) {
    // Regex for validating phone number (simplified version)
    const phoneRegex = /^[+]?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?[\d\s-]{7,}$/;

    // Regex for validating email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the input matches the phone number pattern
    if (phoneRegex.test(input)) {
        return 'phone';
    }
    
    // Check if the input matches the email pattern
    if (emailRegex.test(input)) {
        return 'email';
    }

    // If it doesn't match either, return 'invalid'
    return 'invalid';
}
export const removeSpaces = (str) => str.replace(/\s+/g, '');
export const getStringFromObject = (objectData)=>{
	return Object.values(objectData).join(", ");
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
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (originalPrice > 0 && salePrice > 0) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100).toFixed(0);
    }
    return 0; // Return 0 if the prices are invalid or zero
};

export function generateWaybill() {
	// Logic to generate a unique waybill number
	return 'WB' + Math.floor(Math.random() * 1000000000);
}

export function generateOrderId() {
	// Logic to generate a unique order ID
	return 'ORD' + Math.floor(Math.random() * 1000000000);
}
export const generateOTP = (length = 6, options = { numericOnly: true }) => {
	const digits = '0123456789';
	const alphanum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const chars = options.numericOnly ? digits : alphanum;

	let otp = '';
	for (let i = 0; i < length; i++) {
		otp += chars[Math.floor(Math.random() * chars.length)];
	}
	return otp;
};