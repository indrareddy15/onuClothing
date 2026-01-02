import mongoose from 'mongoose'

const wishlist = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
    }],
   
})

const WhishList = mongoose.model('wishlist', wishlist)
export default WhishList;