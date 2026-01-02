import axios from 'axios'
import {
    REQUEST_GET_WISHLIST,
    SUCCESS_GET_WISHLIST,
    FAIL_GET_WISHLIST,
    REQUEST_GET_BAG,
    SUCCESS_GET_BAG,
    FAIL_GET_BAG,
    SUCCESS_UPDATE_QTY_BAG,
    REQUEST_UPDATE_QTY_BAG,
    FAIL_UPDATE_QTY_BAG,
    SUCCESS_DELETE_BAG,
    REQUEST_DELETE_BAG,
    FAIL_DELETE_BAG,
    SUCCESS_DELETE_WISH,
    REQUEST_DELETE_WISH,
    FAIL_DELETE_WISH,
    CLEAR_ERRORS,
    REQUEST_GET_ORDER,
    SUCCESS_GET_ORDER,
    FAIL_GET_ORDER,
    REQUEST_GET_ALL_ORDER,
    SUCCESS_GET_ALL_ORDER,
    FAIL_GET_ALL_ORDER
} from '../const/orderconst'
import { BASE_API_URL, headerConfig } from '../config'

export const createwishlist = ({productId}) => async () => {
    try {
        const res = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/create_wishlist`,{productId}, headerConfig());
        return res?.data?.success;
    } catch (error) {
        return false;
    }
}
export const createAndSendProductsArrayWishList = (productIdArray) => async()=>{
    try {
        const res = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/create_wishlist_array`,{productIdArray}, headerConfig());
        return res?.data;
    } catch (error) {
        return error?.response?.data;
    }
}


export const getwishlist = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_GET_WISHLIST })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/order_bag_wishList/get_wishlist`,headerConfig())
        dispatch({ type: SUCCESS_GET_WISHLIST, payload: data.wishlist})
    } catch (error) {
        dispatch({ type: FAIL_GET_WISHLIST, payload: error?.response?.data?.message })
    }
}
export const addItemArrayBag = (options) => async()=>{
    try {
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/addItemArrayBag`,options, headerConfig())
        return data;
    } catch (error) {
        return error?.response?.data?.success;
    }
}
export const createbag = (option) => async () => {
    try {
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/create_bag`,option, headerConfig())
        return data?.success || false;
    } catch (error) {
        return false;
    }
}
export const applyCouponToBag = ({bagId,couponCode}) => async()=>{
    try {
        const res = await axios.put(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/applyCoupon/${bagId}`,{couponCode},headerConfig())
        return res.data;
    } catch (error) {
        return false;
    }
}
export const removeCouponFromBag = ({bagId,couponCode}) => async()=>{
    try {
        const res = await axios.patch(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/removeCoupon/${bagId}`,{couponCode},headerConfig())
        return res.data;
    } catch (error) {
        return false;
    }
}

export const getbag = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_GET_BAG })
        const res = await axios.get(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/getBagByUserId`,headerConfig());
        dispatch({ type: SUCCESS_GET_BAG, payload: res.data.bag,})
    } catch (error) {
        dispatch({ type: FAIL_GET_BAG, payload: error?.response?.data?.message})
    }
}

export const getqtyupdate = (qtydata) => async (dispatch) => {

    try {
        dispatch({ type: REQUEST_UPDATE_QTY_BAG })
        const { data } = await axios.put(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/update_bag`,qtydata, headerConfig());
        dispatch({ type: SUCCESS_UPDATE_QTY_BAG, payload: data.success,})
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_QTY_BAG, payload: error.response.data.message })
    }
}
export const itemCheckUpdate = (checkedData) => async () => {
    try {
        const { data } = await axios.put(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/update_bagItemChecked`,checkedData, headerConfig());
		return data.success;
    } catch (error) {
		return false;
    }
}

export const deleteBag = (deletingProductData) => async (dispatch) => {
    try {
        dispatch({ type: SUCCESS_DELETE_BAG })
        const res = await axios.put(`${BASE_API_URL}/api/shop/order_bag_wishList/bag/removeBagItem`,deletingProductData,headerConfig());
        dispatch({ type: REQUEST_DELETE_BAG, payload: res?.data?.success || false})
    } catch (error) {
        dispatch({ type: FAIL_DELETE_BAG, payload: error?.response?.data?.message || "Failed To Delete BAg" })
    }
}

export const deletewish = ({deletingProductId}) => async (dispatch) => {
    try {
        dispatch({ type: SUCCESS_DELETE_WISH })
        const { data } = await axios.put(`${BASE_API_URL}/api/shop/order_bag_wishList/delete_wishlist`,{deletingProductId}, headerConfig());
        dispatch({ type: REQUEST_DELETE_WISH, payload: data.success,})
    } catch (error) {
        dispatch({ type: FAIL_DELETE_WISH, payload: error.response.data.message })
    }
}

export const create_order = (orderdata) => async () => {
    try {
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/create_order`, orderdata, headerConfig())
		return data;
    } catch (error) {
		return null;
    }
}
export const createPaymentOrder = (orderdata) => async () => {
    try {
        console.log("Payment Order Data: ",orderdata);
        const res = await axios.post(`${BASE_API_URL}/api/payment/create_cashFreeOrder`, orderdata, headerConfig())
        console.log("Payment Order Data: ",res.data)
        return res.data;
    } catch (error) {
        console.error("Error: ",error);
        return null;
    }
}
export const verifyingOrder = (orderdata) => async (dispatch) => {
    try {
        // const token = localStorage.getItem('token');
        console.log("Payment Order Data: ",orderdata);
        const res = await axios.post(`${BASE_API_URL}/api/payment/verify_payment`, orderdata, headerConfig())
        console.log("Payment Order Data: ",res.data)
        return res.data;
    } catch (error) {
        console.error("Error: ",error);
        return null;
    }
}
export const fetchAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_GET_ALL_ORDER })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/order_bag_wishList/orders/all`, headerConfig())
        dispatch({ type: SUCCESS_GET_ALL_ORDER, payload: data.result})
    } catch (error) {
        dispatch({ type: FAIL_GET_ALL_ORDER, payload: error.response.data.message })
    }
}
export const fetchOrderById = (id) => async (dispatch) => {
    try {
        // console.log("Fetch Order:  ",headerConfig());
        
        dispatch({ type: REQUEST_GET_ORDER })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/order_bag_wishList/get_order/${id}`, headerConfig())
        console.log("Order: ",data);
        dispatch({ type: SUCCESS_GET_ORDER, payload: data.result})
    } catch (error) {
        dispatch({ type: FAIL_GET_ORDER, payload: error?.response?.data?.message })
    }
}
export const sendOrderReturn = (returnData) => async () => {
	try {
		const {data} = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/order/returnOrder`,returnData, headerConfig());
		console.log("Return Order: ",data);
		return data?.success;
	} catch (error) {
		console.error("Error Creating Order Return: ",error);
		return false;
	}
}
export const sendOrderCancel = ({orderId}) => async () => {
	try {
        const {data} = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/order/cancelOrder/${orderId}`,{}, headerConfig());
        console.log("Cancel Order: ",data);
        return data?.success;
    } catch (error) {
        console.error("Error Creating Order Cancellation: ",error);
        return false;
    }
}

export const sendExchangeRequest = ({orderId}) => async () => {
	try {
        const {data} = await axios.post(`${BASE_API_URL}/api/shop/order_bag_wishList/order/exchangeRequest`,{orderId}, headerConfig());
        console.log("Exchange Request: ",data);
        return data?.success;
    } catch (error) {
        console.error("Error Creating Exchange Request: ",error);
        return false;
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}