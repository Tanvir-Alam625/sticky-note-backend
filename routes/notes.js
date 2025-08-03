const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { createNote, noteList } = require("../controllers/noteController");

router.post("/", authenticateToken, createNote);
router.get("/", authenticateToken, noteList);

module.exports = router;
