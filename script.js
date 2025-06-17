// ✅ Global for intervals
let typewriterInterval;

window.onload = () => {
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    window.location.href = window.location.href.split('#')[0];
    return;
  }

  const speakBtn = document.getElementById("speakBtn");
  const message = "Hosted by the Event Managers Club, this is no ordinary competition. Conquer five thrilling challenges and a fierce PvP finale. Many contenders, one champion. Spots are limited — register now and claim your shot at glory!";
  const speechText = document.getElementById("speechText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const yesPopup = document.getElementById("yesPopup");
  const noPopup = document.getElementById("noPopup");
  const registerFurtherContainer = document.getElementById("registerFurtherContainer");
  const registerFurtherBtn = document.getElementById("registerFurtherBtn");
  const bgMusic = document.getElementById("bgMusic");
  const successMessage = document.getElementById("registerSuccessMessage");

  // ✅ Custom audios
  const mainVoice = new Audio("audio.mp3");
  const successAudio = new Audio("success.mp3");
  const eliminationAudio = new Audio("eliminated.mp3");
  const proceedAudio = new Audio("proceed.mp3");

  function typeText(text, callback) {
    speechText.textContent = "";
    let i = 0;
    clearInterval(typewriterInterval);
    typewriterInterval = setInterval(() => {
      speechText.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typewriterInterval);
        if (callback) callback();
      }
    }, 50);
  }

  function speakNow() {
    typeText(message, () => {
      document.getElementById("registerSection").style.display = "block";
    });

    // ✅ Play your main audio.mp3
    mainVoice.currentTime = 0;
    mainVoice.play().catch(() => {});

    // ✅ Play background music
    bgMusic.volume = 0.2;
    bgMusic.play().catch(() => {});
  }

  speakBtn.addEventListener("click", () => {
    speakNow();
  });

  yesBtn.addEventListener("click", () => {
    yesPopup.style.display = "block";
    document.body.classList.add("blur-background");

    let count = 0;
    const playSuccessAudio = () => {
      if (count < 1) {
        successAudio.currentTime = 0;
        successAudio.play().catch(() => {});
        count++;
      } else {
        clearInterval(intervalId);
      }
    };

    playSuccessAudio();
    const intervalId = setInterval(playSuccessAudio, 3000);

    setTimeout(() => {
      yesPopup.style.display = "none";
      document.body.classList.remove("blur-background");
      registerFurtherContainer.style.display = "block";
    }, 5000);

    registerFurtherBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      document.body.classList.remove("blur-background");
      registerFurtherBtn.textContent = "Registration Started ✅";
      successMessage.style.display = "block";
      proceedAudio.currentTime = 0;
      proceedAudio.play().catch(() => {});
      transfer();
    });
  });

  noBtn.addEventListener("click", () => {
    noPopup.style.display = "block";
    document.body.classList.add("blur-background", "red-blink");
    eliminationAudio.currentTime = 0;
    eliminationAudio.play().catch(() => {});
  });

  const shapes = document.querySelectorAll(".shape");
  shapes.forEach(shape => {
    shape.style.animationDuration = `${Math.random() * 6 + 1}s`;
    shape.style.animationDelay = `${Math.random() * 5}s`;

    setInterval(() => {
      const xPos = Math.random() * 60 - 30;
      shape.style.transform = `translate(${xPos}px, 0)`;
    }, Math.random() * 4000 + 3000);
  });
};

// ✅ Google Form transfer function
function transfer() {
  window.location.href = "https://forms.gle/wq7do4ncdPCNAB2d6";
}
