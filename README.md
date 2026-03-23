# 🔐 SecretShard

> **"Un secreto deja de serlo cuando alguien más lo conoce; una shard solo es poder potencial."**

SecretShard es una implementación de alto rendimiento del **Esquema de Compartición de Secretos de Shamir (SSS)** bajo una arquitectura **Zero-Knowledge**. Permite fragmentar información sensible en $n$ partes, requiriendo un umbral mínimo de $k$ fragmentos para reconstruir el secreto original, eliminando puntos únicos de falla.

---

## 🎯 Pilares del Proyecto

*   **Arquitectura Zero-Knowledge**: El secreto nunca abandona el cliente. Nada se almacena en bases de datos centrales.
*   **Cuerpos Finitos ($GF(p)$)**: Aritmética modular sobre el **Primo de Mersenne** $P = 2^{127} - 1$ para seguridad perfecta.
*   **Precisión Arbitraria**: Implementación nativa con `BigInt` para evitar pérdida de entropía en valores criptográficos.
*   **Seguridad Activa**: Mitigación del *Error del Índice Cero* y generación de aleatoriedad vía `window.crypto`.

---

## 🧠 Fundamentos Matemáticos

El núcleo de SecretShard reside en la construcción de un polinomio aleatorio de grado $k-1$:

$$f(x) = S + a_1x + a_2x^2 + \dots + a_{k-1}x^{k-1} \pmod P$$

Donde $S$ es el secreto original. Para recuperar $S$, el sistema utiliza la **Interpolación de Lagrange** para hallar el valor en el origen:

$$S = f(0) = \sum_{i=1}^{k} y_i \left( \prod_{j=1, j \neq i}^{k} \frac{x_j}{x_j - x_i} \right) \pmod P$$

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Razón |
| :--- | :--- | :--- |
| **Runtime** | [Bun](https://bun.sh) | Ultra-fast execution & native TS support |
| **Backend/Core** | TypeScript | Tipado estricto para operaciones `BigInt` |
| **Bundler** | [Vite](https://vitejs.dev) | Modern frontend DX & build optimization |
| **Seguridad** | Web Crypto API | CSPRNG (Cryptographically Secure Random Number Gen) |

---

## 🏗️ Arquitectura de Flujo

```mermaid
graph TD
    A[Secreto Original] --> B{Fragmentación (SSS)}
    B --> C1[Shard 1]
    B --> C2[Shard 2]
    B --> Cn[Shard n]
    C1 -.-> D{Umbral k}
    C2 -.-> D
    Cn -.-> D
    D --> E[Reconstrucción de Lagrange]
    E --> F[Secreto Recuperado]
    
    style A fill:#059669,stroke:#fff,color:#fff
    style F fill:#059669,stroke:#fff,color:#fff
    style B fill:#334155,stroke:#fff,color:#fff
    style D fill:#334155,stroke:#fff,color:#fff
```

---

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/UFzDev/SecretShard.git
cd SecretShard
```

### 2. Instalar dependencias
```bash
bun install
```

### 3. Ejecutar entorno de desarrollo
```bash
bun dev
```

### 4. Pruebas de Calidad
```bash
bun test
```

---

## 🛡️ Casos de Uso e Inspiración
*   **HashiCorp Vault**: Resguardo de llaves maestras industriales.
*   **SLIP-0039**: Estándar para fragmentación de frases semilla (seed phrases).
*   **Ceremonias DNSSEC**: Gestión de las llaves raíz de Internet.

---

> [!IMPORTANT]
> **Seguridad ante todo**: Esta implementación evita que ningún participante reciba una coordenada $x=0$, lo que expondría el secreto en texto plano de forma inmediata.

---

Desarrollado con ❤️ por **UFzDev**. 
*(2024 - SecretShard Project)*