import OrderModel from "../../model/ordermodel.js";
import ProductModel from "../../model/productmodel.js";
import WareHouseModel from "../../model/WareHosue.mode.js";
import WebSiteModel from "../../model/websiteData.model.js";
import logger from "../../utility/loggerUtils.js";
import { sendOrderStatusUpdateMail } from "../emailController.js";
import { addNewPicketUpLocation, checkShipmentAvailability, fetchAllPickupLocation, getAuthToken } from "./shiprocketLogisticController.js";

export const updateOrderStatusFromShipRokcet = async (req, res) => {
    try {
        console.log("Shiprocket order Status Update Receving Data: ", req.body);
        const { order_id, current_status, shipment_status, shipment_status_id } = req.body;
        // console.log(`Order ID: ${order_id}, Status: ${current_status}`);
        const dbOrder = await OrderModel.findOne({ order_id: order_id });
        if (dbOrder) {
            dbOrder.status = current_status;
            dbOrder.current_status = shipment_status;
            dbOrder.shipment_status = shipment_status_id;
            await dbOrder.save();
            try {
                sendOrderStatusUpdateMail(dbOrder.userId, dbOrder);
            } catch (error) {
                console.error(`Error saving order ${order_id}`)
            }
            console.log(`Order status updated to ${current_status} for ShipRocket Order ID: ${order_id}`);
        } else {
            console.log(`Order Not found! Order ID: ${order_id}`);
        }
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error("Error updating order status: ", error);
        logger.error(`Error occured during updating order status ${error.message}`);
    }
}

export const createNewWareHouse = async (req, res) => {
    try {
        const {
            _id,
            pickup_location,
            name,
            email,
            phone,
            country,
            state,
            pin_code,
            address,
            address_2,
            city,
            lat,
            long,
            address_type,
            vendor_name,
            gstin,
        } = req.body;
        /* console.log("Warehouse: ",req.body);
        if(_id){
            const updateFields = {};
            if(pickup_location) updateFields.pickup_location = pickup_location;
            if(pin_code) updateFields.pin_code = pin_code;
            if(name)updateFields.name = name;
            if(email)updateFields.email = email;
            if(phone)updateFields.phone = phone;
            if(country)updateFields.country = country
            if(state)updateFields.state = state
            if(address)updateFields.address = address
            if(address_2)updateFields.address_2 = address_2
            if(city)updateFields.city = city
            if(lat)updateFields.lat = lat;
            if(long)updateFields.long = long;
            if(address_type)address_type.long = address_type;
            if(vendor_name)address_type.vendor_name = vendor_name;
            if(gstin)address_type.gstin = gstin;
            console.log(`Ware House with ID ${_id} already exists`);
            if(Object.keys(updateFields).length > 0){
                const UpdateProduct = await WareHouseModel.findByIdAndUpdate(_id,updateFields,{new:true});
                if(!UpdateProduct){
                    console.error("Error updating Ware House");
                    return res.status(400).json({Success:false, message: 'Error updating Ware House'});
                }
                return res.status(201).json({Success: true, message: 'New Ware House created successfully'});
            }
        }
        const newWareHouse = new WareHouseModel({
            pickup_location,
            name,
            email,
            phone,
            pin_code,
            country,
            state,
            address,
            address_2,
            city,
            state,
            country,
            lat,
            long,
            address_type,
            vendor_name,
            gstin,
        })
        if(!newWareHouse){
            console.error("Error creating new Ware House");
            return res.status(400).json({Success:false, message: 'Error creating new Ware House'});
        }
        await newWareHouse.save(); */
        const newWareHouseLocation = await addNewPicketUpLocation({
            pickup_location,
            name,
            email,
            phone,
            pin_code,
            country,
            state,
            address,
            address_2,
            city,
            state,
            country,
            lat,
            long,
            address_type,
            vendor_name,
            gstin,
        })
        if (!newWareHouseLocation) {
            console.error("Error creating new ShipRocket Pickup Location");
            return res.status(400).json({ Success: false, message: 'Error creating new ShipRocket Pickup Location' });
        }
        res.status(201).json({ Success: true, message: 'New Ware House created successfully' });
    } catch (error) {
        console.error("Error Creating Ware House: ", error);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}
export const fetchAllWareHouses = async (req, res) => {
    try {
        const allPickUpLoaction = await fetchAllPickupLocation();
        if (!allPickUpLoaction) {
            throw new Error("Couldn't fetch all available Pickup locations");
        }
        console.log("All ShipRocket: Pick Up Loaction", allPickUpLoaction);
        res.status(200).json({ Success: true, message: 'Ware House found', result: allPickUpLoaction || [] });
    } catch (error) {
        console.error("Error fetching Ware House: ", error);
        logger.error(`Error occured during fetching Ware House ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error', error: error.message });
    }
}

export const fetchWareHouseById = async (req, res) => {
    try {
        const { warehouseId } = req.params;
        if (!warehouseId) {
            console.error("Warehouse ID is required");
            return res.status(400).json({ Success: false, message: 'Warehouse ID is required' });
        }
        const wareHouse = await WareHouseModel.findById(warehouseId);
        if (!wareHouse) {
            console.error(`No Ware House found with id: ${warehouseId}`);
            return res.status(404).json({ Success: false, message: 'No Ware House found' });
        }
        res.status(200).json({ Success: true, message: 'Ware House found', result: wareHouse });
    } catch (error) {
        console.error("Error fetching Ware House: ", error);
        logger.error(`Error occured during fetching Ware House ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}

export const removeWareHouseById = async (req, res) => {
    try {
        const { warehouseId } = req.params;
        if (!warehouseId) {
            console.error("Warehouse ID is required");
            return res.status(400).json({ Success: false, message: 'Warehouse ID is required' });
        }
        const wareHouse = await WareHouseModel.findByIdAndDelete(warehouseId);
        res.status(200).json({ Success: true, message: 'Warehouse' });
    } catch (error) {
        console.error("Error fetching", error);
        logger.error(`Error occured during deleting Ware House ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}

export const loginLogistics = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.error("Email and password are required");
            return res.status(400).json({ Success: false, message: 'Email and password are required' });
        }
        const response = await getAuthToken(email, password);
        // console.log("ShipRocket auth token: ",response);
        if (!response) {
            console.error("Error getting ShipRocket auth token: ", response);
            throw new Error("Error getting ShipRocket auth token");
        }
        const alreadySetShipRocketToken = await WebSiteModel.findOne({ tag: 'Shiprocket-token' });
        const logInTime = new Date();  // Current date and time when the user logs in
        const expiringTime = new Date(logInTime);
        expiringTime.setDate(logInTime.getDate() + 10);  // Add 10 days
        // No existing Shiprocket-token, create a new entry
        console.log("ShipRocket Login Token Data: ", { token: response, expiringTime: expiringTime.toISOString() });
        if (!alreadySetShipRocketToken) {
            const newWebsiteData = new WebSiteModel({
                ShiprocketToken: { token: response, expiringTime: expiringTime.toISOString() },
                tag: 'Shiprocket-token',
            });
            await newWebsiteData.save();
        } else {
            alreadySetShipRocketToken.ShiprocketToken = { token: response, expiringTime: expiringTime.toISOString() };
            await alreadySetShipRocketToken.save();
        }
        res.status(200).json({ Success: true, message: 'Logged in successfully', result: { token: response, expiringTime: expiringTime.toISOString() } });
    } catch (error) {
        console.error("Error getting ShipRocket auth token: ", error);
        logger.error(`Error occurred during login ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}

export const checkAvailability = async (req, res) => {
    try {
        const { pincode, productId } = req.query;
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.error("Product Not Found: ", productId);
            logger.warn(`Product not Found: ${productId}`)
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }
        if (!pincode) {
            console.error("Pincode is required");
            logger.warn(`Pincode is required`);
            return res.status(400).json({ Success: false, message: 'Pincode is required' });
        }
        const weight = product.weight;
        const available = await checkShipmentAvailability(Number(pincode), weight);
        if (available === null || available?.length === 0) {
            console.error("Error checking availability");
            logger.warn(`Error Checking Pincode Availability!`)
            return res.status(500).json({ Success: false, message: 'Error checking availability' });
        }

        const courierCompanies = available?.data?.available_courier_companies;
        if (!courierCompanies || courierCompanies.length === 0) {
            return res.status(200).json({ Success: false, message: 'Delivery not available' });
        }

        const partnersDelivering = courierCompanies.map((partners) => ({ edd: partners.estimated_delivery_days, etd: partners.etd, etd_hours: partners.etd_hours }));

        if (partnersDelivering.length <= 0) {
            return res.status(200).json({ Success: false, message: 'Delivery not available' });
        }
        console.log("Pincode is available for delivery: ", partnersDelivering);
        const fastestDelivery = partnersDelivering.reduce((fastest, current) => {
            // Compare 'edd' values, assuming they represent days for delivery
            if (parseInt(current.edd) < parseInt(fastest.edd)) {
                return current;
            }
            return fastest;
        }, partnersDelivering[0]); // Start with the first element
        return res.status(200).json({ Success: true, message: 'Pincode availability', result: fastestDelivery });
    } catch (error) {
        console.error("Error occured during checking availability: ", error);
        logger.error(`Error occured during checking availability ${error.message}`);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}