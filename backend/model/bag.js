import mongoose from 'mongoose'

const BagSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    Coupon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"coupon",
    },
    ConvenienceFees:Number,
    orderItems: [{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
		isChecked:{type:Boolean, default:true},
        color:Object,
        size:Object,
        quantity:Number,
    }],
	totalGst:Number,
    totalProductSellingPrice:Number,
    totalSP:Number,
    totalMRP:Number,
    totalDiscount:Number,
})

const Bag = mongoose.model('Bag', BagSchema)

export default Bag