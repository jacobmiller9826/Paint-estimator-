// Localization text
const texts = {
  en: {
    paintEstimator: "Paint Estimator",
    clientInfo: "Client Information",
    name: "Name:",
    address: "Address:",
    phone: "Phone:",
    notes: "Notes:",
    rooms: "Rooms",
    addRoom: "+ Add Room",
    remove: "Remove",
    wallHeight: "Wall Height (ft):",
    wallLength: "Wall Length (ft):",
    ceilingArea: "Ceiling Area (sq ft):",
    trimLength: "Trim Length (ft):",
    twoCoats: "Include 2 Coats",
    laborRates: "Labor Rates (per sq ft)",
    laborWall: "Wall ($):",
    laborCeiling: "Ceiling ($):",
    laborTrim: "Trim ($):",
    paintInfo: "Paint Info",
    coverage: "Coverage (sq ft/gallon):",
    paintCost: "Paint Cost per Gallon ($):",
    estimate: "Estimate",
    toggleDarkMode: "Toggle Dark Mode",
    toggleLanguage: "Español",
    printEstimate: "Print Estimate",
    totalArea: "Total Area",
    gallonsNeeded: "Gallons Needed",
    paintCostResult: "Paint Cost",
    laborCostResult: "Labor Cost",
    timeEstimate: "Time Estimate (hours)",
    totalEstimate: "Total Estimate",
    client: "Client",
    notesResult: "Notes"
  },
  es: {
    paintEstimator: "Calculadora de Pintura",
    clientInfo: "Información del Cliente",
    name: "Nombre:",
    address: "Dirección:",
    phone: "Teléfono:",
    notes: "Notas:",
    rooms: "Habitaciones",
    addRoom: "+ Agregar Habitación",
    remove: "Eliminar",
    wallHeight: "Altura de Pared (pies):",
    wallLength: "Longitud de Pared (pies):",
    ceilingArea: "Área de Techo (pies²):",
    trimLength: "Longitud de Moldura (pies):",
    twoCoats: "Incluir 2 Capas",
    laborRates: "Costo de Mano de Obra (por pie²)",
    laborWall: "Pared ($):",
    laborCeiling: "Techo ($):",
    laborTrim: "Moldura ($):",
    paintInfo: "Información de Pintura",
    coverage: "Cobertura (pies²/galón):",
    paintCost: "Costo por Galón ($):",
    estimate: "Calcular",
    toggleDarkMode: "Modo Oscuro",
    toggleLanguage: "English",
    printEstimate: "Imprimir Cotización",
    totalArea: "Área Total",
    gallonsNeeded: "Galones Necesarios",
    paintCostResult: "Costo de Pintura",
    laborCostResult: "Costo de Mano de Obra",
    timeEstimate: "Tiempo Estimado (horas)",
    totalEstimate: "Estimación Total",
    client: "Cliente",
    notesResult: "Notas"
  }
};

let currentLang = "en";

const roomsList = document.getElementById("rooms-list");
const addRoomBtn = document.getElementById("addRoomBtn");
const estimateBtn = document.getElementById("estimateBtn");
const resultsDiv = document.getElementById("results");
const toggleDarkModeBtn = document.getElementById("toggleDarkModeBtn");
const toggleLanguageBtn = document.getElementById("toggleLanguageBtn");
const printBtn = document.getElementById("printBtn");

const clientNameInput = document.getElementById("clientName");
const clientAddressInput = document.getElementById("clientAddress");
const clientPhoneInput = document.getElementById("clientPhone");
const jobNotesInput = document.getElementById("jobNotes");

const laborWallInput = document.getElementById("laborWall");
const laborCeilingInput = document.getElementById("laborCeiling");
const laborTrimInput = document.getElementById("laborTrim");

const coverageInput = document.getElementById("coverage");
const paintCostInput = document.getElementById("paintCost");

const twoCoatsCheckbox = document.getElementById("twoCoats");

function createRoom(index) {
  const div = document.createElement("div");
  div.className = "room";
  div.dataset.index = index;

  div.innerHTML = `
    <h3>${texts[currentLang].rooms} #${index + 1}</h3>
    <button class="removeRoomBtn">${texts[currentLang].remove}</button>

    <label for="wallHeight${index}">${texts[currentLang].wallHeight}</label>
    <input type="number" id="wallHeight${index}" min="0" value="8" />

    <label for="wallLength${index}">${texts[currentLang].wallLength}</label>
    <input type="number" id="wallLength${index}" min="0" value="50" />

    <label for="ceilingArea${index}">${texts[currentLang].ceilingArea}</label>
    <input type="number" id="ceilingArea${index}" min="0" value="400" />

    <label for="trimLength${index}">${texts[currentLang].trimLength}</label>
    <input type="number" id="trimLength${index}" min="0" value="100" />
  `;

  // Remove room handler
  div.querySelector(".removeRoomBtn").addEventListener("click", () => {
    div.remove();
    updateRoomHeaders();
  });

  return div;
}

function updateRoomHeaders() {
  const rooms = roomsList.querySelectorAll(".room");
  rooms.forEach((room, i) => {
    room.querySelector("h3").textContent = `${texts[currentLang].rooms} #${i + 1}`;
  });
}

function addRoom() {
  const index = roomsList.children.length;
  const roomDiv = createRoom(index);
  roomsList.appendChild(roomDiv);
}

function calculateEstimate() {
  // Gather inputs per room
  const rooms = roomsList.querySelectorAll(".room");

  if (rooms.length === 0) {
    alert("Please add at least one room.");
    return;
  }

  let totalWallArea = 0;
  let totalCeilingArea = 0;
  let totalTrimLength = 0;

  rooms.forEach((room, i) => {
    const wallHeight = parseFloat(room.querySelector(`#wallHeight${i}`).value) || 0;
    const wallLength = parseFloat(room.querySelector(`#wallLength${i}`).value) || 0;
    const ceilingArea = parseFloat(room.querySelector(`#ceilingArea${i}`).value) || 0;
    const trimLength = parseFloat(room.querySelector(`#trimLength${i}`).value) || 0;

    totalWallArea += wallHeight * wallLength;
    totalCeilingArea += ceilingArea;
    totalTrimLength += trimLength;
  });

  // If two coats, double the paint area
  const coatsMultiplier = twoCoatsCheckbox.checked ? 2 : 1;

  const wallPaintArea = totalWallArea * coatsMultiplier;
  const ceilingPaintArea = totalCeilingArea * coatsMultiplier;
  const trimPaintArea = totalTrimLength * coatsMultiplier;

  // Paint coverage and cost
  const coverage = parseFloat(coverageInput.value) || 350;
  const paintCostPerGallon = parseFloat(paintCostInput.value) || 30;

  // Gallons needed (rounded up)
  const totalPaintArea = wallPaintArea + ceilingPaintArea + trimPaintArea;
  const gallonsNeeded = Math.ceil(totalPaintArea / coverage);

  // Labor rates per sq ft
  const laborWallRate = parseFloat(laborWallInput.value) || 0.5;
  const laborCeilingRate = parseFloat(laborCeilingInput.value) || 0.7;
  const laborTrimRate = parseFloat(laborTrimInput.value) || 1.0;

  // Labor cost
  const laborCost =
    wallPaintArea * laborWallRate +
    ceilingPaintArea * laborCeilingRate +
    trimPaintArea * laborTrimRate;

  // Paint cost
  const paintCost = gallonsNeeded * paintCostPerGallon;

  // Time estimate (hours) - simple formula: 150 sq ft/hour for walls, ceiling; 75 sq ft/hour for trim
  const wallAndCeilingArea = wallPaintArea + ceilingPaintArea;
  const wallCeilingHours = wallAndCeilingArea / 150;
  const trimHours = trimPaintArea / 75;
  const totalHours = wallCeilingHours + trimHours;

  // Total estimate
  const totalEstimate = paintCost + laborCost;

  // Client info
  const clientName = clientNameInput.value.trim();
  const clientAddress = clientAddressInput.value.trim();
  const clientPhone = clientPhoneInput.value.trim();
  const jobNotes = jobNotesInput.value.trim();

  // Build results output string
  let resultText = `${texts[currentLang].client}:\n${clientName}\n${clientAddress}\n${clientPhone}\n\n`;
  resultText += `${texts[currentLang].notesResult}:\n${jobNotes}\n\n`;
  resultText += `${texts[currentLang].totalArea}: ${totalPaintArea.toFixed(2)} sq ft\n`;
  resultText += `${texts[currentLang].gallonsNeeded}: ${gallonsNeeded}\n`;
  resultText += `${texts[currentLang].paintCostResult}: $${paintCost.toFixed(2)}\n`;
  resultText += `${texts[currentLang].laborCostResult}: $${laborCost.toFixed(2)}\n`;
  resultText += `${texts[currentLang].timeEstimate}: ${totalHours.toFixed(2)} hrs\n`;
  resultText += `${texts[currentLang].totalEstimate}: $${totalEstimate.toFixed(2)}`;

  resultsDiv.textContent = resultText;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "es" : "en";
  applyLocalization();
}

function applyLocalization() {
  // Update all labels/buttons based on currentLang
  document.getElementById("title").textContent = texts[currentLang].paintEstimator;
  document.querySelector("#client-info h2").textContent = texts[currentLang].clientInfo;

  // Client info labels
  document.querySelector("label[for='clientName']").textContent = texts[currentLang].name;
  document.querySelector("label[for='clientAddress']").textContent = texts[currentLang].address;
  document.querySelector("label[for='clientPhone']").textContent = texts[currentLang].phone;
  document.querySelector("label[for='jobNotes']").textContent = texts[currentLang].notes;

  // Rooms section
  document.querySelector("#rooms-section h2").textContent = texts[currentLang].rooms;
  addRoomBtn.textContent = texts[currentLang].addRoom;

  // Update each room's labels and header
  const rooms = roomsList.querySelectorAll(".room");
  rooms.forEach((room, i) => {
    room.querySelector("h3").textContent = `${texts[currentLang].rooms} #${i + 1}`;
    room.querySelector(`label[for='wallHeight${i}']`).textContent = texts[currentLang].wallHeight;
    room.querySelector(`label[for='wallLength${i}']`).textContent = texts[currentLang].wallLength;
    room.querySelector(`label[for='ceilingArea${i}']`).textContent = texts[currentLang].ceilingArea;
    room.querySelector(`label[for='trimLength${i}']`).textContent = texts[currentLang].trimLength;
    room.querySelector(".removeRoomBtn").textContent = texts[currentLang].remove;
  });

  // Options
  document.querySelector("#options label").childNodes[1].textContent = ` ${texts[currentLang].twoCoats}`;
  document.querySelector("#options h3").textContent = texts[currentLang].laborRates;
  document.querySelector("label[for='laborWall']").textContent = texts[currentLang].laborWall;
  document.querySelector("label[for='laborCeiling']").textContent = texts[currentLang].laborCeiling;
  document.querySelector("label[for='laborTrim']").textContent = texts[currentLang].laborTrim;

  // Paint info
  document.querySelector("#paint-info h3").textContent = texts[currentLang].paintInfo;
  document.querySelector("label[for='coverage']").textContent = texts[currentLang].coverage;
  document.querySelector("label[for='paintCost']").textContent = texts[currentLang].paintCost;

  // Controls buttons
  estimateBtn.textContent = texts[currentLang].estimate;
  toggleDarkModeBtn.textContent = texts[currentLang].toggleDarkMode;
  toggleLanguageBtn.textContent = texts[currentLang].toggleLanguage;
  printBtn.textContent = texts[currentLang].printEstimate;
}

function printEstimate() {
  const printWindow = window.open("", "", "width=600,height=600");
  printWindow.document.write("<pre>" + resultsDiv.textContent + "</pre>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// Event Listeners
addRoomBtn.addEventListener("click", () => {
  addRoom();
});

estimateBtn.addEventListener("click", () => {
  calculateEstimate();
});

toggleDarkModeBtn.addEventListener("click", () => {
  toggleDarkMode();
});

toggleLanguageBtn.addEventListener("click", () => {
  toggleLanguage();
});

printBtn.addEventListener("click", () => {
  printEstimate();
});

// Initial setup
addRoom(); // Start with one room
applyLocalization();
