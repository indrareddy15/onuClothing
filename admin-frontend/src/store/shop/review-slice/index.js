import { BASE_URL } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	reviews:[],
}
const reviewProductSlice = createSlice({
	name:'review',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addReview.pending,(state)=>{
            state.isLoading = true;
        }).addCase(addReview.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.reviews = action?.payload?.result;
        }).addCase(addReview.rejected,(state)=>{
            state.isLoading = false;
			state.reviews = [];
        }).addCase(getReview.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getReview.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.reviews = action?.payload?.result;
        }).addCase(getReview.rejected,(state)=>{
            state.isLoading = false;
			state.reviews = [];
        })
    }
})


export const addReview = createAsyncThunk('/review/addReview',async(data)=>{
	try {
        const response = await axios.post(`${BASE_URL}/api/shop/review/add`,data,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
    }
})
export const getReview = createAsyncThunk('/review/getReview',async({productId})=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/shop/review/get/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
    }
})
export default reviewProductSlice.reducer;