import { add, multiply, divide, evaluatePolynomial } from './field';
import type { Share, SecretConfig } from './types';

/**
 * Divide un secreto (string) en múltiples fragmentos.
 */
export function split(secret: string, config: SecretConfig): Share[] {
  const { threshold: k, shares: n } = config;
  if (k < 2) throw new Error("El umbral debe ser al menos 2.");
  if (n > 255) throw new Error("El número de partes no puede exceder 255 en el campo actual.");
  if (k > n) throw new Error("El umbral no puede ser mayor al número total de partes.");

  const secretBytes = new TextEncoder().encode(secret);
  const result: Share[] = Array.from({ length: n }, (_, i) => ({ x: i + 1, y: "" }));

  // Para cada byte del secreto, generamos un polinomio único
  for (const byte of secretBytes) {
    const coefficients = new Uint8Array(k);
    coefficients[0] = byte;

    // Coeficientes aleatorios para x^1...x^(k-1)
    const randomCoefficients = new Uint8Array(k - 1);
    crypto.getRandomValues(randomCoefficients);

    for (let j = 1; j < k; j++) {
      coefficients[j] = randomCoefficients[j - 1];
    }

    // Evaluamos el polinomio para cada fragmento x = 1...n
    for (let x = 1; x <= n; x++) {
      const y = evaluatePolynomial(Array.from(coefficients), x);
      // Almacena el byte en hexadecimal para serialización
      result[x - 1].y += y.toString(16).padStart(2, '0');
    }
  }

  return result;
}

/**
 * Reconstruye el secreto original a partir de un conjunto de fragmentos.
 */
export function combine(shares: Share[]): string {
  if (shares.length === 0) return "";

  // Todos los 'y' tienen la misma longitud (número de bytes)
  const byteCount = shares[0].y.length / 2;
  const secretBytes = new Uint8Array(byteCount);

  for (let i = 0; i < byteCount; i++) {
    const points: [number, number][] = shares.map(s => [
      s.x,
      parseInt(s.y.substring(i * 2, i * 2 + 2), 16)
    ]);
    secretBytes[i] = lagrangeInterpolation(points, 0);
  }

  return new TextDecoder().decode(secretBytes);
}

/**
 * Interpolación de Lagrange en GF(256).
 * Calcula f(x) dado un conjunto de puntos (xi, yi).
 */
function lagrangeInterpolation(points: [number, number][], x: number): number {
  let result = 0;

  for (let i = 0; i < points.length; i++) {
    const [xi, yi] = points[i];
    let li = 1;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const [xj] = points[j];

      const num = add(x, xj);
      const den = add(xi, xj);
      li = multiply(li, divide(num, den));
    }

    result = add(result, multiply(yi, li));
  }

  return result;
}
