// ✅ Speak
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}

// ✅ Background sound
const bgSound = new Audio('Squid Game OST - Pink Soldiers (Extended Ver.).mp3');
bgSound.loop = true;
bgSound.volume = 0.4;
bgSound.play().catch(() => {
  document.addEventListener('click', () => bgSound.play(), { once: true });
});

// ✅ Wheel & spin
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const shapes = ["Circle", "Star", "Triangle", "Umbrella"];
const colors = ["#ff5e57", "#ffc048", "#32ff7e", "#18dcff"];
const radius = 200;
let currentRotation = 0;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const anglePerShape = (2 * Math.PI) / shapes.length;

  for (let i = 0; i < shapes.length; i++) {
    const startAngle = currentRotation + i * anglePerShape;
    const endAngle = startAngle + anglePerShape;

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, radius, startAngle, endAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(startAngle + anglePerShape / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(shapes[i], radius - 10, 10);
    ctx.restore();
  }
}

drawWheel();

const pinInput = document.getElementById("pinInput");
const playerIdBox = document.getElementById("playerId");
const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.querySelector("#resultTable tbody");

let pinVerified = false;

window.addEventListener("DOMContentLoaded", () => {
  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  if (stored.length > 0) {
    const { playerId, shape } = stored[0];
    addResultToTable(playerId, shape);
    playerIdBox.value = playerId;
    playerIdBox.disabled = true;
  }
});

pinInput.addEventListener("input", function () {
  if (this.value === "9590") {
    pinVerified = true;
    resetBtn.disabled = false;
  } else {
    pinVerified = false;
    resetBtn.disabled = true;
  }
});

spinBtn.addEventListener("click", () => {
  const playerId = playerIdBox.value.trim();
  if (!playerId) return alert("Enter Player ID");

  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  if (stored.length > 0 && stored[0].playerId !== playerId) {
    alert("Only one attempt allowed per device.");
    return;
  }

  const selectedIndex = Math.floor(Math.random() * shapes.length);
  const anglePerShape = 360 / shapes.length;
  const randomTurns = Math.floor(Math.random() * 3) + 3;
  const finalAngle = 360 * randomTurns + (360 - selectedIndex * anglePerShape) - anglePerShape / 2;
  const finalRadians = finalAngle * (Math.PI / 180);
  const duration = 3000;
  const startTime = performance.now();

  function animateSpin(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentRotation = finalRadians * easeOut;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      const shape = shapes[selectedIndex];
      addResultToTable(playerId, shape);
      speak(`Player ${playerId}, you got ${shape}`);
      sendToGoogleSheet(playerId, shape, "");
    }
  }

  requestAnimationFrame(animateSpin);
});

function addResultToTable(playerId, shape) {
  tableBody.innerHTML = "";
  const row = document.createElement("tr");
  row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
  tableBody.appendChild(row);
  localStorage.setItem("results", JSON.stringify([{ playerId, shape }]));
  playerIdBox.disabled = true;
}

function sendToGoogleSheet(playerId, shape, link) {
  fetch("https://script.google.com/macros/s/AKfycbzs7RssJbAq7xwzNev3UQiKungjM7BuHQyeWovQVIwuM0pG4x09tyWzfbL2V9jWgZEBPA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      path: "shape",
      playerId: playerId,
      shape: shape,
      link: link || ""
    })
  });
}

resetBtn.addEventListener("click", () => {
  if (!pinVerified) {
    alert("Enter correct pin to reset.");
    return;
  }
  localStorage.removeItem("results");
  tableBody.innerHTML = "";
  playerIdBox.disabled = false;
  playerIdBox.value = "";
  alert("Reset done!");
});

document.getElementById('sendScreenshotBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('screenshotInput');
  const file = fileInput.files[0];
  const playerId = document.getElementById('playerId').value.trim();

  if (!file) {
    alert('Please select an image file to upload.');
    return;
  }
  if (!playerId) {
    alert('Please enter your Player ID.');
    return;
  }

  const formData = new FormData();
  formData.append('screenshot', file);
  formData.append('playerId', playerId);

  try {
    // 🔗 Send to your Node.js server (/upload)
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    // ✅ Show status
    document.getElementById('uploadStatus').textContent = result.message;

    // 🔗 Optional: save to Google Sheet if needed
    const stored = JSON.parse(localStorage.getItem('results') || '[]');
    const shape = stored.length > 0 ? stored[0].shape : '';

    if (result.success && result.link) {
      sendToGoogleSheet(playerId, shape, result.link);
    }

  } catch (err) {
    console.error('❌ Upload failed:', err);
    document.getElementById('uploadStatus').textContent = '❌ Failed to upload screenshot.';
  }
});

