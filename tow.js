let totalPlayers = 0;
let leftBulbs = [];
let rightBulbs = [];
let assignedPlayers = new Set();

function setupTeams() {
  totalPlayers = parseInt(document.getElementById("totalPlayers").value);
  if (isNaN(totalPlayers) || totalPlayers < 2 || totalPlayers % 2 !== 0) {
    alert("Please enter a valid even number of players.");
    return;
  }

  leftBulbs = [];
  rightBulbs = [];
  assignedPlayers.clear();
  document.getElementById("leftTeam").innerHTML = "<h3>Left Team</h3>";
  document.getElementById("rightTeam").innerHTML = "<h3>Right Team</h3>";
  document.getElementById("teamTableBody").innerHTML = "";

  const half = totalPlayers / 2;

  for (let i = 0; i < half; i++) {
    const bulbL = createBulb();
    document.getElementById("leftTeam").appendChild(bulbL);
    leftBulbs.push(bulbL);

    const bulbR = createBulb();
    document.getElementById("rightTeam").appendChild(bulbR);
    rightBulbs.push(bulbR);
  }

  document.getElementById("teamContainer").classList.remove("hidden");
  document.querySelector(".player-input").classList.remove("hidden");
}

function createBulb() {
  const wrapper = document.createElement("div");
  wrapper.className = "bulb";

  const label = document.createElement("div");
  label.className = "label";
  wrapper.appendChild(label);

  return wrapper;
}

function assignTeam() {
  const playerId = document.getElementById("playerId").value.trim();
  if (!playerId) {
    alert("Enter Player ID.");
    return;
  }

  if (assignedPlayers.has(playerId)) {
    alert("Player ID already assigned.");
    return;
  }

  let team = Math.random() < 0.5 ? "Left" : "Right";
  let targetArray = team === "Left" ? leftBulbs : rightBulbs;

  const available = targetArray.filter(bulb => !bulb.classList.contains("blinking"));

  if (available.length === 0) {
    // Try other team if this one is full
    team = team === "Left" ? "Right" : "Left";
    targetArray = team === "Left" ? leftBulbs : rightBulbs;
  }

  const finalAvailable = targetArray.filter(bulb => !bulb.classList.contains("blinking"));
  if (finalAvailable.length === 0) {
    alert("Both teams are full.");
    return;
  }

  const bulb = finalAvailable[0];
  bulb.classList.add("blinking");
  bulb.querySelector(".label").textContent = playerId;

  // Add to table
  const table = document.getElementById("teamTableBody");
  const row = table.insertRow();
  row.insertCell(0).textContent = playerId;
  row.insertCell(1).textContent = team;

  assignedPlayers.add(playerId);
  document.getElementById("playerId").value = "";

  // ✅ Send to Google Sheet
  sendTeamToGoogleSheet(playerId, team);

  // ✅ Show popup card
  showPopupCard(playerId, team);

  // ✅ Speak assignment
  speak(`Player ID ${playerId} is in ${team} team`);
}
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}
function showPopupCard(playerId, team) {
  // Create popup
  const popup = document.createElement("div");
  popup.className = "popup-card";
  popup.innerHTML = `<strong>Player ID:</strong> ${playerId}<br><strong>Team:</strong> ${team}`;

  document.body.appendChild(popup);

  // Remove after 3 seconds
  setTimeout(() => {
    popup.remove();
  }, 3000);
}
function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup-card";
  popup.textContent = message;

  document.getElementById("popupContainer").appendChild(popup);

  // Automatically remove after animation
  setTimeout(() => {
    popup.remove();
  }, 3000); // match animation duration
}


// ✅ Send data to Google Sheet
function sendTeamToGoogleSheet(playerId, team) {
  fetch(`https://script.google.com/macros/s/AKfycbwERGPo1BIZmyh9gnAIAU9fTuYGTo16DD4Yby9pETjy-1Y2wLPQsxTxPT7z2ahYgB7NLw/exec?path=team&playerId=${playerId}&team=${team}`, {
    method: "POST",
  })
    .then(response => response.text())
    .then(result => {
      console.log("Google Sheet response:", result);
    })
    .catch(error => {
      console.error("Error sending team data:", error);
    });
}
