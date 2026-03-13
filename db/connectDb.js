import mongoose from "mongoose";
const connectDb = async () => {
    try{
        const conn = await mongoose.connect(`mongodb://localhost:27017/chai`,{
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: {conn.connection.host}`);
    }
    catch(error){
        // console.error(error.message);
        process.exist(1);
    }
}

export default connectDb;