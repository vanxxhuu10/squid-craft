// ---------------------- Voice Announcement ----------------------
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();
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

// Ensure voices load on Chrome
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}

// ---------------------- Background Sound ----------------------
const bgSound = new Audio('Squid Game OST - Pink Soldiers (Extended Ver.).mp3');
bgSound.loop = true;
bgSound.volume = 0.4;
bgSound.play().catch(() => {
  document.addEventListener('click', () => bgSound.play(), { once: true });
});

// ---------------------- Wheel Setup ----------------------
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

    // Text
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

// ---------------------- Spin Button Logic ----------------------
document.getElementById("spinBtn").addEventListener("click", () => {
  const playerIdBox = document.getElementById("playerId");
  const playerId = playerIdBox.value.trim();

  if (playerIdBox.disabled) {
    return alert("Enter correct PIN to unlock Player ID");
  }

  if (!playerId) {
    return alert("Enter Player ID");
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
    }
  }

  requestAnimationFrame(animateSpin);
});

// ---------------------- Result Table ----------------------
function addResultToTable(playerId, shape) {
  const tableBody = document.querySelector("#resultTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
  tableBody.appendChild(row);

  let stored = JSON.parse(localStorage.getItem("results") || "[]");
  stored.push({ playerId, shape });
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

  localStorage.setItem("results", JSON.stringify(stored));
}

// ---------------------- Reset Button ----------------------
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("results");
  document.querySelector("#resultTable tbody").innerHTML = "";
});

// ---------------------- PIN Box Unlock Logic ----------------------
document.getElementById("pinInput").addEventListener("input", function () {
  const pinBox = this;
  const playerIdBox = document.getElementById("playerId");

  if (pinBox.value === "9590") {
    playerIdBox.disabled = false;
    playerIdBox.focus();
    pinBox.style.borderColor = "#00ff88";
    pinBox.style.boxShadow = "0 0 15px #00ff88";
  } else {
    playerIdBox.disabled = true;
    pinBox.style.borderColor = "rgba(255, 255, 255, 0.2)";
    pinBox.style.boxShadow = "none";
  }
});

// ---------------------- On Page Load ----------------------
window.addEventListener("DOMContentLoaded", () => {
  // Disable Player ID input initially
  document.getElementById("playerId").disabled = true;

  // Restore table from local storage
  const tableBody = document.querySelector("#resultTable tbody");
  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  for (const entry of stored) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.playerId}</td><td>${entry.shape}</td>`;
    tableBody.appendChild(row);
  }
});
