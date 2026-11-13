
/* =====================================================
   JS 1: YOUR DATA
   Field order: make, model, engine, brand, fuel,
   pins, voltage, amps, year
   ===================================================== */

const D = [
  ["Honda", "City", "", "Japan", "Gas", 4, 12, "90", 2008],
  ["Honda", "Civic", "", "Japan", "Gas", 4, 12, "90", 2015],
  ["Honda", "CR-V", "", "Japan", "Diesel", 4, 12, "90", 2015],
  ["Hyundai", "Accent", "", "Valeo", "Gas", 2, 12, "110", 2018],
  ["Hyundai", "Accent", "", "Valeo", "Gas", 3, 12, "110", 2018],
  ["Hyundai", "Tucson", "", "Hyundai", "Diesel", 2, 12, "120", null],
  ["Isuzu", "Crosswind", "", "Japan", "Diesel", 3, 12, "40", 2010],
  ["Kia", "Carnival", "", "Valeo", "Diesel", 2, 12, "110 or 120", 2018],
  ["Kia", "Sorento", "", "Valeo", "Diesel", 2, 12, "110", 2010],
  ["Kia", "Carnival", "", "Not listed", "Diesel", 2, 12, "85", 2010],
  ["Kia", "Ceres", "", "Denso", "Diesel", 1, 12, "75", 2010],
  ["Mitsubishi", "Fuso", "4DR7", "Blitz", "Diesel", 2, 12, "75", null],
  ["Mitsubishi", "Lancer", "4G13 / 4G15 / 4G32", "Mando", "Gas", 2, 12, "90", 2003],
  ["Toyota", "Corolla", "", "Japan", "Gas", 3, 12, "90", 2015],
  ["Toyota", "Hiace", "", "Toyota", "Gas / Diesel", 4, 12, "150", 2018],
  ["Toyota", "Innova", "", "Toyota", "Diesel", 4, 12, "90", 2015]
].map(r => ({
  make: r[0],
  model: r[1],
  engine: r[2],
  brand: r[3],
  fuel: r[4],
  pins: r[5],
  v: r[6],
  ampText: r[7],
  amp: parseInt(r[7], 10),
  year: r[8]
}));

const modelImages = {
  "Honda-City": "images/honda-city.jpeg",
  "Hyundai-Accent": "images/hyundai-accent.jpeg"
};

/* JS 2: DERIVED VALUES */

const makes = [...new Set(D.map(d => d.make))];
let make = "";

const $ = id => document.getElementById(id);
const amps = D.map(d => d.amp);

/* JS 3: STAT BOXES */

$("stats").innerHTML = [
  [D.length, "alternators listed"],
  [makes.length, "vehicle makes"],
  [Math.min(...amps) + "–" + Math.max(...amps) + "A", "output range"]
]
  .map(s => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`)
  .join("");

/* JS 4: MAKE FILTER BUTTONS */

function chips() {
  $("chips").innerHTML = ["All makes", ...makes].map(m => {
    const val = m === "All makes" ? "" : m;

    return `<button class="chip" data-m="${val}" aria-pressed="${make === val}">${m}</button>`;
  }).join("");

  document.querySelectorAll(".chip").forEach(b => {
    b.onclick = () => {
      make = b.dataset.m;
      chips();
      render();
    };
  });
}

/* JS 5: ALTERNATOR CARD */

function card(d) {
  const segs = Array.from(
    { length: 15 },
    (_, i) => `<s class="${i < Math.round(d.amp / 10) ? "on" : ""}"></s>`
  ).join("");

  return `<article class="card">
    <div class="amp">
      <b>${d.amp}</b>
      <span>amps</span>
      ${d.ampText.includes("or") ? `<i>${d.ampText}A</i>` : ""}
    </div>

    <div class="body">
      <span class="year">${d.year || "Year not listed"}</span>
      <div class="make">${d.make}</div>
<div class="model-wrapper">

  <img
    src="${modelImages[d.make + '-' + d.model] || 'images/alternator.jpeg'}"
    alt="${d.make} ${d.model} alternator"
    class="model-icon"
    onerror="this.src='images/alternator.jpeg'; this.onerror=null;">

  <h3 class="model">${d.model}</h3>

</div>
      <div class="gauge" aria-hidden="true">${segs}</div>

      <dl>
        <dt>Voltage</dt><dd>${d.v}V</dd>
        <dt>Connector</dt><dd>${d.pins} pin${d.pins > 1 ? "s" : ""}</dd>
        <dt>Fuel</dt><dd>${d.fuel}</dd>
        <dt>Brand</dt><dd>${d.brand}</dd>
      </dl>

      ${d.engine ? `<div class="engine">Engine: ${d.engine}</div>` : ""}
    </div>
  </article>`;
}

/* JS 6: SEARCH, FILTER AND SORT */

function render() {
  const q = $("q").value.trim().toLowerCase();
  const f = $("fuel").value;
  const s = $("sort").value;

  let list = D.filter(d =>
    (!make || d.make === make) &&
    (!f || d.fuel.includes(f)) &&
    (!q || (
      d.make + " " +
      d.model + " " +
      d.brand + " " +
      d.engine
    ).toLowerCase().includes(q))
  );

  if (!list.length) {
    $("out").innerHTML =
      '<p class="empty">No alternators match these filters. Clear the search or choose another make.</p>';
    return;
  }

  if (s === "amp") {
    list = [...list].sort((a, b) => b.amp - a.amp);

    $("out").innerHTML = `
      <h2>${list.length} alternators
        <small>highest ampere rating first</small>
      </h2>
      <div class="grid">${list.map(card).join("")}</div>
    `;

    return;
  }

  $("out").innerHTML = makes
    .filter(m => list.some(d => d.make === m))
    .map(m => {
      const g = list.filter(d => d.make === m);

      return `
        <h2>${m}
          <small>${g.length} ${g.length > 1 ? "listings" : "listing"}</small>
        </h2>
        <div class="grid">${g.map(card).join("")}</div>
      `;
    })
    .join("");
}

/* JS 7: EVENT LISTENERS AND STARTUP */

["q", "fuel", "sort"].forEach(id => {
  $(id).addEventListener("input", render);
});

chips();
render();
