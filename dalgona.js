// Speak in female voice
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Try to find a female English voice
    const femaleVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Google UK English Female") || v.name.includes("Microsoft Zira"));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// Preload voices for Chrome
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {};
}

// Background sound
const bgSound = new Audio('Squid Game OST - Pink Soldiers (Extended Ver.).mp3');
bgSound.loop = true;
bgSound.volume = 0.4;
bgSound.play().catch(() => {
  // Some browsers require user interaction first
  document.addEventListener('click', () => {
    bgSound.play();
  }, { once: true });
});

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

    // Add Text
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

document.getElementById("spinBtn").addEventListener("click", () => {
  const playerId = document.getElementById("playerId").value.trim();
  if (!playerId) return alert("Enter Player ID");

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

function addResultToTable(playerId, shape) {
  const tableBody = document.querySelector("#resultTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `<td>${playerId}</td><td>${shape}</td>`;
  tableBody.appendChild(row);

  let stored = JSON.parse(localStorage.getItem("results") || "[]");
  stored.push({ playerId, shape });
  localStorage.setItem("results", JSON.stringify(stored));
}

window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#resultTable tbody");
  const stored = JSON.parse(localStorage.getItem("results") || "[]");
  for (const entry of stored) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.playerId}</td><td>${entry.shape}</td>`;
    tableBody.appendChild(row);
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("results");
  document.querySelector("#resultTable tbody").innerHTML = "";
});
