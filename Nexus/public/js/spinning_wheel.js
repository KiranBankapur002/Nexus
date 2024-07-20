const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');
const resultText = document.getElementById('result-text');

const activities = [
    "Get a good sleep!",
    "Eat healthy!",
    "Drink water!",
    "Code more!",
    "Dance break!",
    "Relax and rest!",
    "Enjoy a show!"
];

const colors = ['#4CAF50', '#FF9800', '#2196F3', '#FFEB3B', '#9C27B0', '#FF5722', '#795548'];
const numSegments = activities.length;
const anglePerSegment = 2 * Math.PI / numSegments;
let currentAngle = 0;
let spinTimeout;
let isSpinning = false;

function drawWheel() {
    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        ctx.beginPath();
        ctx.moveTo(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.arc(wheelCanvas.width / 2, wheelCanvas.height / 2, wheelCanvas.width / 2, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(activities[i], wheelCanvas.width / 2 - 20, 10);
        ctx.restore();
    }
}

function rotateWheel() {
    currentAngle += 0.1;
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
    ctx.rotate(currentAngle);
    ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
    drawWheel();
    ctx.restore();
    spinTimeout = requestAnimationFrame(rotateWheel);
}

function stopWheel() {
    cancelAnimationFrame(spinTimeout);
    const selectedIndex = Math.floor((numSegments - (currentAngle / anglePerSegment % numSegments)) % numSegments);
    const finalAngle = selectedIndex * anglePerSegment;
    const rotationToAdd = 2 * Math.PI * 5 + finalAngle - (currentAngle % (2 * Math.PI)); // Add multiple rotations for smooth stopping
    const totalDuration = 3000; // 3 seconds
    const startTime = performance.now();

    function animateToStop(now) {
        const elapsed = now - startTime;
        if (elapsed < totalDuration) {
            currentAngle += rotationToAdd * (elapsed / totalDuration) * (Math.PI / 180);
            ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
            ctx.save();
            ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
            ctx.rotate(currentAngle);
            ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(animateToStop);
        } else {
            currentAngle += rotationToAdd;
            currentAngle %= 2 * Math.PI;
            ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
            ctx.save();
            ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
            ctx.rotate(currentAngle);
            ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
            drawWheel();
            ctx.restore();
            resultText.textContent = activities[selectedIndex];
            resultDiv.classList.add('show');
            isSpinning = false;
        }
    }

    requestAnimationFrame(animateToStop);
}

spinButton.addEventListener('click', () => {
    if (!isSpinning) {
        resultDiv.classList.remove('show');
        isSpinning = true;
        rotateWheel();
        setTimeout(stopWheel, 1000); // Initial spinning time before starting deceleration
    }
});

drawWheel();
const menuToggle = document.getElementById("menu-toggle");
menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
});

