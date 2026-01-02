import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const couponSchema = new mongoose.Schema({
    CouponName:{type:String,required:true},
    Description:{type:String},
    CouponCode:{type:String,required:true},
    CouponType:{type:String,required:true,enum:['Percentage','Price']},
    Discount:{type:Number,},
    MinOrderAmount:{type:Number,default:0},
    CustomerLogin:{type:Boolean},
    FreeShipping:{type:Boolean},
    ProductId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    Category:{String},
    Status:{type:String,default:"Active",enum:['Active','Inactive']},
    ValidDate:{type:Date,required:true},
}, { timestamps: true });

const Coupon = mongoose.model('coupon', couponSchema);
export default Coupon;