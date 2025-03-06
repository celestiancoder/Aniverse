import mongoose from 'mongoose'

const connectDB=async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_URI!)

    } catch (error:any) {
        console.error(`Error: ${error.message}`)
        throw new Error(`Database connection failed: ${error.message}`);
    }
}


export default connectDB;