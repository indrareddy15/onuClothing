import { BASE_URL } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const shoppingCartSlice = createSlice({
    name: 'shoppingCartSlice',
    initialState: {
        isAddToCartUpdateLoading:false,
        cartItems: [],
        totalPrice: 0
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addToCart.pending,(state)=>{
            state.isAddToCartUpdateLoading = true;
        }).addCase(addToCart.fulfilled,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = action.payload.cart;
        }).addCase(addToCart.rejected,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = [];
        }).addCase(fetchCartItems.pending,(state)=>{
            state.isAddToCartUpdateLoading = true;
        }).addCase(fetchCartItems.fulfilled,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = action.payload.data;
        }).addCase(fetchCartItems.rejected,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = [];
        }).addCase(updateToCart.pending,(state)=>{
            state.isAddToCartUpdateLoading = true;
        }).addCase(updateToCart.fulfilled,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = action.payload.data;
        }).addCase(updateToCart.rejected,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = [];
        }).addCase(deleteCartItems.pending,(state)=>{
            state.isAddToCartUpdateLoading = true;
        }).addCase(deleteCartItems.fulfilled,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = action.payload.data;
        }).addCase(deleteCartItems.rejected,(state,action)=>{
            state.isAddToCartUpdateLoading = false;
            state.cartItems = [];
        })

    }
})

export const addToCart = createAsyncThunk('shoppingCart/addToCart', async ({userId,productId,quantity,size,color}) => {
    const result = await axios.post(`${BASE_URL}/api/cart/add`,{
        userId,
        productId,
        quantity,
        size,
        color,
    });
    return result.data;
});
export const updateToCart = createAsyncThunk('shoppingCart/updateToCart', async ({userId,productId,quantity,size,color,}) => {
    // Simulate adding product to the cart
    const token = localStorage.getItem('token');
    console.log(token);
    const result = await axios.put(`${BASE_URL}/api/cart/update-cart`,{
        userId,
        productId,
        quantity,
        size,
        color,
    },headerConfig());
    return result.data;
});
export const fetchCartItems = createAsyncThunk('shoppingCart/fetchCarItems', async ({userId}) => {
    console.log(userId);
    const result = await axios.get(`${BASE_URL}/api/cart/get/${userId}`);
    return result.data;
});
export const deleteCartItems = createAsyncThunk('shoppingCart/deleteCartItems', async ({userId,productId}) => {
    const result = await axios.delete(`${BASE_URL}/api/cart/${userId}/${productId}`);
    return result.data;
});
export default shoppingCartSlice.reducer;