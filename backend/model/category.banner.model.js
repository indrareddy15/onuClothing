import mongoose from 'mongoose'

const categoryBannerImage = new mongoose.Schema({
	CategoryType:String,
	Header:String,
	Url:[{
		url:String,
		name:String,
	}],

},{timestamps:true})

const CategoryBannerModel = mongoose.model('category.banner', categoryBannerImage)
export default CategoryBannerModel;