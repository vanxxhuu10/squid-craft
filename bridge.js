let currentSegments = [];
let rotation = 0;
let isSpinning = false;
const radius = 200;
const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");

window.onload = () => {
  loadFromStorage();
  drawWheel();
};

function generateWheel() {
  const total = parseInt(document.getElementById("totalPlayers").value);
  if (isNaN(total) || total < 2) {
    alert("Enter a valid number (minimum 2).");
    return;
  }
  const assigned = JSON.parse(localStorage.getItem("allotments") || "[]");
  const alreadyUsedNumbers = assigned.map(entry => entry.number);
  currentSegments = Array.from({ length: total }, (_, i) => i + 1).filter(n => !alreadyUsedNumbers.includes(n));
  saveToStorage();
  drawWheel();
}

function drawWheel() {
  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  if (!currentSegments.length) return;

  const angleStep = (2 * Math.PI) / currentSegments.length;
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate((rotation * Math.PI) / 180);

  for (let i = 0; i < currentSegments.length; i++) {
    const angle = i * angleStep;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, angle, angle + angleStep);
    ctx.fillStyle = `hsl(${(i * 360) / currentSegments.length}, 70%, 60%)`;
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.stroke();

    // Draw label
    ctx.save();
    ctx.rotate(angle + angleStep / 2);
    ctx.translate(radius - 40, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(currentSegments[i], 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function spinWheel() {
  if (isSpinning) return;

  const playerId = document.getElementById("playerId").value.trim();
  if (!playerId) {
    alert("Enter a Player ID.");
    return;
  }

  if (!currentSegments.length) {
    alert("No more numbers left to assign.");
    return;
  }

  const assigned = JSON.parse(localStorage.getItem("allotments") || "[]");
  if (assigned.find(p => p.playerId === playerId)) {
    alert("This Player ID already got a number.");
    return;
  }

  isSpinning = true;

  const segmentAngle = 360 / currentSegments.length;
  const randomIndex = Math.floor(Math.random() * currentSegments.length);
  const selectedNumber = currentSegments[randomIndex];

  const stopAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
  const totalSpins = 6;
  const finalRotation = totalSpins * 360 + stopAngle;

  animateSpin(rotation, finalRotation, 3000, () => {
    addToTable(playerId, selectedNumber);
    currentSegments.splice(randomIndex, 1);
    saveToStorage();
    drawWheel();
    isSpinning = false;
  });
}

function animateSpin(startAngle, endAngle, duration, onComplete) {
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    rotation = startAngle + (endAngle - startAngle) * easeOut;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      rotation %= 360;
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

function addToTable(playerId, number) {
  const table = document.querySelector("#allotmentTable tbody");
  const row = table.insertRow();
  row.insertCell(0).textContent = playerId;
  row.insertCell(1).textContent = number;

  const existing = JSON.parse(localStorage.getItem("allotments") || "[]");
  existing.push({ playerId, number });
  localStorage.setItem("allotments", JSON.stringify(existing));

  // ✅ Send to Google Sheet (Bridge Number)
  sendToGoogleSheet(playerId, number);
}

function loadFromStorage() {
  const saved = JSON.parse(localStorage.getItem("allotments") || "[]");
  const table = document.querySelector("#allotmentTable tbody");
  table.innerHTML = "";
  for (const entry of saved) {
    const row = table.insertRow();
    row.insertCell(0).textContent = entry.playerId;
    row.insertCell(1).textContent = entry.number;
  }

  const total = parseInt(document.getElementById("totalPlayers").value);
  if (!isNaN(total)) {
    const usedNumbers = saved.map(e => e.number);
    currentSegments = Array.from({ length: total }, (_, i) => i + 1).filter(n => !usedNumbers.includes(n));
  }
}

function saveToStorage() {
  localStorage.setItem("currentSegments", JSON.stringify(currentSegments));
}

function resetGame() {
  if (confirm("Are you sure you want to reset everything?")) {
    localStorage.removeItem("allotments");
    localStorage.removeItem("currentSegments");
    currentSegments = [];
    rotation = 0;
    drawWheel();
    document.querySelector("#allotmentTable tbody").innerHTML = "";
  }
}

// ✅ Sends data to your Google Apps Script to update the Bridge column
function sendToGoogleSheet(playerId, number) {
  const formData = new URLSearchParams();
  formData.append("path", "bridge");
  formData.append("playerId", playerId);
  formData.append("number", number);

  fetch("https://script.google.com/macros/s/AKfycbyW2z6WqI3noldFgBSzHpHMpGqhC6CXjDNXyOPbtMusFP6K2Rajzg2fs8OS6nVqaLlHUg/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })
  .then(res => res.text())
  .then(response => {
    console.log("Google Sheet Response:", response);
  })
  .catch(err => {
    console.error("Failed to update Google Sheet", err);
  });
}
