import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'


const userModelSchema = new mongoose.Schema({
    verify : {
        type: String,
        required: true,
        default: "unverified"
    },
	profilePic:{type:String,default:null},
    email:{
        type:String,
        validate:[validator.isEmail, 'Please enter valid Email ID ']
    },
    phoneNumber:{
        type:String,
    },

    password:{
        type:String
    },

    otp:String,

    name:{
        type:String
    },
    gender:{
        type:String
    },
    DOB:{
        type:Date,
		default:new Date()
    },
    addresses:[{
        type: mongoose.Schema.Types.Mixed, // Allows custom, flexible address fields
        default: []
    }],
    TOA:{
        type:String
    },
    role:{
        type:String,
        default:'user',
        enum: ['user','superAdmin','admin'], 
        required: true,
    }
},{timestamps:true})

userModelSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id}, process.env.SECRETID, {expiresIn: '2d'})
}

const User = mongoose.model('user', userModelSchema)
export default User;