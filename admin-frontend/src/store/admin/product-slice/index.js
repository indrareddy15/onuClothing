import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        isLoading: true,
        allProducts: [],
        productsPagination: [],
        totalProducts: 0,
        Coupons: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allProducts = action?.payload.result?.allProducts;
            state.productsPagination = action?.payload.result?.productsPagination;
            state.totalProducts = action?.payload.result?.totalProducts;
            console.log(action?.payload?.data);
        }).addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false;
            state.allProducts = [];
            state.productsPagination = [];
            state.totalProducts = 0;
        }).addCase(fetchAllCoupons.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(fetchAllCoupons.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Coupons = action?.payload.result;
        }).addCase(fetchAllCoupons.rejected, (state) => {
            state.isLoading = false;
            state.Coupons = [];
        })
    }
})
export const getProductsById = createAsyncThunk('/products/getProductsById', async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/product/get/${id}`, Header());
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const addNewProduct = createAsyncThunk('/products/addNewProduct', async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/product/add`, formData, Header());
        return response.data;
    } catch (error) {
        console.error(`Error creating product: `, error.response?.data || error.message);
        // Return the error response data for proper error handling
        return error.response?.data || { Success: false, message: error.message };
    }
})
export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts', async ({ pageNo }) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/product/all?page=${pageNo}`, Header());
        console.log("Products Fetch: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error Fetching all Products", error);
        return [];
    }
})
export const editProducts = createAsyncThunk('/products/edit', async ({ id, formData }) => {
    try {
        // const token = localStorage.getItem('token');
        console.log(formData);
        const response = await axios.put(`${BASE_URL}/admin/product/edit/${id}`, formData, Header());
        return response?.data;
    } catch (error) {
        console.error("Error Editing Products: ", error);
    }
})
export const delProducts = createAsyncThunk('/products/del', async (id) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.delete(`${BASE_URL}/admin/product/del/${id}`, Header());
        return response?.data;
    } catch (error) {
        console.error(error);
    }
})


export const createNewCoupon = createAsyncThunk('/admin/product/createCoupon', async ({ couponData }) => {
    try {
        // const token = localStorage.getItem('token');
        // console.log(token);
        const response = await axios.post(`${BASE_URL}/admin/product/coupons/create`, couponData, Header());
        return response?.data;
    } catch (error) {
        console.error("Error creating coupon: ", error);
    }
})
export const editCoupon = createAsyncThunk('/admin/product/coupons/edit', async ({ couponId, couponData }) => {
    try {
        // const token = localStorage.getItem('token');
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/admin/product/coupons/edit/${couponId}`, couponData, Header());
        return response?.data;
    } catch (error) {
        console.error("Error editing coupon: ", error);
    }
})

export const deleteCoupon = createAsyncThunk('/admin/product/coupons/delete', async ({ couponId }) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.delete(`${BASE_URL}/admin/product/coupons/remove/${couponId}`, Header());
        return response?.data;
    } catch (error) {
        console.error("Error deleting coupon: ", error);
    }
})

export const fetchAllCoupons = createAsyncThunk('/admin/product/coupons/all', async () => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/product/coupons/all`, Header());
        return response?.data;
    } catch (error) {
        console.error("Error fetching all coupon");
        return [];
    }
})


export default adminProductSlice.reducer;