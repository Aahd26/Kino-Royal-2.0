(() => {
  // Webapp/src/js/Views/rollen.js
  function RollenView () {
    return `
    <div class="rollen">
      <h1>Willkommen in Kino Royal!</h1>
      <button class="kunde">Kunde</button>
      <button class="betreiber">Betreiber</button>
    </div>
  `;
  }

  // Webapp/src/js/Main.mjs
  document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
      console.error(' #app element not found');
      return;
    }
    app.innerHTML = RollenView();
  });
  window.selectRole = function (role) {
    (void 0).role = role;
    render(role === 'operator' ? 'operator-rooms' : 'customer-shows');
  };
})();
