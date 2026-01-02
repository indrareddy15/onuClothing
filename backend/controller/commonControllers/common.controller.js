import axios from "axios";
import BannerModel from "../../model/banner.model.js";
import CategoryBannerModel from "../../model/category.banner.model.js";
import ContactQuery from "../../model/ContactQuery.model.js";
import Coupon from "../../model/Coupon.model.js";
import Option from "../../model/options.model.js";
import ProductModel from "../../model/productmodel.js";
import Visit from "../../model/Visit.model.js";
import WebSiteModel from "../../model/websiteData.model.js";
import logger from "../../utility/loggerUtils.js";
import { sendCouponMail, sendCustomMail } from "../emailController.js";


export const getHomeBanners = async (req, res) => {
	try {
		const banners = await BannerModel.find({});
		return res.status(200).json({ Success: true, message: "Successfully Fetched Banners", result: banners || [] });
	} catch (error) {
		console.error(`Error getting Banners: `, error);
		logger.error(`Error getting Banners: ${error.message}`)
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const updateFeaturesIndex = async (req, res) => {
	try {
		const { categoryType, sourceIndex, destinationIndex } = req.body;
		if (!categoryType) {
			return res.status(400).json({ Success: false, message: "Not category type specified" });
		}
		if (sourceIndex === destinationIndex) {
			return res.status(400).json({ Success: false, message: "Source and Destination index cannot be same" });
		}
		if (sourceIndex < 0) {
			return res.status(400).json({ Success: false, message: "Not source index specified" });
		}
		if (destinationIndex < 0) {
			return res.status(400).json({ Success: false, message: "Not destination index specified" });
		}
		const bannerModel = await BannerModel.findOne({ CategoryType: categoryType });
		console.log("Updating features Images Index: ", req.body, bannerModel);
		if (!bannerModel) {
			return res.status(404).json({ Success: false, message: "Category Type not found" });
		}
		const reorderItems = Array.from(bannerModel.Url);
		const [removed] = reorderItems.splice(sourceIndex, 1);
		reorderItems.splice(destinationIndex, 0, removed);
		bannerModel.Url = reorderItems;
		await bannerModel.save();
		res.status(200).json({ Success: true, message: "Successfully Updated Features Image Positions" });
	} catch (error) {
		console.error("Error updating features index", error);
		logger.error(`Error updating features index: ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error', result: [] });
	}
}
export const addHomeCarousalMultiple = async (req, res) => {
	try {
		// Destructuring inputs from the request body
		const { images, CategoryType, Header } = req.body;

		// Validation check for images
		if (!images || !images.length) {
			return res.status(400).json({ Success: false, message: "At least one image is required" });
		}

		// Extract image URLs
		const imageUrls = images.map(img => img.url);
		console.log("Add Home Carousal Multiple req.body", imageUrls);

		// Find existing banner by CategoryType
		let banner = await BannerModel.findOne({ CategoryType });

		// If no banner found, create a new one
		if (!banner) {
			banner = new BannerModel({
				CategoryType,
				Header,
				Url: imageUrls,
			});
		} else {
			// Update banner's header and add new images if needed
			if (Header) {
				banner.Header = Header;
			}
			if (imageUrls.length) {
				banner.Url.push(...imageUrls);
			}
		}

		// Save the banner document
		await banner.save();

		// Fetch all banners (assuming you need all for response)
		const banners = await BannerModel.find({});

		// Send success response with all banners
		return res.status(201).json({
			Success: true,
			message: 'Home Carousal added successfully!',
			result: banners
		});

	} catch (error) {
		// Log error and return internal server error response
		console.error("Error adding home carousel:", error);
		logger.error(`Error adding home carousel: ${error.message}`);

		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};

export const updateHeaderCarousal = async (req, res) => {
	try {
		const { CategoryType, Header } = req.body;
		console.log("Update Header Carousal req.body", req.body);
		if (!CategoryType) {
			return res.status(400).json({ Success: false, message: "CategoryType is required" });
		}
		const banner = await BannerModel.findOne({ CategoryType });
		if (!banner) {
			return res.status(404).json({ Success: false, message: "Banner not found" });
		}
		banner.Header = Header;
		await banner.save();

		res.status(200).json({ Success: true, message: "Successfully Updated Header Carousal" });
	} catch (error) {
		console.error("Error updating header carousal", error);
		logger.error(`Error updating header carousal: ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error', result: [] });
	}
}

export const addHomeCarousal = async (req, res) => {
	try {
		const { url, CategoryType, Header } = req.body;

		// Early validation check
		if (!url && !Header) {
			return res.status(400).json({ Success: false, message: "URL or Header is required" });
		}

		console.log("Add Home Carousal req.body", req.body);

		// Find existing banner by CategoryType
		let banner = await BannerModel.findOne({ CategoryType });

		// If no banner exists, create a new one; otherwise, update it
		if (!banner) {
			banner = new BannerModel({
				CategoryType,
				Header,
				Url: [url], // Initialize URL array with the provided URL
			});
		} else {
			if (Header) banner.Header = Header;
			if (url) banner.Url.push(url);
		}

		// Save the banner to the database
		await banner.save();

		// Fetch all banners to return
		const banners = await BannerModel.find({});


		// Respond with success message and the updated banners
		return res.status(201).json({
			Success: true,
			message: 'Home Carousal added successfully!',
			result: banners,
		});

	} catch (error) {
		// Handle error and log it
		console.error("Error adding Banners:", error);
		logger.error(`Error adding Banners: ${error.message}`);

		// Respond with error message
		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};


export const removeHomeCarousal = async (req, res) => {
	try {
		const { id, imageIndex } = req.params;

		// Validate inputs early
		if (!id || !imageIndex) {
			return res.status(400).json({ Success: false, message: "Id and image index are required" });
		}

		// Find the banner by ID
		const banner = await BannerModel.findById(id);
		if (!banner) {
			return res.status(404).json({ Success: false, message: "Banner not found" });
		}

		// Validate the image index
		if (imageIndex < 0 || imageIndex >= banner.Url.length) {
			return res.status(400).json({ Success: false, message: "Invalid image index" });
		}

		// Identify the URL to remove
		const urlToRemove = banner.Url[imageIndex];
		const isEmpty = banner.Url.length - 1 === 0
		console.log("Url to isEmpty: ", isEmpty);
		if (isEmpty) {
			const bannerWithRemovedUrl = await BannerModel.findByIdAndUpdate(
				id,
				{
					$pull: { Url: urlToRemove },
					$unset: { Header: "" }  // Unset the header field if the condition is met
				},
				{ new: true }  // Ensure the updated document is returned
			);
			if (!bannerWithRemovedUrl) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}
			console.log("Updated Banners: ", bannerWithRemovedUrl);
			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: bannerWithRemovedUrl });
		} else {
			// Update the banner by removing the URL at the specified index
			const updatedBanner = await BannerModel.findByIdAndUpdate(
				id,
				{ $pull: { Url: urlToRemove } },
				{ new: true }  // Ensure the updated document is returned
			);
			if (!updatedBanner) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}

			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: updatedBanner });
		}


	} catch (error) {
		// Handle and log error
		console.error(`Error removing banner: `, error);
		logger.error("Error removing banner: " + error.message);

		// Return internal server error
		return res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
};

export const addCategoryBanners = async (req, res) => {
	try {
		const { CategoryType, Header, url } = req.body;
		console.log("Add Category Banners req.body", req.body);

		// Validate input fields
		if (!CategoryType || !url) {
			return res.status(400).json({ Success: false, message: "All fields are required" });
		}

		// Check if a banner already exists for the given CategoryType
		let banner = await CategoryBannerModel.findOne({ CategoryType });

		// If no banner exists, create a new one; otherwise, update it
		if (!banner) {
			// No existing banner for CategoryType, create a new one
			banner = new CategoryBannerModel({
				CategoryType,
				Header,
				Url: [url], // Initialize the URL array with the provided url object
			});
		} else {
			// Update the existing banner with the new Header and URL
			if (Header) banner.Header = Header;
			if (url) banner.Url.push(url); // Directly push the URL object
		}

		// Save the banner to the database
		await banner.save();

		// Fetch the updated banner or all banners, depending on your needs
		const banners = await CategoryBannerModel.find({ CategoryType });

		// Respond with a success message and the updated banners
		return res.status(201).json({
			Success: true,
			message: 'Category Banner added/updated successfully!',
			result: banners,
		});

	} catch (error) {
		// Log the error and return a server error message
		console.error("Error adding Category Banners:", error);
		logger.error(`Error adding Category Banners: ${error.message}`);
		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};

export const getCategoryBanners = async (req, res) => {
	try {
		// Fetch all banners to return
		const banners = await CategoryBannerModel.find({});
		// Respond with success message and the banners
		return res.status(200).json({
			Success: true,
			message: 'Home Carousal fetched successfully!',
			result: banners || [],
		});
	} catch (error) {
		console.error(`Error fetching Category Banners: `, error);
		logger.error(`Error fetching Category Banners: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
}
export const updateCategoryBannerIndex = async (req, res) => {
	try {
		const { categoryType, sourceIndex, destinationIndex } = req.body;
		if (!categoryType) {
			return res.status(400).json({ success: false, message: "Category Type is required" });
		}
		if (sourceIndex === destinationIndex) {
			return res.status(400).json({ success: false, message: "Source and Destination indices cannot be the same" });
		}
		if (sourceIndex < 0) {
			return res.status(400).json({ success: false, message: "Source index cannot be negative" });
		}
		if (destinationIndex < 0) {
			return res.status(400).json({ success: false, message: "Destination index cannot be negative" });
		}
		const bannerData = await CategoryBannerModel.findOne({ CategoryType: categoryType });
		if (!bannerData) {
			return res.status(404).json({ success: false, message: "No such category type found" });
		}
		console.log("Update Category Banner Index req.body", bannerData);
		const reorderItems = Array.from(bannerData.Url);
		const [removed] = reorderItems.splice(sourceIndex, 1);
		reorderItems.splice(destinationIndex, 0, removed);
		bannerData.Url = reorderItems;
		await bannerData.save();
		res.status(200).json({ success: true, message: "Category Banner Index" });
	} catch (error) {
		console.error(`Error updating category banner index: `, error);
		logger.error(`Error updating category banner index: ${error.message}`)
		return res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
}
export const removeCategoryBanners = async (req, res) => {
	try {
		const { id, imageIndex } = req.query;
		console.log("Remove Category Banners req.params", req.params);
		// Validate inputs early
		if (!id || !imageIndex) {
			return res.status(400).json({ Success: false, message: "Id and image index are required" });
		}

		// Find the banner by ID
		const banner = await CategoryBannerModel.findById(id);
		if (!banner) {
			return res.status(404).json({ Success: false, message: "Banner not found" });
		}

		// Validate the image index
		if (imageIndex < 0 || imageIndex >= banner.Url.length) {
			return res.status(400).json({ Success: false, message: "Invalid image index" });
		}

		// Identify the URL to remove
		const urlToRemove = banner.Url[imageIndex];
		const isEmpty = banner.Url.length - 1 === 0
		console.log("Url to isEmpty: ", isEmpty);
		if (isEmpty) {
			const bannerWithRemovedUrl = await CategoryBannerModel.findByIdAndUpdate(
				id,
				{
					$pull: { Url: urlToRemove },
					$unset: { Header: "" }  // Unset the header field if the condition is met
				},
				{ new: true }  // Ensure the updated document is returned
			);
			if (!bannerWithRemovedUrl) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}
			if (bannerWithRemovedUrl.Url.length <= 0) {
				// Remove the banner completely
				await banner.remove();
				return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: null });
			}
			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: bannerWithRemovedUrl });
		} else {
			// Update the banner by removing the URL at the specified index
			const updatedBanner = await CategoryBannerModel.findByIdAndUpdate(
				id,
				{ $pull: { Url: urlToRemove } },
				{ new: true }  // Ensure the updated document is returned
			);
			if (!updatedBanner) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}

			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: updatedBanner });
		}
	} catch (error) {
		console.error(`Error removing Category Banners: `, error);
		logger.error(`Error removing Category Banners: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
}
export const FetchAllFilters = async (req, res) => {
	try {
		// Fetch only necessary fields
		const filters = await ProductModel.find({}).select('category subCategory gender AllColors -_id');

		// Reduce the filters data to avoid multiple iterations (more efficient)
		const filterData = filters.reduce((acc, item) => {
			if (item.category) acc.AllCategory.add(item.category);
			if (item.gender) acc.AllGenders.add(item.gender);
			if (item.subCategory) acc.AllSubCategory.add(item.subCategory);
			return acc;
		}, { AllCategory: new Set(), AllGenders: new Set(), AllSubCategory: new Set() });

		// Convert Set to array
		const result = {
			AllCategory: [...filterData.AllCategory],
			AllGenders: [...filterData.AllGenders],
			AllSubCategory: [...filterData.AllSubCategory],
		};

		// Send the response
		res.status(200).json({ Success: true, message: "All Filters", result });

	} catch (error) {
		// Log the error in a concise way
		console.error("Error Fetching Filters:", error.message);
		logger.error(`Error Fetching Filters: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
};

export const setAboutData = async (req, res) => {
	try {
		const aboutData = req.body;

		// Using findOneAndUpdate with upsert: true to either update or create the document
		const result = await WebSiteModel.findOneAndUpdate(
			{ tag: 'AboutData' }, // Query to find the document
			{ AboutData: aboutData }, // Update the AboutData field
			{ new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` creates if not found
		);

		// Return the response with appropriate success message
		res.status(200).json({
			Success: true,
			message: result.isNew ? 'About Data set successfully' : 'About Data updated successfully',
			result: result,
		});
	} catch (error) {
		console.error("Error setting about data:", error.message);
		logger.error("Error setting about data: " + error.message);
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};



export const setTermsAndConditionWebsite = async (req, res) => {
	try {
		const termsAndConditionData = req.body;

		// Attempt to find and update or create the document in one operation
		const websiteData = await WebSiteModel.findOneAndUpdate(
			{ tag: 'terms-and-condition' },  // Find the document with the tag 'terms-and-condition'
			{ termsAndCondition: termsAndConditionData },  // Update the terms and condition
			{ new: true, upsert: true }  // `new: true` returns the updated document, `upsert: true` creates if not found
		);

		if (websiteData) {
			// If document exists or was created, return success response
			res.status(200).json({
				Success: true,
				message: websiteData.isNew ? "Terms and Conditions set successfully." : "Terms and Conditions updated successfully.",
			});
		} else {
			// This code shouldn't normally be reached due to upsert, but you can handle an unexpected case
			res.status(500).json({
				Success: false,
				message: "Unexpected error occurred.",
			});
		}

	} catch (error) {
		console.error("Error setting Terms and Conditions:", error.message);
		logger.error(`Error setting Terms and Conditions: ${error.message}`);
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};



export const getTermsAndConditionWebsite = async (req, res) => {
	try {
		// Fetch terms and condition data based on the tag 'terms-and-condition'
		const termsAndCondition = await WebSiteModel.findOne({ tag: 'terms-and-condition' });

		if (termsAndCondition) {
			// Return the found terms and condition if exists
			return res.status(200).json({
				Success: true,
				message: "Terms and Conditions fetched successfully",
				result: termsAndCondition.termsAndCondition,
			});
		}

		// If no terms and condition data found, return a friendly message
		return res.status(200).json({
			Success: false,
			message: "No Terms and Conditions found",
			result: null,
		});

	} catch (error) {
		// Log detailed error message for debugging purposes
		console.error("Error while fetching terms and conditions: ", error.message);
		logger.error(`Error While Fetching Terms and Conditions: ${error.message}`)
		// Return the error in response
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};



export const setPrivacyPolicyWebsite = async (req, res) => {
	try {
		// Attempt to find and update or create the document in one operation
		const privacyPolicyData = req.body;

		const websiteData = await WebSiteModel.findOneAndUpdate(
			{ tag: 'privacy-policy' },  // Find the document with the tag 'privacy-policy'
			{ privacyPolicy: privacyPolicyData },  // Update the privacy policy
			{ new: true, upsert: true }  // `new: true` returns the updated document, `upsert: true` creates if not found
		);

		if (websiteData) {
			// Respond with the appropriate success message
			res.status(200).json({
				Success: true,
				message: websiteData.isNew
					? "Successfully set Privacy Policy"
					: "Successfully updated Privacy Policy",
			});
		} else {
			throw new Error("Unexpected error occurred while updating Privacy Policy.");
		}

	} catch (error) {
		// Log error details for debugging purposes
		console.error("Error setting Privacy Policy: ", error.message);
		logger.error(`Error setting Privacy Policy: ${error.message}`);
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};


export const getPrivacyPolicyWebsite = async (req, res) => {
	try {
		const privacyPolicy = await WebSiteModel.findOne({ tag: 'privacy-policy' });
		// console.log("termsAndCondition: ",privacyPolicy);
		const result = privacyPolicy ? privacyPolicy.privacyPolicy : null;
		res.status(200).json({ Success: true, message: "Privacy Policy found Succeffully!", result: result })
	} catch (error) {
		console.error("Error while getting Privacy and Policy: ", error);
		logger.error("Error while getting Privacy and Policy" + error.message);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const setFAQWebsite = async (req, res) => {
	try {
		const { faqData } = req.body;

		// Using findOneAndUpdate with upsert and $push for better performance
		const result = await WebSiteModel.findOneAndUpdate(
			{ tag: 'faq' },
			{ $push: { faqArray: faqData } },  // Efficiently append to the faqArray
			{ new: true, upsert: true }  // `new: true` returns the updated document, `upsert: true` creates it if not found
		);

		res.status(200).json({
			Success: true,
			message: result.isNew ? "Successfully set FAQ" : "FAQ updated successfully",
		});

	} catch (error) {
		console.error("Error while setting FAQ: ", error);
		logger.error(`Error while setting FAQ: ${error.message}`);
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};

export const removeFAQById = async (req, res) => {
	try {
		const { faqId } = req.query;
		// console.log("FAQ ID: ",faqId);
		await WebSiteModel.findOneAndUpdate({ tag: 'faq' }, { $pull: { faqArray: { _id: faqId } } }, { new: true });
		// console.log("Updated FAQ Array: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'FAQ removed successfully' });
	} catch (error) {
		console.error("Error while removing FAQ: ", error);
		logger.error(`Error while removing FAQ: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const getFAQWebsite = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'faq' });
		// console.log("FAQ Array: ",alreadyFoundWebsiteData)
		if (!alreadyFoundWebsiteData) {
			return res.status(200).json({ Success: false, message: "No FAQ found", result: [] });
		}
		res.status(200).json({ Success: true, message: "FAQ Array", result: alreadyFoundWebsiteData?.faqArray || [] });
	} catch (error) {
		console.error(`Error getting FAQ: ${error}`);
		logger.error(`Error getting FAQ: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}

export const setContactUsePageData = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: "contact-us" });
		console.log("req.body: ", req.body);
		if (!alreadyFoundWebsiteData) {
			const contact = new WebSiteModel({ ContactUsePageData: req.body, tag: 'contact-us' });
			await contact.save();
			console.log("Contact Use Page Data: ", contact)
			return;
		}
		alreadyFoundWebsiteData.ContactUsePageData = req.body;
		await alreadyFoundWebsiteData.save();
		// console.log("Contact Use Page Data: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'Contact Use Page Data set successfully' });
	} catch (error) {
		console.error("Internal Server Error", error);
		logger.error(`Error setting contact-us data: ${error.message}`)
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const sendContactQueryMail = async (req, res) => {
	try {
		const { queryId, email, Subject, status, resolvedMessage } = req.body;
		const queryToUpdate = await ContactQuery.findByIdAndUpdate(queryId, { Status: status, QueryReslovedMessage: resolvedMessage }, { new: true });
		if (!queryToUpdate) return res.status(404).json({ Success: false, message: 'Contact Query Not Found' });

		const sendCustomeMail = await sendCustomMail(email, Subject, `Response Status: ${status}\nResloved Message: ${resolvedMessage}`);
		console.log("sendCustomeMail: ", sendCustomeMail);
		if (!sendCustomeMail) return res.status(500).json({ Success: false, message: 'Failed to send Contact Query Email' });
		res.status(200).json({ Success: true, message: 'Contact Query Sent Successfully' });
	} catch (error) {
		console.error("Contact Query Sent Error", error);
		logger.error(`Error sending contact query mail: ${error.message}`)
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const getContactUsPageData = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'contact-us' });
		// console.log("Contact Use Page Data: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: "Contact Use Page Data", result: alreadyFoundWebsiteData?.ContactUsePageData || {} });
	} catch (error) {
		console.error(`Error getting`, error);
		logger.error(`Error getting contact: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const getContactQuery = async (req, res) => {
	try {
		const queries = await ContactQuery.find({});
		console.log("Contact Queries: ", queries)
		res.status(200).json({ Success: true, message: "Contact Queries", result: queries });
	} catch (error) {
		console.error(`Error getting`, error);
		logger.error(`Error getting contact queries: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const createContactQuery = async (req, res) => {
	try {
		console.log("Query Data: ", req.body);
		const { contactDetails, message } = req.body;
		if (!contactDetails) {
			return res.status(400).json({ Success: false, message: "Contact Details are required" });
		}
		if (!message) {
			return res.status(400).json({ Success: false, message: "Message is required" });
		}
		const newQuery = new ContactQuery({ QueryDetails: { ...contactDetails }, QueryMessage: message });
		await newQuery.save();
		res.status(201).json({ Success: true, message: 'Query created successfully!', result: newQuery });
	} catch (error) {
		console.error("Error creating contact query: ", error);
		logger.error(`Error creating contact query: ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const getConvenienceFees = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
		// console.log("Convenience Fees: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: "Convenience Fees", result: alreadyFoundWebsiteData?.ConvenienceFees || 0 });
	} catch (error) {
		console.error(`Error getting`, error);
		logger.error(`Error getting convenience fees: ${error.message}`);
		res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
	}
}
export const patchConvenienceOptions = async (req, res) => {
	try {
		const { convenienceFees } = req.body;

		// Ensure convenienceFees is provided
		if (!convenienceFees) {
			return res.status(400).json({ Success: false, message: "Convenience Fees are required" });
		}

		// Convert convenienceFees to a number and handle invalid inputs
		const feeValue = Number(convenienceFees);
		if (isNaN(feeValue)) {
			return res.status(400).json({ Success: false, message: "Invalid convenience fee value" });
		}

		// Check if the convenience fees already exist in the database
		let websiteData = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });

		// If no data found, create a new record
		if (!websiteData) {
			websiteData = new WebSiteModel({ tag: 'ConvenienceFees', ConvenienceFees: feeValue });
			await websiteData.save();
			return res.status(200).json({
				Success: true,
				message: 'Convenience Fees added successfully',
				result: websiteData.ConvenienceFees,
			});
		}

		// If found, update the existing data
		websiteData.ConvenienceFees = feeValue;
		await websiteData.save();

		return res.status(200).json({
			Success: true,
			message: 'Convenience Fees updated successfully',
			result: websiteData.ConvenienceFees || 0,
		});

	} catch (error) {
		console.error("Error Patching Convenience Fees: ", error.message); // Only log error message for clarity
		logger.error(`Error Patching Convenience Fees: ${error.message}`); // Log error message for clarity
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
};
export const updateAddressFormFiledIndex = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'Address' });
		if (!alreadyFoundWebsiteData) {
			return res.status(404).json({ Success: false, message: 'Address not found' })
		}
		const { sourceIndex, destinationIndex } = req.body;
		console.log("Updated Body: ", sourceIndex, destinationIndex);
		// const items = Array.from(alreadyFoundWebsiteData.Address);
		const [removed] = alreadyFoundWebsiteData.Address.splice(sourceIndex, 1);
		alreadyFoundWebsiteData.Address.splice(destinationIndex, 0, removed);
		console.log("Updated Address Form: ", alreadyFoundWebsiteData);
		await alreadyFoundWebsiteData.save();
		res.status(200).json({ Success: true, message: 'Address Form saved successfully' });
	} catch (error) {
		console.error("Error updating address Form Index: ", error);
		logger.error(`Error updating address Form Index: ${error.message}`);
		res.status(500).json({ Success: false, message: "Internal Server Error" })
	}
}

export const removeAddressFormField = async (req, res) => {
	try {
		const { addressFormFields } = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'Address' });
		if (!alreadyFoundWebsiteData) {
			return res.status(404).json({ Success: false, message: 'Address Data not found' });
		}
		const index = alreadyFoundWebsiteData.Address.findIndex(item => item === addressFormFields);
		if (index === -1) {
			return res.status(404).json({ Success: false, message: 'Address Data not found' });
		}
		alreadyFoundWebsiteData.Address.splice(index, 1);
		await alreadyFoundWebsiteData.save();
		// console.log("Address Data: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'Address Data removed successfully', result: alreadyFoundWebsiteData?.Address || [] });
	} catch (error) {
		console.error(`Error setting about data `, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error', result: [] });
	}
}
export const setAddressField = async (req, res) => {
	try {
		const { addressFormFields } = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'Address' });
		if (!alreadyFoundWebsiteData) {
			const about = new WebSiteModel({ Address: [addressFormFields], tag: 'Address' });
			await about.save();
			return res.status(200).json({ Success: true, message: 'Address Data set successfully' });
		}
		alreadyFoundWebsiteData.Address.push(addressFormFields);
		await alreadyFoundWebsiteData.save();
		res.status(200).json({ Success: true, message: 'Address Data set successfully', result: alreadyFoundWebsiteData?.Address || [] });
	} catch (error) {
		console.error(`Error setting about data `, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error', result: [] });
	}
}
export const setWebsiteDisclaimers = async (req, res) => {
	try {
		const { websiteDisclaimers } = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'WebsiteDisclaimers' });
		if (!alreadyFoundWebsiteData) {
			const about = new WebSiteModel({ WebsiteDisclaimers: [websiteDisclaimers], tag: 'WebsiteDisclaimers' });
			await about.save();
			// console.log("Website Disclaimers: ",about)
			return res.status(200).json({ Success: true, message: 'Website Disclaimers set successfully' });
		}
		alreadyFoundWebsiteData.WebsiteDisclaimers.push(websiteDisclaimers);
		await alreadyFoundWebsiteData.save();
		// console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'Website Disclaimers set successfully', result: alreadyFoundWebsiteData?.WebsiteDisclaimers || [] });
	} catch (error) {
		console.error(`Error setting about data `, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const editDisclaimers = async (req, res) => {
	try {
		const { disclaimersId, disclaimers } = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'WebsiteDisclaimers' });
		if (!alreadyFoundWebsiteData) {
			return res.status(404).json({ Success: false, message: 'Website Disclaimers not found' });
		}
		const index = alreadyFoundWebsiteData.WebsiteDisclaimers.findIndex(item => item._id.toString() === disclaimersId);
		if (index === -1) {
			return res.status(404).json({ Success: false, message: 'Website Disclaimers not found' });
		}
		alreadyFoundWebsiteData.WebsiteDisclaimers[index] = disclaimers;
		await alreadyFoundWebsiteData.save();
		// console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'Website Disclaimers updated successfully', result: alreadyFoundWebsiteData?.WebsiteDisclaimers || [] });
	} catch (error) {
		console.error(`Error setting about data`, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const removeWebsiteDisclaimers = async (req, res) => {
	try {
		const { disclaimersId } = req.params;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'WebsiteDisclaimers' });
		if (!alreadyFoundWebsiteData) {
			return res.status(404).json({ Success: false, message: 'Website Disclaimers not found' });
		}
		const index = alreadyFoundWebsiteData.WebsiteDisclaimers.findIndex(item => item._id.toString() === disclaimersId);
		if (index === -1) {
			return res.status(404).json({ Success: false, message: 'Website Disclaimers not found' });
		}
		alreadyFoundWebsiteData.WebsiteDisclaimers.splice(index, 1);
		await alreadyFoundWebsiteData.save();
		// console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
		res.status(200).json({ Success: true, message: 'Website Disclaimers updated successfully', result: alreadyFoundWebsiteData?.WebsiteDisclaimers })
	} catch (error) {
		console.error(`Error setting about data`, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const getWebsiteDisclaimers = async (req, res) => {
	try {
		const aboutData = await WebSiteModel.findOne({ tag: 'WebsiteDisclaimers' });
		if (!aboutData) {
			return res.status(404).json({ Success: false, message: 'Website Disclaimers not found' });
		}
		// console.log("All Website Disclaimers: ",aboutData)
		res.status(200).json({ Success: true, message: 'Website Disclaimers Found', result: aboutData.WebsiteDisclaimers || [] });
	} catch (error) {
		console.error(`Error getting website disclaimers:`, error);
		logger.error(`Error getting website disclaimers ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const getAddressField = async (req, res) => {
	try {
		const aboutData = await WebSiteModel.findOne({ tag: 'Address' });
		//   console.log("Address Data: ",aboutData?.Address)
		res.status(200).json({ Success: true, message: 'Address Data Found', result: aboutData?.Address || [] });
	} catch (error) {
		console.error(`Error setting about data `, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}
export const getAboutData = async (req, res) => {
	try {
		const aboutData = await WebSiteModel.findOne({ tag: 'AboutData' });
		//   console.log("Client About Data: ",aboutData)
		res.status(200).json({ Success: true, message: 'About Data Found', aboutData: aboutData?.AboutData || {} });
	} catch (error) {
		console.error(`Error setting about data `, error);
		logger.error(`Error setting about data ${error.message}`);
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
}




export const getAllOptions = async (req, res) => {
	try {
		const allOptions = await Option.find({});
		res.status(200).json({ success: true, message: "Fetch All Options", result: allOptions || [] })
	} catch (error) {
		console.error(`Error Fetching Options`, error);
		logger.error(`Error Fetching Options ${error.message}`);
		res.status(500).json({ success: false, message: "Failed to fetch all options" })
	}
}
// Fetch all options of a specific type
export const getOptions = async (req, res) => {
	try {
		const { type } = req.params; // Get the type of option (e.g., category)

		if (!['category', 'subcategory', 'color', 'clothingSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}

		const options = await Option.find({ type });
		res.status(200).json({ Success: true, message: "Featch All Options", result: options });
	} catch (error) {
		console.error(`Error Fetching Options: ${error.message}`);
		logger.error(`Error Fetching Options ${error.message}`);
		res.status(500).json({ message: 'Server error' });
	}
};

// Add a new option
export const addOption = async (req, res) => {
	try {
		const { type, value } = req.body;

		if (!['category', 'subcategory', 'color', 'clothingSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}

		const existingOption = await Option.findOne({ type, value });
		if (existingOption) {
			return res.status(400).json({ message: 'Option already exists' });
		}

		const newOption = new Option({ type, value });
		await newOption.save();

		res.status(201).json({ Success: true, message: 'Option added successfully', result: newOption });
	} catch (error) {
		console.error(`Error adding option: ${error.message}`);
		logger.error(`Error adding option ${error.message}`);
		res.status(500).json({ message: 'Server error', result: null });
	}
};

export const updateColorName = async (req, res) => {
	try {
		const { updatingData } = req.body;
		const { type, value, name } = JSON.parse(updatingData);
		// console.log("Updating colors...",updatingData);
		if (!['category', 'subcategory', 'color', 'clothingSize', 'footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
		const updatedOption = await Option.findOneAndUpdate(
			{ type, value },
			{ name: name }, // Toggle the value
			{ new: true } // Return the updated document
		);
		if (!updatedOption) {
			return res.status(404).json({ message: 'Option not found' });
		}
		const allProductsUpdate = await ProductModel.updateMany(
			{},  // Empty filter to match all products
			{
				$set: {
					"AllColors.$[elem].name": name  // Update the name of the matching label
				}
			},
			{
				arrayFilters: [
					{ "elem.label": value }  // Specify the label to match (e.g., "color")
				]
			}
		);
		console.log("Updated Products: ", allProductsUpdate);
		res.status(200).json({ Success: true, message: 'Color Option updated successfully', result: updatedOption });
	} catch (error) {
		console.error(`Error updating color name`, error);
		logger.error(`Error updating color name ${error.message}`);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
}

export const updateIsActive = async (req, res) => {
	try {
		const { updatingData } = req.body;
		const { type, value } = JSON.parse(updatingData);

		if (!['category', 'subcategory', 'color', 'clothingSize', 'footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}

		const option = await Option.findOne({ type, value }); // Find the option by type and value
		if (!option) {
			return res.status(404).json({ message: 'Option not found' });
		}

		// Toggle the isActive value
		const updatedOption = await Option.findOneAndUpdate(
			{ type, value },
			{ isActive: !option.isActive }, // Toggle the value
			{ new: true } // Return the updated document
		);
		res.status(200).json({ Success: true, message: 'Option updated successfully', result: updatedOption });
	} catch (error) {
		console.error(`Error updating option is active`, error);
		logger.error(`Error updating option is active ${error.message}`);
		res.status(500).json({ message: 'Server error' });
	}
}
// Delete an option by its value
export const removeOptionsByType = async (req, res) => {
	try {
		// const parseData = JSON.parse(req.body);
		const { removingData } = req.body;
		const { type, value } = JSON.parse(removingData);
		if (!['category', 'subcategory', 'color', 'clothingSize', 'footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
		let canRemoveOption = true;
		switch (type) {
			case 'category':
				const availableProductCategoryItems = await ProductModel.find({ category: value })
				if (availableProductCategoryItems.length > 0) {
					canRemoveOption = false;
				}
				break;
			case 'subcategory':
				const availableProductSubCategoryItems = await ProductModel.find({ subCategory: value })
				if (availableProductSubCategoryItems.length > 0) {
					canRemoveOption = false;
				}
				break;
			case 'gender':
				const availableProductGenderItems = await ProductModel.find({ gender: value })
				if (availableProductGenderItems.length > 0) {
					canRemoveOption = false;
				}
				break;
			default:
		}
		if (!canRemoveOption) {
			return res.status(400).json({ Success: true, message: "Cannot Remove Items If used" });
		}
		const deleted = await Option.findOneAndDelete({ type, value });
		console.log("Deleted Options: ", deleted);
		res.status(200).json({ Success: true, message: 'Option deleted successfully' });

	} catch (error) {
		console.error("Error Deleting Options ", error);
		res.status(500).json({ message: 'Server error' });
		logger.error(`Error Deleting Options: `, error);
	}
};
export const fetchCouponsByQuery = async (req, res) => {
	try {
		// const {query} = req.query;
		console.log("Fetching Coupons Query: ", req.query);
		const filter = {};
		filter.Status = "Active";
		if (req.query) {
			if (req.query.MinimumAmount) {
				filter.MinimumAmount = { $lte: query.MinimumAmount }
			}
			if (req.query.FreeShipping) {
				filter.FreeShipping = req.query.FreeShipping === 'true' ? true : false;
			}
			if (req.query.CustomerLogin) {
				filter.CustomerLogin = req.query.CustomerLogin === 'true' ? true : false;
			}
			if (req.query.Discount) {
				filter.Discount = { $gt: req.query.Discount };
			}
			if (req.query.Category) {
				filter.Category = req.query.Category;
			}
		}
		const today = new Date();
		await Coupon.updateMany(
			{ ValidDate: { $lt: today } }, // Filter for coupons where ValidDate is less than today's date
			{ $set: { Status: 'Inactive' } } // Update the status to 'Inactive'
		);
		const foundCoupons = await Coupon.find(filter).limit(10);
		res.status(200).json({ success: true, message: "Successfully fetched Coupons", result: foundCoupons || [] });
	} catch (error) {
		console.error(`Error getting Coupons: `, error);
		logger.error(`Error getting Coupons: `, error);
		res.status(500).json({ success: false, message: `Internal Server Error ${error.message}` });
	}
}

export const sendMailToGetCoupon = async (req, res) => {
	try {
		const { fullName, email } = req.body;
		const coupon = await Coupon.aggregate([{ $sample: { size: 1 } }]);
		const randomCoupon = coupon[0]; // Get the first (and only) item in the array
		if (randomCoupon) {
			const success = await sendCouponMail(fullName, email, randomCoupon?.CouponCode)
			// console.log("Coupon sent: ",success)
			if (!success) {
				return res.status(500).json({ success: false, message: 'Failed to send coupon email' });
			}
			return res.status(200).json({ success: true, message: 'Coupon sent successfully' });
		}
		res.status(200).json({ success: false, message: 'No coupon found' });
	} catch (error) {
		console.error("Error sending email: ", error);
		logger.error(`Error sending email: ${error.message}`);
		res.status(500).json({ success: false, message: 'Failed to send email' });
	}
}


export const setCouponBannerData = async (req, res) => {
	try {
		const alreadyPresetCouponBannerData = await WebSiteModel.findOne({ tag: 'Coupon-banner' });

		if (!alreadyPresetCouponBannerData) {
			// No existing AboutData, create a new entry
			const newWebsiteData = new WebSiteModel({
				CouponBannerData: { ...req.body },
				tag: 'Coupon-banner',
			});

			await newWebsiteData.save();
			console.log("New Copuon Banner Data Created: ", newWebsiteData);

			return res.status(200).json({
				Success: true,
				message: 'Coupon Banner Data set successfully',
				result: newWebsiteData,
			});
		}

		alreadyPresetCouponBannerData.CouponBannerData = { ...req.body };

		await alreadyPresetCouponBannerData.save();
		console.log("Updated About Data: ", alreadyPresetCouponBannerData);

		res.status(200).json({
			Success: true,
			message: 'About Data updated successfully',
			result: alreadyPresetCouponBannerData,
		});
	} catch (error) {
		console.error("Error setting coupon banner data: ", error);
		logger.error(`Error setting coupon banner data: ${error.message}`);
		res.status(500).json({ success: false, message: 'Failed to set coupon banner data' });
	}
}
export const getCouponBannerData = async (req, res) => {
	try {
		const termsAndCondition = await WebSiteModel.findOne({ tag: 'Coupon-banner' });

		if (termsAndCondition) {
			// Return the found terms and condition if exists
			return res.status(200).json({
				Success: true,
				message: "Coupon-banner fetched successfully",
				result: termsAndCondition.CouponBannerData,
			});
		}

		// If no terms and condition data found, return a friendly message
		return res.status(200).json({
			Success: false,
			message: "No Coupon-bannerfound",
			result: null,
		});
	} catch (error) {
		console.error("Error getting coupon banner data: ", error);
		logger.error(`Error getting coupon banner data: ${error.message}`);
		res.status(500).json({ success: false, message: 'Failed to get coupon banner data' });
	}
}


export const trackVisit = async (req, res) => {
	try {
		// Extract the client's IP address
		const forwardedFor = req.headers['x-forwarded-for'];
		const ip = forwardedFor ? forwardedFor.split(',')[0] : req.connection.remoteAddress;

		// console.log("ip: ", ip);

		if (!ip) {
			return res.status(400).send({ success: false, message: 'IP address not found' });
		}

		let geo = {
			city: 'Unknown',
			latitude: 0,
			longitude: 0,
			country: 'Unknown',
			region: 'Unknown'
		};

		try {
			// Get geo-location data using the IP address
			const currentLoc = await axios.get(`https://ipapi.co/${ip}/json/`);
			// console.log("currentLoc: ", currentLoc.data);

			if (currentLoc.data && !currentLoc.data.error) {
				geo = currentLoc.data;
			} else {
				console.log('Using fallback geo data due to API error:', currentLoc.data?.error || 'Unknown error');
			}
		} catch (geoError) {
			console.log('Using fallback geo data due to geolocation API error:', geoError.message);
			// Continue with fallback data - don't throw error
		}

		// Create a new visit entry
		const newVisit = new Visit({
			timestamp: new Date(),
			city: geo.city || 'Unknown',
			lat: geo.latitude || 0,
			long: geo.longitude || 0,
			country: geo.country || 'Unknown',
			state: geo.region || 'Unknown',
		});
		// console.log("newVisit: ", newVisit);
		await newVisit.save();

		res.status(200).send({ success: true, message: 'Visit tracked' });
	} catch (err) {
		console.error('Error tracking visit:', err);
		logger.error(`Error tracking visit: ${err.message}`);
		res.status(500).send({ success: false, message: 'Error tracking visit' });
	}
};
