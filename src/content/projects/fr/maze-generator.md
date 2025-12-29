---
lang: "fr"
baseSlug: "maze-generator"
title: "Maze Generator - Visualisation d'algorithmes"
shortDesc:
  - "5 algorithmes de génération - Visualisation temps réel interactive"
  - "Backend Rust/WASM - Performance native dans le navigateur"
  - "Architecture moderne - CI/CD avec GitHub Actions et Vercel"
  - "Animation fluide - Jusqu'à 100 FPS avec requestAnimationFrame"
tech: [ "Rust", "WebAssembly", "CI/CD GitHub Actions", "React", "TypeScript", "Vite" ]
category: "personal"
featured: true
order: 2
links:
  demo: "https://maze-generator-mehdi-rhifar.vercel.app/"
  github: "https://github.com/MehdiRhifar/MazeGenerator"
---

## Vue d'ensemble

Application web de génération et visualisation de labyrinthes en temps réel, exploitant la performance de WebAssembly
pour des animations fluides.

### Mes Réalisations :

- Backend Rust compilé en WASM pour des performances natives dans le navigateur
- Implémentation de 5 algorithmes de génération (Recursive Backtracking, Prim, Kruskal, Wilson, Recursive Division)
- Interface React avec contrôle de la vitesse d'animation et navigation temps réel
- Pipeline CI/CD automatisé avec compilation Rust dans GitHub Actions et déploiement Vercel

## Challenges techniques

Projet conçu pour explorer l'interopérabilité Rust/JavaScript et optimiser les performances d'algorithmes visuels dans
le navigateur.

### 1. Interopérabilité Rust/WASM avec JavaScript

Problématique : Permettre au code Rust haute performance de communiquer efficacement avec l'interface React.

Architecture avec wasm-bindgen :

- Génération automatique des bindings TypeScript depuis les exports Rust
- Transfert de données optimisé avec sérialisation minimale
- Gestion de la mémoire partagée entre WASM et JavaScript
- Types sûrs côté TypeScript grâce aux déclarations générées

Résultats :

- API JavaScript idiomatique générée depuis le code Rust
- Zero-copy pour les structures de données critiques
- Type safety end-to-end (Rust → TypeScript)

### 2. Animation temps réel et contrôle de performance

Implémentation d'un système d'animation fluide avec contrôle de vitesse dynamique.

Optimisations clés :

- **Mode turbo** - Switch automatique vers `requestAnimationFrame` (60+ FPS) quand la vitesse est maximale
- **Génération par étapes** - Algorithmes conçus comme des itérateurs pour permettre l'animation progressive
- **Batching intelligent** - Calcul de plusieurs steps par frame selon la vitesse configurée
- **Rendu optimisé** - Canvas 2D avec minimisation des redraws et batch des opérations de dessin

Résultats : Animation fluide de 10 FPS (debug) à 100+ FPS (turbo) sans blocking du thread principal.

### 3. Pipeline CI/CD pour Rust/WASM

Problématique : Vercel ne supporte pas nativement Rust. Nécessité d'une compilation WASM avant le déploiement.

Architecture GitHub Actions :

- Compilation Rust → WASM avec cache Cargo pour builds rapides (~30s au lieu de 2min)
- Build frontend avec bundling automatique du WASM via Vite
- Déploiement sur Vercel via CLI avec artifacts pré-compilés
- Preview deployments automatiques sur les Pull Requests

Workflow :
Push → GitHub Actions installe Rust → Compile WASM →
Build frontend (bundle WASM) → Deploy Vercel

Bénéfices :

- Aucun fichier généré versionné (WASM compilé uniquement en CI)
- Déploiement automatique à chaque push
- Builds reproductibles avec versions fixées des toolchains

### 4. Algorithmes de génération optimisés

Implémentation de 5 algorithmes classiques avec focus sur la performance et la visualisation.

Défis spécifiques :

- **Wilson's algorithm** - Algorithme probabiliste complexe avec loop-erased random walks
- **Kruskal** - Gestion efficace d'un Union-Find pour détecter les cycles
- **Recursive Division** - Approche top-down nécessitant une stratégie de partitionnement intelligente

Optimisations :

- Structures de données efficaces (Vec, HashSet) pour minimiser les allocations
- Randomisation avec `rand` crate optimisé pour WASM
- Trait `GenerationAlgorithm` commun pour faciliter l'ajout de nouveaux algorithmes

## Stack technique

**Backend (Rust/WASM)** :

- wasm-pack pour la compilation et génération de bindings
- wasm-bindgen pour l'interop JavaScript
- Optimisations de taille avec `wasm-opt` (315KB → 51KB)

**Frontend (React/TypeScript)** :

- Vite pour le bundling et HMR
- TailwindCSS 4 pour le styling
- Architecture modulaire (services, components, constants)

**DevOps** :

- GitHub Actions pour CI/CD
- Vercel pour l'hébergement
- Cache Cargo pour accélérer les builds
