// public/js/voice_notes.js

document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-btn');
    const noteTextarea = document.getElementById('note-textarea');
    const notesList = document.getElementById('notes-list');
    const saveBtn = document.getElementById('save-btn');

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            noteTextarea.value = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };
    } else {
        alert('Your browser does not support speech recognition. Please try using Google Chrome.');
    }

    saveBtn.addEventListener('click', () => {
        const noteContent = noteTextarea.value.trim();
        if (noteContent) {
            fetch('/home/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: noteContent }),
            })
            .then(response => response.json())
            .then(note => {
                const noteBox = document.createElement('div');
                noteBox.className = 'note-box';
                noteBox.dataset.noteId = note._id;
                noteBox.innerHTML = `<p>${note.content}</p>`;
                notesList.appendChild(noteBox);
                noteTextarea.value = '';
            })
            .catch(error => console.error('Error:', error));
        }
    });
});
