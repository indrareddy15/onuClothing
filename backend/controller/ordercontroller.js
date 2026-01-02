import WhishList from '../model/wishlist.js'
import Bag from '../model/bag.js'
import OrderModel from '../model/ordermodel.js'
import ProductModel from '../model/productmodel.js'
import { fetchPayments, generateOrderRequest } from '../utility/paymentGatwayHelper.js'
import Coupon from '../model/Coupon.model.js'
import WebSiteModel from '../model/websiteData.model.js'
import { sendMainifestMail, sendOrderPlacedMail, sendOrderStatusUpdateMail } from './emailController.js'
import mongoose from 'mongoose'
import logger from '../utility/loggerUtils.js'
import {
    generateManifest,
    generateOrderCancel,
    generateOrderForShipment,
    generateOrderPicketUpRequest,
    generateOrderReturnShipment,
    generateRefundOrder,
    getShipmentOrderByOrderId
} from './LogisticsControllers/shiprocketLogisticController.js'
import { getStatusDescription } from '../utility/basicUtils.js'
import User from '../model/usermodel.js'

export const createPaymentOrder = async (req, res) => {
    try {
        console.log("Order User ID:", req.user?.id);
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        const { orderItems, totalAmount } = req.body;
        const orderData = await generateOrderRequest(totalAmount, req.user.id, orderItems, req.user.user.phoneNumber)

        console.log("orderRecept Data: ", orderData);
        if (!orderData) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        console.error("Error creating Order:", error);
        logger.error(`Error creating Order: ${error.message}`)
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        // Check for user existence
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        const { paymentData, SelectedAddress, orderDetails, totalAmount, bagId } = req.body;

        // console.log("Payment Verification Request: ", req.body);

        // Validate if paymentData exists
        if (!paymentData) {
            return res.status(400).json({ success: false, message: "All Fields are required" });
        }

        // Fetch payment status
        const paymentStatus = await fetchPayments(paymentData.order_id);
        // console.log("Payment Status: ", paymentStatus);

        // If no payment status found
        if (!paymentStatus || paymentStatus.length === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
        const alreadyPresentConvenenceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
        // Check if the payment status is "SUCCESS"
        if (paymentStatus[0].payment_status === "SUCCESS") {
            const bagData = await Bag.findById(bagId).populate('orderItems.productId');

            // If bag data exists
            if (bagData) {
                // console.log("Bag Data: ", bagData);
                const addressString = Object.values(SelectedAddress).join(", ");
                // Create new order
                const orderData = new OrderModel({
                    userId: req.user.id,
                    orderItems: orderDetails,
                    address: addressString,
                    ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
                    TotalAmount: totalAmount,
                    paymentMode: paymentStatus[0].payment_group,
                    status: 'Order Confirmed',
                });

                await orderData.save();
                console.log("Order Created Successfully: ", orderData);

                // Handle product removal in parallel
                const removeProductPromises = orderDetails.map(async (item) => {
                    try {
                        console.log(`Removing Product: ${item.productId._id}, Color: ${item.color.label}, Size: ${item.size}, Quantity: ${item.quantity}`);
                        await removeProduct(item.productId._id, item.color.label, item.size, item.quantity);
                    } catch (err) {
                        console.error(`Error removing product: ${item?.productId?._id}`, err);
                    }
                });

                await Promise.all(removeProductPromises);

                // Remove the bag from the database
                await Bag.findByIdAndDelete(bagId);
                console.log("Bag Removed: ", bagId);

                return res.status(200).json({
                    success: true,
                    message: "Order Created Successfully",
                    result: "SUCCESS",
                    userId: req.user.id
                });
            }
        }

        // Handle case where payment is not successful
        return res.status(200).json({
            success: true,
            message: 'Payment Not Completed!',
            result: "FAILED",
            userId: req.user.id
        });

    } catch (error) {
        console.error('Error while verifying payment request:', error);
        logger.error(`Error while verifying payment request ${error.message}`);
        // Avoid sending multiple responses if headers already sent
        if (res.headersSent) return;

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            userId: req.user?.id
        });
    }
};



/* export const createorder = async (req, res) => {
    try {
        // Validate user
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }
        console.log("Req user: ",req.user);
        // const activeUser = req.user.user;
        // Destructure and validate the required fields from the body
        const { orderItems, Address, bagId, TotalAmount, paymentMode,ConvenienceFees, status } = req.body;
        console.log("Order Data: ",req.body);
        // return res.status(200).json({ success: true, message: "Order Created Successfully"});
        if (!orderItems || !Address || !bagId || !TotalAmount || !paymentMode || !status) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }
        const proccessingProducts = orderItems.filter((item) => item?.isChecked);
        console.log("Order Data: ",proccessingProducts);
        if(!proccessingProducts || proccessingProducts.length <= 0){
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }

        // Helper function to generate a random order ID
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();
        // const addressString = Object.values(Address).join(", ");
        // Create a new order entry
        const alreadyPresentConvenenceFees = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
    	
        const createdShipRocketOrder = await generateOrderForShipment(req.user.id,{
            order_id: randomOrderShipRocketId,
            userId: req.user.id,
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems:proccessingProducts,
            address: Address,
            TotalAmount,
            paymentMode,
            pincode:Address.pincode,
            status: 'Confirmed',
        },randomOrderShipRocketId,randomShipmentId)
        const {shipmentCreatedResponseData,bestCourior,manifest,warehouse_name,PickupData} = createdShipRocketOrder;
        console.log("Shipment After Order Create Data: ",createdShipRocketOrder);
        const orderData = new OrderModel({
            order_id: shipmentCreatedResponseData.order_id,
            userId: req.user.id,
            picketUpLoactionWareHouseName: warehouse_name || null,
            shipment_id: shipmentCreatedResponseData.shipment_id,
            channel_id:'6217390',
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems:proccessingProducts,
            address: Address,
            TotalAmount,
            paymentMode,
            status: 'Confirmed',
            PicketUpData:PickupData,
            BestCourior:bestCourior,
            ShipmentCreatedResponseData:shipmentCreatedResponseData,
            manifest:manifest,
        });

        await orderData.save();
        if(createdShipRocketOrder?.manifest){
            if(createdShipRocketOrder?.manifest?.is_invoice_created){
                const sentInvoiceTouser = await sendMainifestMail(req.user.id,createdShipRocketOrder?.manifest?.invoice_url);
            }
        }

        // Perform the item removal asynchronously (parallelize them)
    	
        const removingAmountPromises = proccessingProducts.map(async (item) =>{
                try {
                    // console.log('All Order Items:', item.productId._id, item.color.label, item.size, item.quantity);
                    await removeProduct(item.productId?._id, item?.color?.label, item?.size, item?.quantity)
                } catch (error) {
                    console.error(`Error removing product: ${item?.productId?._id}`, error);	
                }
            }
            
        );

        // Wait for all removal operations to complete
        await Promise.all(removingAmountPromises);
        const activeBag = await Bag.findById(bagId);
        if(activeBag){
            proccessingProducts.map((item) => {
                // const isInRemovingItems = activeBag.orderItems.find((bI) => bI?.productId.toString() === item?.productId?._id.toString());
                const findIndex = activeBag.orderItems.findIndex((bI) => bI?.productId.toString() === item?.productId?._id.toString());
                if(findIndex !== -1){
                    activeBag.orderItems.splice(findIndex,1);
                }
            })
            if(activeBag.orderItems.length <= 0){
                await Bag.findByIdAndDelete(bagId);
            }else{
                await activeBag.save();
            }
        }
        // Handle bag removal if applicable
        // await Bag.findByIdAndDelete(bagId);

        // Send order confirmation email
        await sendOrderPlacedMail(req.user.id, orderData);

        // Respond with success message
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        // Log the error and ensure the response is only sent once
        console.error("Error creating Order: ", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
} */

// Main create order function
/* export const createOrder = async (req, res) => {
    // Helper function to generate random order ID
    const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
    
    // Helper function to remove products
    const removeProducts = async (products) => {
        const removingPromises = products.map(async (item) => {
            try {
                await removeProduct(item.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (error) {
                console.error(`Error removing product: ${item?.productId?._id}`, error);
            }
        });
        await Promise.all(removingPromises);
    };
    
    // Helper function to update the bag after the order is created
    const updateBagAfterOrder = async (bagId, orderItems) => {
        const activeBag = await Bag.findById(bagId);
        if (activeBag) {
            orderItems.forEach((item) => {
                const findIndex = activeBag.orderItems.findIndex((bI) => bI?.productId.toString() === item?.productId?._id.toString());
                if (findIndex !== -1) {
                    activeBag.orderItems.splice(findIndex, 1);
                }
            });
            if (activeBag.orderItems.length <= 0) {
                await Bag.findByIdAndDelete(bagId);
            } else {
                await activeBag.save();
            }
        }
    };
    try {
        // Validate user
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        // Destructure and validate the required fields from the body
        const { orderItems, Address, bagId, TotalAmount, paymentMode, ConvenienceFees, status } = req.body;

        if (!orderItems || !Address || !bagId || !TotalAmount || !paymentMode || !status) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }

        // Filter checked products
        const processingProducts = orderItems.filter((item) => item?.isChecked);

        if (!processingProducts || processingProducts.length <= 0) {
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }

        // Convenience Fees and random IDs generation
        const alreadyPresentConvenienceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();

        // Create shipment order
        const createdShipRocketOrder = await generateOrderForShipment(req.user.id, {
            order_id: randomOrderShipRocketId,
            userId: req.user.id,
            ConveenianceFees: alreadyPresentConvenienceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems: processingProducts,
            address: Address,
            TotalAmount,
            paymentMode,
            pincode: Address.pincode,
            status: 'Confirmed',
        }, randomOrderShipRocketId, randomShipmentId);

        const { shipmentCreatedResponseData, bestCourior, manifest, warehouse_name, PickupData } = createdShipRocketOrder;

        // Create order entry in the database
        const orderData = new OrderModel({
            order_id: shipmentCreatedResponseData.order_id,
            userId: req.user.id,
            picketUpLoactionWareHouseName: warehouse_name || null,
            shipment_id: shipmentCreatedResponseData.shipment_id,
            channel_id: '6217390',
            ConveenianceFees: alreadyPresentConvenienceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems: processingProducts,
            address: Address,
            TotalAmount,
            paymentMode,
            status: 'Confirmed',
            PicketUpData: PickupData,
            BestCourior: bestCourior,
            ShipmentCreatedResponseData: shipmentCreatedResponseData,
            manifest: manifest,
        });

        // Save the order data
        await orderData.save();

        // Send invoice if available
        if (manifest?.is_invoice_created) {
            await sendMainifestMail(req.user.id, manifest?.invoice_url);
        }

        // Remove product quantities and handle bag updates in parallel
        await removeProducts(processingProducts);

        // Update the bag after order creation
        await updateBagAfterOrder(bagId, processingProducts);

        // Send order confirmation email
        await sendOrderPlacedMail(req.user.id, orderData);

        // Respond with success message
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        console.error("Error creating Order:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}; */


export const createOrder = async (req, res) => {
    // Helper function to generate random order ID
    const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

    // Helper function to remove products
    const removeProducts = async (products) => {
        const removingPromises = products.map(async (item) => {
            try {
                await removeProduct(item.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (error) {
                console.error(`Error removing product: ${item?.productId?._id}`, error);
            }
        });
        await Promise.all(removingPromises);
    };

    // Helper function to update the bag after the order is created
    const updateBagAfterOrder = async (bagId, orderItems) => {
        const activeBag = await Bag.findById(bagId);
        if (activeBag) {
            orderItems.forEach((item) => {
                const findIndex = activeBag.orderItems.findIndex((bI) => bI?.productId.toString() === item?.productId?._id.toString());
                if (findIndex !== -1) {
                    activeBag.orderItems.splice(findIndex, 1);
                }
            });
            if (activeBag.orderItems.length <= 0) {
                await Bag.findByIdAndDelete(bagId);
            } else {
                await activeBag.save();
            }
        }
    };

    try {
        // Validate user
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        // Destructure and validate the required fields from the body
        const { orderItems, Address, bagId, TotalAmount, paymentMode, ConvenienceFees, status } = req.body;

        if (!orderItems || !Address || !bagId || !TotalAmount || !paymentMode || !status) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }

        // Filter checked products
        const processingProducts = orderItems.filter((item) => item?.isChecked);

        if (!processingProducts || processingProducts.length <= 0) {
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }

        // Convenience Fees and random IDs generation
        const alreadyPresentConvenienceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();

        // Create shipment order
        const createdShipRocketOrder = await generateOrderForShipment(req.user.id, {
            order_id: randomOrderShipRocketId,
            userId: req.user.id,
            ConveenianceFees: alreadyPresentConvenienceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems: processingProducts,
            address: Address,
            TotalAmount,
            paymentMode,
            pincode: Address.pincode,
            status: 'Confirmed',
        }, randomOrderShipRocketId, randomShipmentId);

        const { shipmentCreatedResponseData, bestCourier, manifest, warehouse_name, PickupData } = createdShipRocketOrder || {};

        // Create order entry in the database
        const orderData = new OrderModel({
            order_id: shipmentCreatedResponseData?.order_id || randomOrderShipRocketId,
            userId: req.user.id,
            picketUpLoactionWareHouseName: warehouse_name || null,
            shipment_id: shipmentCreatedResponseData?.shipment_id || randomShipmentId,
            channel_id: '6217390',
            ConveenianceFees: alreadyPresentConvenienceFees?.ConvenienceFees || ConvenienceFees || 0,
            orderItems: processingProducts,
            address: Address,
            TotalAmount,
            paymentMode: paymentMode || 'COD',
            status: 'Confirmed',
            PicketUpData: PickupData || null,
            BestCourior: bestCourier || null,
            ShipmentCreatedResponseData: shipmentCreatedResponseData || null,
            manifest: manifest || null,
        });

        // Save the order data
        await orderData.save();

        // Prepare email sending promises
        const emailPromises = [];

        // Send invoice if available
        if (manifest?.is_invoice_created) {
            emailPromises.push(sendMainifestMail(req.user.id, manifest?.invoice_url));
        }

        // Send order confirmation email
        emailPromises.push(sendOrderPlacedMail(req.user.id, orderData));

        // Send emails in parallel
        await Promise.all(emailPromises);

        // Remove product quantities and handle bag updates sequentially
        await removeProducts(processingProducts);
        await updateBagAfterOrder(bagId, processingProducts);

        // Respond with success message
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        console.error("Error creating Order:", error);
        logger.error(`Error creating Order: ${error.message}`)
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};




const removeProduct = async (productId, color, size, quantity) => {
    /* try {
        const product = await ProductModel.findById(productId);
        if(!product) {
            console.log("Product Not Found: ",productId);
            return
        };
        const activeSize = product.size.find(s => s?.label == size);
        if(!activeSize) {
            console.log("Size Not Found: ",size);
            return
        }
        const activeColor = activeSize.colors.find(c => c?.label == color);
        if(!activeColor) {
            console.log("Color Not Found: ",color);
            return
        }
        const colorReducedAmount = Math.max(0, activeColor.quantity - quantity);
        const sizeReducedAmount = Math.max(0, activeSize.quantity - quantity);

        // console.log("Reduced Amount: ",colorReducedAmount,sizeReducedAmount);
        activeColor.quantity = colorReducedAmount;
        activeSize.quantity = sizeReducedAmount;
        const AllColors = []
        product.size.forEach(s => {
            if(s.colors){
                s.colors.forEach(c => {
                    AllColors.push(c);
                });
            }
        });
        product.AllColors = AllColors;
        if (product.size && product.size.length > 0) {
            let totalStock = 0;
            product.size.forEach(s => {
                let sizeStock = 0;
                if(s.colors){
                    s.colors.forEach(c => {
                        sizeStock += c.quantity;
                    });
                }
                totalStock += sizeStock;
            })
            if(totalStock > 0) product.totalStock = totalStock;
        };
        product.TotalSoldAmount = product?.TotalSoldAmount + quantity;
        await product.save();
        // console.log("Product Updated: ",product);
    } catch (error) {
        console.error("Error Removing Product: ",error)
    } */
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.log("Product Not Found:", productId);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Find the active size
        const activeSize = product.size.find(s => s?.label === size);
        if (!activeSize) {
            console.log("Size Not Found:", size);
            return res.status(404).json({ success: false, message: "Size not found" });
        }

        // Find the active color
        const activeColor = activeSize.colors.find(c => c?.label === color);
        if (!activeColor) {
            console.log("Color Not Found:", color);
            return res.status(404).json({ success: false, message: "Color not found" });
        }

        // Calculate the reduced amounts for color and size
        const colorReducedAmount = Math.max(0, activeColor.quantity - quantity);
        const sizeReducedAmount = Math.max(0, activeSize.quantity - quantity);

        // Update quantities
        activeColor.quantity = colorReducedAmount;
        activeSize.quantity = sizeReducedAmount;

        // Rebuild the AllColors array and calculate total stock in one loop
        let totalStock = 0;
        const AllColors = product.size.flatMap(s => {
            if (s.colors) {
                s.colors.forEach(c => totalStock += c.quantity); // Accumulate total stock
                return s.colors;
            }
            return [];
        });

        product.AllColors = AllColors;
        product.totalStock = totalStock > 0 ? totalStock : undefined;
        product.TotalSoldAmount = product?.TotalSoldAmount + quantity;
        // Save the updated product
        await product.save();
    } catch (error) {
        console.error("Error Removing Product:", error);
        logger.error(`Error Removing and Product Quantity: ${error.message}`);
    }
}
export const getallOrders = async (req, res) => {
    try {
        // console.log("Order User",req.user);
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found!", result: [] });
        }
        const orders = await OrderModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: "Successfully Fetched Orders", result: orders || [] })
    } catch (error) {
        console.error("Error Fetching Orders...", error)
        logger.error(`Error fetching orders: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}


export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        if (!orderId) {
            return res.status(404).json({ success: false, message: "Please Provide OrderId: ", result: null })
        }
        if (!req.user) {
            return res.status(404).json({ success: false, message: "Please Provide User: ", result: null })
        }
        const order = await OrderModel.findById(orderId);
        if (order.userId.toString() !== req.user.id) {
            return res.status(400).json({ success: false, message: `Not the User Order ${req.user.id}` });
        }
        let lastStatus = order.status;
        try {
            console.log("Shipment Order Id: ", order.order_id);
            const shipmentTracking = await getShipmentOrderByOrderId(order)
            let trackingData = null;
            if (shipmentTracking) {
                if (shipmentTracking.tracking_data) {
                    trackingData = shipmentTracking.tracking_data;
                } else {
                    trackingData = shipmentTracking[order.shipment_id].tracking_data;
                }
            }
            if (trackingData) {
                if (trackingData.shipment_status) {
                    order.status = getStatusDescription(trackingData.shipment_status)
                    order.shipment_status = trackingData?.shipment_status;
                    order.current_status = getStatusDescription(trackingData.shipment_status);

                }
                if (trackingData.etd) {
                    order.etd = trackingData.etd;
                }
                if (trackingData.track_url) {
                    order.trackingUrl = trackingData.track_url
                }
            }
            await order.save();
            if (lastStatus !== order.status) {
                try {
                    sendOrderStatusUpdateMail(order.userId, order);
                } catch (error) {
                    console.error("Error sending order status update mail:", error);
                    logger.error("Error sending order status update mail: " + error.message);
                }
            }
        } catch (error) {
            console.error("Error Getting Shipment Status: ", error);
        }

        res.status(200).json({ success: true, message: "Found Order", result: order });

    } catch (error) {
        console.error("Error Getting Order Details: ", error);
        logger.error(`Error getting order details: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

export const createwishlist = async (req, res) => {
    try {
        const id = req.user.id;
        const { productId } = req.body;
        if (!id) {
            return res.status(200).json({ success: false, message: "user Is Not Logged In" })
        }
        if (!productId) {
            return res.status(200).json({ success: false, message: "Product id Required" });
        }
        let previousWishList = await WhishList.findOne({ userId: id })
        // console.log("Creating Wish List: ",previousWishList);
        if (previousWishList) {
            const isAlreadyPresent = previousWishList.orderItems.find(item => item.productId.toString() === productId);
            if (isAlreadyPresent) {
                const index = previousWishList.orderItems.findIndex(item => item.productId.toString() === productId)
                previousWishList.orderItems.splice(index, 1);
                await previousWishList.save();
                return res.status(200).json({ success: false, message: "Product removed from wishlist" })
            }
            previousWishList.orderItems.push({ productId: mongoose.Types.ObjectId(productId) });
            await previousWishList.save();
            return res.status(200).json({ success: true, message: "Product added to wishlist" })
        }
        previousWishList = new WhishList({
            userId: id, orderItems: [{
                productId: mongoose.Types.ObjectId(productId),  // Ensure productId is cast to ObjectId
            }]
        })
        await previousWishList.save();
        res.status(200).json({ success: true, message: "Product added to wishlist" })
    } catch (error) {
        console.error("Error creating wishlist: ", error);
        logger.error(`Error creating wishlist: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getwishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(404).json({ success: false, message: "No User Found!" });
        const wishlist = await WhishList.findOne({ userId: userId }).populate('orderItems.productId');
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist Not Found" });
        }
        // Filter out orderItems where productId is null or undefined
        const updatedOrderItems = wishlist.orderItems.filter(item => item.productId !== null && item.productId !== undefined);
        // Update the wishlist with the filtered orderItems
        wishlist.orderItems = updatedOrderItems;
        // Optionally, save the updated wishlist if required
        await wishlist.save();
        // If you want to return the updated wishlist to the user
        res.status(200).json({ success: true, message: "Wishlist Fetched successfully", wishlist: wishlist || [] });
    } catch (error) {
        console.error("Error getting WishList: ", error);
        logger.error(`Error getting Wishlist: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const applyCouponToBag = async (req, res) => {
    try {
        const { id } = req.user;
        const { bagId } = req.params;
        const { couponCode } = req.body;

        const coupon = await Coupon.findOne({ CouponCode: couponCode });
        // console.log("Coupon Code: ",coupon)
        if (!coupon) {
            return res.status(404).json({ message: "Coupon Not Found" })
        }
        if (coupon.Status === "Inactive") {
            return res.status(400).json({ message: "Coupon is inactive" });
        }
        if (coupon.ValidDate < Date.now()) {
            return res.status(400).json({ message: "Coupon is expired" });
        }
        const bag = await Bag.findById(bagId);
        if (!bag) {
            return res.status(404).json({ message: "Bag Not Found" })
        }
        if (bag.Coupon) {
            return res.status(400).json({ message: "Bag already has a coupon" })
        }
        if (bag.userId.toString() !== id) {
            return res.status(400).json({ message: "Coupon cannot be applied to this bag" })
        }
        bag.Coupon = coupon._id;
        await Promise.all([
            coupon.save(),
            bag.save(),
        ])
        const updatedBag = await Bag.findById(bagId).populate("Coupon");
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(updatedBag);
        console.log("Bag with Coupon After Coupon Applied: ", totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst);
        updatedBag.totalProductSellingPrice = totalProductSellingPrice;
        updatedBag.totalSP = totalSP;
        updatedBag.totalDiscount = totalDiscount;
        updatedBag.totalMRP = totalMRP;
        await updatedBag.save();
        // console.log("Updated Coupon After Coupon Applied: ",updatedBag)
        // updatedBag.totalGst = totalGst;

        res.status(200).json({ success: true, message: "Coupon Applied Successfully", result: { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } })
    } catch (error) {
        console.error("Failed to apply coupon: ", error);
        logger.error(`Failed to apply coupon: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}
export const removeCouponToBag = async (req, res) => {
    try {
        const { id } = req.user;
        const { bagId } = req.params;
        const { couponCode } = req.body;
        const bag = await Bag.findById(bagId).populate("Coupon");
        // console.error("Removing Coupon bag",bag);
        if (!bag) {
            return res.status(404).json({ message: "Bag Not Found" })
        }

        const coupon = await Coupon.findOne({ CouponCode: couponCode });
        // console.log("Coupon Code: ",coupon)
        if (!coupon) {
            return res.status(404).json({ message: "Coupon Not Found" })
        }
        if (!bag.Coupon) {
            return res.status(400).json({ message: "No Coupon Found" })
        }
        if (bag.userId.toString() !== id) {
            return res.status(400).json({ message: "Coupon cannot be applied to this bag" })
        }
        bag.Coupon = null;
        coupon.Status = "Active";

        await Promise.all([
            coupon.save(),
            bag.save()
        ])
        const updatedBag = await Bag.findById(bagId).populate("Coupon");
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(updatedBag);
        console.log("Bag with Coupon After Coupon Removed: ", totalProductSellingPrice, totalSP, totalDiscount, totalMRP);
        updatedBag.totalProductSellingPrice = totalProductSellingPrice;
        updatedBag.totalSP = totalSP;
        updatedBag.totalDiscount = totalDiscount;
        updatedBag.totalMRP = totalMRP;
        await updatedBag.save();
        res.status(200).json({ success: true, message: "Coupon Removed Successfully" })
    } catch (error) {
        console.error("Failed to apply coupon: ", error);
        logger.error(`Failed to apply coupon: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}


export const addItemsArrayToBag = async (req, res) => {
    try {
        console.log("Adding Items to Bag: ", req.body);
        // Check if the user is logged in
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User Not Logged In" });
        }

        const userId = req.user.id;

        // Fetch ConvenienceFees from the database
        const convenienceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });

        // Check if the user already has a bag
        const userBag = await Bag.findOne({ userId }).populate('orderItems.productId');

        // If no existing bag, create a new one
        if (!userBag) {
            const newBag = new Bag({
                userId,
                ConvenienceFees: convenienceFees?.ConvenienceFees || 0,
                orderItems: req.body.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    color: p.color,
                    size: p.size,
                    isChecked: p.isChecked,
                })),
            });

            // Calculate totals for the new bag
            const totals = await getItemsData(newBag);
            updateBagTotals(newBag, totals);

            // Save the new bag
            await newBag.save();
        } else {
            // Update the existing bag
            const updatePromises = req.body.map(async (p) => {
                const existingItem = userBag.orderItems.find(item => item.productId._id.toString() === p.productId);

                if (existingItem) {
                    // Update quantity if the product is already in the bag
                    existingItem.quantity += p.quantity;
                } else {
                    // Add new item to the bag if not found
                    userBag.orderItems.push({ productId: p.productId, quantity: p.quantity, color: p.color, size: p.size });
                }
            });

            // Wait for all the items to be processed before calculating totals
            await Promise.all(updatePromises);

            // Recalculate and update bag totals
            const totals = await getItemsData(userBag);
            updateBagTotals(userBag, totals);

            // Save the updated bag
            await userBag.save();
        }
        res.status(200).json({ success: true, message: "Items added to bag" });
    } catch (error) {
        console.error("Failed to add items array: ", error);
        logger.error(`Failed to add items array: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Helper function to update bag totals
const updateBagTotals = (bag, totals) => {
    const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = totals;
    if (totalProductSellingPrice) bag.totalProductSellingPrice = totalProductSellingPrice;
    if (totalSP) bag.totalSP = totalSP;
    if (totalDiscount) bag.totalDiscount = totalDiscount;
    if (totalMRP) bag.totalMRP = totalMRP;
    if (totalGst) bag.totalGst = totalGst;
}


/* export const addItemsArrayToBag = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User Not Logged In" });
        }

        const userId = req.user.id;
        const { body: bagItems } = req;

        // Check if bagItems exists and is an array
        if (!Array.isArray(bagItems) || bagItems.length === 0) {
            return res.status(400).json({ message: "No items provided" });
        }

        // Fetch ConvenienceFees from the database
        const convenienceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });

        // Find the user's existing bag
        let userBag = await Bag.findOne({ userId }).populate('orderItems.productId');
        console.log("User Bags: ",userBag);

        // Prepare the update to the bag
        const updatedItems = [];

        // Process each item in the bag
        for (const item of bagItems) {
            const { productId, quantity, color, size, isChecked } = item;

            // Check if the item is already in the user's bag
            const existingItemIndex = userBag?.orderItems.findIndex(
                (existingItem) => existingItem.productId._id.toString() === productId
            );

            if (existingItemIndex !== -1) {
                // If item exists, update quantity
                userBag.orderItems[existingItemIndex].quantity += quantity;
            } else {
                // Otherwise, add the new item to the bag
                updatedItems.push({ productId, quantity, color, size, isChecked });
            }
        }

        // If the user already has a bag, update the items
        if (userBag) {
            userBag.orderItems.push(...updatedItems);
            // Recalculate and update bag totals
            const totals = await getItemsData(userBag);
            updateBagTotals(userBag, totals);

            await userBag.save();
        } else {
            // If no existing bag, create a new one with the items
            const newBag = new Bag({
                userId,
                ConvenienceFees: convenienceFees?.ConvenienceFees || 0,
                orderItems: bagItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    isChecked: item.isChecked,
                })),
            });

            // Recalculate and update bag totals
            const totals = await getItemsData(newBag);
            updateBagTotals(newBag, totals);

            // Save the new bag
            await newBag.save();
        }

        res.status(200).json({ success: true, message: "Items added to bag" });
    } catch (error) {
        console.error("Failed to add items to bag: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}; */

// Helper function to update bag totals
/* const updateBagTotals = (bag, totals) => {
    const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = totals;
    if (totalProductSellingPrice) bag.totalProductSellingPrice = totalProductSellingPrice;
    if (totalSP) bag.totalSP = totalSP;
    if (totalDiscount) bag.totalDiscount = totalDiscount;
    if (totalMRP) bag.totalMRP = totalMRP;
    if (totalGst) bag.totalGst = totalGst;
}; */





export const addItemsArrayToWishList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productIdArray } = req.body;
        console.log("Product Id Array: ", productIdArray);

        // Check if productIdArray exists
        if (!userId && !productIdArray || !productIdArray.length) {
            return res.status(400).json({ success: false, message: "Product Array Not Found" });
        }

        // Get the product IDs from the array
        const allProductIds = productIdArray.map(p => mongoose.Types.ObjectId(p));

        // Find the user's wishlist
        let previousWishList = await WhishList.findOne({ userId });

        // If wishlist exists, update it
        if (previousWishList) {
            // Get the existing product IDs in the wishlist to check for duplicates
            const existingProductIds = previousWishList.orderItems.map(item => item.productId.toString());

            // Filter out the products that are already in the wishlist
            const newProducts = allProductIds.filter(productId => !existingProductIds.includes(productId.toString()));

            if (newProducts.length > 0) {
                // Add new products to the wishlist
                previousWishList.orderItems.push(...newProducts.map(productId => ({ productId })));

                // Save the updated wishlist
                await previousWishList.save();
            }

            return res.status(200).json({ success: true, message: "Items added to Wish List" });
        }

        // If wishlist doesn't exist, create a new one with the products
        const newWishList = new WhishList({
            userId,
            orderItems: allProductIds.map(productId => ({ productId }))
        });

        await newWishList.save();
        res.status(200).json({ success: true, message: "Items added to Wish List" });

    } catch (error) {
        console.error("Failed to add items to wishlist:", error);
        logger.error(`Failed to add items to wishlist: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


/* export const addItemsToBag = async (req, res) => {
    try {
        console.log("Bag Body",req.body)
        const {userId,productId,quantity,color,size} = req.body
        if(!userId || !productId || !quantity || !color || !size){
            return res.status(400).json({message: "Please provide all the required fields"})
        }
        
        const FindUserBag = await Bag.findOne({userId}).populate('orderItems.productId');
        if(!FindUserBag){
            const convenienceFees = await WebSiteModel.findOne({tag:'ConvenienceFees'});
            const bag = new Bag({userId,ConvenienceFees:convenienceFees?.ConvenienceFees || 0,orderItems:[{productId,quantity,color,size,isChecked:true}]})
            console.log("Creating Bag: ",bag);
            const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP,totalGst } = await getItemsData(bag);
            if(totalProductSellingPrice && totalProductSellingPrice !== 0) bag.totalProductSellingPrice = totalProductSellingPrice;
            if(totalSP && totalSP !== 0) bag.totalSP = totalSP;
            if(totalDiscount && totalDiscount !== 0) bag.totalDiscount = totalDiscount;
            if(totalMRP && totalMRP !== 0) bag.totalMRP = totalMRP;
            if(totalGst && totalGst !== 0) bag.totalGst = totalGst;
            
            await bag.save();
        }else{
            const product = FindUserBag.orderItems.find(p => p.productId?._id === productId)
            if(product){
                product.isChecked = true;  // Update isChecked status to true for existing item
                if(product.size._id === size._id && product.color._id === color._id){
                    product.quantity = product.quantity + quantity
                }else{
                    FindUserBag.orderItems.push({productId,quantity,color,size});
                }
            }else{
                FindUserBag.orderItems.push({productId,quantity,color,size})
            }
            const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP,totalGst } = await getItemsData(FindUserBag);
            console.log("Total Product Selling Price: ", totalProductSellingPrice, totalSP, totalDiscount, totalMRP)
            if(totalProductSellingPrice && totalProductSellingPrice !== 0) FindUserBag.totalProductSellingPrice = totalProductSellingPrice;
            if(totalSP && totalSP !== 0) FindUserBag.totalSP = totalSP;
            if(totalDiscount && totalDiscount !== 0) FindUserBag.totalDiscount = totalDiscount;
            if(totalMRP && totalMRP !== 0) FindUserBag.totalMRP = totalMRP;
            if(totalGst && totalGst !== 0) FindUserBag.totalGst = totalGst;
            await FindUserBag.save()
        }
        const bag = await Bag.findOne({userId}).populate('orderItems.productId orderItems.color orderItems.size orderItems.quantity')
        // console.log("Bag Items: ",bag)
        res.status(200).json({success:true,message:"Successfully added Items to Bag",bag})
    } catch (error) {
        console.error("Error Occurred during creating bag: ", error)
        res.status(500).json({success:false,message: "Internal Server Error"})
    }

} */

export const addItemsToBag = async (req, res) => {
    try {
        console.log("Bag Body", req.body);
        const userId = req.user.id;
        const { productId, quantity, color, size } = req.body;

        // Validation
        if (!userId || !productId || !quantity || !color || !size) {
            return res.status(400).json({ success: false, message: "Please provide all the required fields" });
        }

        // Fetch existing user bag
        let bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon');

        // If no bag exists, create one
        if (!bag) {
            const convenienceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
            const newBag = new Bag({
                userId,
                ConvenienceFees: convenienceFees?.ConvenienceFees || 0,
                orderItems: [{ productId, quantity, color, size, isChecked: true }]
            });
            // console.log("Creating New Bag: ", newBag);

            // Get item data and update the bag
            const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(newBag);
            newBag.totalProductSellingPrice = totalProductSellingPrice || 0;
            newBag.totalSP = totalSP || 0;
            newBag.totalDiscount = totalDiscount || 0;
            newBag.totalMRP = totalMRP || 0;
            newBag.totalGst = totalGst || 0;

            await newBag.save();
            return res.status(200).json({ success: true, message: "Successfully added Items to Bag", bag: newBag });
        }

        // Update existing bag
        const existingProduct = bag.orderItems.find(p => p.productId?._id.toString() === productId.toString());

        if (existingProduct) {
            existingProduct.isChecked = true; // Ensure product is marked as checked

            if (existingProduct.size._id.toString() === size._id.toString() && existingProduct.color._id.toString() === color._id.toString()) {
                // Update quantity if size and color match
                existingProduct.quantity += quantity;
            } else {
                // Add new variant (color/size) if they are different
                bag.orderItems.push({ productId, quantity, color, size });
            }
        } else {
            // Add new product if not already in the bag
            bag.orderItems.push({ productId, quantity, color, size });
        }

        // Recalculate the bag totals
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(bag);

        // Update the bag with recalculated totals
        bag.totalProductSellingPrice = totalProductSellingPrice || 0;
        bag.totalSP = totalSP || 0;
        bag.totalDiscount = totalDiscount || 0;
        bag.totalMRP = totalMRP || 0;
        bag.totalGst = totalGst || 0;

        await bag.save();

        // Return the updated bag data
        const updatedBag = await Bag.findOne({ userId }).populate('orderItems.productId');
        res.status(200).json({ success: true, message: "Successfully added Items to Bag", bag: updatedBag });
    } catch (error) {
        console.error("Error occurred during creating/updating bag: ", error);
        logger.error(`Error occurred during creating/updating bag: ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/* const getItemsData = async (bag) => {
    console.log("getItemsData Bag Items: ",bag)
    let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
    let totalMRP = 0, totalGst = 0;

    // Use for...of to handle async properly
    for (const item of bag.orderItems) {
        const { productId, quantity,isChecked } = item;
        if(isChecked){
            // Await the database query
            let idOfProduct = productId?._id;
            if(!idOfProduct){
                idOfProduct = productId;
            }
            const productData = await ProductModel.findById(idOfProduct);
            console.log("Deconstruct Product data: ", productData)
            const { salePrice, price } = productData;
            // const priceWithoutGst = getOriginalAmount(gst,price)
            // let salePriceWithouGst = 0;
            // if(salePrice){
            // 	// salePriceWithouGst = getOriginalAmount(gst,salePrice);
            // }

            // Calculate item totals
            const productSellingPrice = salePrice || price;
            const itemTotalPrice = (salePrice && salePrice > 0 ? salePrice : price) * quantity;
            totalSP += itemTotalPrice;

            // Calculate discount if both salePrice and price are valid
            if (salePrice && price && price > 0) {
                const discount = price - salePrice;
                totalDiscount += discount * quantity;
            }
            // totalGst += gst;

            // Add to the product selling price
            totalProductSellingPrice += (productSellingPrice * quantity);

            // Add to MRP
            totalMRP += price * quantity;
        }
    }

    // If coupon logic is required:
    if (bag.Coupon) {
        const coupon = bag.Coupon;
        const { CouponType, Discount, MinOrderAmount } = coupon;
        console.log("Coupon Details: ", CouponType, Discount, MinOrderAmount)
        // const applyCouponDiscount = () => {
        //     if (CouponType === "Percentage") {
        //         totalProductSellingPrice -= totalProductSellingPrice * (Discount / 100);
        //     } else {
        //         totalProductSellingPrice -= Discount;
        //     }
        // };
        const applyCouponDiscount = () => {
            let discountedAmount = totalProductSellingPrice;
            if (typeof Discount !== 'number' || Discount < 0) {
                console.error('Invalid discount value.');
                return discountedAmount; // Return the original price if discount is invalid.
            }
        
            console.log("Coupon Discount: ", Discount, totalProductSellingPrice)
            if (CouponType === "Percentage") {
                // Ensure totalProductSellingPrice is positive
                if (discountedAmount > 0) {
                    discountedAmount -= discountedAmount * (Discount / 100);
                }
            } else {
                // Ensure discount does not exceed the total price
                if (discountedAmount > Discount) {
                    discountedAmount -= Discount;
                } else {
                    discountedAmount = 0; // Avoid negative prices
                }
            }
        
            // Return updated total price after applying discount
            return discountedAmount;
        };
        

        // Apply coupon discount only if applicable
        if (MinOrderAmount > 0) {
            if (totalProductSellingPrice >= MinOrderAmount) {
                applyCouponDiscount();
            }
        } else {
            applyCouponDiscount();
        }

        // Apply free shipping discount
        if (bag.Coupon.FreeShipping && bag.ConvenienceFees > 0) {
            totalProductSellingPrice -= bag.ConvenienceFees; // Remove convenience fees if no minimum order amount
        }
    }
    if(bag?.ConvenienceFees > 0 && !bag.Coupon.FreeShipping){
        // Optionally, if convenience fee is applied once:
        totalProductSellingPrice += bag?.ConvenienceFees || 0;
    }
    console.log("Total Product Selling Price: ", totalProductSellingPrice,totalSP, totalDiscount, totalMRP, totalGst)
    return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP,totalGst };
}; */
const getItemsData = async (bag) => {

    let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
    let totalMRP = 0, totalGst = 0;  // If GST is needed, implement it

    // Ensure orderItems is valid and an array
    if (!Array.isArray(bag.orderItems)) {
        console.error("Invalid order items data.");
        return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst };
    }

    // Use for...of to handle async properly
    for (const item of bag.orderItems) {
        const { productId, quantity, isChecked } = item;
        if (isChecked) {
            let idOfProduct = productId?._id || productId; // Ensure fallback for productId
            try {
                // Await the database query
                const productData = await ProductModel.findById(idOfProduct);
                if (!productData) {
                    console.error("Product not found for productId:", idOfProduct);
                    continue; // Skip this item if product is not found
                }

                // console.log("Deconstruct Product data: ", productData);
                const { salePrice, price } = productData;

                // Calculate item totals
                const productSellingPrice = salePrice || price;
                const itemTotalPrice = productSellingPrice * quantity;
                totalSP += itemTotalPrice;

                // Calculate discount if both salePrice and price are valid
                if (salePrice && price && price > 0) {
                    const discount = price - salePrice;
                    totalDiscount += discount * quantity;
                }

                // Add to the product selling price
                totalProductSellingPrice += (productSellingPrice * quantity);

                // Add to MRP
                totalMRP += price * quantity;

            } catch (error) {
                console.error("Error fetching product data for productId:", idOfProduct, error);
            }
        }
    }
    let couponDiscountedAmount = 0;

    // Coupon logic
    const applyCouponDiscount = () => {
        let discountedAmount = totalProductSellingPrice;

        if (typeof bag.Coupon?.Discount !== 'number' || bag.Coupon.Discount < 0) {
            console.error('Invalid discount value.');
            return discountedAmount; // Return the original price if discount is invalid.
        }

        const { CouponType, Discount } = bag.Coupon;

        if (CouponType === "Percentage") {
            // Ensure totalProductSellingPrice is positive
            if (totalProductSellingPrice > 0) {
                const discountAmount = discountedAmount * (Discount / 100);
                console.log("discountedAmount = ", discountAmount)
                discountedAmount -= discountAmount;
                couponDiscountedAmount += discountAmount; // Add to couponDiscountedAmount
            }
        } else {
            // Ensure discount does not exceed the total price
            if (discountedAmount > Discount) {
                discountedAmount -= Discount;
                couponDiscountedAmount += Discount; // Add to couponDiscountedAmount
            } else {
                couponDiscountedAmount += discountedAmount; // Apply the full amount if it's less than the discount
                discountedAmount = 0; // Avoid negative prices
            }
        }


        return discountedAmount;
    };


    // Apply coupon discount only if applicable
    if (bag.Coupon) {
        const { MinOrderAmount, FreeShipping } = bag.Coupon;

        // Check if order meets the minimum requirement for the coupon
        if (MinOrderAmount > 0 && totalProductSellingPrice >= MinOrderAmount) {
            totalProductSellingPrice = applyCouponDiscount();
        } else if (MinOrderAmount <= 0) {
            totalProductSellingPrice = applyCouponDiscount();
        }

        // Apply free shipping discount if applicable
        if (FreeShipping && bag.ConvenienceFees > 0) {
            totalProductSellingPrice -= bag.ConvenienceFees; // Remove convenience fees if free shipping is applied
        }

    }

    // Apply convenience fee if no free shipping is provided
    if (bag?.ConvenienceFees > 0 && !bag?.Coupon?.FreeShipping) {
        totalProductSellingPrice += bag.ConvenienceFees;
    }

    totalDiscount += couponDiscountedAmount;
    console.log("Coupon Discount:", couponDiscountedAmount, bag.Coupon);
    console.log("Total Product Selling Price: ", totalProductSellingPrice, totalMRP, totalSP, totalDiscount);
    return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst };
};


function calculateTotalAmount(products) {
    // console.log("Total Bag Orders: ",products);
    return products.reduce((total, product) => {
        // Choose the salePrice if it exists, otherwise use the regular price
        const priceToUse = product.productId.salePrice || product.productId.price;
        return total + (product.quantity * priceToUse);
    }, 0) || 0;
}

/* export const getbag = async (req, res) => {
    try {
        // const { userId } = req.params;
        const userId = req.user.id;
        // Fetch the bag with populated orderItems.productId in one query
        const bag = await Bag.findOne({userId:userId }).populate('orderItems.productId Coupon').exec();

        if (!bag) {
            return res.status(404).json({ success:false,message: "Bag not found" });
        }
        // Fetch all products from the bag's orderItems at once (reduce redundant DB calls)
        const productIds = bag.orderItems.map(o => o.productId?._id.toString() || o.productId.toString()); // returns an array;
        // console.log("Bag Items: ", productIds);
        const products = await ProductModel.find({ _id: { $in: productIds } });

        // Create a map for fast lookup of product sizes
        const productMap = products.reduce((acc, product) => {
            acc[product._id.toString()] = product;
            return acc;
        }, {});

        // Update size quantities based on original product data
        for (let o of bag.orderItems) {
            const originalProductData = productMap[o.productId?._id.toString()];

            if (!originalProductData) {
                console.error(`Product with ID ${o.productId?._id} not found`);
                continue;
            }

            // Find the corresponding size for the order item
            const originalProductSize = originalProductData.size.find(s => s._id.toString() === o.size?._id);

            if (!originalProductSize) {
                console.error(`Size with ID ${o.size?._id} not found for product ${o.productId?._id}`);
                continue;
            }

            // console.log("Bag Order Items size Quantity: ", o?.size?.quantity);

            // Update the size quantity if it doesn't match the original
            if (o?.size?.quantity !== originalProductSize?.quantity) {
                console.log("Updating size quantity");
                o.size.quantity = originalProductSize.quantity;
            }

            // console.log("Original Product Size Quantity: ", originalProductSize.quantity);
        }

        // Save the updated bag
        await bag.save();

        res.status(200).json({
            success: true,
            bag
        });

    } catch (error) {
        console.error("Error Occurred during getting bag: ", error);
        logger.error(`Error while getting bag: ${error.message}`)
        res.status(500).json({ success:true, message: "Internal Server Error" });
    }
}; */
export const getbag = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
            console.log("User not found!");
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Fetch the bag with populated orderItems.productId and Coupon
        const bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon').exec();

        if (!bag) {
            return res.status(400).json({ success: false, message: "Bag not found" });
        }

        if (bag.orderItems.length === 0) {
            return res.status(400).json({ success: true, message: "Bag is empty", bag });
        }

        // Extract product IDs from order items
        const productIds = bag.orderItems.map(o => {
            if (o.productId && o.productId._id) {
                return o.productId._id.toString();
            } else if (o.productId) {
                return o.productId.toString();
            } else {
                console.error("Invalid productId:", o.productId);
                return null;
            }
        }).filter(id => id !== null);

        let products = [];
        try {
            products = await ProductModel.find({ _id: { $in: productIds } });
        } catch (error) {
            console.error("Error Getting All Products", error);
            logger.warn(`Error while fetching products for bag: ${error.message}`, { productIds });
        }

        // Filter out null values and create a lookup map
        products = products.filter(product => product);
        const productMap = products.reduce((acc, product) => {
            acc[product._id.toString()] = product;
            return acc;
        }, {});

        // Update size quantities
        for (let o of bag.orderItems) {
            const originalProductData = productMap[o.productId?._id.toString()];
            if (!originalProductData) {
                console.error(`Product with ID ${o.productId?._id} not found`);
                continue;
            }

            const originalProductSize = originalProductData.size.find(s => s._id.toString() === o.size?._id);
            if (!o.size || !originalProductSize) {
                console.error(`Missing size data for order item ${o._id}`);
                continue;
            }

            if (o.size.quantity !== originalProductSize.quantity) {
                console.log("Updating size quantity");
                o.size.quantity = originalProductSize.quantity;
            }
        }

        // Save the updated bag
        await bag.save();
        console.log("Bag successfully updated");

        res.status(200).json({ success: true, message: "Bag Found!", bag });
    } catch (error) {
        console.error("Error occurred during getting bag: ", error);
        logger.error(`Error while getting bag: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




export const updateItemCheckedInBag = async (req, res) => {
    try {
        // Destructure the request body to get the product ID and checkedIn status
        const { id, size, color } = req.body;
        // console.log("updateItemCheckedInBag id: ", id, "isChecked: ", req.body);
        // Find the original product from the database
        const originalProductData = await ProductModel.findById(id);

        if (!originalProductData) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        // Find the user's shopping bag
        const bag = await Bag.findOne({ userId: req.user.id }).populate('orderItems.productId');;
        if (!bag) {
            return res.status(400).json({ message: "Bag Not Found" });
        }

        // Find the specific product in the user's bag
        const product = bag.orderItems.find(p => p.productId._id.toString() === id && p.size._id.toString() === size?._id && p.color._id.toString() === color?._id);
        if (!product) {
            return res.status(400).json({ message: "Product not found in bag" });
        }
        // Update the checkedIn status
        product.isChecked = !product.isChecked;
        const TotalBagAmount = calculateTotalAmount(bag.orderItems);
        bag.TotalBagAmount = TotalBagAmount;
        // console.log("Updated Bag:", bag);
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(bag);
        // console.log("Update Bag New Data ",totalProductSellingPrice, totalSP, totalDiscount, totalMRP);
        bag.totalProductSellingPrice = totalProductSellingPrice;
        bag.totalSP = totalSP;
        bag.totalDiscount = totalDiscount;
        bag.totalMRP = totalMRP;
        bag.totalGst = totalGst;
        await bag.save();
        // console.log("bag after update: ", bag);
        res.status(200).json({
            success: true,
            message: "Successfully updated Bag",
            bag
        });

    } catch (error) {
        console.error("Error Occurred during updating item checked in bag: ", error);
        logger.error(`Error Occurred during updating item checked in bag: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const updateqtybag = async (req, res) => {
    try {
        // Destructure the request body to get the product ID and quantity
        const { id, size, color, qty } = req.body;

        // Find the original product from the database
        const originalProductData = await ProductModel.findById(id);
        if (!originalProductData) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        // Find the user's shopping bag
        const bag = await Bag.findOne({ userId: req.user.id }).populate('orderItems.productId');;
        if (!bag) {
            return res.status(400).json({ message: "Bag Not Found" });
        }

        // Find the specific product in the user's bag
        const product = bag.orderItems.find(p => p.productId._id.toString() === id && p.size._id.toString() === size._id.toString() && p.color._id.toString() === color._id.toString());
        if (!product) {
            return res.status(400).json({ message: "Product not found in bag" });
        }

        // Check if the product has a size and find the size data
        const originalProductDataSize = originalProductData.size.find(s => s._id.toString() === product.size._id.toString());
        if (!originalProductDataSize) {
            return res.status(400).json({ message: "Product size not found" });
        }

        // If the size quantity in the bag doesn't match the original product size, update it
        if (product.size.quantity !== originalProductDataSize.quantity) {
            // console.log("Updating size quantity");
            product.size.quantity = originalProductDataSize.quantity; // Sync with original product size quantity
        }
        if (product.price !== originalProductData.price) product.price = originalProductData.price; // Sync with original product price
        if (product.salePrice !== originalProductData.salePrice) product.salePrice = originalProductData.salePrice; // Sync with original product sale price
        // Update the quantity in the bag
        product.quantity = qty;
        const TotalBagAmount = calculateTotalAmount(bag.orderItems);
        bag.TotalBagAmount = TotalBagAmount;
        // console.log("Updated Bag:", bag);
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(bag);
        console.log("Update Bag Quantity  Data ", bag.TotalBagAmount);
        if (totalProductSellingPrice && totalProductSellingPrice !== 0) bag.totalProductSellingPrice = totalProductSellingPrice;
        if (totalSP) bag.totalSP = totalSP;
        if (totalDiscount) bag.totalDiscount = totalDiscount;
        if (totalMRP) bag.totalMRP = totalMRP;
        if (totalGst) bag.totalGst = totalGst;
        // Save the updated bag
        await bag.save();

        // Return a success response
        res.status(200).json({
            success: true,
            message: "Successfully updated Bag",
            bag
        });

    } catch (error) {
        console.error("Error Occurred during updating bag:", error.message);
        logger.error(`Error occured during updating bag ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


/* export const deletebag = async (req, res) => {
    try {
        const {productId,size,color} = req.body
        const userId = req.user.id;
        // console.log("Deleting Bag!",userId);
        const bag = await Bag.findOne({userId: userId});
        if(!bag) return res.status(400).json({success:false,message: "Bag not found"});
        const bagItem = bag.orderItems.findIndex(p => p.productId.toString() === productId && p.size._id.toString() === size?._id && p.color?._id === color?._id);
        if(bagItem === -1) {
            console.log("Invalid Items: ",bag);
            logger.error(`Invalid bag: ${productId}`);
            return res.status(400).json({message: "Product not found in bag"})
        }
        bag.orderItems.splice(bagItem, 1);

        if(bag.orderItems.length <= 0){
            await Bag.findOneAndDelete({userId: userId})
            return res.status(200).json({success:true,message:"Successfully deleted Bag"})
        }
        await bag.save();
        const updatedBag = await Bag.findOne({userId: userId}).populate('orderItems.productId Coupon');
        const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP,totalGst } = await getItemsData(updatedBag);
        console.log("After Deleting Update Bag Data ",updatedBag);
        if(totalProductSellingPrice) updatedBag.totalProductSellingPrice = totalProductSellingPrice;
        if(totalSP) updatedBag.totalSP = totalSP;
        if(totalDiscount) bag.totalDiscount = totalDiscount;
        if(totalMRP) updatedBag.totalMRP = totalMRP;
        if(totalGst) updatedBag.totalGst = totalGst;
        await updatedBag.save()
        res.status(200).json({success:true,message:"Successfully deleted Bag",updatedBag})
    } catch (error) {
        console.error("Error Occurred during deleting bag ", error);
        logger.error(`Error occurred during deleting bag ${error.message}`);
        res.status(500).json({message: "Internal Server Error"})
    }
} */
export const deletebag = async (req, res) => {
    try {
        const { productId, size, color } = req.body;
        const userId = req.user.id;

        // Find the user's bag
        const bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon');
        if (!bag) return res.status(400).json({ success: false, message: "Bag not found" });
        // console.log("Deleting Bag!",bag.orderItems);
        // Find the index of the item to remove
        const bagItemIndex = bag.orderItems.findIndex(
            p => p.productId._id.toString() === productId &&
                p.size._id.toString() === size?._id &&
                p.color?._id === color?._id
        );

        if (bagItemIndex === -1) {
            logger.warn(`Invalid bag item: ${productId}`);
            return res.status(400).json({ message: "Product not found in bag" });
        }

        // Remove the item
        bag.orderItems.splice(bagItemIndex, 1);

        // If the bag is empty after removal, delete it
        if (bag.orderItems.length === 0) {
            await Bag.findOneAndDelete({ userId });
            return res.status(200).json({ success: true, message: "Bag is empty, deleted successfully" });
        }

        // Save updated bag
        await bag.save();

        // Recalculate totals
        const { totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst } = await getItemsData(bag);
        const updatedBag = { ...bag.toObject(), totalProductSellingPrice, totalSP, totalDiscount, totalMRP, totalGst };

        // Save the bag again with the new totals
        await bag.updateOne({ $set: updatedBag });

        res.status(200).json({
            success: true,
            message: "Successfully deleted product from bag",
            updatedBag: updatedBag
        });

    } catch (error) {
        console.error("Error deleting product from bag", error);
        logger.error(`Error deleting product from bag: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deletewish = async (req, res) => {
    try {
        const { deletingProductId } = req.body;
        if (!deletingProductId) {
            return res.status(400).json({ message: "Product Id is required" })
        }
        console.log("Deleting Wishlist product: ", deletingProductId);
        // Find the wishlist of the user
        const wishlist = await WhishList.findOne({ userId: req.user.id });

        // If the wishlist is not found, return a 404 error
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        // Ensure the deletingProductId is treated as an ObjectId for proper comparison
        const deletingProductIdObjectId = mongoose.Types.ObjectId(deletingProductId);

        // Remove the item from the wishlist's orderItems
        wishlist.orderItems = wishlist.orderItems.filter(p =>
            !p.productId.equals(deletingProductIdObjectId)  // Using `.equals` for ObjectId comparison
        );

        console.log("Deleting Wishlist Items: ", deletingProductId, wishlist.orderItems.map(p => p.productId));

        // If no items are left in the wishlist, delete the wishlist entirely
        if (wishlist.orderItems.length === 0) {
            await WhishList.findOneAndDelete({ userId: req.user.id });
            return res.status(200).json({ success: true, message: "Successfully deleted Wishlist" });
        }

        // Save the updated wishlist
        await wishlist.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Successfully deleted Wishlist item",
            result: wishlist,
        });
    } catch (error) {
        console.error("Error: ", error);
        // Return a generic error response if an exception occurs
        logger.error(`Error occurred during deleting wishlist item: ${error.message}`);
        res.status(500).json({ success: false, message: "An error occurred while deleting wishlist item", error: error.message });
    }
};


export const returnOrder = async (req, res) => {
    try {
        const { orderId, refundOptionsData } = req.body;
        let userId = req.user.id;
        if (!userId) {
            userId = req.query.userId;
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const order = await OrderModel.findById(orderId);
        const returnSuccess = await generateOrderReturnShipment(order, userId);
        console.log("Return Order Success: ", returnSuccess);
        if (!returnSuccess) {
            return res.status(400).json({ success: false, message: "Failed to create returned order", result: null });
        }
        order.status = returnSuccess.status;
        order.shipment_status = returnSuccess.status_code;
        order.current_status = getStatusDescription(returnSuccess.status_code)
        order.IsReturning = true;
        order.ReturningData = returnSuccess;
        if (refundOptionsData) {
            order.RefundData = refundOptionsData;
        }
        await order.save();
        try {
            sendOrderStatusUpdateMail(order.userId, order);
        } catch (error) {
            console.error("Error sending order status update mail:", error);
            logger.warn("Error sending order status update mail: " + error.message);
        }
        res.status(200).json({ success: true, message: "Successfully returned order" });
    } catch (error) {
        console.error("Error Occured during returning order ", error.message);
        logger.error("Error occured during returning order" + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const createOrderCancel = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Canceling Order: ", orderId);
        const order = await OrderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found", result: null });
        const cancelRequest = await generateOrderCancel(order.order_id);
        console.log("Cancel Request: ", cancelRequest);
        if (!cancelRequest) return res.status(404).json({ success: false, message: "Failed to cancel order" });
        if (cancelRequest?.status_code === 200 || cancelRequest?.status === 200) {
            order.IsCancelled = true;
        } else {
            if (cancelRequest.message === 'Cannot cancel order when shipment status is Cancellation Requested') {
                order.IsCancelled = true;
            } else {
                order.IsCancelled = false;
            }
        }
        if (!cancelRequest) {
            return res.status(400).json({ success: false, message: "Failed to create cancel request", result: null });
        }
        let refundGeneration = null;
        if (order.paymentMode === 'prepaid') {
            refundGeneration = await generateRefundOrder(order);
        }
        order.RefundData = refundGeneration;
        await order.save();
        res.status(200).json({ success: true, message: "Order Canceled successfully" });
    } catch (error) {
        console.error("Error occured during creating order", error);
        logger.error(`Error occured during creating order ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const exchangeOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log("Exchanging Order: ", orderId);
        res.status(200).json({ success: true, message: "Successfully received order exchange request" });
    } catch (error) {
        console.error("Error Occurred during exchanging order ", error.message);
        logger.error(`Error occurred during exchanging order ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const tryCreatePickupResponse = async (req, res) => {
    try {
        const { orderId, BestCourior, ShipmentCreatedResponseData } = req.body;
        const order = await OrderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        const pickupRequest = await generateOrderPicketUpRequest(order, ShipmentCreatedResponseData, BestCourior);
        console.log("Created Pickup Request: ", pickupRequest);
        if (!pickupRequest) {
            return res.status(400).json({ success: false, message: "Failed to create pickup request", result: null });
        }
        res.status(200).json({ success: true, message: 'Successfully created a new pickup' })

    } catch (error) {
        console.error("Error occured during creating pickup request", error);
        logger.error(`Error occured during creating pickup request ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const retryRefundData = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Returning Refund: ", orderId);
        const order = await OrderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        const refundData = await generateRefundOrder(order);
        if (!refundData) {
            return res.status(400).json({ success: false, message: "Failed to create refund", result: null });
        }
        console.log("Admin Refund Data: ", refundData);
        order.RefundData = refundData;
        await order.save();
        res.status(200).json({ Success: true, message: "Successfully retried refund data" });
    } catch (error) {
        console.error(`Error Creating Refund: `, error);
        logger.error(`Error Creating Refund: ${error.message}`);
        res.status(500).json({ Success: false, message: "Internal Server Error" });
    }
}
export const createAndSendOrderManifest = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        // console.log("Order Found! : ", order.order_id);
        const manifest = await generateManifest(order);
        // console.log("Manifest: ", manifest);
        if (manifest?.is_invoice_created) {
            await sendMainifestMail(req.user.id, manifest?.invoice_url);
            return res.status(200).json({ success: true, message: "Order Manifest created successfully" });
        }
        res.status(200).json({ success: false, message: "Failed to create order manifest" });
    } catch (error) {
        console.error(`Error creating order manifest: `, error);
        logger.error(`Error creating order manifest: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
