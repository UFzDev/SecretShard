/**
 * Implementación de Aritmética de Campos Finitos (Galois Field - GF(256)).
 * Basado en el polinomio primitivo x^8 + x^4 + x^3 + x + 1 (0x11d).
 */

const PRIMITIVE_POLYNOMIAL = 0x11d;

// Tablas de búsqueda para optimizar operaciones matemáticas
const LOG = new Uint8Array(256);
const EXP = new Uint8Array(512);

/**
 * Inicialización de las tablas de logs y exponentes.
 */
(function initTables() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    EXP[i + 255] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= PRIMITIVE_POLYNOMIAL;
    }
  }
})();

/**
 * Suma (y resta) en GF(256) es equivalente a un XOR.
 */
export const add = (a: number, b: number): number => (a ^ b) & 0xFF;

/**
 * Multiplicación en GF(256) usando tablas log.
 */
export const multiply = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
};

/**
 * División en GF(256).
 */
export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("División por cero en GF(256)");
  if (a === 0) return 0;
  return EXP[LOG[a] - LOG[b] + 255];
};

/**
 * Evaluación de un polinomio en GF(256) usando el Esquema de Horner.
 * f(x) = a_n*x^n + ... + a_1*x + a_0
 */
export const evaluatePolynomial = (poly: number[], x: number): number => {
  if (x === 0) return poly[0];
  let res = 0;
  for (let i = poly.length - 1; i >= 0; i--) {
    res = add(multiply(res, x), poly[i]);
  }
  return res;
};
