---
title: "Archi+ - Chatbot IA"
shortDesc:
  - "10 000+ utilisateurs - Architecture temps réel async optimisée"
  - "+1M messages traités - Base MongoDB haute performance"
  - "Multimodal - Génération de texte, code et images"
  - "RAG avancé - Fusion, multi-query et agents autonomes"
tech: ["Python FastAPI" , "Angular", "LLM / RAG / LangChain", "Azure AI Search", "MongoDB"]
category: "professional"
featured: true
order: 1
company: "Caisse des Dépôts (ICDC)"
---

## Vue d'ensemble

Chatbot IA conversationnel multimodal pour le groupe de la Caisse des Dépôts, ancré dans les données internes de l'entreprise.

### Mes Réalisations (Projet from scratch) :
- Architecture multi-modèle avec orchestration intelligente (Mistral pour le conversationnel, Codestral pour le code, Flux pour la génération d'images)
- Pipeline RAG avancé avec chunking sémantique, RAG Fusion et agents autonomes pour traiter les documents internes complexes
- Système d'agents ReAct (Reasoning + Acting) avec accès à des outils externes (recherche web, génération d'images)
- Architecture scalable supportant une charge importante avec optimisations asynchrones et multi-threading

## Challenges techniques

Conception et implémentation complète de l'architecture backend, avec itérations successives pour répondre aux besoins évolutifs du métier.

### 1. Architecture asynchrone et performance

Problématique : La majorité du temps d'exécution est passé en attente de réponses des LLMs (latence réseau).

Architecture FastAPI fully asynchrone avec :
- Gestion asynchrone complète (asyncio) pour maximiser le throughput
- Concurrence des requêtes multiples sans blocage
- Pipeline de streaming optimisé pour une expérience utilisateur fluide
- Multi-threading et multi-processing pour les tâches CPU-intensives (embedding, parsing de documents)

### 2. Streaming temps réel

Implémentation SSE (Server-Sent Events) plutôt que WebSockets pour optimiser la simplicité et la performance en communication unidirectionnelle.

Résultats :
- Affichage progressif des réponses du LLM (token par token)
- Expérience utilisateur fluide sans attente de la réponse complète
- Protocole léger et performant adapté au cas d'usage
- Gestion native de la reconnexion automatique

### 3. Système RAG avancé

Ancrage du chatbot dans les données internes de l'entreprise (documentation technique, processus, base de connaissances).

Pipeline RAG complet :
- Développement d'un système d'ingestion multi-format (PDF, DOCX, TXT) avec parsing et normalisation
- Intégration avec Azure AI Search pour l'indexation et la recherche vectorielle
- Orchestration de l'ensemble du pipeline : ingestion → chunking → embedding → retrieval → génération

Optimisations avancées :
- **Chunking sémantique** - Algorithme de découpage intelligent basé sur la structure et le sens du document. Préservation du contexte et amélioration significative de la pertinence.
- **RAG Fusion** - Stratégie de retrieval générant plusieurs reformulations de la question, recherches parallèles et fusion des résultats avec re-ranking. Robustesse face aux formulations imparfaites.
- **Multi-query retrieval** - Génération automatique de variations de requêtes pour maximiser le rappel et couvrir différents angles sémantiques.
- **Agents autonomes** - Architecture d'agents pour orchestrer dynamiquement les stratégies de recherche et affiner itérativement les résultats.