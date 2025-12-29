---
lang: "en"
baseSlug: "maze-generator"
title: "Maze Generator - Algorithm Visualization"
shortDesc:
  - "5 generation algorithms - Interactive real-time visualization"
  - "Rust/WASM backend - Native browser performance"
  - "Modern architecture - CI/CD with GitHub Actions and Vercel"
  - "Fluid animation - Up to 100 FPS with requestAnimationFrame"
tech: [ "Rust", "WebAssembly", "CI/CD GitHub Actions", "React", "TypeScript", "Vite" ]
category: "personal"
featured: true
order: 2
links:
  demo: "https://maze-generator-mehdi-rhifar.vercel.app/"
  github: "https://github.com/MehdiRhifar/MazeGenerator"
---

## Overview

Real-time maze generation and visualization web application, leveraging WebAssembly performance for fluid animations.

### My Achievements:

- Rust backend compiled to WASM for native browser performance
- Implementation of 5 generation algorithms (Recursive Backtracking, Prim, Kruskal, Wilson, Recursive Division)
- React interface with animation speed control and real-time navigation
- Automated CI/CD pipeline with Rust compilation in GitHub Actions and Vercel deployment

## Technical Challenges

Project designed to explore Rust/JavaScript interoperability and optimize visual algorithm performance in the browser.

### 1. Rust/WASM Interoperability with JavaScript

Challenge: Enable high-performance Rust code to communicate efficiently with the React interface.

Architecture with wasm-bindgen:

- Automatic generation of TypeScript bindings from Rust exports
- Optimized data transfer with minimal serialization
- Shared memory management between WASM and JavaScript
- Type-safe TypeScript side thanks to generated declarations

Results:

- Idiomatic JavaScript API generated from Rust code
- Zero-copy for critical data structures
- End-to-end type safety (Rust → TypeScript)

### 2. Real-time Animation and Performance Control

Implementation of a fluid animation system with dynamic speed control.

Key optimizations:

- **Turbo mode** - Automatic switch to `requestAnimationFrame` (60+ FPS) when speed is maximum
- **Step-by-step generation** - Algorithms designed as iterators to allow progressive animation
- **Intelligent batching** - Calculation of multiple steps per frame according to configured speed
- **Optimized rendering** - Canvas 2D with redraw minimization and drawing operation batching

Results: Fluid animation from 10 FPS (debug) to 100+ FPS (turbo) without blocking the main thread.

### 3. CI/CD Pipeline for Rust/WASM

Challenge: Vercel doesn't natively support Rust. Need for WASM compilation before deployment.

GitHub Actions architecture:

- Rust → WASM compilation with Cargo cache for fast builds (~30s instead of 2min)
- Frontend build with automatic WASM bundling via Vite
- Deployment on Vercel via CLI with pre-compiled artifacts
- Automatic preview deployments on Pull Requests

Workflow:
Push → GitHub Actions installs Rust → Compile WASM →
Build frontend (bundle WASM) → Deploy Vercel

Benefits:

- No generated files versioned (WASM compiled only in CI)
- Automatic deployment on every push
- Reproducible builds with fixed toolchain versions

### 4. Optimized Generation Algorithms

Implementation of 5 classic algorithms with focus on performance and visualization.

Specific challenges:

- **Wilson's algorithm** - Complex probabilistic algorithm with loop-erased random walks
- **Kruskal** - Efficient Union-Find management for cycle detection
- **Recursive Division** - Top-down approach requiring intelligent partitioning strategy

Optimizations:

- Efficient data structures (Vec, HashSet) to minimize allocations
- Randomization with `rand` crate optimized for WASM
- Common `GenerationAlgorithm` trait to facilitate adding new algorithms

## Tech Stack

**Backend (Rust/WASM)**:

- wasm-pack for compilation and bindings generation
- wasm-bindgen for JavaScript interop
- Size optimizations with `wasm-opt` (315KB → 51KB)

**Frontend (React/TypeScript)**:

- Vite for bundling and HMR
- TailwindCSS 4 for styling
- Modular architecture (services, components, constants)

**DevOps**:

- GitHub Actions for CI/CD
- Vercel for hosting
- Cargo cache to accelerate builds
