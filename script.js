let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
let timer = null;
let isRunning = false;
let lapCount = 0;
let countdownMode = false;
let countdownEnd = 0;

// Sounds
const startSound = new Audio("sounds/start.mp3");
const stopSound = new Audio("sounds/stop.mp3");
const resetSound = new Audio("sounds/reset.mp3");
const lapSound = new Audio("sounds/lap.mp3");

function updateDisplay() {
  let h = hours < 10 ? "0" + hours : hours;
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ms = milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;

  document.getElementById("display").innerText = `${h}:${m}:${s}.${ms}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startSound.play();
    if (countdownMode) {
      timer = setInterval(() => {
        let now = Date.now();
        let remaining = countdownEnd - now;
        if (remaining <= 0) {
          resetTimer();
          alert("⏰ Countdown Finished!");
          return;
        }
        let totalMs = remaining;
        hours = Math.floor(totalMs / 3600000);
        minutes = Math.floor((totalMs % 3600000) / 60000);
        seconds = Math.floor((totalMs % 60000) / 1000);
        milliseconds = totalMs % 1000;
        updateDisplay();
      }, 10);
    } else {
      timer = setInterval(() => {
        milliseconds += 10;
        if (milliseconds === 1000) {
          milliseconds = 0;
          seconds++;
          if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
              minutes = 0;
              hours++;
            }
          }
        }
        updateDisplay();
      }, 10);
    }
  }
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
  stopSound.play();
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  hours = minutes = seconds = milliseconds = 0;
  lapCount = 0;
  document.getElementById("laps").innerHTML = "";
  updateDisplay();
  resetSound.play();
}

function recordLap() {
  if (isRunning && !countdownMode) {
    lapCount++;
    const lapTime = document.getElementById("display").innerText;
    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${lapTime}`;
    document.getElementById("laps").appendChild(li);
    lapSound.play();
    saveLaps();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleCountdownInput() {
  document.getElementById("countdown-input").classList.toggle("hidden");
}

function setCountdown() {
  let mins = parseInt(document.getElementById("minutesInput").value) || 0;
  let secs = parseInt(document.getElementById("secondsInput").value) || 0;
  let totalMs = (mins * 60 + secs) * 1000;
  if (totalMs > 0) {
    countdownMode = true;
    countdownEnd = Date.now() + totalMs;
    startTimer();
  }
}

// Save laps in local storage
function saveLaps() {
  let laps = [];
  document.querySelectorAll("#laps li").forEach(li => laps.push(li.textContent));
  localStorage.setItem("stopwatchLaps", JSON.stringify(laps));
}

function loadLaps() {
  let laps = JSON.parse(localStorage.getItem("stopwatchLaps")) || [];
  laps.forEach(lap => {
    let li = document.createElement("li");
    li.textContent = lap;
    document.getElementById("laps").appendChild(li);
  });
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") isRunning ? stopTimer() : startTimer();
  if (e.key.toLowerCase() === "r") resetTimer();
  if (e.key.toLowerCase() === "l") recordLap();
});

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("lap").addEventListener("click", recordLap);
document.getElementById("theme").addEventListener("click", toggleTheme);
document.getElementById("countdown").addEventListener("click", toggleCountdownInput);
document.getElementById("setCountdown")

// Initialize
updateDisplay();
loadLaps();
