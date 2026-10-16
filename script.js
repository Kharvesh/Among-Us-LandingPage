const COLORS = {
  Red: "#F45858",
  Blue: "#67C9F5",
  Green: "#8DD982",
  Yellow: "#FFD166",
  Purple: "#B8A5F5",
  Pink: "#F5A3C7",
};
const LINES = [
  [
    "Red",
    "EMERGENCY MEETING! Spark Club is bringing something big to IIIT Bhopal…",
  ],
  [
    "Blue",
    "It's Among Us in REAL LIFE, all across campus on 22 November, 10 AM!",
  ],
  ["Green", "200 crewmates will roam the campus in rounds of 20 players."],
  [
    "Yellow",
    "Finish real tasks around campus, while impostors tag and sabotage!",
  ],
  ["Purple", "Entry is free. Trophies and eternal glory for the winners!"],
  ["Pink", "So who's sus? Anyone who hasn't registered yet. Vote now!"],
];
const $ = (id) => document.getElementById(id);
const crew = (c) =>
  `<svg class="crew" style="--c:${c}"><use href="#crew"/></svg>`;

// Colour swatches + preview
const sw = $("sw");
Object.entries(COLORS).forEach(([n, c], i) => {
  sw.insertAdjacentHTML(
    "beforeend",
    `<label style="--c:${c}" title="${n}"><input type="radio" name="color" value="${n}" ${i ? "" : "checked"} aria-label="${n}"><span></span></label>`,
  );
});
sw.addEventListener("change", (e) => {
  $("pv").style.setProperty("--c", COLORS[e.target.value]);
});

// Form
$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) {
    f.reportValidity();
    return;
  }
  const d = new FormData(f);
  $("okmsg").textContent =
    `${d.get("name")}, your seat as ${d.get("color")} (${d.get("ign")}) is reserved.`;
  f.style.display = "none";
  $("ok").classList.add("show");
});

// Siren
function siren() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)(),
      o = a.createOscillator(),
      g = a.createGain();
    o.type = "square";
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(a.destination);
    o.start();
    for (let i = 0; i < 6; i++)
      o.frequency.setValueAtTime(i % 2 ? 620 : 880, a.currentTime + i * 0.22);
    o.stop(a.currentTime + 1.4);
  } catch (_) {}
}

// Meeting
let token = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const show = (id) =>
  ["s1", "s2", "s3"].forEach((s) => $(s).classList.toggle("on", s === id));
const names = Object.keys(COLORS);
$("row").innerHTML = names
  .map((n) => `<div class="pl" data-n="${n}">${crew(COLORS[n])}</div>`)
  .join("");
$("row2").innerHTML = names
  .map((n) => `<div class="pl talk">${crew(COLORS[n])}</div>`)
  .join("");

async function meeting() {
  const my = ++token;
  const live = () => my === token;
  $("meet").classList.add("on");
  document.body.style.overflow = "hidden";
  show("s1");
  siren();
  await sleep(2200);
  if (!live()) return;
  show("s2");
  for (const [n, t] of LINES) {
    if (!live()) return;
    document
      .querySelectorAll("#row .pl")
      .forEach((p) => p.classList.toggle("talk", p.dataset.n === n));
    $("who").textContent = n;
    $("who").parentElement.style.setProperty("--sc", COLORS[n]);
    $("who").style.color = COLORS[n];
    $("say").textContent = "";
    for (const ch of t) {
      if (!live()) return;
      $("say").textContent += ch;
      await sleep(35);
    }
    await sleep(2800 + t.length * 45);
  }
  if (!live()) return;
  show("s3");
  const fill = $("fill");
  fill.style.transition = "width 4s linear";
  fill.style.width = "100%";
  await sleep(4100);
  if (live()) goRegister();
}
function closeMeeting() {
  token++;
  $("meet").classList.remove("on");
  document.body.style.overflow = "";
  const f = $("fill");
  f.style.transition = "none";
  f.style.width = "0";
}
function goRegister() {
  closeMeeting();
  if (EXTERNAL_FORM) {
    window.location.href = EXTERNAL_FORM;
  } else $("register").scrollIntoView({ behavior: "smooth" });
}
$("eb").addEventListener("click", () => {
  $("eb").classList.add("pressed");
  setTimeout(() => {
    $("eb").classList.remove("pressed");
    meeting();
  }, 220);
});
$("skip").addEventListener("click", closeMeeting);
$("yes").addEventListener("click", goRegister);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMeeting();
});
