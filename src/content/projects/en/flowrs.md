---
lang: "en"
baseSlug: "flowrs"
title: "FlowRS - Real-time multi-order books crypto"
shortDesc:
  - "Sub-10µs latency - P50: 9µs, P99: 195µs (CPU cache + fixed-point optimizations)"
  - "Multi-exchange - Real-time aggregation of 4 crypto exchanges (Binance, Bybit, Kraken, Coinbase)"
  - "Lock-free architecture - Atomic ring buffer, concurrent DashMap, zero-allocation parsing"
  - "Extensible design - Plugin pattern, add exchange in ~200 lines"
tech: [ "Rust", "Tokio (async)", "WebSocket", "DashMap", "Vue 3", "TypeScript" ]
category: "personal"
featured: true
order: 1
links:
  github: "https://github.com/MehdiRhifar/FlowRS"
---

> **Note**: This project is not deployed in production due to bandwidth costs. A video demonstration is available below.

## Performance Results

| Metric   | Latency |
|----------|---------|
| **P50**  | 9µs     |
| **Mean** | 20µs    |
| **P95**  | 63µs    |
| **P99**  | 195µs   |

**Throughput:** 500-1000 msg/s on 4 exchanges × 9 symbols (36 simultaneous streams)

## Demonstration

<video controls width="100%" style="max-width: 1200px; border-radius: 8px; margin: 20px 0;">
  <source src="/assets/flowrs_demo.mov" type="video/mp4">
  Your browser does not support video playback.
</video>

*Real-time interface: multi-exchange aggregation, order books, trade streams and performance metrics.*

---

## Low-Latency Optimizations

### 1. CPU Cache-Optimized Order Book

Classic implementations use `BTreeMap<Price, Quantity>` for O(log n) operations. FlowRS uses a **fixed-size Vec**:

```
BTreeMap (Classic)              Vec (FlowRS)
├─ Pointer chasing               ├─ Contiguous memory block
├─ Scattered heap allocations   ├─ Single allocation
├─ Cache misses on every node   ├─ Prefetch-friendly
└─ O(log n) but cache-cold      └─ O(n) but L1/L2 cache-hot
```

**Why it wins:** With 25 price levels (200 bytes), the entire book fits in L1 cache. CPUs iterate contiguous memory ~
100x faster than pointer chasing. The theoretical O(log n) advantage disappears when each node access is a cache miss.

### 2. Fixed-Point Integer Arithmetic

All prices and quantities use `u64` with a 1e8 scale factor instead of `Decimal` or `f64`:

```rust
const SCALE_FACTOR: u64 = 100_000_000; // 8 decimals

// "97234.56" → 9_723_456_000_000
fn fast_parse_u64(s: &str) -> Option<u64> {
    // Pure integer math, zero allocation
    // Inline ASCII → digit conversion
}
```

**Advantages:**

- **No floating-point errors** - Exact decimal representation
- **5-10x faster than Decimal** - Native CPU operations
- **8 bytes vs 16 bytes** - Better cache utilization
- **SIMD-friendly** - Vectorizable comparisons

### 3. Lock-Free Metrics Pipeline

Latency tracking uses a ring buffer with atomic operations. Percentile calculation runs in background task:

```rust
// Hot path: O(1) atomic write
fn record(&self, latency_us: u64) {
    let idx = self.write_index.fetch_add(1, Relaxed) & 0x7FF; // Bitwise AND
    self.samples[idx].store(latency_us, Relaxed);
}

// Background (every 900ms): O(n) partial selection
fn update_percentiles(&self) {
    // select_nth_unstable() instead of full sort
    // Pre-allocated scratch buffer
}
```

**Techniques:**

- `index & MASK` instead of `index % SIZE` - Avoids expensive integer division
- `select_nth_unstable()` - O(n) partial selection vs O(n log n) sort
- Pre-allocated buffers - Zero allocation in hot path

### 4. Concurrency Model

**DashMap** (sharded concurrent HashMap) instead of `RwLock<HashMap>`:

- 16 independent shards with fine-grained locking
- Multiple exchanges update different symbols without contention

**Isolated Exchange Tasks:**

- Each exchange runs in its own Tokio task
- Independent reconnection logic (one outage doesn't affect others)
- Automatic state recovery on disconnection

### Optimization Impact

| Optimization           | Before                   | After                       |
|------------------------|--------------------------|-----------------------------|
| Percentile calculation | In hot path (1.26ms P99) | Background task (195µs P99) |
| Price storage          | `Decimal`                | `u64` - 5-10x faster        |
| Order book             | `BTreeMap`               | `Vec` - Cache-friendly      |
| Metrics buffer         | `Mutex<Vec>`             | Lock-free ring buffer       |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Exchange Manager                        │
│            (Tokio task per exchange)                      │
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
               │   (DashMap per symbol) │
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

### Plugin Architecture

Adding a new exchange requires ~200 lines:

```rust
pub struct NewExchangeConnector { symbols: Vec<String> }

impl NewExchangeConnector {
    pub fn build_subscription_url(&self) -> String { ... }
    pub fn parse_message(&self, raw: &str) -> Option<MarketMessage> { ... }
    pub fn get_subscription_messages(&self) -> Vec<String> { ... }
}
```

---

## Tech Stack

**Backend (Rust)**

- Tokio async runtime
- tokio-tungstenite (WebSocket)
- DashMap (concurrent HashMap)
- serde/serde_json
- jemalloc allocator

**Frontend (Vue 3 + TypeScript)**

- Vite build tool
- Composition API
- Native WebSocket

---

## Key Learnings

1. **Cache locality beats algorithmic complexity** - O(n) with L1 cache > O(log n) with cache misses
2. **Integers beat decimals** - Fixed-point arithmetic is faster and avoids precision errors
3. **Move work out of hot path** - Background tasks for expensive calculations
4. **Avoid allocations** - Pre-allocated buffers, `Option` instead of `Box<dyn Error>`
5. **Lock-free when possible** - Atomics for metrics, sharded maps for data
