import mongoose from 'mongoose'

const productModelSchema = new mongoose.Schema({
    productId:{
		type:String,
        required:[true,'Please enter product Id'],
	},
	sku:Number,
	hsn:String,
    brand:String,
	gst:Number,
	tags:[],
    title:{
        type:String,
        required:[true,'Please enter product title'],
    },
    shortTitle:String,
    brand:{
        type:String,
        default:'On U'
    },
    gst:Number,
    salePrice:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    DiscountedPercentage:{type:Number,default:0},
    size:[
        {
            id:Number,
            label:String,
            quantity:Number,
            colors:[
                {
                    id:Number,
                    label:String,
                    quantity:Number,
                    name:String,
					sku:String,
                    images:[],
                }
            ]
        }
    ],
    AllColors:[{
        type:Object,default:[]
    }],
    bulletPoints:[{
            header:{type:String},
            body:{type:String},
        }
    ],
    description:{
        type:String
    },
    careInstructions:{
        type:String
    },
    material:{
        type:String
    },
    specification:{String},
    gender:{
        type:String
    },
    category:{
        type:String
    },
    subCategory:{
        type:String,
    },
    specialCategory:{type:String},
    totalStock:{type: Number},
    Rating:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            rating:Number,
            comment:String
        }
    ],
    AppliedCoupon:{type:mongoose.Schema.Types.ObjectId,ref:'coupon'},
    width:Number,
    height:Number,
    length:Number,
    weight:Number,
    breadth:Number,
	averageRating:Number,
	TotalSoldAmount:{type:Number,default:0},
},{timestamps:true})
productModelSchema.pre('save', function (next) {
    // Calculate averageRating when Rating is modified
    if (this.isModified('Rating')) {
        if (this.Rating.length === 0) {
            this.averageRating = 0;
        } else {
            const total = this.Rating.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = total / this.Rating.length;
        }
    }

    // Calculate DiscountedPercentage when price or salePrice is modified
    if (this.isModified('price') || this.isModified('salePrice')) {
        if (this.salePrice && this.salePrice > 0) {
            const discountAmount = this.price - this.salePrice;
            const discountPercentage = ((discountAmount / this.price) * 100).toFixed(0);
            this.DiscountedPercentage = discountPercentage;
        } else {
            this.DiscountedPercentage = 0;  // If no salePrice, no discount
        }
    }

    // Logging the updated product (use this)
    // console.log("Updated Product: ", this);

    next();  // Proceed to save
});

/* productModelSchema.virtual('averageRating').get(function () {
    if (this.Rating.length === 0) return 0;
    const total = this.Rating.reduce((acc, review) => acc + review.rating, 0);
    return total / this.Rating.length;
}); */
productModelSchema.index({title: 1})

const ProductModel = mongoose.model('product', productModelSchema)
export default ProductModel;