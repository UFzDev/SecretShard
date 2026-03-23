# 🛡️ SecretShard: Master Class en Criptografía Distribuida

**SecretShard** es una implementación de grado doctoral del Esquema de Compartición de Secretos de Shamir (SSS), diseñada para ofrecer una seguridad incondicional y una transparencia técnica absoluta a través de visualizaciones matemáticas rigurosas.

---

## 🏛️ 1. Fundamentos: Álgebra de Cuerpos Finitos (GF256)

Para garantizar el **Secreto Perfecto**, SecretShard no opera en el dominio de los números reales (donde la precisión es limitada y la información se filtra), sino en el **Cuerpo de Galois de 256 elementos**, denotado como $GF(2^8)$.

### Aritmética de Rijndael
Utilizamos el polinomio primitivo irreducible estándar de AES:
$$P(x) = x^8 + x^4 + x^3 + x + 1$$

Esto significa que:
- **Suma/Resta**: Se resuelven mediante la operación bitwise **XOR**. Sumar y restar son idénticos en este campo.
- **Multiplicación/División**: Se optimizan mediante tablas de búsqueda para logaritmos discretos (`LOG`) y sus inversos exponenciales (`EXP`), basándose en un generador primitivo (típicamente 3).
- **Cierre Algebraico**: Cualquier operación entre dos elementos del campo (0-255) resulta siempre en otro elemento dentro del mismo rango, sin desbordamientos.

---

## 📈 2. Interpolación de Lagrange: El Secreto en el Origen

El corazón de la fragmentación es un polinomio de grado $k-1$, donde $k$ es el umbral mínimo de recuperación:
$$f(x) = a_0 + a_1x + a_2x^2 + \dots + a_{k-1}x^{k-1}$$

Donde:
- $a_0 = S$ (el byte del secreto).
- $a_1, \dots, a_{k-1}$ son coeficientes aleatorios generados con **CSPRNG** (`window.crypto.getRandomValues`).

### Recuperación Formal
Dado un conjunto de $k$ fragmentos $(x_i, y_i)$, reconstruimos el secreto evaluando el polinomio en $x=0$ mediante la fórmula de Lagrange:
$$S = f(0) = \sum_{i=1}^{k} y_i \prod_{j=1, j\neq i}^{k} \frac{x_j}{x_j \oplus x_i}$$
*Nota: La división y multiplicación se realizan estrictamente en aritmética de campo finito (GF256).*

---

## 🗺️ 3. El "Mapa de Puntos" (Point Map) y Visualización

SecretShard resuelve el desafío de visualizar la criptografía discreta (que parece "ruido" aleatorio) proyectándola en un mapa educativo comprensible.

### Gráfica del Plano Real
Cuando ves la curva en la aplicación, el motor realiza una **interpolación de Lagrange sobre números reales** ($\mathbb{R}$) utilizando:
- **Eje X (Fragmento ID)**: El identificador numérico de la pieza.
- **Eje Y (Valor Byte)**: El valor decimal del primer byte del fragmento.

### La "Visión Global"
Esta vista expande el análisis a **todos los bytes** del secreto simultáneamente. En lugar de una curva única, genera una "nube de puntos" que revela la densidad estadística del esquema, permitiendo al usuario auditar visualmente que no existen patrones predecibles en las piezas generadas.

---

## ⚙️ 4. Arquitectura de Bits en Paralelo

Un secreto (cadena de texto) se fragmenta procesando cada byte de forma aislada y paralela:
1. **Stream de Bytes**: El secreto se convierte en un buffer de bytes.
2. **Polinomios Independientes**: Por cada byte, se genera un polinomio $f_i(x)$ único.
3. **Generación de Fragmentos**: Se evalúan todos los polinomios en $x=1, \dots, x=n$.
4. **Encapsulamiento**: El fragmento final es la concatenación de los resultados, prefijado por su ID de fragmento.

---

## 🛡️ 5. Seguridad Defensiva y Análisis de Amenazas

### Mitigaciones Implementadas
- **Resistencia a Side-Channel**: Las tablas de búsqueda permiten operaciones en tiempo constante, mitigando ataques de temporización.
- **Aislamiento de Precisión**: Al no usar números flotantes en el core criptográfico, eliminamos las vulnerabilidades por errores de redondeo que afectan a esquemas basados en reales.
- **Entropía Segura**: El uso de CSPRNG garantiza que los coeficientes sean impredecibles incluso ante adversarios con gran poder de cómputo.

---
*Documentación técnica de SecretShard | Ingeniería de Grado Doctoral*
