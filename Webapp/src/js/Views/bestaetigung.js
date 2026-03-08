import QRCode from 'qrcode';

export async function BestaetigungView (reservierungsDaten) {
  // QR-Code Daten als String
  const qrDaten = JSON.stringify({
    film: reservierungsDaten.film,
    datum: reservierungsDaten.datum,
    sitze: reservierungsDaten.sitze,
    name: reservierungsDaten.name
  });

  // QR-Code als Base64 Image generieren
  const qrCodeUrl = await QRCode.toDataURL(qrDaten);

  return `
    <div class="top-black"></div>
    <div class="nav-bar">
      <img src="logo.png" alt="Kino Royal" class="logo">
      <button class="role-switch">Rolle wechseln</button>
    </div>

    <div class="bestaetigung-container">
      <h2> Reservierung bestätigt!</h2>
      
      <div class="reservierungs-details">
        <p><strong>Film:</strong> ${reservierungsDaten.film}</p>
        <p><strong>Datum:</strong> ${reservierungsDaten.datum}</p>
        <p><strong>Uhrzeit:</strong> ${reservierungsDaten.uhrzeit}</p>
        <p><strong>Sitze:</strong> ${
          (reservierungsDaten.sitze || [])
            .map(s => `Reihe ${s.reihe} - Sitz ${s.platz}`)
            .join(', ')
          }</p>
        <p><strong>Name:</strong> ${reservierungsDaten.name}</p>
      </div>

  <div class="qr-container">
    <h3>Ihr QR-Code</h3>
    <div class="qr-content">
      <div class="qr-code-wrapper">
        <img src="${qrCodeUrl}" alt="QR-Code" class="qr-code" />
      </div>
      <button class="drucken-btn" onclick="window.print()">
         QR-Code drucken
      </button>
    </div>
  </div>

      <button class="zurueck-btn">Zurück zum Programm</button>
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
