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

let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds

const displayTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const startTimer = () => {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        timeLeft--;
        displayTime();
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alert('Time for a break!');
            timeLeft = 300; // 5 minutes break
            startTimer();
        }
    }, 1000);
};

const resetTimer = () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500; // Reset to 25 minutes
    displayTime();
};

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

displayTime();

