const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const authenticateJWT = require('../middleware/jwt');

// Get all notes
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ isArchived: false, user: req.user.id }).sort({ createdAt: -1 });
    res.render('home', { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get archived notes
router.get('/archive', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ isArchived: true, user: req.user.id }).sort({ createdAt: -1 });
    res.render('archive', { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.json(note);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch note' });
  }
});

// Update a note
router.post('/edit/:id', async (req, res) => {
  try {
      const noteId = req.params.id;
      const { title, content } = req.body;
      const updatedNote = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
      if (!updatedNote) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.json(updatedNote);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update note' });
  }
});

// Archive a note
router.post('/:id/archive', authenticateJWT, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    note.isArchived = true;
    await note.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Unarchive a note
router.post('/:id/unarchive', authenticateJWT, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    note.isArchived = false;
    await note.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new note
router.post('/add', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  const user = req.user.id;
  try {
    await Note.create({ title, content, user });
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a note
router.post('/delete/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    await Note.findByIdAndDelete(id);
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/wheel', function (req, res) {
  res.render('spinning_wheel');
});
router.get('/home/matrix', async (req, res) => {
  const urgentImportantNotes = await Note.find({ category: 'urgent-important' });
  const notUrgentImportantNotes = await Note.find({ category: 'not-urgent-important' });
  const urgentNotImportantNotes = await Note.find({ category: 'urgent-not-important' });
  const notUrgentNotImportantNotes = await Note.find({ category: 'not-urgent-not-important' });
  res.render('eisenhower_matrix', { urgentImportantNotes, notUrgentImportantNotes, urgentNotImportantNotes, notUrgentNotImportantNotes });
});

router.post('/add-note', async (req, res) => {
  const { category, content } = req.body;
  const newNote = new Note({
      category,
      content
  });
  await newNote.save();
  res.json(newNote);
});

router.delete('/delete-note/:id', async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.sendStatus(200);
});
router.get('/matrix', authenticateJWT, async (req, res) => {
  try {
      const userId = req.user.id;
      const urgentImportantNotes = await Note.find({ category: 'urgent-important', user: userId });
      const notUrgentImportantNotes = await Note.find({ category: 'not-urgent-important', user: userId });
      const urgentNotImportantNotes = await Note.find({ category: 'urgent-not-important', user: userId });
      const notUrgentNotImportantNotes = await Note.find({ category: 'not-urgent-not-important', user: userId });
      res.render('eisenhower_matrix', { urgentImportantNotes, notUrgentImportantNotes, urgentNotImportantNotes, notUrgentNotImportantNotes });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

// Add a note to the Eisenhower Matrix
router.post('/matrix/add', authenticateJWT, async (req, res) => {
  const { category, content } = req.body;
  const userId = req.user.id;
  try {
      const newNote = new Note({
          category,
          content,
          user: userId
      });
      await newNote.save();
      res.json(newNote);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

// Delete a note from the Eisenhower Matrix
router.delete('/matrix/delete/:id', authenticateJWT, async (req, res) => {
  try {
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
      if (!note || note.user.toString() !== req.user.id.toString()) {
          return res.status(404).send('Note not found or unauthorized');
      }
      await Note.findByIdAndDelete(noteId);
      res.sendStatus(200);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});
// Route to serve the voice note-taking page
router.get('/voice', authenticateJWT, (req, res) => {
  res.render('voice', { user: req.user });
});

// Route to add a new note
router.post('/add', authenticateJWT, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  try {
      const newNote = new Note({
          content,
          user: userId,
      });
      await newNote.save();
      res.json(newNote);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});
// Route to render the Focus Timer page
router.get('/focus_timer', (req, res) => {
  res.render('focus_timer'); // Ensure 'focus_timer' is your correct EJS file name
});
module.exports = router;
