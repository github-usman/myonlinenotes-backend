import { connectToMongo } from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cors from "cors";
import axios from "axios"; // Add this import for making HTTP requests
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// MongoDB database connection
connectToMongo();

const app = express();

// Middleware to parse the request body into JSON
app.use(cors()); // For local hosting
app.use(express.json());

// HTTP request for the /greetings route
app.get("/greetings", async (req, res) => {
  try {
    // Return plain text response
    res.setHeader("Content-Type", "text/plain");
    res.send("Welcome to Schedula thanks");
  } catch (error) {
    console.error("Error generating plain text response:", error);
    res.status(500).send("Error generating plain text response");
  }
});


app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.listen(dbPort, () => {
  console.log(`App listening on port ${dbHost}${dbPort}`);
});
