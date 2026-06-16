import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const videoReviewSlice = createSlice({
    name: "videoReviews",
    initialState: {
        isLoading: true,
        videos: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllVideoReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllVideoReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videos = action?.payload?.result || [];
            })
            .addCase(fetchAllVideoReviews.rejected, (state) => {
                state.isLoading = false;
                state.videos = [];
            });
    },
});

export const fetchAllVideoReviews = createAsyncThunk(
    "/videoReviews/fetchAll",
    async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/video-reviews/all`, Header());
            return response.data;
        } catch (error) {
            console.error("Error fetching video reviews:", error);
            return { Success: false, result: [] };
        }
    }
);

export const uploadVideoReview = createAsyncThunk(
    "/videoReviews/upload",
    async ({ formData, onUploadProgress }) => {
        try {
            const cfg = Header();
            const response = await axios.post(`${BASE_URL}/admin/video-reviews/upload`, formData, {
                ...cfg,
                headers: { ...cfg.headers, "Content-Type": "multipart/form-data" },
                onUploadProgress,
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading video review:", error.response?.data || error.message);
            return error.response?.data || { Success: false, message: error.message };
        }
    }
);

export const updateVideoReview = createAsyncThunk(
    "/videoReviews/update",
    async ({ id, data }) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/video-reviews/${id}`, data, Header());
            return response.data;
        } catch (error) {
            console.error("Error updating video review:", error);
            return error.response?.data || { Success: false, message: error.message };
        }
    }
);

export const reorderVideoReviews = createAsyncThunk(
    "/videoReviews/reorder",
    async ({ order }) => {
        try {
            const response = await axios.patch(`${BASE_URL}/admin/video-reviews/reorder`, { order }, Header());
            return response.data;
        } catch (error) {
            console.error("Error reordering video reviews:", error);
            return { Success: false };
        }
    }
);

export const deleteVideoReview = createAsyncThunk(
    "/videoReviews/delete",
    async ({ id }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/video-reviews/${id}`, Header());
            return response.data;
        } catch (error) {
            console.error("Error deleting video review:", error);
            return error.response?.data || { Success: false, message: error.message };
        }
    }
);

export default videoReviewSlice.reducer;
