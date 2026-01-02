import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const optionSchema = new mongoose.Schema({
    name:{
		type:String,
		default:null,
		trim: true,
		match: /^[a-zA-Z\s]+$/,
		minlength: 3,
    },
    type: {
		type: String,
		required: true,
		enum: ['category', 'subcategory', 'color', 'clothingSize', 'gender'],
    },
    value: {
		type: String,
		required: true,
		unique: true,
    },
    isActive: {
		type: Boolean,
		default: true,
    }
}, { timestamps: true });

const Option = mongoose.model('Option', optionSchema);
export default Option;