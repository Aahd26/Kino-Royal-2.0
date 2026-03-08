let selectedSaal = null;
let selectedReihe = null;
let selectedSitze = [];
let vorstellungId = null;
let sitzeProReihe = 0;
let saalNameGlobal = '';

export async function ReservierungView (filmData) {
  vorstellungId = filmData.vorstellungId;

  // Lade Kinosäle
  const response = await fetch(`/api/vorstellungen/${filmData.vorstellungId}`);
  const vorstellung = await response.json();
  const saal = vorstellung.kinosaal;

  selectedSaal = saal._id;
  sitzeProReihe = saal.sitzeProReihe;
  saalNameGlobal = saal.name;

  return `
    <div class="top-black"></div>
    <div class="nav-bar">
      <img src="logo.png" alt="Kino Royal" class="logo">
      <button class="role-switch">Rolle wechseln</button>
    </div>

    <div class="reservierung-container">
      <h2>Reservierung für ${filmData.titel}</h2>
      <p class="film-details">${filmData.datum} | ${filmData.uhrzeit} Uhr</p>

      <div class="sitzauswahl">
        <h3>Sitzplatz auswählen</h3>
        
            <p><strong>Kinosaal:</strong> ${saal.name} (${saal.sitzreihen}x${saal.sitzeProReihe})</p>

        <div class="dropdown-gruppe">
          <label for="reihe-select">Reihe:</label>
          <select id="reihe-select" required>
            <option value="">Bitte wählen...</option>
            ${Array.from({ length: saal.sitzreihen }, (_, i) =>
              `<option value="${i + 1}">Reihe ${i + 1}</option>`
            ).join('')}
          </select>
        </div>
     <!-- Für das Auswählen mehrerer Sitze: Steuerung gedrückt halten! -->
        <div class="dropdown-gruppe">
          <label for="sitz-select">Sitz:</label>
          <select id="sitz-select" multiple size="6" disabled required>
            <option value="">Erst Reihe wählen</option>
          </select>
        </div>

        <div id="reservierung-status"></div>
      </div>

      <div class="reservierung-form">
        <div class="form-group">
          <label for="kundenName">Ihr Name:</label>
          <input type="text" id="kundenName" placeholder="Max Mustermann" required />
        </div>
        <p class="ausgewaehlt-info">
          Ausgewählter Sitz: <span id="ausgewaehlt-sitz">Noch nicht ausgewählt</span>
        </p>
        <button class="bestaetigen-btn" disabled>Reservierung bestätigen</button>
      </div>
    </div>

    <footer>
      <div class="footer-teil">
        <nav class="footer-elemente">
          <ul>
            <li><a href="#">DATENSCHUTZ</a></li>
            <li><a href="#">IMPRESSUM</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  `;
}

export function initReservierungEvents () {
  const reiheSelect = document.getElementById('reihe-select');
  const sitzSelect = document.getElementById('sitz-select');
  const bestaetigBtn = document.querySelector('.bestaetigen-btn');

  if (!reiheSelect || !sitzSelect) return;

  // Reihe ausgewählt
  reiheSelect.addEventListener('change', async (e) => {
    selectedReihe = parseInt(e.target.value);
    selectedSitze = [];

    if (!selectedReihe) return;

    sitzSelect.disabled = false;
    sitzSelect.innerHTML = '<option value="">Bitte wählen...</option>';

    // Belegte Sitze laden
    const belegteSitze = await loadBelegteSitze(vorstellungId, selectedSaal, selectedReihe);

    for (let i = 1; i <= sitzeProReihe; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Sitz ${i}`;
      if (belegteSitze.includes(i)) {
        option.disabled = true;
        option.textContent += ' (Belegt)';
        option.style.color = 'red';
      }
      sitzSelect.appendChild(option);
    }

    // Sitzanzeige zurücksetzen
    selectedSitze = [];
    updateAusgewaehlterSitz();
  });

  // Sitz ausgewählt
  sitzSelect.addEventListener('change', (e) => {
    selectedSitze = Array.from(e.target.selectedOptions)
      .map(option => parseInt(option.value));
    console.log('selectedSitze', selectedSitze);
    updateAusgewaehlterSitz();
    bestaetigBtn.disabled = selectedSitze.length === 0;
  });
}

async function loadBelegteSitze (vorstellungId, saalId, reihe) {
  try {
    console.log('loadBelegteSitze aufgerufen mit vorstellungId=', vorstellungId);
    if (!vorstellungId) {
      console.error('FEHLER: vorstellungId ist ungültig!');
      return [];
    }
    const res = await fetch(`/api/vorstellungen/${vorstellungId}/reservierungen`);
    const reservierungen = await res.json();

    return reservierungen
      .flatMap(r => Array.isArray(r.sitze) ? r.sitze : [])
      .map(s => ({ reihe: Number(s.reihe), platz: Number(s.platz) }))
      .filter(s => Number(s.reihe) === Number(reihe))
      .map(s => Number(s.platz));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function updateAusgewaehlterSitz () {
  const anzeige = document.getElementById('ausgewaehlt-sitz');
  if (!anzeige) return;

  if (selectedReihe && selectedSitze.length > 0) {
    anzeige.textContent = `${saalNameGlobal} - Reihe ${selectedReihe} - Sitze ${selectedSitze.join(', ')}`;
  } else {
    anzeige.textContent = 'Noch nicht ausgewählt';
  }
}

export function getReservierungsDaten () {
  if (!selectedReihe || selectedSitze.length === 0) return { vorstellungId: vorstellungId, sitze: [] };
  return {
    vorstellungId: vorstellungId,
    sitze: selectedSitze.map(sitz => ({
      reihe: selectedReihe,
      platz: sitz
    }))
  };
}
