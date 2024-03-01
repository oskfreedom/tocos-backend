import { Application } from "express";
import mongoose from "mongoose";

export const connectDB = (app: Application) => {
  const connectAndRetry = async () => {
    const mongoURI =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI
        : process.env.MONGO_TEST_URI;
    if (!mongoURI) {
      console.error("MongoURI is not defined in the configuration.");
      return;
    }
    try {
      await mongoose.connect(mongoURI);
      if (process.env.NODE_ENV !== "test") {
        console.log("MongoDB is connected");
      }
      app.emit("ready");
    } catch (err: any) {
      console.log(err);
      console.error("Connection is failed, retry after 3s.");
      setTimeout(connectAndRetry, 3000);
    }
  };

  connectAndRetry();
};
