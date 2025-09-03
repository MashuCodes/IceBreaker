// timer.js
// Usage: include this as a module and make sure your HTML has the IDs used below.
// <script type="module" src="timer.js"></script>

let intervalId = null;
let totalSeconds = 0;        // initial set time (in seconds)
let remainingSeconds = 0;    // countdown (in seconds)

const display     = document.getElementById("timerDisplay"); // e.g., <div id="timerDisplay"></div>
const minInput    = document.getElementById("minutesInput"); // e.g., <input id="minutesInput" type="number">
const secInput    = document.getElementById("secondsInput"); // e.g., <input id="secondsInput" type="number">
const startBtn    = document.getElementById("startBtn");     // e.g., <button id="startBtn">Start</button>
const pauseBtn    = document.getElementById("pauseBtn");     // e.g., <button id="pauseBtn">Pause</button>
const resetBtn    = document.getElementById("resetBtn");     // e.g., <button id="resetBtn">Reset</button>
const setBtn      = document.getElementById("setBtn");       // optional: <button id="setBtn">Set</button>

// --- Helpers ---
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function updateDisplay() {
  display.textContent = formatTime(remainingSeconds);
  // Optionally reflect progress with a CSS variable:
  if (totalSeconds > 0) {
    const progress = 1 - remainingSeconds / totalSeconds; // 0 → 1
    display.style.setProperty("--timer-progress", progress);
  }
}

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// --- Core actions ---
function setTimeFromInputs() {
  const mins = clamp(parseInt(minInput?.value, 10) || 0, 0, 599); // up to ~10 hours
  const secs = clamp(parseInt(secInput?.value, 10) || 0, 0, 59);

  totalSeconds = mins * 60 + secs;
  remainingSeconds = totalSeconds;

  updateDisplay();
}

function startTimer() {
  if (intervalId !== null) return; // already running
  if (remainingSeconds <= 0) {
    // If nothing set, try to read inputs; if still 0, default to 1 minute
    setTimeFromInputs();
    if (remainingSeconds <= 0) {
      totalSeconds = 60;
      remainingSeconds = 60;
    }
  }

  updateDisplay();

  intervalId = setInterval(() => {
    remainingSeconds = clamp(remainingSeconds - 1, 0, Number.MAX_SAFE_INTEGER);
    updateDisplay();

    if (remainingSeconds === 0) {
      clearTimer();
      // Optional: simple end beep using Web Audio (no external file)
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = "sine"; o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        o.start();
        setTimeout(() => { g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2); o.stop(ctx.currentTime + 0.25); }, 180);
      } catch { /* audio not supported, ignore */ }
      // Optional: visual flash
      display.classList.add("timer-done");
      setTimeout(() => display.classList.remove("timer-done"), 1000);
    }
  }, 1000);
}

function pauseTimer() {
  clearTimer();
}

function resetTimer() {
  clearTimer();
  remainingSeconds = totalSeconds;
  updateDisplay();
}

// --- Wire up events ---
startBtn?.addEventListener("click", startTimer);
pauseBtn?.addEventListener("click", pauseTimer);
resetBtn?.addEventListener("click", resetTimer);
setBtn?.addEventListener("click", () => {
  pauseTimer();
  setTimeFromInputs();
});

// Initialize on load
(function init() {
  // Default to 00:00 on first paint
  if (display) display.textContent = "00:00";
  // Keep inputs clamped and update as user types
  minInput?.addEventListener("input", () => {
    minInput.value = String(clamp(parseInt(minInput.value || "0", 10) || 0, 0, 599));
  });
  secInput?.addEventListener("input", () => {
    secInput.value = String(clamp(parseInt(secInput.value || "0", 10) || 0, 0, 59));
  });
})();
