// routes/index.js
const express = require('express');
const router = express.Router();
const {login,signup} = require('../controllers/authController');
const {getNotes,createNote,getNoteById,updateNoteById,deleteNoteById,searchNotes,shareNoteWithUser} = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');



router.post('/api/auth/signup', signup);
router.post('/api/auth/login',login);

// router.use(authMiddleware.authenticate);

router.get('/api/notes', getNotes);
router.post('/api/notes', createNote);
router.get('/api/notes/:id',getNoteById);
router.put('/api/notes/:id', updateNoteById);
router.delete('/api/notes/:id',deleteNoteById);
router.post('/notes/:id/share',shareNoteWithUser);
router.get('/notes/search', searchNotes);

module.exports = router;
