import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/main.css';
import { split } from './core';

/**
 * Gestión del Tema (Light/Dark).
 */
function setupTheme(): void {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  const toggleTheme = () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  toggleBtn?.addEventListener('click', toggleTheme);
}

/**
 * Contador de Caracteres.
 */
function setupCharacterCounter(): void {
  const secretInput = document.getElementById('secret-input') as HTMLTextAreaElement;
  const counter = document.getElementById('char-counter');
  const MAX_CHARS = 2000;

  secretInput?.addEventListener('input', () => {
    const len = secretInput.value.length;
    if (counter) {
      counter.textContent = `${len} / ${MAX_CHARS}`;
      // Efecto visual si llegamos al límite
      counter.style.color = len >= MAX_CHARS ? '#ef4444' : 'var(--primary)';
    }
  });
}


/**
 * Lógica de Fraccionamiento (Split).
 */
function setupSplitLogic(): void {
  const secretInput = document.getElementById('secret-input') as HTMLTextAreaElement;
  const thresholdRange = document.getElementById('threshold-range') as HTMLInputElement;
  const sharesRange = document.getElementById('shares-range') as HTMLInputElement;
  const thresholdVal = document.getElementById('threshold-val');
  const sharesVal = document.getElementById('shares-val');
  const splitBtn = document.getElementById('split-btn');
  const resultsPanel = document.getElementById('results-panel');
  const sharesGrid = document.getElementById('shares-grid');
  const copyAllBtn = document.getElementById('copy-all-btn');

  // Actualizar indicadores visuales
  thresholdRange?.addEventListener('input', () => {
    if (thresholdVal) thresholdVal.textContent = thresholdRange.value;
    if (parseInt(thresholdRange.value) > parseInt(sharesRange.value)) {
      sharesRange.value = thresholdRange.value;
      if (sharesVal) sharesVal.textContent = sharesRange.value;
    }
  });

  sharesRange?.addEventListener('input', () => {
    if (sharesVal) sharesVal.textContent = sharesRange.value;
    if (parseInt(sharesRange.value) < parseInt(thresholdRange.value)) {
      thresholdRange.value = sharesRange.value;
      if (thresholdVal) thresholdVal.textContent = thresholdRange.value;
    }
  });

  splitBtn?.addEventListener('click', () => {
    const secret = secretInput.value.trim();
    if (!secret) return;

    const k = parseInt(thresholdRange.value);
    const n = parseInt(sharesRange.value);

    try {
      const shares = split(secret, { threshold: k, shares: n });
      
      if (sharesGrid) {
        sharesGrid.innerHTML = '';
        shares.forEach(share => {
          const shareStr = `${share.x}-${share.y}`;
          const card = document.createElement('div');
          card.className = 'share-card-item';

          const shareText = document.createElement('span');
          shareText.className = 'share-text';
          shareText.title = shareStr;
          shareText.textContent = `Pieza ${share.x}: ${shareStr}`;

          const copyBtn = document.createElement('button');
          copyBtn.className = 'copy-btn-mini';
          copyBtn.title = 'Copiar';
          copyBtn.textContent = 'Copiar';

          card.appendChild(shareText);
          card.appendChild(copyBtn);

          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(shareStr);
          });
          
          sharesGrid.appendChild(card);
        });
      }

      resultsPanel?.classList.remove('hidden');
      resultsPanel?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error(error);
    }
  });

  copyAllBtn?.addEventListener('click', () => {
    const cards = document.querySelectorAll('.share-text');
    const allText = Array.from(cards).map(c => c.getAttribute('title')).join('\n');
    navigator.clipboard.writeText(allText);
  });
}

// 🚀 Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupCharacterCounter();
  setupSplitLogic();
});
