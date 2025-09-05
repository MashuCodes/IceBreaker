let intervalId = null;
let totalSeconds = 0;    // total time set on timer
let remainingSeconds = 0; // current countdown

// Grab timer elements from the page
const display     = document.getElementById("timerDisplay");
const minInput    = document.getElementById("minutesInput");
const secInput    = document.getElementById("secondsInput");
const startBtn    = document.getElementById("startBtn");
const pauseBtn    = document.getElementById("pauseBtn");
const resetBtn    = document.getElementById("resetBtn");
const setBtn      = document.getElementById("setBtn");

//Some helper functions :D
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function pad(n) { return String(n).padStart(2, "0"); }
function formatTime(seconds) { return `${pad(Math.floor(seconds/60))}:${pad(seconds%60)}`; }

function updateDisplay() {
  display.textContent = formatTime(remainingSeconds);
}

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Reads the timer inputs and update the countdown
function setTimeFromInputs() {
  const mins = clamp(parseInt(minInput?.value || "0", 10), 0, 599);
  const secs = clamp(parseInt(secInput?.value || "0", 10), 0, 59);
  totalSeconds = mins * 60 + secs;
  remainingSeconds = totalSeconds;
  updateDisplay();
}

// Start the countdown
function startTimer() {
  if (intervalId !== null || remainingSeconds <= 0) return;

  updateDisplay();

  intervalId = setInterval(() => {
    remainingSeconds = clamp(remainingSeconds - 1, 0, Number.MAX_SAFE_INTEGER);
    updateDisplay();

    if (remainingSeconds === 0) {
      clearTimer();
      
      // Plays a short beep when timer ends 
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        osc.start();
        setTimeout(() => { 
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2); 
          osc.stop(ctx.currentTime + 0.25); 
        }, 180);
      } catch {}

      // Flash effect for visual cue
      display.classList.add("timer-done");
      setTimeout(() => display.classList.remove("timer-done"), 1000);
    }
  }, 1000);
}

function pauseTimer() { clearTimer(); }
function resetTimer() { clearTimer(); remainingSeconds = totalSeconds; updateDisplay(); }

// Set timer to a specific number of seconds (used for Rapid Fire, 5 seconds by default)
function setTimer(seconds) { clearTimer(); totalSeconds = seconds; remainingSeconds = seconds; updateDisplay(); }

// Connects the buttons to timer actions
startBtn?.addEventListener("click", startTimer);
pauseBtn?.addEventListener("click", pauseTimer);
resetBtn?.addEventListener("click", resetTimer);
setBtn?.addEventListener("click", () => { pauseTimer(); setTimeFromInputs(); });

export { setTimer, startTimer };

if (display) display.textContent = "00:00";