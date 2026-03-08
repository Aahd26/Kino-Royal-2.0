// Views/betreiber.js
export function BetreiberView () {
  return `
      <div class="top-black"></div>
    <div class="betreiber">
      <header class="header">
        <img src="logo.png" class="header-logo" />
        <nav class="header-elemente">
          <ul>
            <li><button class="nav-btn" data-view="saele">Kinosäle</button></li>
            <li><button class="nav-btn" data-view="vorstellungen">Vorstellungen</button></li>
          </ul>        
        </nav>
        <button class="role-switch">Rolle wechseln</button>
      </header>
      
      <main id="betreiber-content">
         ${renderSaeleView()}
      </main>
    </div>
  `;
}

function renderSaeleView () {
  return `
    <section>
      <h2>Kinosäle anlegen</h2>
      <form id="saal-form">
        <input type="text" name="name" placeholder="Name" required />
        <input type="number" name="sitzreihen" placeholder="Sitzreihen" min="1" max="20" required />
        <input type="number" name="sitzeProReihe" placeholder="Sitze pro Reihe" max="20" required />
        <button type="submit">Anlegen</button>
      </form>

      <div id="saal-liste"></div>
    </section>
  `;
}

function renderVorstellungenView () {
  return `
    <section>
      <h2>Vorstellung anlegen</h2>
      <form id="vorstellung-form">
        <input type="text" name="filmName" placeholder="Filmname" required />
        
        <input type="text" name="genre" placeholder="Genre (z.B. Action)" required />
        
        <input type="number" name="ageRating" placeholder="FSK (z.B. 12)" min="0" required />
        
        <input type="number" name="duration" placeholder="Dauer in Minuten" min="1" required />
        
        <textarea name="description" placeholder="Beschreibung" required></textarea>
        
        <input type="date" name="date" required />
        
        <input type="time" name="time" required />
         
        <select name="kinosaal" id="kinosaal-select" required></select>
        <button type="submit">Anlegen</button>
      </form>

      <div id="vorstellung-liste"></div>
    </section>
  `;
}

export function switchBetreiberView (view) {
  const content = document.getElementById('betreiber-content');
  if (!content) return;

  if (view === 'saele') {
    content.innerHTML = renderSaeleView();
    loadSaele();
  }

  if (view === 'vorstellungen') {
    content.innerHTML = renderVorstellungenView();
    loadKinosaeleForSelect();
  }
}

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'vorstellung-form') {
    await handleVorstellungSubmit(e);
  }

  if (e.target.id === 'saal-form') {
    await handleSaalSubmit(e);
  }
});

async function handleVorstellungSubmit (e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data.ageRating = Number(data.ageRating);
    data.duration = Number(data.duration);

    data.startTime = new Date(`${data.date}T${data.time}`);

    delete data.date;
    delete data.time;

    const response = await fetch('/api/vorstellungen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('Vorstellung erfolgreich angelegt');
      e.target.reset();
    } else {
      const err = await response.json();
      throw new Error(err.error);
    }
  } catch (err) {
    console.error('Fehler beim Anlegen der Vorstellung:', err.message);
  }
}

async function handleSaalSubmit (e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data.sitzreihen = Number(data.sitzreihen);
    data.sitzeProReihe = Number(data.sitzeProReihe);

    const response = await fetch('/api/kinosaele', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('Kinosaal erfolgreich angelegt');
      e.target.reset();
      loadSaele();
    } else {
      const err = await response.json();
      throw new Error(err.error);
    }
  } catch (err) {
    console.error('Fehler beim Anlegen des Saals:', err.message);
  }
}

async function loadSaele () {
  try {
    const res = await fetch('/api/kinosaele');
    const saele = await res.json();

    const liste = document.getElementById('saal-liste');
    if (!liste) return;

    let html = '';

    for (const s of saele) {
      html += `<div>${s.name} (${s.sitzreihen}x${s.sitzeProReihe})</div>`;
    }

    liste.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function loadKinosaeleForSelect () {
  try {
    const res = await fetch('/api/kinosaele');
    const Kinosaeles = await res.json();

    const select = document.getElementById('kinosaal-select');
    if (!select) return;

    select.innerHTML = '';

    Kinosaeles.forEach(s => {
      const option = document.createElement('option');
      option.value = s._id;
      option.textContent = s.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}
