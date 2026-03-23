# 🛡️ SecretShard

**SecretShard** es una implementación criptográfica robusta, visual y educativa del Esquema de Intercambio de Secretos de Shamir (Shamir's Secret Sharing). 

Diseñado para desarrolladores e ingenieros de seguridad, este proyecto no solo permite dividir y reconstruir secretos de forma segura, sino que también ofrece una ventana visual a las matemáticas subyacentes detrás de la criptografía moderna.

## ✨ Características Principales

*   🔐 **Fragmentación Segura:** Divide cualquier secreto en $n$ fragmentos (hasta un máximo de 255), requiriendo un umbral personalizable de $k$ partes para poder reconstruirlo.
*   📊 **Visualización Analítica Avanzada:** Integración profunda con **Chart.js** para renderizar y comparar la interpolación de Lagrange tanto en el plano real como en su vista global dentro del campo finito GF(256).
*   🌗 **Soporte de Temas (Dark/Light):** Gestión de interfaz fluida con adaptación automática o manual a preferencias de tema claro y oscuro a través de CSS Variables.
*   📱 **Responsive Design:** Orquestación del DOM optimizada para una experiencia impecable en cualquier dispositivo, todo construido con Vanilla TS y CSS (Glassmorphism).

## 🧠 Arquitectura y Decisiones Técnicas

### El Esquema de Shamir
El algoritmo se basa en la interpolación de Lagrange. Matemáticamente, se construye un polinomio de grado $k-1$ (donde $k$ es el umbral de partes necesarias) en el que el término independiente ($a_0$) es el secreto real que queremos proteger. La división se procesa iterando a través de cada byte del secreto original mediante la generación de polinomios únicos.

### ¿Por qué utilizar un Campo de Galois - GF(256)?
Si utilizáramos aritmética tradicional (números enteros o reales), la geometría del polinomio podría filtrar información parcial sobre el secreto a medida que se recolectan fragmentos. Para evitar esto y garantizar **secreto perfecto**, SecretShard opera estrictamente dentro de la Aritmética de Campos Finitos (Galois Field), específicamente **GF(256)**.

Las ventajas de esta decisión de diseño son múltiples:
*   **Seguridad Incondicional:** Todo cálculo permanece encapsulado en valores de 8 bits (0-255). Cualquier conjunto de fragmentos merno al umbral $k$ no revela absolutamente nada sobre el dato original.
*   **Rendimiento en $O(1)$:** Las operaciones complejas se han optimizado al máximo. Las sumas y restas en GF(256) se resuelven como simples operaciones de bits XOR (`(a ^ b) & 0xFF`). Las multiplicaciones y divisiones evitan ciclos pesados utilizando un sistema de tablas de búsqueda (Look-up Tables) para logaritmos (`LOG`) y exponenciales (`EXP`).
*   **Matemática de Precisión:** El campo finito está construido sobre el polinomio primitivo de Rijndael (AES): $x^8 + x^4 + x^3 + x + 1$ o `0x11d`.
*   **Eficiencia Computacional:** La evaluación polinómica se realiza utilizando el **Esquema de Horner**, reduciendo drásticamente la cantidad de multiplicaciones necesarias en GF(256).

## 🛠️ Tecnologías Utilizadas

*   **TypeScript:** Para un tipado estricto y seguridad en el manejo de estructuras matemáticas.
*   **Vite:** Herramienta de construcción (bundler) ultrarrápida.
*   **Bun:** Runtime y gestor de paquetes de alto rendimiento.
*   **Chart.js:** Renderizado de gráficos interactivos para los polinomios.
*   **Vanilla CSS:** Estilizado modular, veloz y sin dependencias externas (Glassmorphism).

## 📂 Estructura del Proyecto

El código está modularizado para separar de forma limpia la lógica criptográfica de la capa de presentación:

```text
src/
├── core/
│   ├── field.ts      # Aritmética pura de Campos Finitos GF(256) (Tablas, XOR, Horner)
│   ├── shamir.ts     # Core de división, combinación e Interpolación de Lagrange
│   ├── types.ts      # Interfaces para configuración y definición de 'Shares'
│   └── index.ts      # Barril de exportación para el core
├── styles/
│   ├── base.css      # Variables globales (temas) y reset básico
│   ├── layout.css    # Distribución del dashboard y tabs
│   ├── components.css # Estilizado de paneles, botones e inputs (Glassmorphism)
│   └── main.css      # Transiciones y overrides globales
└── main.ts           # Orquestador del DOM, binding con Chart.js y gestor de temas
```

## 🚀 Instalación y Desarrollo

SecretShard está optimizado para funcionar con **Bun** 🥟, garantizando tiempos de resolución y arranque casi instantáneos.

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/secretshard.git
   cd secretshard
   ```

2. **Instala las dependencias usando Bun**
   ```bash
   bun install
   ```

3. **Inicia el servidor de desarrollo (Vite)**
   ```bash
   bun run dev
   ```

4. **Construye para producción**
   ```bash
   bun run build
   ```

---
*Construido con ☕ y matemáticas discretas.*
