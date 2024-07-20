document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const searchInput = document.getElementById("search-input");
    const noteBoxes = document.querySelectorAll('.note-box');

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterNotes(query);
    });

    // Function to filter notes based on search query
    function filterNotes(query) {
        noteBoxes.forEach(noteBox => {
            const title = noteBox.querySelector('h2').textContent.toLowerCase();
            const content = noteBox.querySelector('p').textContent.toLowerCase();
            if (title.includes(query) || content.includes(query)) {
                noteBox.style.display = 'block';
            } else {
                noteBox.style.display = 'none';
            }
        });
    }

});

const unarchiveButtons = document.querySelectorAll('.unarchive-btn');
unarchiveButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const noteId = event.target.dataset.noteId;
        unarchiveNote(noteId);
    });
});

async function unarchiveNote(noteId) {
    try {
        console.log(noteId);
        const response = await fetch(`/home/${noteId}/unarchive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(`Archived note with ID: ${noteId}`);
            document.querySelector(`.note-box[data-note-id="${noteId}"]`).remove();
        } else {
            console.error('Failed to archive note');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const searchInput = document.getElementById("search-input");

searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    noteBoxes.forEach(noteBox => {
        const title = noteBox.querySelector('h2').textContent.toLowerCase();
        const content = noteBox.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || content.includes(query)) {
            noteBox.style.display = 'block';
        } else {
            noteBox.style.display = 'none';
        }
    });
});