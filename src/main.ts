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
    <div class="content-wrapper">
      <h1>Hola Mundo</h1>
      <p>Bienvenido a tu plantilla ultraligera de alto rendimiento.</p>
      
      <div class="versions">
        <div class="badge" title="Bun Runtime">Bun <span>v1.3.10</span></div>
        <div class="badge" title="Vite Build Tool">Vite <span>v5.4.21</span></div>
        <div class="badge" title="TypeScript Language">TypeScript <span>v5.x</span></div>
      </div>
    </div>
  `;
}

// Ensure the auth or other dependencies are ready if needed
initApp();
