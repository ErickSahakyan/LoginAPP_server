import mongoose from "mongoose";

const connect = async () => {
    mongoose.set('strictQuery', true)
    const db = await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@loginapp-cluster.u47iplb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Database Connected")
    return db;
}

export default connect;