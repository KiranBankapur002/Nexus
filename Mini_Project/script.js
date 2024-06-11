document.addEventListener('DOMContentLoaded', () => {
    showNotes();
});

function showNewNote() {
    document.getElementById('noteModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}

function saveNote() {
    const noteText = document.getElementById('noteText').value;
    if (noteText) {
        const note = document.createElement('div');
        note.className = 'note-card';
        note.innerText = noteText;
        document.getElementById('content').appendChild(note);
        document.getElementById('noteText').value = '';
        closeModal();
    }
}

function showNotes() {
    document.getElementById('content').innerHTML = '<h2>All Notes</h2>';
    // In a real app, you would load and display notes from storage
}

function showReminders() {
    document.getElementById('content').innerHTML = '<h2>Reminders</h2>';
}

function showArchive() {
    document.getElementById('content').innerHTML = '<h2>Archive</h2>';
}

function showTrash() {
    document.getElementById('content').innerHTML = '<h2>Trash</h2>';
}
