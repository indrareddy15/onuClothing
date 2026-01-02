import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const paymentGatwaySchema = new mongoose.Schema({
    order_id:{type:String},
    razorpay_payment_id:{type:String},
    razorpay_order_id:{type:String},
    razorpay_signature:{type:String},
	userId:{
		type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
	},
	selectedAddress:{type:String,required:true},
	orderDetails:{type:String,required:true},
	totalAmount:{type:Number,required:true},
	bagId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Bag",
        required:true,
	}
}, { timestamps: true });

const PaymentOrderModel = mongoose.model('paymentOrder', paymentGatwaySchema);
export default PaymentOrderModel;