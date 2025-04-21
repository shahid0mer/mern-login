import mongoose from "mongoose";


const connectdb = async () => {
  mongoose.connection.on("connected", () => console.log("db conncted"));
  await mongoose.connect(`${process.env.MONGO_URI}/mern-auth-login-fsd`);
};

export default connectdb;
