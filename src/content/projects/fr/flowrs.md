---
lang: "fr"
baseSlug: "flowrs"
title: "FlowRS - Multi order books crypto temps réel"
shortDesc:
  - "Latence sub-10µs - P50: 9µs, P99: 195µs (optimisations CPU cache + fixed-point)"
  - "Multi-exchange - Agrégation temps réel de 4 exchanges crypto (Binance, Bybit, Kraken, Coinbase)"
  - "Architecture lock-free - Ring buffer atomique, DashMap concurrent, zero-allocation parsing"
  - "Design extensible - Plugin pattern, ajout d'exchange en ~200 lignes"
tech: [ "Rust", "Tokio (async)", "WebSocket", "DashMap", "Vue 3", "TypeScript" ]
category: "personal"
featured: true
order: 1
links:
  github: "https://github.com/MehdiRhifar/FlowRS"
---

> **Note** : Ce projet n'est pas déployé en production en raison des coûts de bande passante. Une démonstration vidéo
> est disponible ci-dessous.

## Résultats de performance

| Métrique    | Latence |
|-------------|---------|
| **P50**     | 9µs     |
| **Moyenne** | 20µs    |
| **P95**     | 63µs    |
| **P99**     | 195µs   |

**Throughput :** 500-1000 msg/s sur 4 exchanges × 9 symboles (36 flux simultanés)

## Démonstration

<video controls width="100%" style="max-width: 1200px; border-radius: 8px; margin: 20px 0;">
  <source src="/assets/flowrs_demo.mov" type="video/mp4">
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>

*Interface temps réel : agrégation multi-exchange, carnets d'ordres, flux de trades et métriques de performance.*

---

## Optimisations Low-Latency

### 1. Order Book optimisé pour le cache CPU

Les implémentations classiques utilisent `BTreeMap<Price, Quantity>` pour des opérations O(log n). FlowRS utilise un *
*Vec de taille fixe** :

```
BTreeMap (Classique)             Vec (FlowRS)
├─ Pointer chasing               ├─ Bloc mémoire contigu
├─ Allocations heap dispersées   ├─ Allocation unique
├─ Cache misses à chaque nœud    ├─ Prefetch-friendly
└─ O(log n) mais cache-cold      └─ O(n) mais L1/L2 cache-hot
```

**Pourquoi ça gagne :** Avec 25 niveaux de prix (200 bytes), le carnet entier tient dans le cache L1. Les CPUs itèrent
la mémoire contiguë ~100x plus vite que le pointer chasing. L'avantage théorique O(log n) disparaît quand chaque accès
de nœud est un cache miss.

### 2. Arithmétique entière fixed-point

Tous les prix et quantités utilisent `u64` avec un facteur d'échelle 1e8 au lieu de `Decimal` ou `f64` :

```rust
const SCALE_FACTOR: u64 = 100_000_000; // 8 décimales

// "97234.56" → 9_723_456_000_000
fn fast_parse_u64(s: &str) -> Option<u64> {
    // Math entière pure, zero allocation
    // Conversion ASCII → digit inline
}
```

**Avantages :**

- **Pas d'erreurs floating-point** - Représentation décimale exacte
- **5-10x plus rapide que Decimal** - Opérations CPU natives
- **8 bytes vs 16 bytes** - Meilleure utilisation du cache
- **SIMD-friendly** - Comparaisons vectorisables

### 3. Pipeline de métriques lock-free

Le tracking de latence utilise un ring buffer avec opérations atomiques. Le calcul des percentiles tourne en tâche de
fond :

```rust
// Hot path : écriture atomique O(1)
fn record(&self, latency_us: u64) {
    let idx = self.write_index.fetch_add(1, Relaxed) & 0x7FF; // Bitwise AND
    self.samples[idx].store(latency_us, Relaxed);
}

// Background (toutes les 900ms) : sélection partielle O(n)
fn update_percentiles(&self) {
    // select_nth_unstable() au lieu d'un tri complet
    // Scratch buffer pré-alloué
}
```

**Techniques :**

- `index & MASK` au lieu de `index % SIZE` - Évite la division entière coûteuse
- `select_nth_unstable()` - Sélection partielle O(n) vs tri O(n log n)
- Buffers pré-alloués - Zero allocation dans le hot path

### 4. Modèle de concurrence

**DashMap** (HashMap concurrent shardée) au lieu de `RwLock<HashMap>` :

- 16 shards indépendants avec verrouillage fin
- Plusieurs exchanges mettent à jour différents symboles sans contention

**Tasks d'exchange isolées :**

- Chaque exchange tourne dans sa propre task Tokio
- Logique de reconnexion indépendante (une panne n'affecte pas les autres)
- Récupération d'état automatique à la déconnexion

### Impact des optimisations

| Optimisation           | Avant                         | Après                     |
|------------------------|-------------------------------|---------------------------|
| Calcul des percentiles | Dans le hot path (1.26ms P99) | Tâche de fond (195µs P99) |
| Stockage des prix      | `Decimal`                     | `u64` - 5-10x plus rapide |
| Order book             | `BTreeMap`                    | `Vec` - Cache-friendly    |
| Buffer de métriques    | `Mutex<Vec>`                  | Ring buffer lock-free     |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Exchange Manager                        │
│            (Task Tokio par exchange)                      │
└──────────────────────────────────────────────────────────┘
         │           │           │           │
         ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Binance │ │  Bybit  │ │ Kraken  │ │Coinbase │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘
         │           │           │           │
         └───────────┴─────┬─────┴───────────┘
                           ▼
              ┌────────────────────────┐
              │   OrderBook Manager    │
              │   (DashMap par symbole)│
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Broadcast Channel    │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   WebSocket Clients    │
              └────────────────────────┘
```

### Architecture Plugin

Ajouter un nouvel exchange nécessite ~200 lignes :

```rust
pub struct NewExchangeConnector { symbols: Vec<String> }

impl NewExchangeConnector {
    pub fn build_subscription_url(&self) -> String { ... }
    pub fn parse_message(&self, raw: &str) -> Option<MarketMessage> { ... }
    pub fn get_subscription_messages(&self) -> Vec<String> { ... }
}
```

---

## Stack technique

**Backend (Rust)**

- Tokio async runtime
- tokio-tungstenite (WebSocket)
- DashMap (HashMap concurrent)
- serde/serde_json
- jemalloc allocator

**Frontend (Vue 3 + TypeScript)**

- Vite build tool
- Composition API
- WebSocket natif

---

## Enseignements clés

1. **La localité cache bat la complexité algorithmique** - O(n) avec cache L1 > O(log n) avec cache misses
2. **Les entiers battent les décimaux** - L'arithmétique fixed-point est plus rapide et évite les erreurs de précision
3. **Sortir le travail du hot path** - Tâches de fond pour les calculs coûteux
4. **Éviter les allocations** - Buffers pré-alloués, `Option` plutôt que `Box<dyn Error>`
5. **Lock-free quand possible** - Atomics pour les métriques, maps shardées pour les données
