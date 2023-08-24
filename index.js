import { connectToMongo } from "./db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// MongoDB database connection
connectToMongo();

const app = express();

// middleware to parse the   object into json are follow helper

app.use(cors()); // for local hosting
app.use(express.json());

// http requestion get method root
app.get("/", (req, res) => {
  res.send(
    "Welcome! Backend for myonlinenotes website is working, please visit https://myonlinenotes.netlify.app/ for client side"
  );
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.listen(dbPort, () => {
  console.log(`App listening on port ${dbHost}${dbPort}`);
});
