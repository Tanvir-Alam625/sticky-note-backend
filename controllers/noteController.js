const { pool: DB } = require("../config/database");

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
    });
  }

  try {
    const [result] = await DB.execute(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        noteId: result.insertId,
        title,
        content,
      },
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating note",
    });
  }
};
const noteList = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [notes] = await DB.execute("SELECT * FROM notes WHERE user_id = ?", [
      userId,
    ]);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching notes",
    });
  }
};
const getSingleNote = async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  try {
    const [notes] = await DB.execute(
      "SELECT * FROM notes WHERE id = ? AND user_id = ?",
      [noteId, userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notes[0],
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching note",
    });
  }
};

module.exports = {
  createNote,
  noteList,
  getSingleNote,
};
