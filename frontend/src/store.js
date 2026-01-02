import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import { registeruser, getuser, resendotp, updateuser, otpverifie, updatedetailsuserreducer, loginuser, addressupdate, getAddress } from './Reducer/userreducer';
import {allOptions, allProductNoFilter, Allproducts, randomProducts, singleProduct} from './Reducer/productreducer'
import { create_bag_reducer, create_order_reducer, create_wishlist_reducer, delete_bag_reducer, delete_wish_reducer, get_all_order_reducer, get_bag_reducer, get_order_by_id_reducer, get_wishlist_reducer, update_qty_bag_reducer } from './Reducer/orderreducer';
import { fetch_banners_reducer, get_all_category_banners } from './Reducer/bannerreducer';
import { fetch_All_Coupons, fetch_All_Options, fetch_form_banners, fetchAllFAQS, fetchPrivacyAndPolicy, fetchTermsAndCondition, fetchWebsiteDisclaimer } from './Reducer/common.reducer';


const reducer = combineReducers({
      Registeruser: registeruser,
      
      loginuser: loginuser,
      user : getuser,
      updateAddress:addressupdate,
      resendotp: resendotp,
      updateuser: updateuser,
      userdetails: otpverifie,
      Allproducts:Allproducts,
      AllProductNoFilter:allProductNoFilter,
      AllOptions:allOptions,
      AllCoupons:fetch_All_Coupons,
      
      Sproduct: singleProduct,
      getAllAddress:getAddress,
      banners:fetch_banners_reducer,
	  categoryBanners:get_all_category_banners,

      wishlist:create_wishlist_reducer,
      wishlist_data:get_wishlist_reducer,
      bag:create_bag_reducer,
      bag_data:get_bag_reducer,
      update_bag: update_qty_bag_reducer,
      updateuser2:updatedetailsuserreducer,
      deletebagReducer:delete_bag_reducer,
      deletewish:delete_wish_reducer,
    
      

      createOrder: create_order_reducer,
      getOrderById:get_order_by_id_reducer,
      getallOrders:get_all_order_reducer,
  
      RandomProducts:randomProducts,
      
      fetchFormBanners:fetch_form_banners,
      allOptions:fetch_All_Options,
      websiteDisclaimer:fetchWebsiteDisclaimer,
	  TermsAndConditions:fetchTermsAndCondition,
	  PrivacyPolicy:fetchPrivacyAndPolicy,
	  faqsArray:fetchAllFAQS,
      
})

let initialState = {};

const middleware  = [thunk];

const store = createStore(reducer,initialState,composeWithDevTools( applyMiddleware(...middleware)))


export default store
