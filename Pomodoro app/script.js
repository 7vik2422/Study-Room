let workDuration = 25 * 60; // 25 min
let breakDuration = 5 * 60; // 5 min
let timeLeft = workDuration;
let timerInterval = null;
let isRunning = false;
let isWorkSession = true;
let noisePlaying = false;

const timerDisplay = document.getElementById("timer");
const toggleBtn = document.getElementById("toggle");
const debugBtn = document.getElementById("debug");
const sessionLabel = document.getElementById("session-label");
const body = document.body;
const bell = document.getElementById("bell");
const noiseToggle = document.getElementById("noise-toggle");
const brownNoise = document.getElementById("brown-noise");
const workInput = document.getElementById("work-input");
const breakInput = document.getElementById("break-input");
const applySettingsBtn = document.getElementById("apply-settings");

// Toggle Brown noise
noiseToggle.addEventListener("click", () => {
  if (noisePlaying) {
    brownNoise.pause();
    noiseToggle.textContent = "🎵 Brown Noise";
  } else {
    brownNoise.play();
    noiseToggle.textContent = "🔇 Stop Noise";
  }
  noisePlaying = !noisePlaying;
});

function formatTime(seconds) {
  let m = Math.floor(seconds / 60).toString().padStart(2, "0");
  let s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function updateSessionUI() {
  sessionLabel.textContent = isWorkSession ? "Work Time" : "Break Time";
  body.style.backgroundColor = isWorkSession ? "green" : "steelblue";
}

function switchSession() {
  isWorkSession = !isWorkSession;
  timeLeft = isWorkSession ? workDuration : breakDuration;
  updateTimer();
  updateSessionUI();
  bell.play(); // play sound at switch
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    toggleBtn.textContent = "❚❚ Pause";
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        switchSession();
        startTimer(); // auto-start next session
      }
    }, 1000);
  }
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  toggleBtn.textContent = "▶ Play";
}

toggleBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

debugBtn.addEventListener("click", () => {
  timeLeft = 1; // force timer to 00:01
  updateTimer();
});

// Apply custom work/break durations
applySettingsBtn.addEventListener("click", () => {
  workDuration = parseInt(workInput.value, 10) * 60;
  breakDuration = parseInt(breakInput.value, 10) * 60;
  timeLeft = isWorkSession ? workDuration : breakDuration;
  updateTimer();
});

// Init
updateTimer();
updateSessionUI();
