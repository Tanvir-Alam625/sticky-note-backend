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

// Applying authentication middleware to all routes in this file
router.use(authenticateToken);

router.route("/").post(createNote).get(noteList);

router.route("/:id").get(getSingleNote).put(updateNote).delete(deleteNote);
module.exports = router;
