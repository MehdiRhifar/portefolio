---
title: "FlowRS - Agrégateur de carnets d'ordres temps réel"
shortDesc:
  - "Multi-exchange - Agrégation temps réel de 4 exchanges (Binance, Bybit, Kraken, Coinbase)"
  - "Latence sub-milliseconde - P50: ~200µs, P99: ~1.5ms, 500-1000 msg/sec"
  - "Architecture lock-free - DashMap concurrent, métriques atomiques, zero-copy broadcasting"
  - "Design extensible - Plugin pattern, ajout d'exchange en ~200 lignes"
tech: ["Rust", "Tokio (async)", "WebSocket", "DashMap", "Vue 3", "TypeScript"]
category: "personal"
featured: true
order: 1
links:
  github: "https://github.com/MehdiRhifar/FlowRS"
---

> **Note** : Ce projet n'est pas déployé en production en raison des coûts élevés de bande passante générés par l'agrégation temps réel de multiples flux WebSocket simultanés. Une démonstration vidéo est disponible ci-dessous.

## Vue d'ensemble

Agrégateur haute performance de carnets d'ordres de cryptomonnaies en temps réel. FlowRS normalise et agrège les flux de données de multiples exchanges via WebSocket, avec une latence sub-milliseconde et une architecture extensible.

**Caractéristiques principales :**
- Agrégation temps réel de 4 exchanges simultanément
- Support multi-symboles (9+ paires de trading)
- Flux de trades et order books unifiés
- Métriques de performance (latence, throughput, mémoire)
- Reconnexion automatique avec récupération d'état

### Mes Réalisations :
- Architecture plugin-based permettant l'ajout d'exchanges en ~200 lignes de code
- Pipeline de concurrence lock-free avec DashMap pour éliminer la contention
- Système de reconnexion isolée par exchange (une panne n'affecte pas les autres)
- Optimisations critiques réduisant le temps sous lock de 70% (~100µs → ~30µs)

## Démonstration

<video controls width="100%" style="max-width: 1200px; border-radius: 8px; margin: 20px 0;">
  <source src="/public/assets/demo_flowrs.mov" type="video/mp4">
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>

*Interface en temps réel montrant l'agrégation multi-exchange, les carnets d'ordres, le flux de trades et les métriques de performance (latence, throughput, mémoire).*

## Challenges techniques

Projet conçu pour démontrer la maîtrise de la programmation système performante et de l'architecture concurrente en Rust.

### 1. Architecture extensible multi-exchange

Problématique : Chaque exchange a son propre format WebSocket et ses spécificités API. Comment unifier sans couplage fort ?

**Solution - Plugin Pattern avec trait commun :**

Chaque exchange implémente 4 méthodes standardisées :
- `build_subscription_url()` - Construction de l'endpoint WebSocket
- `get_subscription_messages()` - Souscriptions post-connexion
- `parse_message()` - Normalisation JSON brut → `MarketMessage` unifié
- `fetch_snapshot()` - État initial via REST API

Architecture modulaire :
```
Exchange Manager (orchestration)
    ↓
ExchangeConnector enum (abstraction)
    ↓
BinanceConnector | BybitConnector | KrakenConnector | CoinbaseConnector
    ↓
Normalized MarketMessage stream
    ↓
OrderBook Manager → Clients
```

**Résultats :**
- Ajout d'un nouvel exchange en ~200 lignes sans modifier le core
- Isolation complète : chaque exchange tourne dans sa propre task Tokio
- Abstraction zéro-cost grâce aux enums Rust

### 2. Concurrence lock-free avec DashMap

Problématique initiale : Global `RwLock<HashMap>` causait de la contention. Plusieurs exchanges mettaient à jour des symboles différents mais se bloquaient mutuellement.

**Architecture avec DashMap :**
- Hashmap concurrente avec verrouillage granulaire (16 shards)
- Lock par shard, pas global → écritures parallèles possibles
- API similaire à `HashMap` standard, drop-in replacement

Migration :
```rust
// Avant : Lock global
let mut books = order_books.write().await;  // Bloque TOUT
books.get_mut(key).update(...);

// Après : Lock granulaire
order_books.get_mut(key).update(...);  // Lock uniquement ce shard
```

**Résultats :**
- Élimination de la contention entre exchanges
- Chaque exchange écrit indépendamment
- Throughput linéaire avec le nombre d'exchanges

### 3. Optimisation du chemin critique

Problématique : Conversion Decimal→String (~40µs) + Update (~30µs) = **~100µs sous lock**. À 1000 msg/sec, cela représente 100ms/sec de temps bloqué.

**Optimisation - Minimize Lock Hold Time :**
```rust
// AVANT (lock tenu 100µs)
lock.acquire();
let str_value = decimal.to_string();  // 40µs SOUS LOCK
update_orderbook(str_value);          // 30µs SOUS LOCK
lock.release();

// APRÈS (lock tenu 30µs)
let str_value = decimal.to_string();  // 40µs HORS LOCK
lock.acquire();
update_orderbook(str_value);          // 30µs SOUS LOCK
lock.release();
```

**Résultats :**
- Réduction de 70% du temps sous lock
- À 1000 msg/sec : 70ms/sec libérées pour d'autres tâches
- Latence P99 améliorée de ~5.5ms → ~2.5ms

### 4. Gestion intelligente de la mémoire

Problématique : Les order books peuvent grandir indéfiniment. Trim à chaque insert = overhead O(log n) constant.

**Solution - Amortized Trimming Strategy :**
- Cible : 100 niveaux de prix par côté (bids/asks)
- Tolérance : Croissance jusqu'à 1000 niveaux (10×)
- Trim uniquement au dépassement du seuil
- Utilisation de `BTreeMap::split_off()` pour trim O(log n)

**Trade-off :**
- Overhead régulier évité : 99% des inserts sans trim
- Utilisation mémoire : ~10-20KB par symbole (acceptable)
- Trim occasionnel : O(log n) amorti sur 900 opérations

### 5. Reconnexion isolée et résilience

Problématique : Une coupure réseau sur Binance ne doit pas affecter Bybit, Kraken, etc.

**Architecture - One Task Per Exchange :**
Chaque exchange tourne dans une task Tokio indépendante avec :
- Boucle de reconnexion avec exponential backoff (délai de 5s)
- Reset de l'order book au reconnect (évite les états inconsistants)
- Log isolé des erreurs par exchange
- Pas de panic : erreurs propagées et loggées

**Résultats :**
- Fault isolation : un exchange down ≠ système down
- Récupération automatique transparente
- État cohérent garanti (snapshot → incremental updates)

## Performance

**Latence End-to-End :**
- **P50** : ~200µs (temps médian de traitement d'un message)
- **P95** : ~1ms (95e percentile)
- **P99** : ~2.5ms (99e percentile, incluant outliers GC)

**Throughput :**
- 500-1000 messages/seconde en continu
- 36 flux simultanés (4 exchanges × 9 symboles)
- Memory footprint : ~50-100MB RSS

**Optimisations clés :**
- Métriques lock-free avec compteurs atomiques (`AtomicU64`)
- Throttling client (fenêtre d'agrégation de 1000ms)
- Zero-copy message broadcasting via `tokio::sync::broadcast`
- BTreeMap pour prix triés (ordre naturel du carnet)

## Stack technique

**Backend (Rust)** :
- **Tokio** - Runtime async multi-threadé
- **tokio-tungstenite** - WebSocket client async
- **DashMap** - Concurrent HashMap lock-free
- **rust_decimal** - Arithmétique décimale financière
- **serde/serde_json** - Sérialisation
- **reqwest** - Client HTTP pour snapshots REST

**Frontend (Vue 3)** :
- Composition API avec TypeScript
- WebSocket natif pour communication temps réel
- Vite pour build et HMR
- CSS moderne avec gradients

## Architecture du système

```
┌─────────────────────────────────────────┐
│        Exchange Manager                 │
│  (One task per exchange, isolated)      │
└─────────────────────────────────────────┘
     │         │         │         │
     ▼         ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Binance │ │ Bybit  │ │Kraken  │ │Coinbase│
└────────┘ └────────┘ └────────┘ └────────┘
     │         │         │         │
     └─────────┴─────────┴─────────┘
               │
               ▼
   ┌──────────────────────┐
   │  Normalized Stream   │
   │  (MarketMessage)     │
   └──────────────────────┘
               │
               ▼
   ┌──────────────────────┐
   │  OrderBook Manager   │
   │  (DashMap lock-free) │
   └──────────────────────┘
               │
               ▼
   ┌──────────────────────┐
   │  Broadcast Channel   │
   └──────────────────────┘
               │
               ▼
   ┌──────────────────────┐
   │  WebSocket Clients   │
   └──────────────────────┘
```

## Pipeline de traitement

```
Exchange WebSocket
    ↓
Raw JSON Message
    ↓
parse_message() → MarketMessage {exchange, symbol, bids, asks, ...}
    ↓
DashMap.get_or_create("Binance:BTCUSDT")
    ↓
OrderBook.apply_update(bids, asks)  [~30µs sous lock]
    ↓
Broadcast Channel → All clients
    ↓
Client Throttling (1000ms) → WebSocket
```

## Métriques et monitoring

**Métriques par symbole :**
- Messages/seconde
- Updates/seconde
- Trades/seconde
- Spread (en points de base)

**Métriques système :**
- Latence end-to-end (P50, P95, P99)
- Utilisation mémoire (RSS, Virtual)
- Utilisation CPU
- Compteur de reconnexions

Toutes les métriques sont collectées **lock-free** via opérations atomiques pour éviter l'impact sur les performances.

## Apprentissages clés

1. **Concurrence en Rust** - Trade-offs entre locks (simplicité) et structures lock-free (performance)
2. **Extensibilité par abstraction** - Traits communs pour APIs hétérogènes
3. **Optimisation basée sur mesures** - Profiling avant optimisation, focus sur le chemin critique
4. **Error handling distribué** - Dégradation gracieuse (isolation des pannes)
5. **Memory management** - Stratégies de nettoyage amorti
6. **Type safety** - Système de types Rust pour prévenir les erreurs runtime