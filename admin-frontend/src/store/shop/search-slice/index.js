import { BASE_URL } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	searchResult:[],
}
const searchProductSlice = createSlice({
	name:'shopSearch',
    initialState,
    reducers:{
        resetSearchResult:(state,action)=>{
            state.searchResult = null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(searchProductsByKeyWord.pending,(state)=>{
            state.isLoading = true;
        }).addCase(searchProductsByKeyWord.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.searchResult = action?.payload?.products;
        }).addCase(searchProductsByKeyWord.rejected,(state)=>{
            state.isLoading = false;
			state.searchResult = [];
        })
    }
})


export const searchProductsByKeyWord = createAsyncThunk('/search/searchProducts',async(keyword)=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/shop/search/${keyword}`);
        return response.data;
    } catch (error) {
        console.error(`Error creating order: `,error);
    }
})
export const {resetSearchResult} = searchProductSlice.actions;
export default searchProductSlice.reducer;