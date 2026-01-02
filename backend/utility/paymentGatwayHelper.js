import dotenv from 'dotenv';
import { Cashfree } from "cashfree-pg"; 
import crypto from 'crypto';
import axios from 'axios';
dotenv.config();

Cashfree.XClientId = process.env.CASHFREEE_PG_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREEE_PG_CLIENT_SECRETE;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


async function generateOrderId(){
	try {
		const uniqueId = crypto.randomBytes(16).toString('hex');
		const hash = crypto.createHash('sha256');
		hash.update(uniqueId);
		const orderId = hash.digest('hex');
		return orderId.substring(0,12);
	} catch (error) {
		console.error(`Error generating orderId: ${error.message}`);
	}
}
async function generateOrderRequest(amount,customer_id,cart_items,customer_phone){
	try {
		const orderId = await generateOrderId();
		// console.log(cart_items);
		// return;
		console.log(amount,customer_id,cart_items,customer_phone);
		var request = {
			"order_id": orderId,
			"order_amount": amount,
			"order_currency": "INR",
			"customer_details": {
				"customer_id": customer_id,
				"customer_phone": customer_phone,
			},
			"cart_details":{
				'cart_items':cart_items.map(item =>{
					return {
						"item_id": item.productId,
						"item_name": item.title,
						"item_price": item.price,
						"item_quantity": item.quantity,
						'item_currency': "INR"
					}
				}),
				"cart_total": amount,
        		"currency": "INR"
			},
			"order_meta": {
        		"return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
    		}
		};
		const response = await Cashfree.PGCreateOrder("2022-09-01", request)
		return response.data;
	} catch (error) {
		console.error(`Error generating orderRequest: `,error.message);
		return null;
	}
}
async function fetchPayments(orderId){
	try {
		const payment = await Cashfree.PGOrderFetchPayments("2022-09-01",orderId);
		return payment.data;
	} catch (error) {
		console.error(`Error Verifying Payments: `,error);
	}
}

export {generateOrderRequest,fetchPayments}