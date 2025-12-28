function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function applyThemeFromUrl() {
  const bg = getParam("bg");
  const text = getParam("text");
  const line = getParam("line");
  const page = getParam("page");
  const width = getParam("w");
  const height = getParam("h");
  const ui = getParam("ui");
  const fmt = getParam("fmt"); // 12 or 24

  if (page) document.documentElement.style.setProperty("--page", decodeURIComponent(page));
  if (bg) document.documentElement.style.setProperty("--panel-bg", decodeURIComponent(bg));
  if (text) document.documentElement.style.setProperty("--text", decodeURIComponent(text));
  if (line) document.documentElement.style.setProperty("--line", decodeURIComponent(line));
  if (width) document.documentElement.style.setProperty("--w", `${Number(width)}px`);
  if (height) document.documentElement.style.setProperty("--h", `${Number(height)}px`);

  if (ui === "0") {
    const hint = document.getElementById("hint");
    if (hint) hint.style.display = "none";
  }

  return fmt === "24" ? 24 : 12;
}

function pad2(n){ return String(n).padStart(2, "0"); }

function weekdayName(date){
  return date.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase();
}

function updateClock(mode) {
  const now = new Date();
  let hours = now.getHours();
  const mins = now.getMinutes();

  const ampmEl = document.getElementById("ampm");
  const dayEl = document.getElementById("weekday");

  let displayHours = hours;
  let ampm = "";

  if (mode === 12) {
    ampm = hours >= 12 ? "PM" : "AM";
    displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
  }

  ampmEl.textContent = mode === 12 ? ampm : "";
  dayEl.textContent = weekdayName(now);

  const hoursEl = document.querySelector("#hours [data-value]");
  const minsEl = document.querySelector("#mins [data-value]");

  const nextH = pad2(displayHours);
  const nextM = pad2(mins);

  flipIfChanged(hoursEl, nextH);
  flipIfChanged(minsEl, nextM);
}

function flipIfChanged(el, next) {
  if (el.textContent === next) return;
  el.textContent = next;

  // restart animation
  el.classList.remove("flip");
  void el.offsetWidth; // force reflow
  el.classList.add("flip");
}

const mode = applyThemeFromUrl();
updateClock(mode);

// update on the second so it feels “snappy”
setInterval(() => updateClock(mode), 1000);
