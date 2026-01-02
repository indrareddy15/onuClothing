import express from 'express';
import { addCustomProductsRating, addNewProduct, createNewCoupon, deleteProduct, editCoupon, editProduct, fetchAllCoupons, fetchAllProducts, fetchAllReturnOrders, getallOrders, getOrderById, getProductById, getShipmtRocketTokenFromDb, removeCoupon, removeCustomProductsRating, updateOrderStatus, uploadImage, uploadMultipleImages } from '../../controller/adminController/admin.product.controller.js';
import { addNewColorToSize, addNewSizeToProduct, adminRegisterOtpCheck, fetchAllCustomerUsers, getAllProducts, getCustomerGraphData, getMaxDeliveredOrders, getOrderDeliveredGraphData, getOrdersGraphData, getProductTotalStocks, getRecentOrders, getTopSellingProducts, getTotalOrders, getTotalUsers, getuser, getWebsiteVisitCount, logInUser, registerNewAdmin, removeColorFromSize, removeSizeFromProduct, removingCustomer, updateAdminData, updateColorSku, UpdateColorStock, updateImages, UpdateSizeStock } from '../../controller/adminController/admin.auth.controller.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';
import { upload } from '../../utility/cloudinaryUtils.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';
import { GetWalletBalance } from '../../controller/LogisticsControllers/shiprocketLogisticController.js';
import { createAndSendOrderManifest, createOrderCancel, retryRefundData, tryCreatePickupResponse } from '../../controller/ordercontroller.js';

const route = express.Router();
route.post('/auth/register',registerNewAdmin)
route.post('/auth/adminOtpCheck',adminRegisterOtpCheck)
route.post('/auth/login',logInUser)
route.put('/auth/user/update',isAuthenticateuser,ProtectAdminRoute,updateAdminData)


route.get('/auth/check-auth',isAuthenticateuser,ProtectAdminRoute,getuser)
route.post('/product/add',ProtectAdminRoute,addNewProduct);

route.post('/upload-image',isAuthenticateuser,upload.single('my_file'),uploadImage);
route.post('/upload-image-all',isAuthenticateuser,ProtectAdminRoute,upload.array('my_files[]',10),uploadMultipleImages);

route.get('/product/all',fetchAllProducts);
route.post('/product/add-rating',ProtectAdminRoute,addCustomProductsRating);
route.patch('/product/remove-rating',ProtectAdminRoute,removeCustomProductsRating);
route.get('/product/get/:id',ProtectAdminRoute,getProductById);
route.put('/product/edit/:id',ProtectAdminRoute,editProduct);
route.delete('/product/del/:id',ProtectAdminRoute,deleteProduct);


route.get('/orders/getAllOrders',isAuthenticateuser,ProtectAdminRoute,getallOrders);
route.get('/orders/:orderId',isAuthenticateuser,ProtectAdminRoute,getOrderById)
route.put('/orders/updateOrderStatus/:orderId',isAuthenticateuser,ProtectAdminRoute,updateOrderStatus);
route.post('/orders/tryPickUp',isAuthenticateuser,ProtectAdminRoute,tryCreatePickupResponse);
route.post('/order/refundRequest/:orderId',ProtectAdminRoute,isAuthenticateuser,retryRefundData);
route.patch('/orders/tryCreateManifest/:orderId',isAuthenticateuser,ProtectAdminRoute,createAndSendOrderManifest);
route.post('/orders/cancelOrder/:orderId',isAuthenticateuser,ProtectAdminRoute,createOrderCancel);
route.get('/orders/shiprocket/AllCancelOrder',isAuthenticateuser,ProtectAdminRoute,fetchAllReturnOrders)




route.get('/stats/getRecentOrders',isAuthenticateuser,ProtectAdminRoute,getRecentOrders);
route.get('/stats/getTopSellingProducts',isAuthenticateuser,ProtectAdminRoute,getTopSellingProducts);

route.get('/stats/getTotalAllUsersCount',isAuthenticateuser,ProtectAdminRoute,getTotalUsers);
route.get('/stats/getMaxDeliveredOrders',isAuthenticateuser,ProtectAdminRoute,getMaxDeliveredOrders);


route.get('/stats/getCustomerGraphData',isAuthenticateuser,ProtectAdminRoute,getCustomerGraphData);
route.get('/stats/getOrderDeliveredGraphData',isAuthenticateuser,ProtectAdminRoute,getOrderDeliveredGraphData);

route.get('/stats/getOrderGraphData',isAuthenticateuser,ProtectAdminRoute,getOrdersGraphData);
route.get('/stats/getAllProductsCount',isAuthenticateuser,ProtectAdminRoute,getAllProducts);
route.get('/stats/getTotalOrdersLength',isAuthenticateuser,ProtectAdminRoute,getTotalOrders);

route.get('/stats/getWalletBalance',isAuthenticateuser,ProtectAdminRoute,GetWalletBalance);


route.get('/stats/getTotalStock',isAuthenticateuser,ProtectAdminRoute,getProductTotalStocks);


route.get('/stats/getShiprocketToken',isAuthenticateuser,ProtectAdminRoute,getShipmtRocketTokenFromDb);

route.get('/stats/getWebstiesVisitCount',isAuthenticateuser,ProtectAdminRoute,getWebsiteVisitCount);


route.patch('/product/update/updateSizeStock',isAuthenticateuser,ProtectAdminRoute,UpdateSizeStock);
route.patch('/product/update/updateColorStock',isAuthenticateuser,ProtectAdminRoute,UpdateColorStock);
route.patch('/product/update/updateColorSku',isAuthenticateuser,ProtectAdminRoute,updateColorSku);


route.patch('/product/update/addNewSizeStock',isAuthenticateuser,ProtectAdminRoute,addNewSizeToProduct);
route.patch('/product/update/addNewColorToSize',isAuthenticateuser,ProtectAdminRoute,addNewColorToSize);

route.patch('/product/update/removeColorFromSize',isAuthenticateuser,ProtectAdminRoute,removeColorFromSize);
route.patch('/product/update/removeSizeFromProduct',isAuthenticateuser,ProtectAdminRoute,removeSizeFromProduct);
route.patch('/product/update/updateImages',isAuthenticateuser,ProtectAdminRoute,updateImages);



// coupons.
route.post('/product/coupons/create',isAuthenticateuser,ProtectAdminRoute,createNewCoupon);
route.put('/product/coupons/edit/:couponId',isAuthenticateuser,ProtectAdminRoute,editCoupon);
route.delete('/product/coupons/remove/:couponId',isAuthenticateuser,ProtectAdminRoute,removeCoupon);
route.get('/product/coupons/all',isAuthenticateuser,ProtectAdminRoute,fetchAllCoupons);


// shipent logistic


route.get('/customer/all',isAuthenticateuser,ProtectAdminRoute,fetchAllCustomerUsers);
route.patch('/customer/del',isAuthenticateuser,ProtectAdminRoute,removingCustomer);

export default route;