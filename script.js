// ✅ Global for intervals + voices
let typewriterInterval;
let availableVoices = [];

// ✅ Load voices properly ONCE
window.speechSynthesis.onvoiceschanged = () => {
  availableVoices = speechSynthesis.getVoices();
};

window.onload = () => {
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    window.location.href = window.location.href.split('#')[0];
    return;
  }

  const speakBtn = document.getElementById("speakBtn");
  const message = "Brought to you by the Event Managers Club, this is no ordinary competition — it’s a fight for survival. Face five heart-pounding challenges, each more intense than the previous, until it all culminates in a brutal PvP finale. Many worthy contenders. One champion. Spots are disappearing fast — register now and take your shot at glory.";
  const speechText = document.getElementById("speechText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const yesPopup = document.getElementById("yesPopup");
  const noPopup = document.getElementById("noPopup");
  const registerFurtherContainer = document.getElementById("registerFurtherContainer");
  const registerFurtherBtn = document.getElementById("registerFurtherBtn");
  const bgMusic = document.getElementById("bgMusic");
  const successMessage = document.getElementById("registerSuccessMessage");

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

    speakText(message);

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
    const repeatMessage = () => {
      if (count < 1) {
        speakText("Welcome to the game — your fate is now sealed. May the odds be ever in your favor! Register yourself now to prove your skills and claim your place among the legends.");
        count++;
      } else {
        clearInterval(intervalId);
      }
    };

    repeatMessage();
    const intervalId = setInterval(repeatMessage, 3000);

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
      speakText("Registration started, go ahead!");
      transfer();
    });
  });

  noBtn.addEventListener("click", () => {
    noPopup.style.display = "block";
    document.body.classList.add("blur-background", "red-blink");
    speakText("Choosing not to play means missing out — are you sure? For now, you’re Eliminated.");
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
