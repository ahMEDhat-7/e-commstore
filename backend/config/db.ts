import mongoose from "mongoose";

export default async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    const connect = await mongoose.connect(mongoUrl);
    console.log(
      `[+] MongoDB connected successfully at ${connect.connection.host}`
    );
  } catch (error) {
    console.log("[-] Unable to connect to MongoDB ", error);
  }
};
