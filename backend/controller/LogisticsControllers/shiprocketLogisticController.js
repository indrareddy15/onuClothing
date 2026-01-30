import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';
import { getBestCourierPartners, getStringFromObject } from '../../utility/basicUtils.js';
import logger from '../../utility/loggerUtils.js';
import WebSiteModel from '../../model/websiteData.model.js';

dotenv.config();



const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

export const getShipRocketToken = async () => {
    const alreadySetShipRocketToken = await WebSiteModel.findOne({ tag: 'Shiprocket-token' });
    if (alreadySetShipRocketToken) {
        return alreadySetShipRocketToken.ShiprocketToken.token;
    }
    return null;
}
export const getAuthToken = async (email, password) => {
    try {
        const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
            email: email || SHIPROCKET_EMAIL,
            password: password || SHIPROCKET_PASSWORD
        });
        // console.log("ShipRocket auth token: ",response?.data);
        return response?.data?.token;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return '';
    }
};

export const logoutAuthToken = async () => {
    try {
        const response = await axios.post(`${SHIPROCKET_API_URL}/auth/logout`)
        token = ''; // Clear the token
        console.log('ShipRocket auth token logged out');
    } catch (error) {
        console.error('Error logging out auth token:', error.message);
    }
}
const generateReturnAwb = async (awbData) => {
    try {
        const token = await getShipRocketToken();
        console.log("Check Return AWB ", awbData);
        const response = await axios.post(`${SHIPROCKET_API_URL}/courier/assign/awb`, awbData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("Return Awb Generationg response: ", response?.data?.response?.data);
        const awb_code = response?.data?.response?.data?.awb_code
        return awb_code || null;
    } catch (error) {
        console.error('Error Creating Return AWB: ', error?.response?.data);
        return null;
    }
}
const generateAwb = async (awbData) => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        console.log("Check AWB ", awbData);
        const response = await axios.post(`${SHIPROCKET_API_URL}/courier/assign/awb`, awbData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("Awb Generationg response: ", response.data.response.data);
        const awb_code = response.data.response.data?.awb_code
        return awb_code || null;
    } catch (error) {
        console.error('Error Creating AWB: ', error?.response?.data);
        // console.dir(error,{depth:null});
        // logger.error(`Error creating AWB: ${getStringFromObject(error?.response?.data)}`)
        return null;
    }
}
const getAllServicalibiltyties = async (servicesData) => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        // console.log("Check Serviceability ",servicesData);
        const response = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: servicesData,  // Use `params` for query parameters in GET requests
        })
        // console.dir(response?.data,{depth:null});
        console.log("Response Check Serviceability", response?.data)
        return response?.data?.data;
    } catch (error) {
        console.error('Error fetching all serviceabilityties:', error?.response?.data);
        // console.dir(error,{depth:null});
        // logger.error(`Failed to fetch all serviceabilityties ${getStringFromObject(error?.response?.data)}`)
        return null;
    }
}
/* export const generateOrderPicketUpRequest =async(order,orderData,bestCourior)=>{
    if (!token) await getAuthToken();
    try {
        const {shipment_id,order_id} = orderData;
        let bestCourier = bestCourior;
        if(!bestCourier){
            // const order = await OrderModel.findOne({order_id:order_id,shipment_id:shipment_id})
            console.log("Delivery Pincode Address: ",order);
            const pickup_locations = await getPickUpLocation();
            const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
            const allAvailableCourier = await getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: order?.address?.pincode,
                order_id: order_id,
            })
            bestCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0];
            console.error("No suitable courier found");
            bestCourier = allAvailableCourier?.available_courier_companies[0];
        }
        const awbCode = await generateAwb({
            shipment_id:shipment_id,
            courier_id:bestCourier?.courier_company_id,
        });
        console.log('awbCode', awbCode);
        if(!awbCode){
            return null;
        }
        // if(!awbCode) throw new Error("Error generating awb code");
        console.log("Generating Picket Up Request for Shipment: ",orderData);
        const response = await axios.post(`${SHIPROCKET_API_URL}/courier/generate/pickup`, {shipment_id:[shipment_id]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("Generated Picket Up Request for Shipment: ",response.data);
        if(!response.data.response){
            throw new Error("Error generating picket up request");
        }
        const returningData = {awbCode,picketUpResponseData:response.data.response};
        return returningData;
    } catch (error) {
        console.error('Error generating order picket up request:', error);
        // logger.error(`Error generating order picket up request ${getStringFromObject(error?.response?.data || error?.message)}`);
        return null;
    }
} */
export const generateOrderPicketUpRequest = async (order, orderData, bestCourier) => {
    // if (!token) await getAuthToken();

    try {
        const token = await getShipRocketToken();
        console.log("Pick up order Data: ", order, orderData, bestCourier);

        const { shipment_id, order_id } = orderData;
        let selectedCourier = bestCourier;

        // Check if bestCourier is provided
        if (!selectedCourier) {
            console.log("No best courier provided, fetching available couriers...");
            // Check for primary pickup location and available couriers
            const pickup_locations = await getPickUpLocation();
            const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);

            if (!primaryLocation) {
                throw new Error("No primary pickup location found.");
            }

            console.log("Delivery Pincode Address: ", order);

            const allAvailableCourier = await getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: order?.address?.pincode,
                order_id: order_id,
            });
            // console.log("All Available Courier: ",allAvailableCourier);
            if (!allAvailableCourier?.available_courier_companies || allAvailableCourier?.available_courier_companies.length === 0) {
                throw new Error("No available couriers found.");
            }
            const shiprocket_recommended_courier_id = allAvailableCourier.shiprocket_recommended_courier_id;
            // selectedCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0];
            selectedCourier = allAvailableCourier?.available_courier_companies.find(courier_id => courier_id.courier_company_id === shiprocket_recommended_courier_id);
        }

        // Generate AWB code for the selected courier
        const awbCode = await generateAwb({
            shipment_id: shipment_id,
            courier_id: selectedCourier?.courier_company_id,
        });

        if (!awbCode) {
            console.error("Error generating AWB code.");
            return null;
        }

        console.log("AWB Code generated:", awbCode);
        console.log("Generating Pickup Request for Shipment: ", orderData);

        // Send request to generate the pickup
        const response = await axios.post(`${SHIPROCKET_API_URL}/courier/generate/pickup`, { shipment_id: [shipment_id] }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response?.data?.response) {
            throw new Error("Error generating pickup request.");
        }

        console.log("Generated Pickup Request for Shipment: ", response.data);
        return { awbCode, picketUpResponseData: response.data.response };

    } catch (error) {
        console.error('Error generating order pickup request:', error.message || error);
        return null;
    }
};


export const generateInvoice = async (orderData) => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        console.log("Generating order Invoice:", orderData)
        const { order_id } = orderData;
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/print/invoice`, { ids: [order_id] }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("Invoice: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error generating Invoice:", error?.response?.data);
        return null;
    }
}
export const generateManifest = async (orderData) => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        const { shipment_id } = orderData;
        console.log("Generating order Manifest:", shipment_id)
        const response = await axios.post(`${SHIPROCKET_API_URL}/manifests/generate`, { shipment_id: [Number(shipment_id)] }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("Manifest: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error generating manifest:", error?.response?.data);
        return null;
    }
}
export const fetchAllPickupLocation = async () => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        console.log("Fetching all pickup locations");
        const response = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("All pickup locations: ", response.data);
        return response?.data?.data?.shipping_address || [];
    } catch (error) {
        console.error('Error fetching all pickup locations:', error?.response?.data);
        return null;
    }
}
// Helper function to format date
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
/* export const generateOrderForShipment = async (userId, shipmentData, randomOrderId, randomShipmentId) => {
    // Check if token exists and fetch it if not
    if (!token) await getAuthToken();

    try {
        // Fetch user data if necessary
        const userData = await User.findById(userId);
        if (!userData) {
            console.error("User not found");
            return null;
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate various totals
        const [subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Generate random ID for HSN and SKU if needed
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
        console.log("Order Items: ",shipmentData.orderItems);
        // Map order items to required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            sku: item?.productId?.sku || item?.productId?._id,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.sku || generateRandomId().toString()
        }));

        // Get available pickup locations
        const pickup_locations = await getPickUpLocation();
        const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
        if (!primaryLocation) {
            console.error("Primary pickup location not found");
            // return null;
        }
        console.log("shipment Address",shipmentData.address);

        // Prepare order details
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()),
            pickup_location: primaryLocation?.pickup_location,
            reseller_name: primaryLocation?.pickup_location,
            company_name: primaryLocation?.pickup_location,
            channel_id: '6282866',
            category: "Clothes",
            billing_isd_code: "+91",
            billing_customer_name: shipmentData.address.Firstname,
            billing_last_name: shipmentData.address.Lastname,
            billing_address: shipmentData.address.address1,
            billing_city: shipmentData.address.address2,
            billing_pincode: shipmentData.address.pincode,
            billing_state: shipmentData.address.state,
            units: orderItems.length,
            billing_country: 'In',
            billing_phone: shipmentData.address.phoneNumber,
            billing_alternate_phone: userData?.phoneNumber,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000, // Convert weight to KG
            order_type: 'NON ESSENTIALS',
            hsn: '441122',
        };

        // Send the request to ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Shipment Created Response: ", response.data);

        // Fetch available couriers in parallel with other tasks
        const [allAvailableCourier, manifest] = await Promise.all([
            getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: shipmentData.address.pincode,
                order_id: response?.data?.order_id,
            }),
            generateInvoice(response.data)
        ]);

        console.log("All Available Courier: ", allAvailableCourier?.available_courier_companies);
        // Get the best courier based on the available companies
        let bestCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0];
        if (!bestCourier) {
            console.error("No suitable courier found");
            bestCourier = allAvailableCourier?.available_courier_companies[0];
        }
        let createPickUpResponse = null;
        if(bestCourier){
            // Create pickup request with the best courier
            createPickUpResponse = await generateOrderPicketUpRequest(null,{
                order_id: response?.data?.order_id,
                shipment_id: response?.data?.shipment_id,
                status: response?.data?.status,
                status_code: response?.data?.status_code,
                onboarding_completed_now: response?.data?.onboarding_completed_now,
                courier_company_id: bestCourier?.courier_company_id
            }, bestCourier);
        }

        return {
            shipmentCreatedResponseData: response.data,
            bestCourier,
            manifest,
            warehouse_name: primaryLocation,
            PickupData: createPickUpResponse
        };

    } catch (error) {
        console.error("Error creating order:", error?.response?.data || error.message);
        return null;
    }
} */
export const generateOrderForShipment = async (userId, shipmentData, randomOrderId, randomShipmentId) => {
    try {
        // Fetch token if it's missing
        const token = await getShipRocketToken();

        // Fetch user data
        const userData = await User.findById(userId);
        if (!userData) {
            console.error("User not found");
            return null;
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate various totals
        const [subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Generate random ID for HSN and SKU if needed
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        console.log("Order Items: ", shipmentData.orderItems);

        // Map order items to required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            color: item?.color.name,
            size: item?.size?.label,
            sku: item?.color?.sku,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.hsn || generateRandomId().toString()
        }));

        // Get available pickup locations
        const pickup_locations = await getPickUpLocation();
        const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
        if (!primaryLocation) {
            console.error("Primary pickup location not found");
            return null; // Avoid proceeding if primary location is not found
        }

        console.log("Shipment Address:", shipmentData.address);
        const alternatePhoneOriginal = userData?.phoneNumber;
        const alternatePhoneWith10Digit = alternatePhoneOriginal ? alternatePhoneOriginal.replace(/\D/g, '').slice(0, 10) : '';
        console.log("Alternate Phone:", alternatePhoneOriginal)
        // Prepare order details
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()), // Ensure formatDate is defined
            pickup_location: primaryLocation?.pickup_location,
            reseller_name: primaryLocation?.pickup_location,
            company_name: primaryLocation?.pickup_location,
            channel_id: '6282866',
            category: "Clothes",
            billing_isd_code: "+91",
            billing_customer_name: shipmentData.address.Firstname || shipmentData.address.FirstName,
            billing_last_name: shipmentData.address.Lastname,
            billing_address: shipmentData.address.address1,
            billing_city: shipmentData.address.address2,
            billing_pincode: shipmentData.address.pincode,
            billing_state: shipmentData.address.state,
            units: orderItems.length,
            billing_country: 'In',
            billing_phone: shipmentData.address.phoneNumber,
            billing_alternate_phone: alternatePhoneWith10Digit,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000, // Convert weight to KG
            order_type: 'NON ESSENTIALS',
            hsn: '441122', // Static HSN, but can be dynamically generated based on your needs
        };

        // Send the request to ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Shipment Created Response: ", response.data);

        // Fetch available couriers and generate invoice in parallel
        const [allAvailableCourier, invoice] = await Promise.all([
            getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: shipmentData.address.pincode,
                order_id: response?.data?.order_id,
            }),
            generateInvoice(response.data)
        ]);
        const shiprocket_recommended_courier_id = allAvailableCourier.shiprocket_recommended_courier_id;
        console.log("All Available Courier: ", allAvailableCourier?.available_courier_companies.find(courier_id => courier_id.courier_company_id === shiprocket_recommended_courier_id));

        // Get the best courier based on available options
        let bestCourier = null;
        if (allAvailableCourier && allAvailableCourier.available_courier_companies.length > 0) {
            bestCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0]
        }
        if (!bestCourier) {
            console.error("No suitable courier found");
        }
        bestCourier = allAvailableCourier?.available_courier_companies.find(courier_id => courier_id.courier_company_id === shiprocket_recommended_courier_id);
        if (bestCourier) {
            // Create pickup request with the best courier
            const createPickUpResponse = await generateOrderPicketUpRequest(null, {
                order_id: response?.data?.order_id,
                shipment_id: response?.data?.shipment_id,
                status: response?.data?.status,
                status_code: response?.data?.status_code,
                onboarding_completed_now: response?.data?.onboarding_completed_now,
                courier_company_id: bestCourier?.courier_company_id
            }, bestCourier);

            return {
                shipmentCreatedResponseData: response.data,
                bestCourier,
                manifest: invoice,
                warehouse_name: primaryLocation,
                PickupData: createPickUpResponse
            };
        } else {
            return {
                shipmentCreatedResponseData: response.data,
                bestCourier: null,
                manifest: invoice,
                warehouse_name: primaryLocation,
                PickupData: null
            };
        }

    } catch (error) {
        console.error("Error creating order:", error?.response?.data || error.message);
        return null;
    }
};
export const getOrderReturnServicesablity = async (servicesData) => {
    // if (!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        console.log("Check Serviceability ", servicesData);
        const response = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: servicesData,  // Use `params` for query parameters in GET requests
        })
        // console.dir(response?.data,{depth:null});
        console.log("Response Check Serviceability", response?.data)
        return response?.data;
    } catch (error) {
        console.error('Error fetching all serviceabilityties:', error?.response?.data);
        // console.dir(error,{depth:null});
        // logger.error(`Failed to fetch all serviceabilityties ${getStringFromObject(error?.response?.data)}`)
        return null;
    }
}
export const generateRefundOrder = async (order) => {
    try {
        const { paymentId, TotalAmount } = order;

        // Retrieve the Razorpay API Key and API Secret from environment variables (keep them secure)
        const razorpayApiKey = process.env.RAZOR_PG_ID;  // Replace with your actual key
        const razorpayApiSecret = process.env.RAZOR_PG_SECRETE;  // Replace with your actual secret

        // Base64 encode the API key and secret for Basic Authentication
        const auth = Buffer.from(`${razorpayApiKey}:${razorpayApiSecret}`).toString('base64');

        // Make the refund API call with the Basic Authentication header
        const response = await axios.post(
            `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
            { amount: TotalAmount },
            {
                headers: {
                    Authorization: `Basic ${auth}`, // Add the Basic Authentication header
                }
            }
        );

        console.log('Refund Success:', response.data);
        return response.data; // Return the response data from Razorpay
    } catch (error) {
        console.error(`Error Generating Refund in Razorpay order: `, error?.response?.data || error.message);
        // throw error; // Optionally throw the error so that the calling function can handle it
        return null;
    }
};


export const generateOrderCancel = async (orderId) => {
    try {
        const token = await getShipRocketToken();
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/cancel`, { ids: [orderId] }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const dataToReturn = response.data;
        return dataToReturn
    } catch (error) {
        console.error("Error cancelling order:", error?.response?.data || error.message);
        return error?.response?.data;
    }
}

export const generateOrderReturnShipment = async (shipmentData, userId) => {
    // if (!token) await getAuthToken();

    try {
        const token = await getShipRocketToken();
        // Check if user exists, skip if not needed for the process
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate various totals in parallel using Promise.all
        const [
            subTotal,
            totalOrderWeight,
            totalOrderHeight,
            totalOrderLength,
            totalBreadth
        ] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);
        // console.log("Shipment Data: ",shipmentData);
        // Generate random ID for HSN and SKU if needed
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
        // Map order items to required format in a single pass
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            qc_enable: true,
            sku: item?.color?.sku,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.hsn || generateRandomId().toString()
        }));

        // Extract the active pickup location

        const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
        if (!activePickUpLocation) {
            throw new Error("Pickup location is missing");
        }
        /* const alternatePhoneOriginal = userData?.phoneNumber;
        const alternatePhoneWith10Digit = alternatePhoneOriginal ? alternatePhoneOriginal.replace(/\D/g, '').slice(0, 10) : '';
        console.log("Alternate Phone:", alternatePhoneOriginal) */

        // Construct the order details for the return shipment
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
            reseller_name: "On U",
            company_name: "On U",
            channel_id: '6282866',
            category: "Clothes",
            pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname || shipmentData.address.FirstName,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

            shipping_customer_name: activePickUpLocation.name,
            shipping_last_name: '',
            shipping_address: activePickUpLocation.address,
            shipping_address_2: activePickUpLocation.address_2,
            shipping_city: activePickUpLocation.city,
            shipping_country: activePickUpLocation.country,
            shipping_pincode: activePickUpLocation.pin_code,
            shipping_state: activePickUpLocation.state,
            shipping_email: activePickUpLocation.email,
            shipping_phone: activePickUpLocation.phone,
            units: orderItems.length,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBreadth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000, // Convert weight to KG
            // hsn: '441122' // Use a predefined HSN code
        };
        // Create return shipment by calling ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/return`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });


        console.log("Return Shipment Created Response: ", response.data);
        const returnResponseData = response.data;
        const pickup_locations = await getPickUpLocation();
        const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
        console.log("Pickup Locations: : ", pickup_locations);
        const allAvailableCourier = await getOrderReturnServicesablity({
            pickup_postcode: shipmentData.address.pincode,
            delivery_postcode: primaryLocation?.pin_code,
            cod: shipmentData.paymentMode === 'prepaid' ? 0 : 1,
            weight: totalOrderWeight,
            is_return: 1,
        });
        let dataToSend = null;
        if (allAvailableCourier) {
            dataToSend = getStringFromObject(allAvailableCourier);
        }
        // console.log("Avaialbele Couriors",allAvailableCourier);
        /* let bestCourier = allAvailableCourier?.available_courier_companies[0];
        if(allAvailableCourier && allAvailableCourier.available_courier_companies.length > 0){
            bestCourier = allAvailableCourier?.available_courier_companies[0];
        }
        console.log('Best Crourior: ',bestCourier); */
        /* const result = await generateReturnAwb({
            shipment_id:returnResponseData.shipment_id,
            courier_id:bestCourier?.courier_company_id,
            status:returnResponseData.status,
            is_return:1,
        }); */
        // console.log("Return Awb Response Result: ",result);
        if (allAvailableCourier) {
            return { ...returnResponseData, ['Return Result Message']: dataToSend };
        } else {
            return returnResponseData;
        }
    } catch (error) {
        console.error("Error creating return shipment:", error?.response?.data || error.message);
        logger.error(`Error creating return shipment: ${error?.response?.data || error.message}`);
        return null;
    }
};



export const getAllReturnOrdersShiprockets = async () => {
    try {
        const token = await getShipRocketToken();
        const response = await axios.get(`${SHIPROCKET_API_URL}/orders/processing/return`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all return orders:", error?.response?.data || error.message);
        return [];
    }
}

export const generateExchangeShipment = async (shipmentData, userId) => {
    // Check and fetch token only if it's not available
    try {
        const token = await getShipRocketToken();
        // If userId is passed, no need to fetch user data from DB unless necessary
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate totals concurrently using Promise.all
        const [subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Map order items to the required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            sku: item?.productId?._id,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            qc_enable: true,
            qc_product_name: item?.productId?.title,
            qc_product_image: item?.productId?.image,
            qc_brand: item?.productId?.brand,
            qc_color: item?.productId?.color?.name,
            qc_size: item?.productId?.size?.label,
            discount: item?.productId?.DiscountedPercentage,
            tax: item?.productId?.gst || 0,
        }));

        // Get pickup location from shipment data
        const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
        if (!activePickUpLocation) {
            throw new Error("Pickup location is missing");
        }

        // Construct the order details
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
            reseller_name: "On U",
            company_name: "On U",
            channel_id: '6282866',
            category: "Clothes",
            pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

            shipping_customer_name: activePickUpLocation.name,
            shipping_last_name: '',
            shipping_address: activePickUpLocation.address,
            shipping_address_2: activePickUpLocation.address_2,
            shipping_city: activePickUpLocation.city,
            shipping_country: activePickUpLocation.country,
            shipping_pincode: activePickUpLocation.pin_code,
            shipping_state: activePickUpLocation.state,
            shipping_email: activePickUpLocation.email,
            shipping_phone: activePickUpLocation.phone,
            units: orderItems.length,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight,  // Convert weight to KG
        };

        console.log("ShipRocket Exchange Data: ", orderDetails);

        // Make the request to ShipRocket API to create the exchange shipment
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/exchange`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Return Shipment Created Response: ", response.data);
        return response.data; // Returning response for further processing if necessary
    } catch (error) {
        console.error("Error creating exchange shipment:", error?.response?.data || error.message);
        logger.error(`Error creating exchange shipment ${getStringFromObject(error?.response?.data || error.message)}`)
        // throw new Error("Failed to create exchange shipment"); // Forward the error for handling upstream
        return null;
    }
};

export const getAllShipRocketOrder = async () => {
    try {
        const token = await getShipRocketToken();

        const response = await axios.get(`${SHIPROCKET_API_URL}/orders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.dir(error, { depth: null });
        return [];
    }
}

export const getShipmentOrderByOrderId = async (order) => {
    try {
        const { shipment_id } = order;
        const token = await getShipRocketToken();
        //${SHIPROCKET_API_URL}/courier/track?order_id=${order_id}&channel_id=6282866
        const res = await axios.get(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipment_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Shipment order Tracking: ", res.data?.tracking_data?.shipment_track_activities);
        return res.data;
    } catch (error) {
        console.error("Error getting Shipment Order by ID: ", error?.response?.data);
        console.error("Error getting Shipment Order by ID: ", error);
        return null;
    }
}
const refreshAndSaveShipRocketToken = async () => {
    try {
        console.log("Refreshing ShipRocket Token...");
        const token = await getAuthToken();
        if (!token) throw new Error("Failed to authenticate with ShipRocket");

        const alreadySetShipRocketToken = await WebSiteModel.findOne({ tag: 'Shiprocket-token' });
        const logInTime = new Date();
        const expiringTime = new Date(logInTime);
        expiringTime.setDate(logInTime.getDate() + 10);

        if (alreadySetShipRocketToken) {
            alreadySetShipRocketToken.ShiprocketToken = { token: token, expiringTime: expiringTime.toISOString() };
            await alreadySetShipRocketToken.save();
        } else {
            const newWebsiteData = new WebSiteModel({
                ShiprocketToken: { token: token, expiringTime: expiringTime.toISOString() },
                tag: 'Shiprocket-token',
            });
            await newWebsiteData.save();
        }
        console.log("ShipRocket Token Refreshed and Saved.");
        return token;
    } catch (error) {
        console.error("Error Refreshing Token:", error.message);
        return null;
    }
}

export const getPickUpLocation = async () => {
    try {
        let token = await getShipRocketToken();
        try {
            const res = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res?.data?.data?.shipping_address || [];
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("401 Unauthorized in getPickUpLocation, refreshing token...");
                token = await refreshAndSaveShipRocketToken();
                if (token) {
                    const res = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    return res?.data?.data?.shipping_address || [];
                }
            }
            throw error;
        }
    } catch (error) {
        console.error("Error getting PickeUp Location: ", error?.response?.data || error.message);
        return [];
    }
}
export const addNewPicketUpLocation = async (locationData) => {
    // if(!token) await getAuthToken();
    try {
        const token = await getShipRocketToken();
        const res = await axios.post(`${SHIPROCKET_API_URL}/settings/company/addpickup`, locationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Created PickeUp Location Response: ", res?.data);
        return res?.data?.success;
    } catch (error) {
        // console.dir(error, { depth: null});
        console.error("Error adding new PickeUp Location: ", error?.response?.data);
    }
}

export const checkShipmentAvailability = async (delivary_pin, weight) => {
    try {
        let token = await getShipRocketToken();
        const pickup_locations = await getPickUpLocation();

        if (!pickup_locations || pickup_locations.length === 0) {
            console.error("No pickup locations found.");
            return null;
        }

        // Ensure token exists, if not try to get it (though getPickUpLocation might have just refreshed it)
        if (!token) token = await getShipRocketToken();

        const picketUp_pin = pickup_locations[0]?.pin_code;
        const shipmentData = {
            cod: 1,
            pickup_postcode: picketUp_pin,
            delivery_postcode: delivary_pin,
            weight: weight,
        };

        console.log("Shipment availability check for:", shipmentData);

        try {
            const res = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: shipmentData,
            });
            return res.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("401 Unauthorized in checkShipmentAvailability, refreshing token...");
                token = await refreshAndSaveShipRocketToken();
                if (token) {
                    const res = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: shipmentData,
                    });
                    return res.data;
                }
            }
            throw error;
        }

    } catch (error) {
        console.error("Error Checking Pincode.: ", error?.message || error)
        return null;
    }
}
export const getShipmentTrackingStatus = async (order) => {
    // if(!token) await getAuthToken();
    try {
        const { shipment_id } = order;
        const token = await getShipRocketToken();
        const res = await axios.get(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipment_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const returningTrackingData = res.data;
        return returningTrackingData;
    } catch (error) {
        console.error("Error Checking Shipment Status.: ", error.response?.date || error)
    }
}

export const GetWalletBalance = async (req, res) => {
    try {
        const token = await getShipRocketToken();
        const walletResponse = await axios.get(`${SHIPROCKET_API_URL}/account/details/wallet-balance`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Wallet: ", walletResponse.data?.data?.balance_amount);
        const balance = walletResponse.data?.data?.balance_amount;
        res.status(200).json({ success: true, message: "Successfully Get Wallet Balance", result: balance || 0 });
    } catch (error) {
        console.error("Error getting Wallet Balance.: ", error.message)
        res.status(500).json({ success: false, message: "Error Getting Wallet Balance" });
    }
}
