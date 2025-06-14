window.onload = () => {
  const speakBtn = document.getElementById("speakBtn");
  const message = "Squid Game — Minecraft Edition! Brought to you by the Event Managers Club, this is your shot at glory: six adrenaline-packed challenges, from Red Light, Green Light to parkour and a fierce PvP finale. Sixty contenders, one champion. Spots are few — register now and claim your chance to outwit and outlast the rest!";
  const speechText = document.getElementById("speechText");
  const countdownElem = document.getElementById("countdownTimer");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const yesPopup = document.getElementById("yesPopup");
  const noPopup = document.getElementById("noPopup");
  const registerFurtherContainer = document.getElementById("registerFurtherContainer");
  const registerFurtherBtn = document.getElementById("registerFurtherBtn");
  const bgMusic = document.getElementById("bgMusic");
  const successMessage = document.getElementById("registerSuccessMessage");

  // ✅ Make sure voices are loaded for mobile
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };

  function typeText(text, callback) {
    speechText.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      speechText.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 50);
  }

  function speakNow() {
    typeText(message, () => {
      document.getElementById("registerSection").style.display = "block";
    });

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    speechSynthesis.cancel(); // Stops any previous utterances
    speechSynthesis.speak(utterance);

    // Countdown Timer
    let timeLeft = 600;
    countdownElem.textContent = `Time left: ${timeLeft}s`;
    const countdownInterval = setInterval(() => {
      timeLeft--;
      countdownElem.textContent = `Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownElem.textContent = "";
      }
    }, 1000);
  }

  // ✅ Always bind immediately so mobile click triggers both audio + voice
  speakBtn.addEventListener("click", () => {
    speakNow();
    bgMusic.volume = 0.2;
    bgMusic.play().catch(() => {});
  });

  // ✅ YES Button
  yesBtn.addEventListener("click", () => {
    yesPopup.style.display = "block";
    document.body.classList.add("blur-background");

    let count = 0;
    const repeatMessage = () => {
      if (count < 1) {
        const msg = new SpeechSynthesisUtterance("Welcome to the game — your fate is now sealed. May the odds be ever in your favor! Register yourself now to prove your skills and claim your place among the legends.");
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith("en"));
        if (englishVoice) msg.voice = englishVoice;
        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
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

      const confirmation = new SpeechSynthesisUtterance("Registration started, go ahead!");
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en"));
      if (englishVoice) confirmation.voice = englishVoice;
      speechSynthesis.cancel();
      speechSynthesis.speak(confirmation);
    });
  });

  // ✅ NO Button
  noBtn.addEventListener("click", () => {
    noPopup.style.display = "block";
    document.body.classList.add("blur-background", "red-blink");

    const msg = new SpeechSynthesisUtterance("Choosing not to play means missing out — are you sure? For now, you’re Eliminated.");
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) msg.voice = englishVoice;
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  });

  // ✅ Animate shapes as before
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

// ✅ FORM related
const registerFurtherBtn = document.getElementById("registerFurtherBtn");
const registerForm = document.getElementById("registrationForm");

registerFurtherBtn.addEventListener("click", () => {
  registerForm.style.display = "block";
});

// ✅ Validation
window.validateField = function (fieldId) {
  const input = document.getElementById(fieldId);
  const icon = document.getElementById("icon-" + fieldId);
  const value = input.value.trim();
  const isValid = value.length >= 3;

  icon.src = isValid ? "yes.png" : "No-removebg-preview.png";
  icon.style.display = "inline-block";
  icon.style.transition = "opacity 1s";
  icon.style.opacity = "1";

  setTimeout(() => {
    icon.style.opacity = "0";
    setTimeout(() => icon.style.display = "none", 500);
  }, 1000);
};
function transfer() {
  window.location.href = "https://forms.gle/wq7do4ncdPCNAB2d6";
}

window.submitForm = function () {
  const fields = ["teamName", "member1", "regNo"];
  let allFilled = true;

  fields.forEach(id => {
    const val = document.getElementById(id).value.trim();
    if (!val) {
      alert(`Please fill ${id}`);
      allFilled = false;
    }
  });

  if (allFilled) {
    alert("Registration Successful! 🎮");
  }
};

function submitToGoogleForm() {
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScQJLfjS554ZURSTF3mfEn8ogPg8X-heyPR-NORhQSqPro1Iw/formResponse";

  const formData = new FormData();
  formData.append("entry.1668573321", document.getElementById("teamName").value);
  formData.append("entry.454258648", document.getElementById("member1").value);
  formData.append("entry.1521181521", document.getElementById("regNo").value);

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).then(() => {
    alert("Form submitted to Google Form!");
    location.reload();
  }).catch(() => {
    alert("Failed to submit");
  });
}
