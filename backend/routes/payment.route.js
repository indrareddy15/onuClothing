import express from 'express';
import { createPaymentOrder, verifyPayment } from "../controller/ordercontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post('/create_cashFreeOrder',isAuthenticateuser,createPaymentOrder)
route.post('/verify_payment',isAuthenticateuser,verifyPayment)
export default route;