import A from '../Middelwares/resolveandcatch.js';
import User from '../model/usermodel.js';
import Errorhandler from '../utility/errorhandel.js';
import sendtoken from '../utility/sendtoken.js';
import bcrypt from 'bcryptjs';
import { sendFast2Sms, sendVerificationEmail } from './emailController.js';
import logger from '../utility/loggerUtils.js';
import { CheckIsPhoneNumber, generateOTP, removeSpaces } from '../utility/basicUtils.js';
import axios from 'axios';

export const registermobile = async (req, res) => {
    try {
        const {email,name,gender, phonenumber } = req.body
        const existingUser = await User.findOne({phoneNumber:phonenumber,email:email})
		const otp = generateOTP(6,{numericOnly:true});
        if(existingUser){
            if(existingUser.verify === 'verified'){
                return res.status(200).json({success:true,message:"User Already Exists",result:{user:existingUser,token:sendtoken(existingUser)}})
            }
			existingUser.otp = otp;
			await Promise.all([existingUser.save(),sendVerificationEmail(existingUser.email, otp),sendFast2Sms(existingUser.phoneNumber,otp)])
            return res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp:otp,user:existingUser}})
        }
        await Promise.all([sendVerificationEmail(email, otp),sendFast2Sms(phonenumber,otp)])
        /* await sendVerificationEmail(email, otp)
		const optSendingResponse = await sendFast2Sms(phonenumber,otp)
		console.log("Opt Sending Response: ",optSendingResponse) */

		// https://avatar-placeholder.iran.liara.run/
		const profilePic = `https://avatar.iran.liara.run/public/${gender === 'men' ? "boy":'girl'}?username=${removeSpaces(name)}`
        const user = await User.create({
            name,
			profilePic,
            email,
            phoneNumber:phonenumber,
            gender,
            otp:otp.toString(),
            role:'user',
        })
        console.log("New User: ",user)
        // logger.info("New User: " + user?.name)
        res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp,user}})
    } catch (error) {
        console.log("Error Registering User: ",error)
        logger.error("Error registering User: " + error.message)
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}


export const loginMobileNumber = async(req, res) => {
    try {
		const {LoginData} = req.body;
		const isPhoneNumber = CheckIsPhoneNumber(LoginData);
		console.log("isPhoneNumber: ",isPhoneNumber);
		let user = null;
		if(isPhoneNumber === 'invalid'){
			return res.status(400).json({success: false, message: 'Invalid LogIn Data' });
		}
		if(isPhoneNumber === 'phone'){
			user = await User.findOne({phoneNumber:LoginData});
		}else{
			user = await User.findOne({email:LoginData});
		}
		if(!user){
			return res.status(200).json({success:false,message: 'No User Found',result:null})
		}
		if(user.verify !== 'verified'){
			return res.status(200).json({success:false,message: 'User Not Verified',result:null})
		}
		const otp = generateOTP(6,{numericOnly:true});
		let sendingOptSuccess = false;
		try {
			if(isPhoneNumber === 'phone'){
				sendingOptSuccess = await sendFast2Sms(user.phoneNumber,otp)
				console.log("Opt Sending Response: ",sendingOptSuccess)
			}else{
				sendingOptSuccess = await sendVerificationEmail(user.email, otp);
			}
		} catch (error) {
			console.error("Error Sending otp");
			logger.error(`Error Sending otp ${error.message}`);
			return res.status(200).json({success:false,message: 'Failed to Send Verification Otp! Try Again',result:null})
		}		
		if(user.profilePic === ''){
			const profilePic = `https://avatar.iran.liara.run/public/${user.gender === 'men' ? "boy":'girl'}?${user.name}`
			user.profilePic = profilePic;
		}
		user.otp = otp;
		await user.save();
		res.status(200).json({success:true,message: 'OTP Sent Successfully',result:{otp,phoneNumber:user.phoneNumber,email:user.email}})
	} catch (error) {
		console.error("Error Login User: ",error);
		logger.error(`Error Login User: ${error.message}`);
		res.status(500).json({success:false,message: "Internal server error"});
	}
}

export const updateProfilePic = async(req,res)=>{
	try {
		const id = req.user.id;
		const {profilePic} = req.body;
		const user = await User.findByIdAndUpdate(id, {profilePic: profilePic}, {new: true});
		if(!user){
            return res.status(404).json({message: "User not found"});
        }
		res.status(200).json({message: "Profile Pic Updated Successfully", result:user,token:sendtoken(user)})
	} catch (error) {
		console.error("Error getting user id",error);
		logger.error("Error getting user id: " + error.message);
		res.status(500).json({success:false,message: "Internal server error"});
	}
}


export const loginOtpCheck = async(req,res)=>{
	try {
		const{otp,phoneNumber,email} = req.body;
		let user = await User.findOne({phoneNumber:phoneNumber,email:email});
		if(!user){
			// return next( new Errorhandler('Mobile Number not found', 404))
			user = await User.findOne({email:email});
			if(!user){
				return res.status(404).json({error: 'Mobile Number not found'});
			}
		}
		if(!user.otp){
			return res.status(404).json({error: 'OTP Not found!'});
		}
		if(user.otp.toString() !== otp){
			return res.status(200).json({success:false, message:"OTP Do not Match"});
		}
		user.otp = null
		await user.save();
		const token = sendtoken(user);
		return res.status(200).json({success:true,message: 'Mobile Number Found',result:{user,token}})
		
	} catch (error) {
		console.error(`Error Login Otp Check: ${error.message}`);
		logger.error("Error Login Otp Check " + error.message);
		res.status(500).json({success:false,message: "Internal server error"});
	}

}

export const registerUser = A(async (req, res) => {
    
    const { userName,email,password,phonenumber } = req.body

    console.log("Authenticating with: ",userName,email,password,phonenumber )
    // const existingUser = await User.findOne({phonenumber})
    const user = await User.findOne({phonenumber})

    let otp = Math.floor((1 + Math.random()) * 90000)
	const data = {
        route: "dlt",
        requests: [
            {
                sender_id: "ONUIND",
                message: `${185257}`,
                variables_values: `${otp}`,
                flash: 0,
                numbers: `${phonenumber}`
            }
        ]
    };
    
    axios.post('https://www.fast2sms.com/dev/custom', data, {
        headers: {
            'Authorization': process.env.FAST2SMS,
            'Content-Type': 'application/json'
        }
    })
    /* let options = { authorization: process.env.FAST2SMS, message: `Hello, your OTP for On U is ${otp}

	- ON U `, numbers: [phonenumber] } */
    
    /* sendMessage(options).then(response => {
    
        if (response.return === true) {
        
        async function fun() {
            user.otp = otp;
            await user.save({ validateBeforeSave: false })
        }
        fun()
        
        res.status(200).json({
            success: true,
            user,
            message:`OTP Sent on ${user.phonenumber} Successfully`
        })
        
        } else {
            console.log("Failed to Register User: ",error);
            res.status(400).json({
                success: false,
            })
        
        }
    }) */
})

export const getuser = async(req, res)=>{
	try {
		const user = await User.findById(req.user.id).select('-password');
		const data = {
			id:req.user.id,
			role:req.user.role,
			user:user,
		}
		return res.status(200).json({Success:true,message: 'User is Authenticated',user:data});
	} catch (error) {
		console.error("OTP Error while getting user", error);
		logger.error(`Error OTP Error while getting user: ${error.message}`);
		res.status(500).json({Success:false,message: "Internal server error"});
	}
}

export const optverify = async (req, res)=>{
    try {
		// const {otp} = req.body
		const{phoneNumber,email,otp} = req.body;
		console.log("OTP: ",phoneNumber,email,otp);
		const user = await User.findOne({phoneNumber: phoneNumber,email:email})
		console.log("OTP: ",user);
		if (!user.otp) {
			// return next( new Errorhandler("Your OTP has been expired or not has been genrated pls regenrate OTP", 400))
			return res.status(400).json({success:false,message: 'OTP not found'});
		}
		if (user.otp.toString() !== otp) {
			// return next( new Errorhandler("You entered expire or wrong OTP", 400))
			return res.status(200).json({success:false,message: 'OTP Do not Match'});
		}
		user.otp = null;
		user.verify = 'verified';
		await user.save()
		res.status(200).json({success:true,message: 'OTP Verified Successfully',result:user,token:sendtoken(user)});
	} catch (error) {
		console.error("Error getting user id",error);
		logger.error("Error getting user id: " + error.message);
		if(!res.headersSent){
			res.status(500).json({message: "Internal server error"});
		}
	}

}

export const resendotp = async (req, res)=>{
	try {
		const{email,phoneNumber} = req.body;
		console.log("Resend Otp Email: ",req.body)
		if(!email) return res.status(401).json({success:false,message: 'Email is Required!',result:null});
		const existingUser = await User.findOne({email:email,phoneNumber:phoneNumber})
		if(!existingUser){
			return res.status(401).json({success:true,message:"OTP Sent Successfully",result:null})
		}
		console.log("Existing: User Otp resend ",existingUser)
		if(existingUser.verify === 'verified'){
			return res.status(200).json({success:true,message:"User Already Exists",result:{user:existingUser,token:sendtoken(existingUser)}})
		}
		const otp = generateOTP(6,{numericOnly:true});
		// let sendingOptSuccess = false;
		try {
			await Promise.all([
				sendVerificationEmail(email, otp),
				sendFast2Sms(phoneNumber,otp)
			])
			/* if(isPhoneNumber === 'phone'){
				sendingOptSuccess = await sendFast2Sms(phoneNumber,otp)
				console.log("Opt Sending Response: ",sendingOptSuccess)
			}else{
				sendingOptSuccess = await sendVerificationEmail(email, otp);
			} */
		} catch (error) {
			console.error("Error Sending otp");
			logger.error(`Error Sending otp ${error.message}`);
			return res.status(200).json({success:false,message: 'Failed to Resend Verification Otp! Try Again',result:null})
		}	
		// await sendVerificationEmail(email, otp)
		existingUser.otp = otp;
		await existingUser.save();
		res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp:otp,user:existingUser}})
	} catch (error) {
		console.error(`Error resending OTP request to server:`,error.message)
		logger.error(`Error resending OTP request to server: ${error.message}`)
		res.status(500).json({success:false,message: 'Internal server error'});
	}
}
export const logInUser = async (req,res) =>{
    try {
        const {phonenumber} = req.body;
        if(!phonenumber) return res.status(401).json({Success:false,message: 'Please enter a valid Phone Number'});
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({Success:false,message: 'User not found'});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || '');
        if(!isPasswordCorrect){
            return res.status(401).json({Success:false,message: 'Incorrect Password'});
        }
        const token = sendtoken(user);
        res.status(200).json({Success:true,message: 'User logged in successfully',user:{
            userName:user.userName,
            email:user.email,
            role: user.role,
            id: user._id,
        },token})
    } catch (error) {
        console.error(`Error Logging in user ${error.message}`);
		logger.error(`Error Logging in user ${error.message}`);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}

export const updateuser = async(req,res)=>{
	try {
		const{ name, gender,DOB,profilePic} = req.body
		const dobParsed = new Date(DOB);
		console.log("DOB, ",profilePic);
		const user = await User.findByIdAndUpdate(req.user.id,{$set:{name:name,DOB:dobParsed,gender:gender,profilePic:profilePic}},{new:true})
		if(!user){
			return res.status(303).json({success:false,message: 'User not found'});
		}
		await user.save();
		console.log("User saved successfully!",user);
		res.status(200).json({success:true,message: 'User Updated Successfully',result:user,token:sendtoken(user)})
	} catch (error) {
		console.error(`Error Logging in user ${error.message}`);
		logger.error(`Error Logging in user ${error.message}`);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}
export const removeAddress = async(req, res) => {
    try {
        const user = req.user;
        
        if(!user) return res.status(403).json({success:false,message:'User not found'});
        const userToUpdate = await User.findById(user.id);
        if(!userToUpdate) return res.status(404).json({success:false,message:'User not found'});
        const { addressId } = req.body;
        console.log("Removing Address: ",req.body)
        userToUpdate.addresses.splice(addressId, 1);
        await userToUpdate.save();
        res.status(200).json({success:true,message: 'Address Removed Successfully', user: userToUpdate});
    } catch (error) {
        console.error(`Error removing address `,error);
		logger.error(`Error Removing Address: ${error.message}`);
        res.status(500).json({success:false,message: `Internal Server Error ${error.message}`});
    }
}
export const updateAddress = async(req, res, next) => {
    try {
        const user = req.user;
        // console.log("Updating Address: ",user)
        if(!user) return res.status(404).json({success:false,message:"User not found"});
        if(!req.body) return res.status(404).json({success:false,message:"Address not found"});
        // const { name, phonenumber, pincode, address1, address2, citystate } = req.body;
        const userToUpdate = await User.findById(user.id);
        if(!userToUpdate) return next(new Errorhandler('User not found', 500));
        userToUpdate.addresses.push({ ...req.body});
        await userToUpdate.save();
        res.status(200).json({success:true,message: 'Address Updated Successfully', user: userToUpdate});
    } catch (error) {
        console.error(`Error updating address `,error);
		logger.error(`Error Updating Address: ${error.message}`);
        res.status(500).json({success:false,message: `Internal Server Error ${error.message}`});
    }
}
export const getAllAddress = async(req, res) => {
    try {
        const user = req.user;
        if(!user) return res.status(404).json({success:false,message:'User not found'});
        const userAddresses = await User.findById(user.id);
        if(!userAddresses) return res.status(403).json({success:false,message:'User Address Not Found'});
        res.status(200).json({success:true,message: 'Address Found Successfully',allAddresses: userAddresses.addresses || []});
    } catch (error) {
        console.error("Error getting all address ", error)
		logger.error(`Error Getting All Address: ${error.message}`);
        res.status(500).json({message: "Internal Server Error"})
    }
}


export const logout = A( async(req, res)=>{
    res.cookie('token', null,{
        expire:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Log Out sucessfully"
    })
})

