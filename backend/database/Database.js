import mongoose from 'mongoose'

const connectdatabse = async ()=>{
    try {
        mongoose.set('strictQuery',false);
        const data = await mongoose.connect(process.env.DB_URI,{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 30000,  // Increase timeout limit (default is 30000 ms)
		});
        console.log(`Database connected ${data.connection.host}`)
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
    }
}

export default connectdatabse