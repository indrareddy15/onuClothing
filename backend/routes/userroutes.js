import express from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { registerUser, getuser, optverify, resendotp, updateuser, logout, logInUser, registermobile, loginMobileNumber, updateAddress, getAllAddress, removeAddress, loginOtpCheck, updateProfilePic } from '../controller/usercontroller.js';

const route = express.Router();
route.post('/register', registerUser)
route.post('/login', logInUser)
route.post('/registermobile',registermobile)
route.post('/loginmobile',loginMobileNumber)
route.post('/loginmobile/verify',loginOtpCheck)
route.get('/check-auth',isAuthenticateuser, getuser)
route.post('/otpverify', optverify)
route.post('/resendotp', resendotp)


route.put('/updateAddress',isAuthenticateuser,updateAddress);
route.patch('/removeAddress',isAuthenticateuser,removeAddress)
route.get('/getAddress',isAuthenticateuser,getAllAddress);
route.put('/updateuser',isAuthenticateuser, updateuser)
route.put('/updateuserprofilePic',isAuthenticateuser, updateProfilePic)
route.post('/logout', logout)

// route.get('/website/about',getAboutData)


export default route