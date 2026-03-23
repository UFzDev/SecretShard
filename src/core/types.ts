export interface Share {
  // El índice de la parte (coordenada x en el polinomio).
  x: number;
  // El valor de la parte (coordenada y codificada en Base64 o Hex).
  y: string;
}

/**
 * Parámetros de configuración para la división del secreto.
 */
export interface SecretConfig {
  threshold: number; // Mínimo de partes necesarias (k)
  shares: number;    // Total de partes a generar (n)
}

/**
 * Resultado de una operación de fraccionamiento.
 */
export interface ShardResult {
  shares: Share[];
  metadata: {
    createdAt: number;
    threshold: number;
    total: number;
  };
}
