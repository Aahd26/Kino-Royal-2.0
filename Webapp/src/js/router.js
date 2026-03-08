import { RollenView } from './Views/rollen.js';
import { BetreiberView } from './Views/betreiber.js';
import { KundeView } from './Views/kunde.js';
import { ReservierungView } from './Views/reservierung.js';
import { BestaetigungView } from './Views/bestaetigung.js';

export async function navigate (route, filmData = null) {
  const app = document.getElementById('app');
  switch (route) {
    case 'betreiber':
      app.innerHTML = BetreiberView();
      break;
    case 'kunde':
      app.innerHTML = await KundeView();
      break;
    case 'reservierung':
      app.innerHTML = await ReservierungView(filmData);
      break;
    case 'bestaetigung':
      app.innerHTML = await BestaetigungView(filmData);
      break;
    default:
      app.innerHTML = RollenView();
  }
}
