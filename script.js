window.onload = () => {
  const speakBtn = document.getElementById("speakBtn");
  const message = "Hello, Player. Welcome to the Game. Follow the instructions carefully to survive.";
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

  // Function to type text letter by letter
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

  // Speech and typing combo
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

  // Load voices
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.addEventListener("voiceschanged", () => {
      speakBtn.addEventListener("click", speakNow);
    });
  } else {
    speakBtn.addEventListener("click", speakNow);
  }

  // Yes Button
  yesBtn.addEventListener("click", () => {
    yesPopup.style.display = "block";
    document.body.classList.add("blur-background");

    let count = 0;
    const repeatMessage = () => {
      if (count < 2) {
        const msg = new SpeechSynthesisUtterance("You have survived. Now you can register further.");
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith("en"));
        if (englishVoice) msg.voice = englishVoice;
        speechSynthesis.speak(msg);
        count++;
      } else {
        clearInterval(intervalId);
      }
    };

    repeatMessage();
    const intervalId = setInterval(repeatMessage, 3000);

    // Show register further button after 5s
    setTimeout(() => {
      yesPopup.style.display = "none";
      document.body.classList.remove("blur-background");
      registerFurtherContainer.style.display = "block";
    }, 5000);

    registerFurtherBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      document.body.classList.remove("blur-background");
      registerFurtherBtn.textContent = "Registration Started ✅";

      // Show success message
      successMessage.style.display = "block";

      const confirmation = new SpeechSynthesisUtterance("Registration started, go ahead!");
      speechSynthesis.speak(confirmation);
    });
  });

  // No Button
  noBtn.addEventListener("click", () => {
    noPopup.style.display = "block";
    document.body.classList.add("blur-background", "red-blink");

    const msg = new SpeechSynthesisUtterance("You have been eliminated. Reload to Register Again");
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) msg.voice = englishVoice;
    speechSynthesis.speak(msg);
  });

  // Background music
  bgMusic.volume = 0.1;
  bgMusic.play().catch(() => {
    speakBtn.addEventListener("click", () => bgMusic.play());
  });

  // Animate shapes
  const shapes = document.querySelectorAll(".shape");
  shapes.forEach(shape => {
    shape.style.animationDuration = `${Math.random() * 6 + 1}s`;
    shape.style.animationDelay = `${Math.random() * 5}s`;

    setInterval(() => {
      const xPos = Math.random() * 60 - 30;
      shape.style.transform = `translate(${xPos}px, 0)`;
    }, Math.random() * 4000 + 3000);
  });
}

const registerFurtherBtn = document.getElementById("registerFurtherBtn");
const registerForm = document.getElementById("registrationForm");

// Show form on clicking "REGISTER"
registerFurtherBtn.addEventListener("click", () => {
  registerForm.style.display = "block";
});

// Validation function
window.validateField = function (fieldId) {
  const input = document.getElementById(fieldId);
  const icon = document.getElementById("icon-" + fieldId);
  const value = input.value.trim();

  // Dummy validation: just check if filled and at least 3 characters
  const isValid = value.length >= 3;

  icon.src = isValid ? "yes.png" : "No-removebg-preview.png";
  icon.style.display = "inline-block";
  icon.style.transition = "opacity 1s";
  icon.style.opacity = "1";

  setTimeout(() => {
    icon.style.opacity = "0";
    setTimeout(() => icon.style.display = "none", 500);
  }, 1000);
}

// Submit all fields
window.submitForm = function () {
  const fields = ["teamName", "member1", "regNo"]; // Add all your 10 field IDs
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
    // You can also send data to server here if needed
  }
}

function submitToGoogleForm() {
  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScQJLfjS554ZURSTF3mfEn8ogPg8X-heyPR-NORhQSqPro1Iw/formResponse";


  const formData = new FormData();
  formData.append("entry.1668573321", document.getElementById("teamName").value); // Replace with actual entry ID
  formData.append("entry.454258648", document.getElementById("member1").value);
  formData.append("entry.1521181521", document.getElementById("regNo").value);
  // Add other fields...

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",  // Needed to prevent CORS errors
    body: formData
  }).then(() => {
    alert("Form submitted to Google Form!");
    location.reload();
    // Optional: Reset form or show message
  }).catch(() => {
    alert("Failed to submit");
  });
}
