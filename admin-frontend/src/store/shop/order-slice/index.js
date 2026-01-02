import { BASE_URL } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	orders:null,
    orderId:null,
    cartId:null,
    orderList: [],
    orderDetails:null,
}
const shoppingOrderSlice = createSlice({
	name:'shoppingOrders',
    initialState,
    reducers:{
        resetOrderDetails:(state,action)=>{
            state.orderDetails = null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(createNewOrder.pending,(state)=>{
            state.isLoading = true;
        }).addCase(createNewOrder.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orders = action?.payload?.result?.orderData;
            state.orderId = action?.payload?.result?.orderId;
            state.cartId = action?.payload?.result?.cartId;
            sessionStorage.setItem("checkoutData",JSON.stringify({responseResult:state.orders,orderId:state.orderId,cartId:state.cartId}))
        }).addCase(createNewOrder.rejected,(state)=>{
            state.isLoading = false;
            state.orders = null;
        }).addCase(verifyingOrder.pending,(state)=>{
            state.isLoading = true;
        }).addCase(verifyingOrder.fulfilled,(state,action)=>{
            state.isLoading = false;
        }).addCase(verifyingOrder.rejected,(state)=>{
            state.isLoading = false;
        }).addCase(getAllOrders.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getAllOrders.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orderList = action?.payload?.result || [];
        }).addCase(getAllOrders.rejected,(state)=>{
            state.isLoading = false;
        }).addCase(getUsersOrdersById.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getUsersOrdersById.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orderDetails = action?.payload?.result;
        }).addCase(getUsersOrdersById.rejected,(state)=>{
            state.isLoading = false;
            state.orderDetails = null;
        })
    }
})


export const createNewOrder = createAsyncThunk('/order/createNewOrder',async(orderData)=>{
	try {
        const response = await axios.post(`${BASE_URL}/api/shop/order/create`,orderData);
        return response.data;
    } catch (error) {
        console.error(`Error creating order: `,error);
    }
})
export const verifyingOrder =createAsyncThunk('/order/verify',async(data)=>{
    try {
        console.log(data);
        const response = await axios.post(`${BASE_URL}/api/shop/order/verifyPayment`,data);
        return response.data;
    } catch (error) {
        console.error(`Error verifying order: `,error);
    }
});
export const getAllOrders = createAsyncThunk('/orders/getAllOrders',async(userId)=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/order/all/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders: `,error);
    }
})
export const getUsersOrdersById = createAsyncThunk('/orders/getOrderById',async(orderId)=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/shop/order/getOrder/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching orders: `,error);
    }
})

export const {resetOrderDetails} = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;