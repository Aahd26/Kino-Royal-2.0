/* global alert */
import { navigate } from './router.js';
import { initReservierungEvents, getReservierungsDaten } from './Views/reservierung.js';
import { switchBetreiberView } from './Views/betreiber.js';
import { handlePagination } from './Views/kunde.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('#app element not found');
    return;
  }

  navigate('home');

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('kunde-button')) {
      navigate('kunde');
    }

    if (e.target.classList.contains('betreiber-button')) {
      navigate('betreiber');
    }
    if (e.target.classList.contains('nav-btn')) {
      const view = e.target.dataset.view;
      switchBetreiberView(view);
    }
    if (e.target.classList.contains('role-switch')) {
      navigate('home');
    }

    // Paginierung
    if (e.target.classList.contains('next-btn')) {
      handlePagination('next');
    }
    if (e.target.classList.contains('prev-btn')) {
      handlePagination('prev');
    }

    // Reservieren Button
    if (e.target.classList.contains('reservieren-btn')) {
      const filmData = {
        titel: e.target.dataset.film,
        datum: e.target.dataset.datum,
        uhrzeit: e.target.dataset.uhrzeit,
        vorstellungId: e.target.dataset.vorstellungId // Später aus DB
      };
      console.log('filmData beim Reservieren:', filmData);
      await navigate('reservierung', filmData);
      initReservierungEvents();
    }

    // Reservierung bestätigen
    if (e.target.classList.contains('bestaetigen-btn')) {
      const name = document.getElementById('kundenName')?.value;
      if (!name) {
        alert('Bitte geben Sie Ihren Namen ein!');
        return;
      }

      const reservierungsDaten = getReservierungsDaten();

      if (!reservierungsDaten.sitze || reservierungsDaten.sitze.length === 0) {
        alert('Bitte wählen Sie mindestens einen Sitzplatz aus!');
        return;
      }

      try {
        // In DB speichern
        const response = await fetch('http://localhost:8080/api/reservierungen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vorstellungId: reservierungsDaten.vorstellungId,
            kundenName: name,
            sitze: reservierungsDaten.sitze
          })
        });

        if (!response.ok) throw new Error('Reservierung fehlgeschlagen');

        // Zur Bestätigungsseite
        const filmTitel = document.querySelector('.reservierung-container h2')?.textContent.replace('Reservierung für ', '');
        const filmDetails = document.querySelector('.film-details')?.textContent.split('|');

        await navigate('bestaetigung', {
          film: filmTitel,
          datum: filmDetails[0]?.trim() || '',
          uhrzeit: filmDetails[1]?.trim().replace(' Uhr', '') || '',
          sitze: reservierungsDaten.sitze,
          name
        });
      } catch (err) {
        alert('Fehler bei der Reservierung: ' + err.message);
      }
    }

    // Zurück zum Programm
    if (e.target.classList.contains('zurueck-btn')) {
      navigate('kunde');
    }
  });
});
