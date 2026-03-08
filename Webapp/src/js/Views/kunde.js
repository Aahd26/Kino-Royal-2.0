let alleVorstellungen = [];
let aktuelleSeite = 1;

export async function KundeView () {
  // Lade alle Vorstellungen
  const response = await fetch('/api/vorstellungen');
  alleVorstellungen = await response.json();
  aktuelleSeite = 1;

  // Initial rendern
  setTimeout(() => {
    renderVorstellungen();
    initPaginationEvents();
  }, 0);

  return `
    <div class="top-black"></div>
    <div class="nav-bar">
      <img src="logo.png" alt="Kino Royal" class="logo">
      <button class="role-switch">Rolle wechseln</button>
    </div>

    <div class="programm-container">
      <div class="programm" id="programm">
        
      </div>

      <div class="pagination" id="pagination">
        
      </div>
    </div>
  `;
}

function getItemsPerPage () {
  const headerHeight = 80;
  const footerHeight = 60;
  const paginationHeight = 60;
  const filmCardHeight = 500;
  const gap = 48;

  const verfuegbareHoehe = window.innerHeight - headerHeight - footerHeight - paginationHeight;
  const itemsProReihe = Math.floor(window.innerWidth / 350);
  const anzahlReihen = Math.floor(verfuegbareHoehe / (filmCardHeight + gap));

  return Math.max(1, itemsProReihe * anzahlReihen);
}

function renderVorstellungen () {
  const programm = document.getElementById('programm');
  const pagination = document.getElementById('pagination');

  if (!programm || !pagination) return;

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(alleVorstellungen.length / itemsPerPage);

  // Seite korrigieren falls zu hoch
  if (aktuelleSeite > totalPages) aktuelleSeite = totalPages;
  if (aktuelleSeite < 1) aktuelleSeite = 1;

  const start = (aktuelleSeite - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const aktuelleFilme = alleVorstellungen.slice(start, end);

  // Filme rendern
  programm.innerHTML = aktuelleFilme.map(v => `
    <div class="film">
      <article class="film-info">
        <h1>${v.filmName}</h1>
        <p>${v.genre} | Ab ${v.ageRating} | ${v.duration} Minuten</p>
        <p>${v.description}</p>
        <p>${new Date(v.startTime).toLocaleDateString('de-DE')} | ${new Date(v.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
        <button class="reservieren-btn" 
          data-film="${v.filmName}" 
          data-datum="${new Date(v.startTime).toLocaleDateString('de-DE')}" 
          data-uhrzeit="${new Date(v.startTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}"
          data-vorstellung-id="${v._id}">
          Reservieren
        </button>
      </article>
    </div>
  `).join('');

  // Paginierung
  pagination.innerHTML = `
    <button class="prev-btn" ${aktuelleSeite === 1 ? 'disabled' : ''}>←</button>
    <span class="page-info">Seite ${aktuelleSeite} / ${totalPages}</span>
    <button class="next-btn" ${aktuelleSeite === totalPages ? 'disabled' : ''}>→</button>
  `;
}

function initPaginationEvents () {
  // Bei Fenstergrößenänderung neu rendern
  window.addEventListener('resize', () => {
    renderVorstellungen();
  });
}

export function handlePagination (direction) {
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(alleVorstellungen.length / itemsPerPage);

  if (direction === 'next' && aktuelleSeite < totalPages) {
    aktuelleSeite++;
    renderVorstellungen();
  }
  if (direction === 'prev' && aktuelleSeite > 1) {
    aktuelleSeite--;
    renderVorstellungen();
  }
}
