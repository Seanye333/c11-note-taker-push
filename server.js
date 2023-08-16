// Import the required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// assigned port and express
const app = express();
const PORT = process.env.PORT || 3000;
// const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf-8'));

    // Assign a unique id to the new note
    newNote.id = notes.length.toString();
    
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));

    res.json(newNote);
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;
    const notesFilePath = path.join(__dirname, 'db', 'db.json');
    
    // Read the existing notes from the db.json file
    const notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf-8'));

    // Find the index of the note to delete
    const indexToDelete = notes.findIndex(note => note.id === noteIdToDelete);
    if (indexToDelete === -1) {
        return res.status(404).json({ error: 'Note not found.' });
    }

    // Remove the note from the array
    notes.splice(indexToDelete, 1);

    // Update the db.json file with the modified notes
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));

    res.json({ message: 'Note deleted successfully.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});