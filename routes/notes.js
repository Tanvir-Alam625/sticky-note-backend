const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { createNote, noteList } = require("../controllers/noteController");

router.post("/", authenticateToken, createNote);
router.get("/", authenticateToken, noteList);
router.get("/:id", authenticateToken, getSingleNote)
router.put("/:id", authenticateToken, updateNote);
router.delete("/:id", authenticateToken, deleteNote);
module.exports = router;
