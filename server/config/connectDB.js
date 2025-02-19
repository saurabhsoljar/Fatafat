import mongoose from "mongoose";

if (!process.env.MONGODB_URI){
  throw new Error(
    "Please provide MONGODB_URI in the .env file"
  )
}