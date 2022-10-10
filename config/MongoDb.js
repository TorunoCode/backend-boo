import mongoose from "mongoose";

const connectDatabase = async() =>{
    try{
        const connection = await mongoose.connect(process.env.CONNECTION_URL,{useUnifiedTopology:true,useNewUrlParser:true});
        console.log("Mongo Connected");
    } catch(error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
        if (err) console.error(err)


    }
};
export default connectDatabase;