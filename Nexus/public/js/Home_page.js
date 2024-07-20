document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const searchInput = document.getElementById("search-input");
    const noteBoxes = document.querySelectorAll('.note-box');
    const addBtn = document.querySelector('.add-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const archiveButtons = document.querySelectorAll('.archive-btn');
    const editModal = document.getElementById('edit-note-modal');
    const editForm = editModal.querySelector('form');
    const editTitle = editModal.querySelector('#edit-title');
    const editContent = editModal.querySelector('#edit-content');
    const spinner = document.getElementById('spinner');
    const spinButton = document.getElementById('spin-button');
    const resultText = document.getElementById('result-text');
    const resultDiv = document.getElementById('result');


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

    addBtn.addEventListener('click', async () => {
        const title = document.querySelector('#add-title').value;
        const content = document.querySelector('#add-content').value;
        console.log(title, content); // Debug
        try {
            const response = await fetch('/home/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });
            if (response.ok) {
                window.location.href = '/home';
            } else {
                console.error('Failed to add note', response);
            }
        } catch (err) {
            console.error(err);
        }
    });

    editBtns.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const noteId = btn.dataset.noteId;
            console.log('Editing note ID:', noteId); // Debug
            try {
                const response = await fetch(`/home/edit/${noteId}`, {
                    method: 'GET',
                });
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const note = await response.json();
                        console.log('Fetched note data:', note); // Debug
                        editTitle.value = note.title;
                        editContent.value = note.content;
                        editModal.style.display = 'block';
                        editForm.onsubmit = async (e) => {
                            e.preventDefault();
                            const updatedTitle = editTitle.value;
                            const updatedContent = editContent.value;
                            try {
                                const updateResponse = await fetch(`/home/edit/${noteId}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
                                });
                                if (updateResponse.ok) {
                                    window.location.href = '/home';
                                } else {
                                    console.error('Failed to update note', updateResponse);
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        };
                    } else {
                        const html = await response.text();
                        document.open();
                        document.write(html);
                        document.close();
                    }
                } else {
                    console.error('Failed to fetch note', response);
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const noteId = btn.dataset.noteId;
            console.log('Deleting note ID:', noteId); // Debug
            try {
                const response = await fetch(`/home/delete/${noteId}`, {
                    method: 'POST',
                });
                if (response.ok) {
                    window.location.href = '/home';
                } else {
                    console.error('Failed to delete note', response);
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    archiveButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.dataset.noteId;
            archiveNote(noteId);
        });
    });

    async function archiveNote(noteId) {
        try {
            console.log(noteId);
            const response = await fetch(`/home/${noteId}/archive`, {
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

    // Search functionality
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

  spinButton.addEventListener('click', function () {
    // Disable the button temporarily to prevent multiple spins
    spinButton.disabled = true;

    // Simulate a random spin result
    const sectors = ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5"];
    const randomIndex = Math.floor(Math.random() * sectors.length);
    const randomSector = sectors[randomIndex];

    // Rotate the spinner
    spinner.style.animation = 'none';
    setTimeout(function () {
      spinner.style.animation = 'spin 4s linear infinite';
    }, 100);

    // Show result after delay
    setTimeout(function () {
      resultText.textContent = `You landed on: ${randomSector}`;
      resultDiv.classList.add('show');
      spinButton.disabled = false;
    }, 4000); // Adjust time as per your animation duration
  });
});

