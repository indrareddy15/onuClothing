import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const adminContactQuerySlice = createSlice({
    name:"adminContactQuery",
    initialState:{
        isLoading:false,
        ContactQuery:[],
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllQuery.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAllQuery.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.ContactQuery = action?.payload.result;
        }).addCase(fetchAllQuery.rejected,(state,action)=>{
            state.isLoading = false;
            state.ContactQuery = [];
        })
    }
})
export const fetchAllQuery = createAsyncThunk('/website/fetchAllQuery',async (id)=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/common/website/get-contact-query`,Header());
        return response.data;
    } catch (error) {
        console.error(error);
    }
})



export default adminContactQuerySlice.reducer;