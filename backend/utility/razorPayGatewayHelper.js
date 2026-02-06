import Razorpay from "razorpay";
import crypto from 'crypto';
import OrderModel from "../model/ordermodel.js";
import ProductModel from "../model/productmodel.js";
import Bag from "../model/bag.js";
import { generateOrderForShipment } from "../controller/LogisticsControllers/shiprocketLogisticController.js";
import { sendMainifestMail, sendOrderPlacedMail } from "../controller/emailController.js";
import WebSiteModel from "../model/websiteData.model.js";
import PaymentOrderModel from "../model/PaymentGatway.model.js";

export const instance = new Razorpay({
    key_id: process.env.RAZOR_PG_ID,
    key_secret: process.env.RAZOR_PG_SECRETE,
});

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Payment Amount:", req.body);
        const { amount, selectedAddress, orderDetails, totalAmount, bagId } = req.body;

        // Validate Razorpay credentials
        const options = {
            amount: Number(Math.round(amount) * 100),
            currency: "INR",
            receipt: `order_receipt_${Date.now()}`,
            payment_capture: 1, // auto-capture payment (1) or manual (0)
        };

        console.log("📤 Creating Razorpay order with options:", { amount: options.amount, currency: options.currency });
        const order = await instance.orders.create(options);
        console.log("✅ Razorpay Payment Order Created", order);

        if (!order) {
            return res.status(404).json({ success: false, message: "Error creating Razorpay order!" });
        }
        // const newRazorPayOrder = await PaymentOrderModel.create({})
        res.status(200).json({ success: true, order, keyId: process.env.RAZOR_PG_ID });
    } catch (error) {
        console.error("❌ Payment Order Creation Error: ", error);
        console.error("Error Details:", {
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            error: error.error
        });
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/* export const paymentVerification = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("Checking Payment: ",req.body);
        if (!id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, selectedAddress, orderDetails, totalAmount, bagId } = req.body;

        // Generate expected signature
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_PG_SECRETE)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error("Payment Signature Mismatch");
            return res.status(400).json({
                success: false,
                message: 'Payment not authenticated',
            });
        }
        const proccessingProducts = orderDetails.filter((item) => item?.isChecked);
        console.log("Order Data: ",proccessingProducts);
        if(!proccessingProducts || proccessingProducts.length <= 0){
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }
        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if (!bagData) {
            return res.status(404).json({ success: false, message: 'Bag not found' });
        }

        console.log('Bag Data:', bagData);

        // Generate random order ID for ShipRocket
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();
        const alreadyPresentConvenenceFees = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
        let manifest = null;
        let warehouse_name = null;
        let PickupData = null;
        let shipmentCreatedResponseData = null
        let bestCourior = null
        try {
            const createdShipRocketOrder = await generateOrderForShipment(req.user.id,{
                order_id: randomOrderShipRocketId,
                userId: id,
                razorpay_order_id:razorpay_order_id,
                ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
                orderItems:proccessingProducts,
                address: selectedAddress,
                TotalAmount:totalAmount,
                paymentMode:"prepaid",
                status: 'Confirmed',
            },randomOrderShipRocketId,randomShipmentId)
            console.log("Shipment Data: ",createdShipRocketOrder);
            manifest = createdShipRocketOrder?.manifest
            warehouse_name = createdShipRocketOrder?.warehouse_name || null;
            PickupData = createdShipRocketOrder?.PickupData || null;
            bestCourior = createdShipRocketOrder?.bestCourior || null;
            shipmentCreatedResponseData = createdShipRocketOrder?.shipmentCreatedResponseData || null;
        } catch (error) {
            console.error("Error while creating shipRocket order: ", error);
        }
        const orderData = new OrderModel({
            order_id: randomOrderShipRocketId,
            userId: id,
            shipment_id:randomShipmentId,
            picketUpLoactionWareHouseName: warehouse_name,
            razorpay_order_id:razorpay_order_id,
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
            orderItems:proccessingProducts,
            address: selectedAddress,
            TotalAmount:totalAmount,
            paymentMode:"prepaid",
            status: 'Confirmed',
            PicketUpData:PickupData || null,
            ShipmentCreatedResponseData:shipmentCreatedResponseData,
            BestCourior:bestCourior,
            manifest:manifest,
        });

        await orderData.save();
        if(manifest){
            if(manifest?.is_invoice_created){
                try {
                    const sentInvoiceTouser = await sendMainifestMail(id,manifest?.invoice_url);
                } catch (error) {
                    console.error(`Error while sending invoice: ${error}`);
                }
            }
        }
        // Process product quantity updates concurrently
        const removingAmountPromise = proccessingProducts.map(async (item) => {
            try {
                console.log('All Order Items:', item.productId._id, item.color.label, item.size, item.quantity);
                await removeProduct(item?.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (err) {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            }
        });

        await Promise.all(removingAmountPromise);

        // Delete the bag after order creation
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

        // Send confirmation email
        await sendOrderPlacedMail(id, orderData);

        // Respond with success message
        res.status(200).json({
            success: true,
            message: 'Order Created Successfully',
            result: 'SUCCESS',
            userId: id,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
} */
// Helper function for generating random order/shipment IDs

// Main payment verification function
/* export const paymentVerification = async (req, res) => {
    const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
    
    // Helper function to validate the payment signature
    const isPaymentSignatureValid = (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_PG_SECRETE)
            .update(body)
            .digest('hex');
        return expectedSignature === razorpay_signature;
    };
    
    // Helper function to process product quantity updates
    const updateProductQuantities = async (products) => {
        const promises = products.map(async (item) => {
            try {
                await removeProduct(item?.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (err) {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            }
        });
        await Promise.all(promises);
    };
    
    // Helper function to create order in ShipRocket
    const createShipRocketOrder = async (userId, orderDetails, randomOrderShipRocketId, randomShipmentId) => {
        try {
            return await generateOrderForShipment(userId, {
                order_id: randomOrderShipRocketId,
                ...orderDetails,
            }, randomOrderShipRocketId, randomShipmentId);
        } catch (error) {
            console.error("Error while creating ShipRocket order: ", error);
            return null;
        }
    };
    try {
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, selectedAddress, orderDetails, totalAmount, bagId } = req.body;

        if (!id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Validate payment signature
        if (!isPaymentSignatureValid(razorpay_payment_id, razorpay_order_id, razorpay_signature)) {
            return res.status(400).json({ success: false, message: 'Payment not authenticated' });
        }

        // Filter checked products
        const proccessingProducts = orderDetails.filter((item) => item?.isChecked);
        if (!proccessingProducts || proccessingProducts.length <= 0) {
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }

        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if (!bagData) {
            return res.status(404).json({ success: false, message: 'Bag not found' });
        }

        // Generate ShipRocket order IDs
        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();

        const alreadyPresentConvenenceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });

        // Create ShipRocket order
        const createdShipRocketOrder = await createShipRocketOrder(req.user.id, {
            orderItems: proccessingProducts,
            address: selectedAddress,
            TotalAmount: totalAmount,
            paymentMode: "prepaid",
            status: 'Confirmed',
            razorpay_order_id: razorpay_order_id,
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
        }, randomOrderShipRocketId, randomShipmentId);

        const { manifest, warehouse_name, PickupData, bestCourior, shipmentCreatedResponseData } = createdShipRocketOrder || {};

        // Create the order in the database
        const orderData = new OrderModel({
            order_id: randomOrderShipRocketId,
            userId: id,
            shipment_id: randomShipmentId,
            razorpay_order_id,
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
            orderItems: proccessingProducts,
            address: selectedAddress,
            TotalAmount: totalAmount,
            paymentMode: "prepaid",
            status: 'Confirmed',
            PicketUpLoactionWareHouseName: warehouse_name,
            PicketUpData: PickupData || null,
            ShipmentCreatedResponseData: shipmentCreatedResponseData,
            BestCourior: bestCourior,
            manifest,
        });

        await orderData.save();

        
        // Update product quantities concurrently
        await updateProductQuantities(proccessingProducts);

        // Handle bag deletion after order creation
        const activeBag = await Bag.findById(bagId);
        if (activeBag) {
            proccessingProducts.forEach((item) => {
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
        if (manifest?.is_invoice_created) {
            try {
                await sendMainifestMail(id, manifest?.invoice_url);
            } catch (error) {
                console.error(`Error while sending invoice: ${error}`);
            }
        }

        // Send confirmation email
        await sendOrderPlacedMail(id, orderData);

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Order Created Successfully',
            result: 'SUCCESS',
            userId: id,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}; */

export const paymentVerification = async (req, res) => {
    const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

    // Helper function to validate the payment signature
    const isPaymentSignatureValid = (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_PG_SECRETE)
            .update(body)
            .digest('hex');
        return expectedSignature === razorpay_signature;
    };

    // Helper function to process product quantity updates
    const updateProductQuantities = async (products) => {
        const promises = products.map(async (item) => {
            try {
                await removeProduct(item?.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (err) {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            }
        });
        await Promise.all(promises);
    };

    // Helper function to create order in ShipRocket
    const createShipRocketOrder = async (userId, orderDetails, randomOrderShipRocketId, randomShipmentId) => {
        try {
            return await generateOrderForShipment(userId, {
                order_id: randomOrderShipRocketId,
                ...orderDetails,
            }, randomOrderShipRocketId, randomShipmentId);
        } catch (error) {
            console.error("Error while creating ShipRocket order: ", error);
            return null;
        }
    };

    try {
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, selectedAddress, orderDetails, totalAmount, bagId } = req.body;

        if (!id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Validate payment signature
        if (!isPaymentSignatureValid(razorpay_payment_id, razorpay_order_id, razorpay_signature)) {
            return res.status(400).json({ success: false, message: 'Payment not authenticated' });
        }

        // Filter checked products
        const proccessingProducts = orderDetails.filter((item) => item?.isChecked);
        if (!proccessingProducts || proccessingProducts.length <= 0) {
            return res.status(400).json({ success: false, message: "Please select at least one product" });
        }

        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if (!bagData) {
            return res.status(404).json({ success: false, message: 'Bag not found' });
        }

        // Generate ShipRocket order IDs
        const randomOrderShipRocketId = generateRandomId();
        const randomShipmentId = generateRandomId();

        const alreadyPresentConvenenceFees = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });

        // Create ShipRocket order
        const createdShipRocketOrder = await createShipRocketOrder(req.user.id, {
            orderItems: proccessingProducts,
            address: selectedAddress,
            TotalAmount: totalAmount,
            paymentMode: "prepaid",
            status: 'Confirmed',
            razorpay_order_id: razorpay_order_id,
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
        }, randomOrderShipRocketId, randomShipmentId);

        const { manifest, warehouse_name, PickupData, bestCourier, shipmentCreatedResponseData } = createdShipRocketOrder || {};

        // Create the order in the database
        // Create the order in the database
        const orderData = new OrderModel({
            order_id: shipmentCreatedResponseData?.order_id || randomOrderShipRocketId,
            userId: id,
            PicketUpLoactionWareHouseName: warehouse_name || null,
            shipment_id: shipmentCreatedResponseData?.shipment_id || randomShipmentId,
            channel_id: '6217390',
            ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
            orderItems: proccessingProducts,
            razorpay_order_id,
            paymentId: razorpay_payment_id,
            address: selectedAddress,
            TotalAmount: totalAmount,
            paymentMode: "prepaid",
            status: 'Confirmed',
            PicketUpData: PickupData || null,
            ShipmentCreatedResponseData: shipmentCreatedResponseData || null,
            BestCourior: bestCourier || null,
            manifest: manifest || null,
        });

        await orderData.save();

        // Update product quantities concurrently
        await updateProductQuantities(proccessingProducts);

        // Handle bag deletion after order creation
        const activeBag = await Bag.findById(bagId);
        if (activeBag) {
            proccessingProducts.forEach((item) => {
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

        // Send emails in parallel
        const emailPromises = [];

        if (manifest?.is_invoice_created) {
            emailPromises.push(sendMainifestMail(id, manifest?.invoice_url));
        }

        emailPromises.push(sendOrderPlacedMail(id, orderData));

        // Await all email promises concurrently
        await Promise.all(emailPromises);

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Order Created Successfully',
            result: 'SUCCESS',
            userId: id,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};




const removeProduct = async (productId, color, size, quantity) => {
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


        /* // Check for insufficient stock
        if (colorReducedAmount < 0 || sizeReducedAmount < 0) {
            console.log("Insufficient stock for color or size");
            return res.status(400).json({ success: false, message: "Not enough stock to remove" });
        } */

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
        // console.log("Product Updated:", product);

        // Respond with success
        // res.status(200).json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error Removing Product:", error);
        // res.status(500).json({ success: false, message: "Error removing product", error: error.message });
    }
};



export const OnPaymentCallBack = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const receivedSignature = req.headers['x-razorpay-signature'];
        const payload = JSON.stringify(req.body);
        const SECREAT = 1234567890;
        console.dir(req.body, { depth: null });
        res.status(200).json({ success: true, message: 'Payment Successful' });
    } catch (error) {
        console.error("Error Removing on Razorpay Payment call back", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}