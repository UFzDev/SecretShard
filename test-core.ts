import { split, combine } from './src/core';

const secret = "TopSecret123! @SecretShard";
const config = { threshold: 3, shares: 5 };

console.log("--- 🛡️ SecretShard Core Test ---");

try {
  const shares = split(secret, config);
  
  // Prueba 1: Reconstrucción con EXACTAMENTE k partes
  const subsetK = shares.slice(0, 3);
  const recoveredK = combine(subsetK);
  if (recoveredK === secret) {
    console.log("TEST 1 (k=3): ✅ SUCCESS");
  } else {
    console.error("TEST 1 (k=3): ❌ FAILED. Got: " + recoveredK);
  }

  // Prueba 2: Reconstrucción con MÁS de k partes
  const recoveredAll = combine(shares);
  if (recoveredAll === secret) {
    console.log("TEST 2 (n=5): ✅ SUCCESS");
  } else {
    console.error("TEST 2 (n=5): ❌ FAILED");
  }

  // Prueba 3: Intento con MENOS de k partes (k-1)
  const subsetLess = shares.slice(0, 2);
  const recoveredLess = combine(subsetLess);
  if (recoveredLess !== secret) {
    console.log("TEST 3 (k=2): ✅ SUCCESS (Security preserved)");
  } else {
    console.error("TEST 3 (k=2): ❌ FAILED (Secret leaked with k-1 shares!)");
  }

} catch (err) {
  console.error("❌ ERROR CRÍTICO:", err);
}
