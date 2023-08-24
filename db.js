import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const dbHost = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbDatabase = process.env.DB_DATABASE;

async function connectToMongo() {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbHost}:${dbPass}@cluster0.tfxyygf.mongodb.net/${dbDatabase}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Other MongoDB Atlas options here
      }
    );
    console.log("Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error);
    // Handle the error as needed
  }
}

export { connectToMongo };
