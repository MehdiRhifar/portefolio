---
lang: "en"
baseSlug: "archi-plus"
title: "Archi+ - AI Chatbot"
shortDesc:
  - "10,000+ users - Optimized async real-time architecture"
  - "1M+ messages processed - High-performance MongoDB database"
  - "Multimodal - Text, code and image generation"
  - "Advanced RAG - Fusion, multi-query and autonomous agents"
tech: [ "Python FastAPI" , "Angular", "LLM / RAG / LangChain", "Azure AI Search", "MongoDB" ]
category: "professional"
featured: true
order: 1
company: "Caisse des Dépôts (ICDC)"
---

## Overview

Conversational multimodal AI chatbot for the Caisse des Dépôts group, anchored in the company's internal data.

### My Achievements (Project from scratch):

- Multi-model architecture with intelligent orchestration (Mistral for conversational, Codestral for code, Flux for
  image generation)
- Advanced RAG pipeline with semantic chunking, RAG Fusion and autonomous agents to process complex internal documents
- ReAct (Reasoning + Acting) agent system with access to external tools (web search, image generation)
- Scalable architecture supporting high load with async optimizations and multi-threading

## Technical Challenges

Complete design and implementation of backend architecture, with successive iterations to meet evolving business needs.

### 1. Asynchronous Architecture and Performance

Challenge: Most execution time is spent waiting for LLM responses (network latency).

Fully async FastAPI architecture with:

- Complete async management (asyncio) to maximize throughput
- Concurrency of multiple requests without blocking
- Optimized streaming pipeline for fluid user experience
- Multi-threading and multi-processing for CPU-intensive tasks (embedding, document parsing)

### 2. Real-time Streaming

Implementation of SSE (Server-Sent Events) instead of WebSockets to optimize simplicity and performance in
unidirectional communication.

Results:

- Progressive display of LLM responses (token by token)
- Fluid user experience without waiting for complete response
- Lightweight and performant protocol adapted to use case
- Native management of automatic reconnection

### 3. Advanced RAG System

Anchoring chatbot in company's internal data (technical documentation, processes, knowledge base).

Complete RAG pipeline:

- Development of a multi-format ingestion system (PDF, DOCX, TXT) with parsing and normalization
- Integration with Azure AI Search for indexing and vector search
- Orchestration of entire pipeline: ingestion → chunking → embedding → retrieval → generation

Advanced optimizations:

- **Semantic chunking** - Intelligent splitting algorithm based on document structure and meaning. Context preservation
  and significant relevance improvement.
- **RAG Fusion** - Retrieval strategy generating multiple question reformulations, parallel searches and result fusion
  with re-ranking. Robustness against imperfect formulations.
- **Multi-query retrieval** - Automatic generation of query variations to maximize recall and cover different semantic
  angles.
- **Autonomous agents** - Agent architecture to dynamically orchestrate search strategies and iteratively refine
  results.
