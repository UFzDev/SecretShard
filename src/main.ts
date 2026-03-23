import './style.css'

/**
 * Initializes the application dashboard by injecting the template into the DOM.
 * Follows the visual and structural standards for a premium experience.
 */
function initApp(): void {
  const appContainer = document.querySelector<HTMLDivElement>('#app');

  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  appContainer.innerHTML = `
    <header>
      <h1>SecretShard</h1>
    </header>
    
    <main>
      <section class="content-section">
        <p>
          SecretShard es una implementación del <strong>Esquema de Shamir</strong> para dividir secretos en partes seguras.
        </p>
      </section>

      <section class="content-section">
        <h2>Cómo funciona</h2>
        <ul class="feature-list">
          <li class="feature-item"><strong>Divide:</strong> Tu secreto se fragmenta en varias piezas.</li>
          <li class="feature-item"><strong>Protege:</strong> Ninguna pieza individual revela nada del secreto.</li>
          <li class="feature-item"><strong>Recupera:</strong> Solo con el mínimo de piezas configurado puedes volver a unirlo.</li>
        </ul>
      </section>
    </main>

    <footer class="footer">
      <p>Desarrollado con Bun + TypeScript</p>
    </footer>
  `;
}

// Ensure the auth or other dependencies are ready if needed
initApp();
