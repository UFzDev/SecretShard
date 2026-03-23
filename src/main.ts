import { Chart, registerables } from 'chart.js';
import { split } from './core';

Chart.register(...registerables);

let vizChart: Chart | null = null;
let currentChartMode: 'polynomial' | 'global' = 'polynomial';
let lastSecret: string = '';
let lastShares: any[] = [];

/**
 * Gestión del Tema (Light/Dark).
 */
function setupTheme(): void {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  const toggleTheme = () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (vizChart) updateChartTheme();
  };

  toggleBtn?.addEventListener('click', toggleTheme);
}

function updateChartTheme(): void {
  if (!vizChart) return;
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  vizChart.options.scales!.x!.ticks!.color = textColor;
  vizChart.options.scales!.y!.ticks!.color = textColor;
  vizChart.options.scales!.x!.grid!.color = gridColor;
  vizChart.options.scales!.y!.grid!.color = gridColor;
  vizChart.update();
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

      if (resultsPanel) {
        resultsPanel.classList.remove('hidden');
        resultsPanel.scrollIntoView({ behavior: 'smooth' });
      }

      lastSecret = secret;
      lastShares = shares;
      
      const firstByteSecret = new TextEncoder().encode(secret)[0];
      const plotPoints = shares.map(s => ({ x: s.x, y: parseInt(s.y.substring(0, 2), 16) }));
      
      vizChart = renderRealChart(firstByteSecret, plotPoints, vizChart);

    } catch (error) {
      console.error(error);
    }
  });

  const toggleBtn = document.getElementById('toggle-view-btn');
  toggleBtn?.addEventListener('click', () => {
    if (!lastSecret || lastShares.length === 0) return;
    
    currentChartMode = currentChartMode === 'polynomial' ? 'global' : 'polynomial';
    toggleBtn.textContent = currentChartMode === 'polynomial' ? 'Ver Visión Global' : 'Ver Polinomio (Byte 1)';
    
    const firstByteSecret = new TextEncoder().encode(lastSecret)[0];
    if (currentChartMode === 'polynomial') {
      const plotPoints = lastShares.map(s => ({ x: s.x, y: parseInt(s.y.substring(0, 2), 16) }));
      vizChart = renderRealChart(firstByteSecret, plotPoints, vizChart);
    } else {
      // Visión Global: Nube de todos los bytes
      const allPoints: { x: number, y: number }[] = [];
      lastShares.forEach(s => {
        for (let i = 0; i < s.y.length / 2; i++) {
          allPoints.push({ x: s.x, y: parseInt(s.y.substring(i * 2, i * 2 + 2), 16) });
        }
      });
      vizChart = renderRealChart(firstByteSecret, allPoints, vizChart, true);
    }
  });

  copyAllBtn?.addEventListener('click', () => {
    const cards = document.querySelectorAll('.share-text');
    const allText = Array.from(cards).map(c => c.getAttribute('title')).join('\n');
    navigator.clipboard.writeText(allText);
  });
}

/**
 * Visualización Real usando Interpolación de Lagrange (sobre Reales).
 * Si isGlobal es true, muestra una nube de puntos de todos los bytes.
 */
function renderRealChart(secretVal: number, points: { x: number, y: number }[], existingChart: Chart | null, isGlobal: boolean = false): Chart | null {
  const ctx = document.getElementById('viz-chart') as HTMLCanvasElement;
  if (!ctx) return null;

  if (existingChart) {
    existingChart.destroy();
  }

  const isDark = document.documentElement.classList.contains('dark');
  const primaryColor = '#10b981';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  const allPoints = [{ x: 0, y: secretVal }, ...points];
  
  const lagrange = (x: number, pts: {x: number, y: number}[]) => {
    let total = 0;
    for (let i = 0; i < pts.length; i++) {
      let basis = 1;
      for (let j = 0; j < pts.length; j++) {
        if (i !== j) {
          basis *= (x - pts[j].x) / (pts[i].x - pts[j].x);
        }
      }
      total += pts[i].y * basis;
    }
    return total;
  };

  const curveData = [];
  const maxIdx = Math.max(...allPoints.map(p => p.x));
  
  for (let x = -0.5; x <= maxIdx + 0.5; x += 0.1) {
    curveData.push({ x, y: lagrange(x, allPoints) });
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: isGlobal ? 'Todos los Bytes' : 'Curva de Lagrange (Real)',
          data: isGlobal ? points : curveData,
          borderColor: primaryColor,
          borderWidth: isGlobal ? 0 : 2,
          pointRadius: isGlobal ? 3 : 0,
          backgroundColor: isGlobal ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
          showLine: !isGlobal,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Secreto (Byte 1)',
          data: [{ x: 0, y: secretVal }],
          backgroundColor: '#ef4444',
          pointRadius: isGlobal ? 0 : 7,
          pointHoverRadius: isGlobal ? 0 : 9,
          showLine: false,
          type: 'scatter'
        },
        {
          label: isGlobal ? 'Fragmentos (Nube)' : 'Fragmentos (Byte 1)',
          data: points,
          backgroundColor: primaryColor,
          pointRadius: isGlobal ? 2 : 6,
          pointHoverRadius: isGlobal ? 4 : 8,
          showLine: false,
          type: 'scatter'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const p = context.parsed;
              if (context.datasetIndex === 1) return `Secreto: ${p.y} (dec)`;
              if (context.datasetIndex === 2) return `Fragmento ${p.x}: ${p.y} (dec)`;
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 1 },
          title: { display: true, text: isGlobal ? 'Visión Global (Piezas)' : 'ID de Fragmento (x)', color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor },
          title: { display: true, text: isGlobal ? 'Distribución de Bytes' : 'Valor del Byte (y)', color: textColor }
        }
      }
    }
  });
}

// 🚀 Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupCharacterCounter();
  setupSplitLogic();
});
