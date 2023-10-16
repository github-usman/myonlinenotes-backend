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

// HTTP request for the /audio route
app.get("/audio", async (req, res) => {
  try {
    // Make an HTTP GET request to the external URL to fetch the audio data
    const response = await axios.get("https://s3-assets.stg.schedula.in/scripts/2264.wav", {
      responseType: "arraybuffer", // Request audio data as an array buffer
    });

    // Set the response headers for the audio file
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", response.data.length);

    // Send the audio data as the response
    res.end(response.data);
  } catch (error) {
    console.error("Error fetching audio:", error);
    res.status(500).send("Error fetching audio");
  }
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.listen(dbPort, () => {
  console.log(`App listening on port ${dbHost}${dbPort}`);
});
