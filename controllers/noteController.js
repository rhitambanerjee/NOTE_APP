// controllers/noteController.js
const Note = require('../models/note');

async function getNotes(req, res) {
  try {
    const userId = req.userId;
    const notes = await Note.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const note = new Note({ userId, title, content });
    await note.save();
    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNoteById(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateNoteById(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true } // Return the modified document
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteNoteById(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully', note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function searchNotes(req, res) {
  try {
    const userId = req.userId;
    const { query } = req.query;

    const notes = await Note.find({
      userId,
      $text: { $search: query },
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function shareNoteWithUser(req, res) {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;
    const { sharedUserId } = req.body;

    // Check if the note exists
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the user to be shared with exists
    const sharedUser = await User.findOne({ _id: sharedUserId });
    if (!sharedUser) {
      return res.status(404).json({ message: 'User to share with not found' });
    }

    // Check if the note is already shared with the user
    if (note.sharedWith.includes(sharedUserId)) {
      return res.status(400).json({ message: 'Note is already shared with this user' });
    }

    // Share the note with the user
    note.sharedWith.push(sharedUserId);
    await note.save();

    res.status(200).json({ message: 'Note shared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getNotes, createNote, getNoteById, updateNoteById, deleteNoteById,searchNotes,shareNoteWithUser };
