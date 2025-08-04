const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  createNote,
  noteList,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

// Middleware to authenticate token for all note routes
// This ensures that all routes in this file require authentication
router.use(authenticateToken);

// @route   POST /api/notes
// @desc    Create a new note or get all notes
// @access  Private
router.route("/").post(createNote).get(noteList);

// @route   GET /api/notes/:id
// @desc    Get, update, or delete a single note
// @access  Private
router.route("/:id").get(getSingleNote).put(updateNote).delete(deleteNote);

module.exports = router;
