import Coupon from "../../model/Coupon.model.js";
import OrderModel from "../../model/ordermodel.js";
import logger from "../../utility/loggerUtils.js";
import ProductModel from "../../model/productmodel.js";
import { handleImageUpload, handleMultipleImageUpload } from "../../utility/cloudinaryUtils.js";
import { sendOrderStatusUpdateMail, sendUpdateOrderStatus } from "../emailController.js";
import { calculateDiscountPercentage, calculateGst, getStatusDescription, getStringFromObject } from "../../utility/basicUtils.js";
import { getShipmentOrderByOrderId,getAllReturnOrdersShiprockets} from "../LogisticsControllers/shiprocketLogisticController.js";
import Bag from "../../model/bag.js";
import WhishList from "../../model/wishlist.js";
import WebSiteModel from "../../model/websiteData.model.js";

export const uploadImage = async (req, res) =>{
    try {
        // Convert the buffer into a base64 string
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const fileData = `data:${req.file.mimetype};base64,${b64}`;

        // Upload image to Cloudinary
        const result = await handleImageUpload(fileData);
        if(!result) {
            logger.warn("Image upload failed");
            return res.status(401).json({Success:false, Message:"Failed to upload image"});
        }
        // console.log("Uploaded Image URL:", result.secure_url);
        if(result.error){
            console.error("Error while uploading image:", result.error);
            return res.status(500).json({
                Success: false,
                message: result.error
            });
        }

        // Return the uploaded image URL
        res.status(200).json({
            Success: true,
            message: 'Image uploaded successfully!',
            result: result.secure_url
        });
    } catch (error) {
        console.error('Error while uploading Single image:', error);
        logger.error('Error while Uploading Single image: ' + error.message);
        res.status(500).json({
            Success: false,
            message: 'Internal Server Error'
        });
    }
}
export const uploadMultipleImages = async (req, res) => {
    try {
		console.log("Files uploaded: ", req.files)
		if(!req.files){
			logger.warn("No images were provided");
            return res.status(400).json({Success: true,message:"No images were provided!"});
		}
		if(req.files.length <= 0){
			logger.warn("No images were provided");
            return res.status(400).json({Success: true,message:"No images were provided!"});
		}
        const files = req.files.map(file => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            return `data:${file.mimetype};base64,${b64}`;
        });
		if(files.length <= 0){
            logger.warn("No images were provided");
            return res.status(400).json({Success: true,message:"No images were provided!"});
        }
        // Upload multiple images to Cloudinary
        const results = await handleMultipleImageUpload(files);
        console.log("Uploaded Images:", results);
		if(!results){
			console.error("No images were uploaded");
            return res.status(400).json({Success: true,message:"No images were uploaded!"});
		}
		if(results.error){
			throw new Error(results.error || "Error Uploading Images: ");
		}
		// console.log("Uploaded Images:", results.map(result => result.secure_url));
        if(results.length <= 0) {
            logger.warn("No images were uploaded");
            return res.status(400).json({Success: true,message:"No images were uploaded!"});
        }
		const imageArray = results?.map(result => result.secure_url);
        // Return the uploaded image URLs
        return res.status(200).json({
            Success: true,
            message: 'Images uploaded successfully!',
            results: imageArray || []
        });
    } catch (error) {
        console.error('Error while uploading images:', error);
        logger.error('Error while uploading images: ' + error.message);
        res.status(500).json({
            Success: false,
            message: 'Internal Server Error'
        });
    }
};

export const createNewCoupon = async(req,res)=>{
    try {
        const {
            couponName,
            couponCode,
            couponDescription,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            productId,
            category,
            status,
            validDate,
        } = req.body;
        // console.log("Creating new coupon: ",req.body);
        const newCoupon = new Coupon({
            CouponName:couponName,
            CouponCode:couponCode,
            CouponType:couponType,
            Description:couponDescription,
            Discount:discount,
            MinOrderAmount:minOrderAmount,
            CustomerLogin:customerLogin,
            FreeShipping:freeShipping,
            ProductId:productId,
            Category:category,
            Status:status,
            ValidDate:validDate,
        });
        await newCoupon.save();
        res.status(201).json({message: "Coupon created successfully", newCoupon});
    } catch (error) {
        console.error("Error creating new coupon: ",error);
        logger.error("Error creating new coupon: " + error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const removeCoupon = async(req,res)=>{
    try {
        const{couponId} = req.params;
        const removed = await Coupon.findByIdAndDelete(couponId);
        if (!removed) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ message: "Coupon removed successfully", removed });
    } catch (error) {
        console.error("Error removing coupon: ",error);
        logger.error("Error removing coupon: " + error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const editCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const {
            couponName,
            couponDescription,
            couponCode,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            productId,
            category,
            status,
            validDate,
        } = req.body;

        // Initialize updateFields object
        const updateFields = {};

        // Function to conditionally add fields to the updateFields object
        const addFieldIfValid = (field, value) => {
            if (value !== undefined) {
                updateFields[field] = value;
            }
        };

        // Log the request body for debugging purposes
        console.log("Editing coupon: ", req.body);

        // Add fields to updateFields
        addFieldIfValid('CouponName', couponName);
        addFieldIfValid('Description', couponDescription);
        addFieldIfValid('CouponCode', couponCode);
        addFieldIfValid('CouponType', couponType);
        addFieldIfValid('Discount', discount);
        addFieldIfValid('MinOrderAmount', minOrderAmount);
        addFieldIfValid('CustomerLogin', customerLogin);
        addFieldIfValid('FreeShipping', freeShipping);
        if (productId) updateFields.ProductId = productId; // ProductId is required, no need for length check
        if (category && category !== 'none') updateFields.Category = category; // Ensure 'none' is handled
        if (status && ["Active", "Inactive"].includes(status)) updateFields.Status = status;
        if (validDate) updateFields.ValidDate = validDate;

        // Check if any fields were provided for update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                Success: false,
                message: "No fields provided for update",
            });
        }

        // Find the coupon and update it
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateFields, { new: true });

        // If coupon is not found, return 404
        if (!updatedCoupon) {
            return res.status(404).json({
                Success: false,
                message: "Coupon Update Failed: Coupon not found",
            });
        }

        // Return the updated coupon
        return res.status(200).json({
            Success: true,
            message: 'Coupon updated successfully!',
            result: updatedCoupon,
        });
    } catch (error) {
        console.log("Error Editing coupon: ", error);
        logger.error("Error Editing coupon: " + error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const fetchAllCoupons = async(req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.status(200).json({message: "All coupons fetched successfully", result: coupons || []});
    } catch (error) {
        console.error("Error fetching all coupon",error);
        res.status(500).json({message: "Internal Server Error",result:[]});
    }
}
const isFormValid =(formData) => {
    // console.log("Check Form: ",formData);
    const reasons = [];
	if(!formData){
		reasons.push("Form data is required.");
		return {
			isValid:reasons.length === 0,
			reasons
		}
	}
    if(!formData.productId){
        reasons.push("Product ID is required.");
    }
    // Title check
    if (!formData.title) {
        reasons.push("Title is required.");
    }
    // Title check
    if (!formData.shortTitle) {
        reasons.push("Short Title is required.");
    }

    // Description check
    if (!formData.description) {
        reasons.push("Description is required.");
    }

    // Price check
    if (!formData.price) {
        reasons.push("Price is required.");
    } else if (isNaN(formData.price) || formData.price <= 0) {
        reasons.push("Price must be a positive number.");
    }
    // Size check
    if (!formData.size || formData.size.length === 0) {
        reasons.push("At least one size is required.");
    }
    // Material check
    if (!formData.material) {
        reasons.push("Material is required.");
    }

    // Gender check
    if (!formData.gender) {
        reasons.push("Gender is required.");
    }

    // Subcategory check
    if (!formData.subCategory) {
        reasons.push("Subcategory is required.");
    }

    // Category check
    if (formData.Width === undefined) {
        reasons.push("width is required.");
    }
    if (formData.Height === undefined) {
        reasons.push("height is required.");
    }
    if (formData.Length === undefined) {
        reasons.push("length is required.");
    }
    if (formData.Weight === undefined) {
        reasons.push("weight is required.");
    }
    if (formData.Breadth === undefined) {
        reasons.push("breadth is required.");
    }
    // Quantity check

    // Bullet points check
    if (!formData.bulletPoints || formData.bulletPoints.length === 0) {
        reasons.push("At least one bullet point is required.");
    }

    // If there are no reasons, the form is valid

    return {
        isValid:reasons.length === 0,
        reasons
    }
}
/* export const addNewProduct = async (req, res) => {
    try {
        const {
            productId,
            title,
            shortTitle,
            size,
			gst,
			hsn,
			sku,
            description,
            specification,
            careInstructions,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            specialCategory,
            price,
            salePrice,
            Rating,
            Width,
            Height,
            Length,
            Weight,
            Breadth,
        } = req.body;
        // Log incoming data for debugging
        console.log("Adding Products fields ", isFormValid(req.body));
        console.log("Adding Products fields ",typeof productId);

        // Check if form data is valid
        const isValid = isFormValid(req.body)
		
        if (!isValid || !isValid.isValid) {
			throw new Error(`Missing Fields: ${getStringFromObject(isFormValid(req.body))}`);
        }

        // Handle colors
        const AllColors = [];
        size.forEach(s => {
            if (s.colors && s.colors.length > 0) {
                s.colors.forEach(c => {
					if(c.images && c.images.length > 0){
						const colorsImageArray = c.images.filter(c => c !== "");
						c.images = colorsImageArray;
						AllColors.push(c);
					}else{
						throw new Error(`Missing Images for Color: ${c?.name}`);
					}
                });
            }
        });

        // Calculate total stock
        let totalStock = 0;
        size.forEach(s => {
            let sizeStock = 0;
            if (s.colors) {
                s.colors.forEach(c => {
                    sizeStock += c?.quantity;
                });
            }
            totalStock += sizeStock;
        });
        console.log("Total Stock: ", totalStock);

        // Calculate discounted percentage
        let DiscountedPercentage = 0;
        if (price && salePrice && salePrice > 0) {
            // const discountAmount = price - salePrice;
            // const discountPercentage = ((discountAmount / price) * 100).toFixed(0);
            DiscountedPercentage = calculateDiscountPercentage(price,salePrice);
        }
        // else {
        //     const currentProduct = await ProductModel.findById(productId);
        //     const p = currentProduct.price;
        //     const sp = currentProduct.salePrice;
        //     const discountAmount = p - sp;
        //     const discountPercentage = ((discountAmount / p) * 100).toFixed(0);
        //     DiscountedPercentage = calculateDiscountPercentage(p,sp);
        // }

        // Apply GST to price and salePrice
        // const priceWithGST = price + (price * gst / 100);
        // const salePriceWithGST = salePrice && salePrice > 0 ? salePrice + (salePrice * gst / 100) : null;
        // priceWithGST = gst / (1 - (100 / (100 + gst)));
        //originalPrice * (1 + (gstPercent / 100));
        // const priceWithGST = calculateGst(price,gst);
        // const salePriceWithGST = salePrice && salePrice > 0 ? calculateGst(salePrice,gst) : null;

        // Create new product
        const newProduct = new ProductModel({
            productId:productId?.toString(),
            title,
            shortTitle,
            size,
            gst,
			hsn,
			sku,
            description,
            careInstructions: careInstructions ? careInstructions : '',
            bulletPoints,
            material,
            gender,
            category,
            specification,
            subCategory,
            specialCategory: specialCategory,
            price: price, // Price after applying GST
            salePrice: salePrice !== null && salePrice > 0 ? salePrice : 0, // SalePrice after applying GST (if applicable)
            DiscountedPercentage: DiscountedPercentage,
            totalStock,
            AllColors: AllColors,
            Rating: Rating && Rating.length > 0 ? [Rating] : [],
            width:Width,
            height:Height,
            length:Length,
            weight:Weight,
            breadth:Breadth,
        });

        if (!newProduct) return res.status(400).json({ Success: false, message: "Product not created", result: null });

        // Save the new product
        await newProduct.save();

        console.log("New Products Data: ", newProduct);
        res.status(201).json({ Success: true, message: 'Product added successfully!', result: newProduct });

    } catch (error) {
        console.error('Error while adding new product:', error);
        logger.error("Error while creating new Product: " + error.message);
        res.status(201).json({ Success: false, message: 'Internal Server Error' ,reasons:error.message})
    }
}; */

// Main function to add a new product
export const addNewProduct = async (req, res) => {
    // Helper function to calculate the discounted percentage
    const calculateDiscountPercentage = (price, salePrice) => {
        if (salePrice <= 0) return 0;
        return ((price - salePrice) / price * 100).toFixed(0);
    };
    
    // Helper function to handle color validations
    /* const handleColors = (size) => {
        const allColors = [];
        size.forEach(s => {
            if (s.colors && s.colors.length > 0) {
                s.colors.forEach(c => {
                    if (c.images && c.images.length > 0) {
                        c.images = c.images.filter(image => image !== ""); // Remove empty images
                        allColors.push(c);
                    } else {
                        throw new Error(`Missing Images for Color: ${c?.name}`);
                    }
                });
            }
        });
        return allColors;
    }; */
    const handleColors = (size) => {
        return size.reduce((allColors, s) => {
            if (s.colors && s.colors.length > 0) {
                s.colors.forEach(c => {
                    if (!c.images || c.images.length === 0) {
                        throw new Error(`Missing Images for Color: ${c?.name}`);
                    }
    
                    // Filter out empty images in a single line
                    const filteredImages = c.images.filter(image => image !== "");
                    if (filteredImages.length > 0) {
                        c.images = filteredImages;
                        allColors.push(c);
                    }
                });
            }
            return allColors;
        }, []);
    };
    
    
    // Helper function to calculate total stock
    const calculateTotalStock = (size) => {
        return size.reduce((totalStock, s) => {
            let sizeStock = 0;
            if (s.colors) {
                sizeStock = s.colors.reduce((stock, c) => stock + (c?.quantity || 0), 0);
            }
            return totalStock + sizeStock;
        }, 0);
    };
    try {
        const {
            productId,
            title,
            shortTitle,
            size,
            gst,
            hsn,
            sku,
            description,
            specification,
            careInstructions,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            specialCategory,
            price,
            salePrice,
            Rating,
            Width,
            Height,
            Length,
            Weight,
            Breadth,
        } = req.body;

        // Check if form data is valid
        const isValid = isFormValid(req.body);
        if (!isValid || !isValid.isValid) {
            throw new Error(`Missing Fields: ${getStringFromObject(isValid)}`);
        }

        // Handle colors and stock
        const AllColors = handleColors(size);
        const totalStock = calculateTotalStock(size);

        // Calculate the discount percentage
        const DiscountedPercentage = price && salePrice ? calculateDiscountPercentage(price, salePrice) : 0;

        // Create new product object
        const newProduct = new ProductModel({
            productId: productId?.toString(),
            title,
            shortTitle,
            size,
            gst,
            hsn,
            sku,
            description,
            careInstructions: careInstructions || '',
            bulletPoints,
            material,
            gender,
            category,
            specification,
            subCategory,
            specialCategory,
            price,
            salePrice: salePrice || 0,
            DiscountedPercentage,
            totalStock,
            AllColors,
            Rating: Rating && Rating.length > 0 ? [Rating] : [],
            width: Width,
            height: Height,
            length: Length,
            weight: Weight,
            breadth: Breadth,
        });

        // Check if the product is successfully created
        if (!newProduct) {
            return res.status(400).json({ Success: false, message: "Product not created", result: null });
        }

        // Save the new product
        await newProduct.save();

        console.log("New Product Added:", newProduct);
        res.status(201).json({ Success: true, message: 'Product added successfully!', result: newProduct });

    } catch (error) {
        console.error('Error while adding new product:', error);
        logger.error("Error while creating new Product: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error', reasons: error.message });
    }
};




export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ Success: false, message: "Product ID is required" });
        }

        const {
            productId,
            title,
            size,
			gst,
			sku,
			hsn,
			tags,
            description,
            specification,
            careInstructions,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            specialCategory,
            price,
            salePrice,
            width,
            height,
            length,
            weight,
            breadth,
        } = req.body;
        // Initialize updateFields object
        const updateFields = {};

        // Helper function to conditionally add fields to updateFields
        const addToUpdate = (field, value) => {
			
			// console.log("Updating: ",field,Array.isArray(value));
            if (value && (!Array.isArray(value) ? value.length > 0 : value.length > 0)) {
                updateFields[field] = value;
            }
        };

        // Add basic fields to updateFields
        addToUpdate('productId', productId);
        addToUpdate('title', title);
        addToUpdate('description', description);
        addToUpdate('sku', sku);
        addToUpdate('hsn', hsn);
        addToUpdate('gst', gst);
        addToUpdate('tags', tags);
        addToUpdate('specification', specification);
        addToUpdate('careInstructions', careInstructions);
        addToUpdate('material', material);
        addToUpdate('bulletPoints', bulletPoints);
        addToUpdate('gender', gender);
        addToUpdate('category', category);
        addToUpdate('subCategory', subCategory);
        addToUpdate('specialCategory', specialCategory);
        addToUpdate('width', width);
        addToUpdate('height', height);
        addToUpdate('length', length);
        addToUpdate('weight', weight);
        addToUpdate('breadth', breadth);

        // Handle 'size' field separately (calculate totalStock)
        if (size && size.length > 0) {
            let totalStock = 0;
            size.forEach(s => {
                if (s.colors) {
                    s.colors.forEach(c => {
                        totalStock += c.quantity || 0;
                    });
                }
            });
            if (totalStock > 0) updateFields.size = size;
            updateFields.totalStock = totalStock;
        }
        // Recalculate price and salePrice with GST
        // [Value of supply x {100/ (100+GST%)}]
        // let priceWithGST = price * (100 / (100 + gst));
        // let salePriceWithGST = salePrice && salePrice > 0 ? salePrice * (100 / (100 + gst)) : null;
        let priceWithGST = calculateGst(price,gst);
        let salePriceWithGST = salePrice && salePrice > 0 ? calculateGst(salePrice,gst) : null;
        // Add the recalculated price and salePrice to the updateFields
        if (price && price > 0) updateFields.price = price;
        if (salePrice && salePrice > 0) {
			updateFields.salePrice = salePrice
		}else{
			updateFields.salePrice = null; // If no salePrice, set salePrice to null in the updateFields object.
		}

        // Calculate and set the DiscountedPercentage field if salePrice exists
		
        /* if (price && salePrice && salePrice > 0) {
            const discountAmount = price - salePrice;
            const discountPercentage = ((discountAmount / salePrice) * 100).toFixed(0);
            updateFields.DiscountedPercentage = discountPercentage;
        } else {
            const currentProduct = await ProductModel.findById(id);
            const p = currentProduct.price;
            const sp = currentProduct.salePrice;
            const discountAmount = p - sp;
            const discountPercentage = ((discountAmount / p) * 100).toFixed(0);
            // If no salePrice, set DiscountedPercentage to 0
            updateFields.DiscountedPercentage = discountPercentage;
        } */
		const DiscountedPercentage = price && salePrice ? calculateDiscountPercentage(price, salePrice) : 0;
		updateFields.DiscountedPercentage = DiscountedPercentage;
        console.log("Updating Product Fields: ", updateFields);

        // If no fields to update, return early
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ Success: false, message: "No fields provided for update" });
        }

        // Update product in the database
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateFields, { new: true });

        // Check if update was successful
        if (!updatedProduct) {
            return res.status(404).json({ Success: false, message: "Product Update Failed" });
        }

        res.status(200).json({
            Success: true,
            message: 'Product updated successfully!',
            result: updatedProduct,
        });
    } catch (error) {
        console.error('Error while editing a product:', error);
        logger.error('Product Update Failed: ' + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};


export const addCustomProductsRating = async (req, res) => {
    try {
        const { productId, ratingData } = req.body;

        // Find and update the product with the new rating
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { $push: { Rating: ratingData } }, 
            { new: true }
        );

        // Check if the product was found
        if (!product) {
            return res.status(404).json({ Success: false, message: "Product not found" });
        }

        // Calculate the average rating after updating
        const total = product.Rating.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = total / product.Rating.length;

        // Update the product's average rating field
        product.averageRating = Math.round(averageRating);

        // Save the updated product with the new average rating
        await product.save();

        console.log("Updated Product with Average Rating: ", product);
        
        res.status(200).json({
            Success: true, 
            message: "Custom Rating Added Successfully", 
            result: product
        });

    } catch (error) {
        console.error('Product Update Failed: ', error);
        logger.error('Product Add Custom Rating Failed: ' + error.message);
        return res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

export const fetchAllRatingProducts = async(req,res)=>{
    try {
        const{productId} = req.params;
        const product = await ProductModel.findById(productId);
        // console.log("allProducts: ",product);
        if(!product) {
            return res.status(404).json({Success: false, message: "Product not found"});
        }
        res.status(200).json({Success:true, message: "All Products Rating Found",result:product.Rating || []})
    } catch (error) {
        console.error('Product Fetch Custom Rating Failed: ', error);
        logger.error('Product Fetch Custom Rating Failed: '+ error.message);
        return res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const removeCustomProductsRating = async(req,res)=>{
    try {
        const {productId,ratingId} = req.body;
        const product = await ProductModel.findByIdAndUpdate(productId, {$pull: {Rating: {_id: ratingId}}}, {new: true});
		if(!product) {
            return res.status(404).json({Success: false, message: "Product not found"});
        }
		const total = product.Rating.reduce((acc, review) => acc + review.rating, 0);
		const averageRating = total / product.Rating.length;
		console.log("Updating Average Rating: ", averageRating);
		// Update the product's average rating field
		product.averageRating = !isNaN(averageRating) ?  Math.round(averageRating) : 0;
		await product.save();
        console.log("Removing Custom Rating: ", product);
        res.status(200).json({Success:true,message:"Successfully Remove Rating Data"})
    } catch (error) {
        console.error('Product Update Failed: ', error);
        logger.error('Product Add Custom Rating Failed: '+ error.message);
        return res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const fetchAllProducts = async (req, res) => {
    try {
        const{page} = req.query;
        console.log("Current Page: ",page);

        const allProducts = await ProductModel.find({});
        const totalProducts = await ProductModel.countDocuments();
        const itemsPerPage = 10;
        const currentPage = parseInt(page, 10) || 1; // Default to page 1 if not provided

        // Calculate the number of items to skip
        const skip = (currentPage - 1) * itemsPerPage;
        
        // Get total count of products matching the filter
        

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / itemsPerPage);

        // Fetch paginated products
        const productsPagination = await ProductModel.find({}).populate('Rating.userId').limit(itemsPerPage).skip(skip);
        console.log("Total Pages: ",totalPages,"currentPage: ",currentPage,productsPagination.length);
        // if(!allProducts) res.status(404).json({Success:false,message:"No products found"});
        res.status(200).json({Success: true, message: 'All products fetched successfully!', result: {
            productsPagination:productsPagination,
            allProducts:allProducts,
            totalProducts:totalProducts
        }});
    } catch (error) {
        console.error('Error while Fetching all product:', error);
        logger.error("Error while Fetching all products: " + error.message);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({Success:false,message:"Product ID is required"});
        const product = await ProductModel.findById(id);
        if(!product) res.status(404).json({Success:false,message:"Product not found"});
        res.status(200).json({Success: true, message: 'Product fetched successfully!', result: product});
    } catch (error) {
        console.error('Error while Fetching a product:', error);
        logger.error("Error while Fetching a product: " + error.message);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}



    

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ Success: false, message: "Product ID is required" });

        // Delete the product
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ Success: false, message: "Product not found" });

        // Find bags that contain the product
        const removeProductsFromBag = await Bag.find({
            "orderItems.productId": id
        });

        if (removeProductsFromBag.length > 0) {
            // Create an array of bulk update operations
            const bulkOps = removeProductsFromBag.map(bag => {
                const updatedOrderItems = bag.orderItems.filter(item => item.productId.toString() !== id.toString());
                return {
                    updateOne: {
                        filter: { _id: bag._id },
                        update: { $set: { orderItems: updatedOrderItems } }
                    }
                };
            });

            // Execute all the updates in bulk
            await Bag.bulkWrite(bulkOps);
        }
		const removeProductsFromWishList = await WhishList.find({
            "orderItems.productId": id
        });
		if (removeProductsFromWishList.length > 0) {
			// Create an array of bulk update operations
            const bulkOps = removeProductsFromWishList.map(wishList => {
                const updatedOrderItems = wishList.orderItems.filter(item => item.productId.toString() !== id.toString());
                return {
                    updateOne: {
                        filter: { _id: wishList._id },
                        update: { $set: { orderItems: updatedOrderItems } }
                    }
                };
            });
			
            // Execute all the updates in bulk
			await WhishList.bulkWrite(bulkOps);
		}
        // Return success response
        res.status(200).json({ Success: true, message: 'Product deleted successfully!', result: deletedProduct });

    } catch (error) {
        console.error('Error deleting the Product', error);
        logger.error('Error deleting the Product' + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};


export const getOrderById = async(req,res)=>{
    try {
        const{orderId} = req.params;
        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(200).json({Success:true,message:"No Orders Found Yet",order:{}})
        }
		let lastStatus = order.status;
		try {
			const shipmenetOrder = await getShipmentOrderByOrderId(order)
			if(shipmenetOrder){
				if(shipmenetOrder.tracking_data){
					const trackingData = shipmenetOrder.tracking_data;
					order.status = getStatusDescription(trackingData.shipment_status)
					order.shipment_status = trackingData.shipment_status;
					order.current_status = getStatusDescription(trackingData.shipment_status);
					order.etd = trackingData.etd;
					order.trackingUrl = trackingData.track_url
					order.tracking_Activity = trackingData.shipment_track_activities
					await order.save();
				}else{
					const trackingData = shipmenetOrder[order.shipment_id].tracking_data;
					console.log("Admin Checking shipment Tracking Data: ",trackingData);
					order.status = getStatusDescription(trackingData.shipment_status)
					order.shipment_status = trackingData.shipment_status;
					order.current_status = getStatusDescription(trackingData.shipment_status);
					order.etd = trackingData.etd || null;
					order.trackingUrl = trackingData.track_url || ''
					order.tracking_Activity = trackingData.shipment_track_activities || []
					if(trackingData.error){
						order.orderError = trackingData.error
					}
					await order.save();
				}
			}
			if(lastStatus !== order.status){
				try {
					sendOrderStatusUpdateMail(order.userId,order);
				} catch (error) {
					console.error("Error sending order status update mail:", error);
					logger.error("Error sending order status update mail: " + error.message);
				}
			}
		} catch (error) {
			console.error("Error while getting shipment Status Shiprocket: ",error);
		}

        res.status(200).json({Success:true,message:'Fetched All Orders',result:order})
    } catch (error) {
        console.error("Error getting orders by Id: ",error);
        logger.error("Error getting orders: " + error.message);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}
export const updateOrderStatus = async(req,res)=>{
    try {
        const {id} = req.user;
        const{orderId} = req.params;
        const{status} = req.body;
        if(!orderId || !status){
            return res.status(400).json({Success:false,message:"Order Id and Status are required"});
        }
        const order = await OrderModel.findByIdAndUpdate(orderId,{status:status},{new:true});
        if(!order){
            return res.status(404).json({Success:false,message:"Order not found"});
        }
        // const updateMailSent = await
        const updateOrderStatusMailSent = await sendUpdateOrderStatus(id,order);
        if(updateOrderStatusMailSent){
            return res.status(200).json({Success:true,message:"Order Status Updated",result:order});
        }
        res.status(200).json({Success:false,message:"Failed to update order status"});
    } catch (error) {
        console.error("Error updating order status: ",error);
        logger.error("Error updating order status: " + error.message);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}

export const getallOrders = async (req, res) => {
    try {
        const allOrders = await OrderModel.find({});

        // Check if there are no orders found
        if (!allOrders || allOrders.length === 0) {
            return res.status(200).json({ Success: true, message: "No Orders Found Yet", result: [] });
        }

        // Fetch order status for each order and update the order with the new status
        const orderStatus = await Promise.all(allOrders.map(async (order) => {
            /* const shipmentTracking = await getShipmentTrackingStatus(order);
			if(!shipmentTracking){
				return null;
			}
			let trackingData = shipmentTracking?.tracking_data;
			if(shipmentTracking.tracking_data){
				trackingData = shipmentTracking.tracking_data
			}else{
				trackingData = shipmentTracking[order.shipment_id].tracking_data;
			}
			order.status = getStatusDescription(trackingData.shipment_status)
			order.shipment_status = trackingData.shipment_status;
			order.current_status = getStatusDescription(trackingData.shipment_status);
			order.etd = trackingData.etd;
			order.trackingUrl = trackingData.track_url
			await order.save(); */
			return {
				...order.toObject(),
				/* status: getStatusDescription(trackingData.shipment_status),
				shipment_status: trackingData.shipment_status,
				current_status: getStatusDescription(trackingData.shipment_status),
				etd: trackingData.etd,
				trackingUrl: trackingData.track_url, */
			};
        }));
		// const token = await getShipRocketToken();
		// console.log("order Status Updated Token: ", token);
        // Send the updated orders with current status
		const refreshedNull = orderStatus.filter(stat => stat !== null)
        res.status(200).json({ Success: true, message: "All Orders", result: refreshedNull || []});
    } catch (error) {
        console.error("Error Getting All Orders", error);
        logger.error(`Error Getting All Orders: ${error.message}`);
        res.status(500).json({ Success: false, message: "Internal Server Error" });
    }
};

export const getShipmtRocketTokenFromDb = async(req,res)=>{
	try {
		const token = await WebSiteModel.findOne({ tag: 'Shiprocket-token' });
		if(!token){
			logger.warn(`No ShipRocket Token Found`);
			return res.status(200).json({ Success: true, message: "No ShipRocket Token Found", result: null});
		}
		if(!token.ShiprocketToken){
			logger.warn(`No ShipRocket Token Found`);
			return res.status(200).json({ Success: true, message: "No ShipRocket Token Found", result: null});
		}
		// console.log("Shipwrecked Token Updated Token: ", token.ShiprocketToken);
		res.status(200).json({ Success: true, message: "ShipRocket Token Fetched", result: token?.ShiprocketToken});
	} catch (error) {
		console.error("Error Getting ShipRocket Token from DB: ", error);
        logger.error("Error Getting ShipRocket Token from DB: " + error.message);
        res.status(500).json({ Success: false, message: "Internal Server Error" });
	}
}

export const fetchAllReturnOrders = async(req,res) =>{
	try {
		const allReturnOrders = await getAllReturnOrdersShiprockets();
		const returningOrdersData = allReturnOrders.data;
		/* const allDbOrders = await OrderModel.find({});
		if(!allDbOrders){
			return res.status(200).json({ Success: true, message: "Fetched All Return Orders", result: returningOrdersData || []});
		}
		const commonIds = returningOrdersData.map(order => order.shipment_id);
		const allDbOrderShipId = allDbOrders.map(order => order.shipment_id);
		const similarOrders = allDbOrders.filter(order => commonIds.includes(order.shipment_id));
		console.log("Not Found Orders: ",returningOrdersData) */
		res.status(200).json({ Success: true, message: "Fetched All Return Orders", result: returningOrdersData || []});
	} catch (error) {
		console.error("Error fetching all return orders:",error);
		logger.error("Error fetching all return orders: " + error.message);
		res.status(500).json({ Success: false, message: "Internal Server Error" });
	}
}


