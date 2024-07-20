document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const noteId = this.dataset.noteId;
            deleteNote(noteId, this.closest('.notes-list').id);
        });
    });
});

function addNote(category) {
    const input = document.getElementById(`${category}-input`);
    const noteContent = input.value.trim();
    if (noteContent === '') return;

    const notesList = document.getElementById(`${category}-notes`);

    fetch('/home/matrix/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category,
            content: noteContent
        })
    })
    .then(response => response.json())
    .then(note => {
        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';
        noteBox.dataset.noteId = note._id;
        noteBox.innerHTML = `<p>${note.content}</p><button class="delete-btn" data-note-id="${note._id}">Delete</button>`;
        notesList.appendChild(noteBox);
        noteBox.querySelector('.delete-btn').addEventListener('click', function () {
            deleteNote(note._id, category);
        });
        input.value = '';
    })
    .catch(error => console.error('Error:', error));
}

function deleteNote(noteId, category) {
    fetch(`/home/matrix/delete/${noteId}`, {
        method: 'DELETE'
    })
    .then(() => {
        const noteBox = document.querySelector(`[data-note-id="${noteId}"]`);
        noteBox.remove();
    })
    .catch(error => console.error('Error:', error));
}
const menuToggle = document.getElementById("menu-toggle");
menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
});

