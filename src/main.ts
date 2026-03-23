import './style.css'

/**
 * Manages the theme switching logic (Light/Dark).
 */
function setupTheme(): void {
  const html = document.documentElement;
  const toggleBtnId = 'theme-toggle';
  

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // 1. Initial State: Solo sincronizamos si hay cambios manuales posteriores.
  // La carga inicial la gestiona el script bloqueante en index.html para evitar FOUC.


  // 2. Logic to toggle
  const toggleTheme = () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // 3. Sync with OS changes (if no manual choice was made)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 4. Attach Event
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(`#${toggleBtnId}`)) {
      toggleTheme();
    }
  });
}


// 🚀 Initialization
setupTheme();


