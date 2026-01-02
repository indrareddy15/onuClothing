import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
	timestamp: { type: Date, required: true },
	lat: { type: String, required: true },
	long: { type: String, required: true },
	city:{type: String},
	country: { type: String },
  	state: { type: String },
},{timestamps: true});

const Visit = mongoose.model('Visit', VisitSchema);

export default Visit;