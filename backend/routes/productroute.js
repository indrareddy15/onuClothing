import express from 'express';
import {  imagekits, getallproducts, SendSingleProduct, setRating, checkUserPurchasedProduct, getRandomProducts, allProductsNoFilter } from "../controller/productcontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.get('/get', imagekits)
route.get('/all', getallproducts)
route.get('/allFilter', allProductsNoFilter)
route.get('/random',getRandomProducts)
route.put('/rating/:productId',isAuthenticateuser, setRating),
route.get('/rating/checkPurchases/:productId', isAuthenticateuser,checkUserPurchasedProduct)
route.get('/getById/:id',SendSingleProduct)
export default route;