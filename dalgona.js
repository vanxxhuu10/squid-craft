// 🔊 Speak Function (Female Voice)
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

// 🔊 Preload Voices
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {};
}

// 🔊 Background Sound
const bgSound = new Audio('Squid Game OST - Pink Soldiers (Extended Ver.).mp3');
bgSound.loop = true;
bgSound.volume = 0.4;
bgSound.play().catch(() => {
  document.addEventListener('click', () => bgSound.play(), { once: true });
});

// 🎯 Wheel Logic
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

// ✅ Pin Input Logic
const pinInput = document.getElementById("pinInput");
const playerIdBox = document.getElementById("playerId");
const resetBtn = document.getElementById("resetBtn");
let pinVerified = false;

window.addEventListener("DOMContentLoaded", () => {
  playerIdBox.disabled = true;
  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  const tableBody = document.querySelector("#resultTable tbody");

  if (stored.length > 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${stored[0].playerId}</td><td>${stored[0].shape}</td>`;
    tableBody.appendChild(row);
    playerIdBox.value = stored[0].playerId;
    playerIdBox.disabled = true;
  }
});

pinInput.addEventListener("input", function () {
  if (this.value === "9590") {
    pinVerified = true;
    playerIdBox.disabled = false;
    playerIdBox.focus();
    pinInput.style.borderColor = "#00ff88";
    pinInput.style.boxShadow = "0 0 15px #00ff88";
    resetBtn.disabled = false;
  } else {
    pinVerified = false;
    playerIdBox.disabled = true;
    pinInput.style.borderColor = "rgba(255,255,255,0.2)";
    pinInput.style.boxShadow = "none";
    resetBtn.disabled = true;
  }
});

// 🎰 Spin Button Logic
document.getElementById("spinBtn").addEventListener("click", () => {
  const playerId = playerIdBox.value.trim();
  if (!playerId) return alert("Enter Player ID");

  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  if (stored.length > 0) {
    if (stored[0].playerId !== playerId) {
      alert("You are only allowed to spin for your own Player ID.");
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

// 📋 Add Result to Table
function addResultToTable(playerId, shape) {
  const tableBody = document.querySelector("#resultTable tbody");
  tableBody.innerHTML = ""; // Ensure only one row

  const row = document.createElement("tr");
  row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
  tableBody.appendChild(row);

  localStorage.setItem("results", JSON.stringify([{ playerId, shape }]));
  playerIdBox.disabled = true;
}

// 📤 Send Data to Google Sheets
function sendToGoogleSheet(playerId, shape) {
  fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_URL_HERE/exec", {
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

// 🔁 Reset Button (Only if Pin is Verified)
resetBtn.addEventListener("click", () => {
  if (!pinVerified) {
    alert("Enter correct pin to reset.");
    return;
  }
  localStorage.removeItem("results");
  document.querySelector("#resultTable tbody").innerHTML = "";
  playerIdBox.value = "";
  playerIdBox.disabled = false;
  alert("Reset successful.");
});
