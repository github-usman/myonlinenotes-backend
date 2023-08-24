import express, { json } from "express";
const router = express.Router();
import { fetchuser } from "../middleware/fetchuser.js";
import Note from "../models/Notes.js";
import { body, validationResult } from "express-validator";

// ROUTE  1: Get all the Notes using Get:/notes/fetchallnotes login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error show");
  }
});

// ROUTE 2: Add new NOtes using POST :/notes/addnotes login Required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 2 }),
    body("description", "Description must be atleast 5 char").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error add");
    }
  }
);

// ROUTE 3: Update NOtes using put :/notes/addnotes login Required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal  Server Error update");
  }
});

// ROUTE 4: delete NOtes using DELETE :/notes/addnotes login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
   
 

    // Find the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow user deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.send({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error delete");
  }
});

export default router;
