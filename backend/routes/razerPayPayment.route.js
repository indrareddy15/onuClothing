import express from 'express';
import { createOrder, OnPaymentCallBack, paymentVerification } from '../utility/razerPayGatewayHelper.js';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post("/order",isAuthenticateuser, createOrder);
route.post("/paymentVerification",isAuthenticateuser, paymentVerification);
route.post('/webhook/payments', OnPaymentCallBack)
export default route;