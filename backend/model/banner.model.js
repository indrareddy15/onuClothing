import mongoose from 'mongoose'

const bannerImagesSchema = new mongoose.Schema({
	CategoryType:String,// Wide,Mobile
	Header:String,
	Size:String,
	Url:[],

},{timestamps:true})

const BannerModel = mongoose.model('Banner.Images', bannerImagesSchema)
export default BannerModel;