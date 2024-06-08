import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Dtabase connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(error);
    }
}

export default connectDB;