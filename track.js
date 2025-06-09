const totalPlayers = 20;
const gridContainer = document.getElementById("gridContainer");

// 🔗 Insert your 20 photo URLs here in order of Player 1 to 20
const playerPhotos = [
  "image1.jpeg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg",
  "https://example.com/photo4.jpg",
  "https://example.com/photo5.jpg",
  "https://example.com/photo6.jpg",
  "https://example.com/photo7.jpg",
  "https://example.com/photo8.jpg",
  "https://example.com/photo9.jpg",
  "https://example.com/photo10.jpg",
  "https://example.com/photo11.jpg",
  "https://example.com/photo12.jpg",
  "https://example.com/photo13.jpg",
  "https://example.com/photo14.jpg",
  "https://example.com/photo15.jpg",
  "https://example.com/photo16.jpg",
  "https://example.com/photo17.jpg",
  "https://example.com/photo18.jpg",
  "https://example.com/photo19.jpg",
  "https://example.com/photo20.jpg"
];

function createPlayers() {
  for (let i = 1; i <= totalPlayers; i++) {
    const tile = document.createElement("div");
    tile.classList.add("player-tile");
    tile.setAttribute("id", `player-${i}`);

    const img = document.createElement("img");
    img.src = playerPhotos[i - 1];
    img.alt = `Player ${i}`;

    const number = document.createElement("div");
    number.classList.add("player-number");
    number.textContent = `Player ${i}`;

    tile.appendChild(img);
    tile.appendChild(number);
    gridContainer.appendChild(tile);
  }
}

function eliminatePlayer() {
  const input = document.getElementById("eliminateInput");
  const playerNum = parseInt(input.value);

  if (!playerNum || playerNum < 1 || playerNum > totalPlayers) {
    alert("Enter a valid player number between 1 and 20.");
    return;
  }

  const playerTile = document.getElementById(`player-${playerNum}`);
  if (!playerTile || playerTile.classList.contains("eliminated")) {
    alert(`Player ${playerNum} is already eliminated.`);
    return;
  }

  playerTile.classList.add("eliminated");

  // Voice announcement
  const msg = new SpeechSynthesisUtterance(`Player ${playerNum} eliminated.`);
  msg.rate = 0.8;
  window.speechSynthesis.speak(msg);

  input.value = "";
}

createPlayers();

function eliminatePlayer() {
  const input = document.getElementById("eliminateInput");
  const playerNum = parseInt(input.value);

  if (!playerNum || playerNum < 1 || playerNum > totalPlayers) {
    alert("Enter a valid player number between 1 and 20.");
    return;
  }

  const playerTile = document.getElementById(`player-${playerNum}`);
  if (!playerTile || playerTile.classList.contains("eliminated")) {
    alert(`Player ${playerNum} is already eliminated.`);
    return;
  }

  // Get image and show popup
  const imgSrc = playerPhotos[playerNum - 1];
  const popup = document.getElementById("eliminationPopup");
  const popupImg = document.getElementById("popupImg");
  const popupText = document.getElementById("popupText");

  popupImg.src = imgSrc;
  popupText.textContent = `Player ${playerNum} Eliminated`;

  popup.style.display = "block";

  // Voice
  const msg = new SpeechSynthesisUtterance(`Player ${playerNum} eliminated.`);
  msg.rate = 0.8;
  window.speechSynthesis.speak(msg);

  // After animation, hide tile and popup
  setTimeout(() => {
    playerTile.classList.add("eliminated");
    popup.style.display = "none";
  }, 2000); // show popup for 2 seconds

  input.value = "";
}
