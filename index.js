import { connectToMongo } from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Import the 'path' module

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// MongoDB database connection
connectToMongo();

const app = express();

app.use(cors());
app.use(express.json());

// Define a route for serving the audio file
app.get("/audio", (req, res) => {
  // Set the content type to "audio/wav"
  res.set('Content-Type', 'audio/wav');

  // Send the audio file
  const audioFilePath = path.join(__dirname, '2264.wav');
  res.sendFile(audioFilePath);
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.listen(dbPort, () => {
  console.log(`App listening on port ${dbHost}${dbPort}`);
});
