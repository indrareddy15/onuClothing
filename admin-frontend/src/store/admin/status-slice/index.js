import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const adminStatusSlice = createSlice({
    name: "status",
    initialState: {
        isLoading: false,
        TotalCustomers: 0,
        TotalProducts: 0,
        TotalOrders: 0,
        walletBalance: -1,
        MaxDeliveredOrders: 0,
        AverageCountPerDay: 0,
        CustomerGraphData: [],
        CustomerVisitersGraphData: [],
        OrdersGraphData: [],
        OrderDeliverData: [],
        TopSellingProducts: [],
        RecentOrders: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllCustomers.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllCustomers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.TotalCustomers = action?.payload?.result;
            // console.log(action?.payload?.data);
        }).addCase(fetchAllCustomers.rejected, (state, action) => {
            state.isLoading = false;
            state.TotalCustomers = -1;
        }).addCase(fetchAllProductsCount.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllProductsCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.TotalProducts = action?.payload?.result || -1;
            console.log(action?.payload?.data);
        }).addCase(fetchAllProductsCount.rejected, (state, action) => {
            state.isLoading = false;
            state.TotalProducts = -1;
        }).addCase(fetchAllOrdersCount.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllOrdersCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.TotalOrders = action?.payload.result;
            // console.log(action?.payload?.data);
        }).addCase(fetchAllOrdersCount.rejected, (state, action) => {
            state.isLoading = false;
            state.TotalOrders = 0;
        }).addCase(getCustomerGraphData.pending, (state) => {
            state.isLoading = true;
        }).addCase(getCustomerGraphData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.CustomerGraphData = action?.payload?.result;
            // console.log("Customer Graph Data ",action?.payload?.result);
        }).addCase(getCustomerGraphData.rejected, (state) => {
            state.isLoading = false;
            state.CustomerGraphData = [];
        }).addCase(getOrderGraphData.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrderGraphData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.OrdersGraphData = action?.payload?.result;
            // console.log("Order Graph Data ",action?.payload?.result);
        }).addCase(getOrderGraphData.rejected, (state) => {
            state.isLoading = false;
            state.OrdersGraphData = [];
        }).addCase(getOrderDeliveredGraphData.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrderDeliveredGraphData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.OrderDeliverData = action?.payload?.result;
            // console.log("Order Delivered Graph Data ",action?.payload?.result);
        }).addCase(getOrderDeliveredGraphData.rejected, (state) => {
            state.isLoading = false;
            state.OrderDeliverData = [];
        }).addCase(fetchMaxDeliveredOrders.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchMaxDeliveredOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.MaxDeliveredOrders = action?.payload?.result;
        }).addCase(fetchMaxDeliveredOrders.rejected, (state) => {
            state.isLoading = false;
            state.MaxDeliveredOrders = 0
        }).addCase(fetchTopSellingProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.TopSellingProducts = action?.payload?.result;
        }).addCase(fetchTopSellingProducts.rejected, (state) => {
            state.isLoading = false;
            state.TopSellingProducts = [];
        }).addCase(fetchRecentOrders.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchRecentOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.RecentOrders = action?.payload?.result;
        }).addCase(fetchRecentOrders.rejected, (state) => {
            state.isLoading = false;
            state.RecentOrders = [];
        }).addCase(getWalletBalance.pending, (state) => {
            state.isLoading = true;
        }).addCase(getWalletBalance.fulfilled, (state, action) => {
            state.isLoading = false;
            state.walletBalance = action?.payload?.result;
        }).addCase(getWalletBalance.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(getWebsiteVisitCount.pending, (state) => {
            state.isLoading = true;
        }).addCase(getWebsiteVisitCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.CustomerVisitersGraphData = action?.payload?.result;
            state.AverageCountPerDay = action?.payload?.averageCountPerDay
        }).addCase(getWebsiteVisitCount.rejected, (state) => {
            state.isLoading = false;
            state.CustomerVisitersGraphData = [];
            state.AverageCountPerDay = 0
        })
    }
})
export const getOrderGraphData = createAsyncThunk('/admin/stats/getOrderGraphData', async ({ startDate, endDate, period }) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/stats/getOrderGraphData`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching Order Graph Data", error);
    }
})
export const getCustomerGraphData = createAsyncThunk('/admin/stats/getCustomerGraphData', async ({ startDate, endDate, period }) => {
    try {
        console.log("Customer Graph Data: ", startDate, endDate, period)
        const response = await axios.get(`${BASE_URL}/admin/stats/getCustomerGraphData?startDate=${startDate}&endDate=${endDate}&period=${period}`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching Customer Graph Data", error);
    }
})
export const getWebsiteVisitCount = createAsyncThunk('/admin/stats/getWebsiteVisitCount', async ({ startDate, endDate, period }) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/stats/getWebstiesVisitCount?startDate=${startDate}&endDate=${endDate}&period=${period}`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching Customer Graph Data", error);
    }
})
export const getOrderDeliveredGraphData = createAsyncThunk('/admin/stats/getOrderDeliveredGraphData', async ({ startDate, endDate, period }) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/stats/getOrderDeliveredGraphData`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching Order Delivered Graph Data", error);
    }
})
export const fetchAllCustomers = createAsyncThunk('/admin/stats/totalUserCount', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getTotalAllUsersCount`, Header());
        // console.log("Result",response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
})

export const fetchTopSellingProducts = createAsyncThunk('/admin/stats/topsellingproducts', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getTopSellingProducts`, Header());
        // console.log("Result",response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const fetchRecentOrders = createAsyncThunk('/admin/stats/recentOrders', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getRecentOrders`, Header());
        console.log("Result", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const fetchAllProductsCount = createAsyncThunk('/admin/stats/getAllProductsCount', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getAllProductsCount`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching all Products", error);
    }
})
export const fetchAllOrdersCount = createAsyncThunk('/admin/stats/getAllOrdersCount', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getTotalOrdersLength`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching all Products", error);
    }
})
export const fetchMaxDeliveredOrders = createAsyncThunk('/admin/stats/getMaxDeliveredOrders', async () => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/stats/getMaxDeliveredOrders`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching all Products", error);
    }
})
export const getWalletBalance = createAsyncThunk('/admin/wallet/getBalance', async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/stats/getWalletBalance`, Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching Wallet Balance", error);
    }
})
export default adminStatusSlice.reducer;