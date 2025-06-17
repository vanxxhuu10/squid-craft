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

  function getMaleVoice() {
    if (!availableVoices.length) return null;

    // ✅ Known male voice names by OS
    const maleVoiceNames = [
      "Microsoft David",
      "Microsoft Mark",
      "Alex",
      "Daniel",
      "Google UK English Male",
      "en-US-Wavenet-D" // for Google Cloud TTS if applicable
    ];

    // Try exact name match first
    for (const name of maleVoiceNames) {
      const voice = availableVoices.find(v => v.name === name);
      if (voice) return voice;
    }

    // Fallback: pick first English voice
    return availableVoices.find(v => v.lang.startsWith("en")) || null;
  }

  function speakText(text) {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    const maleVoice = getMaleVoice();
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    speechSynthesis.cancel(); // cancel any current speech
    speechSynthesis.speak(utterance);
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
