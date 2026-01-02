import { BASE_URL } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const shopProductSlice = createSlice({
    name:'shopProducts',
    initialState:{
        isLoading:false,
        products:[],
        ProductDetails:null,
    },
    reducers:{
        setProductsDetails:(state) => {
            state.ProductDetails = null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAllFilteredShopProducts.pending,(state,action)=>{
            state.isLoading = true;
        }).addCase(fetchAllFilteredShopProducts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.products = action.payload.products;
        }).addCase(fetchAllFilteredShopProducts.rejected,(state,action)=>{
            state.isLoading = false;
            state.products = [];
            console.error(action.error);
        }).addCase(fetchProductDetails.pending,(state,action)=>{
            state.isLoading = false;
            state.ProductDetails = null;
        }).addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.ProductDetails = action.payload.product;
        }).addCase(fetchProductDetails.rejected,(state,action)=>{
            state.isLoading = false;
            state.ProductDetails = null;
        });
    }
})
export const fetchAllFilteredShopProducts = createAsyncThunk('/products/fetchAllFilteredShopProducts',
    async ({filtersParams,sortParams})=>{
    try {
        console.log("Filters: ",filtersParams,sortParams)
        const query = new URLSearchParams({...filtersParams, sortby:sortParams});
        const response = await axios.get(`${BASE_URL}/api/shop/products/get?${query.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching filters: ',error);
    }
})
export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails',
    async (id)=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/shop/products/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const {setProductsDetails} = shopProductSlice.actions;
export default shopProductSlice.reducer;