const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { createNote } = require("../controllers/noteController");

router.post("/", authenticateToken, createNote);

module.exports = router;
