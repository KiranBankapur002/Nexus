document.getElementById('start-timer').addEventListener('click', function () {
    const minutesInput = document.getElementById('minutes');
    let time = parseInt(minutesInput.value) * 60;

    const timerDisplay = document.getElementById('timer-display');
    updateDisplay(time);

    const interval = setInterval(function () {
        time--;

        if (time >= 0) {
            updateDisplay(time);
        } else {
            clearInterval(interval);
            timerDisplay.textContent = "Time's up!";
        }
    }, 1000);
});

function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    document.getElementById('timer-display').textContent = `${displayMinutes}:${displaySeconds}`;
}
const menuToggle = document.getElementById("menu-toggle");
menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
});

