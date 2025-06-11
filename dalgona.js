// 🔊 Speak Function
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.name.includes("Female") ||
      v.name.includes("Google UK English Female") ||
      v.name.includes("Microsoft Zira")
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// 🔊 Background Sound
const bgSound = new Audio('Squid Game OST - Pink Soldiers (Extended Ver.).mp3');
bgSound.loop = true;
bgSound.volume = 0.4;
bgSound.play().catch(() => {
  document.addEventListener('click', () => bgSound.play(), { once: true });
});

// 🎯 Wheel Drawing
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

// ✅ DOM Elements
const pinInput = document.getElementById("pinInput");
const playerIdBox = document.getElementById("playerId");
const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.querySelector("#resultTable tbody");

let pinVerified = false;

// 🔁 Load Existing Data on Page Load
window.addEventListener("DOMContentLoaded", () => {
  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  if (stored.length > 0) {
    const { playerId, shape } = stored[0];
    const row = document.createElement("tr");
    row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
    tableBody.appendChild(row);
    playerIdBox.value = playerId;
    playerIdBox.disabled = true;
  }
});

// ✅ Pin Validation for Reset
pinInput.addEventListener("input", function () {
  if (this.value === "9590") {
    pinVerified = true;
    pinInput.style.borderColor = "#00ff88";
    pinInput.style.boxShadow = "0 0 15px #00ff88";
    resetBtn.disabled = false;
  } else {
    pinVerified = false;
    pinInput.style.borderColor = "rgba(255,255,255,0.2)";
    pinInput.style.boxShadow = "none";
    resetBtn.disabled = true;
  }
});

// 🎰 Spin Button
spinBtn.addEventListener("click", () => {
  const playerId = playerIdBox.value.trim();
  if (!playerId) return alert("Enter Player ID");

  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  if (stored.length > 0) {
    if (stored[0].playerId !== playerId) {
      alert("Only one attempt allowed per device. You can't change Player ID.");
      return;
    } else {
      alert("You have already spun the wheel.");
      return;
    }
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
      speak(`Player ${playerId}, you are allotted ${shape}`);
      sendToGoogleSheet(playerId, shape);
    }
  }

  requestAnimationFrame(animateSpin);
});

// 📋 Add Result to Table and Store
function addResultToTable(playerId, shape) {
  tableBody.innerHTML = ""; // Only 1 row allowed
  const row = document.createElement("tr");
  row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
  tableBody.appendChild(row);
  localStorage.setItem("results", JSON.stringify([{ playerId, shape }]));
  playerIdBox.disabled = true;
}

// 📤 Send to Google Sheet
function sendToGoogleSheet(playerId, shape) {
  fetch("https://script.google.com/macros/s/AKfycbyDaJPcWYkoNbjNujqvW1gHD579GMtg4CeDi_aPBGXK9knUKVntSiXwzPrbDbGlbAlvWg/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      path: "shape",
      playerId: playerId,
      shape: shape
    })
  });
}

// 🔁 Reset (Requires Correct Pin)
resetBtn.addEventListener("click", () => {
  if (!pinVerified) {
    alert("Enter correct pin to reset.");
    return;
  }
  localStorage.removeItem("results");
  tableBody.innerHTML = "";
  playerIdBox.disabled = false;
  playerIdBox.value = "";
  alert("Reset successful.");
});

document.getElementById('sendScreenshotBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('screenshotInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      const response = await fetch('https://squid-craft.onrender.com/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      document.getElementById('uploadStatus').textContent = result.message;
    } catch (error) {
      document.getElementById('uploadStatus').textContent = 'Error sending screenshot.';
    }
  });