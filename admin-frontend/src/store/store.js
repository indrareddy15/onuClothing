import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminProductsSlice from './admin/product-slice';
import adminStatusSlice from './admin/status-slice';
import adminCustomerSlice from './admin/users-slice';
import adminOrderSlice from './admin/order-slice';
import contactQuerySlice from './admin/query-slice';
import addressSlice from './shop/address-slice';
import shopProductSlice from './shop/product-slice';
import shoppingCartSlice from './shop/car-slice';
import shopOrderSlice from './shop/order-slice';
import searchSlice from './shop/search-slice';
import commonSlice from './common-slice'
import reviewProductSlice from './shop/review-slice';


const store = configureStore({
	reducer:{
		auth:authReducer,
        adminProducts:adminProductsSlice,
        adminOrder:adminOrderSlice,
        Customer:adminCustomerSlice,
        
        common:commonSlice,
        stats:adminStatusSlice,
        
        shopProductSlice:shopProductSlice,
        shopCardSlice:shoppingCartSlice,
        shopAddress:addressSlice,
        shopOrder:shopOrderSlice,
        shopSearch:searchSlice,
        reviewProduct:reviewProductSlice,

        contactQuery:contactQuerySlice,
	}
})


export default store;