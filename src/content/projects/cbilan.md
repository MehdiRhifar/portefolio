---
title: "C'bilan - Prédiction ML Bilan Carbone"
shortDesc:
  - "Prédictions ML sur bilans carbone d'entreprises pour données manquantes"
  - "Architecture microservices Spring Boot et Python avec communication Kafka"
tech: ["Java", "Spring Boot", "Python", "Machine Learning", "Kafka", "PostgreSQL", "Docker"]
category: "professional"
featured: true
order: 2
company: "Caisse des Dépôts (ICDC)"
---

## Vue d'ensemble

Système de prédiction par Machine Learning pour compléter automatiquement les bilans carbone incomplets des entreprises françaises soumis à l'ADEME.

Problématique : Les bilans carbone obligatoires contiennent de nombreux champs optionnels, rendant les données incomplètes et difficiles à analyser.

**Principales réalisations** :
- Architecture microservices event-driven avec Spring Boot et Python
- Modèles ML de prédiction pour compléter les données manquantes
- Communication asynchrone via Kafka pour découplage et scalabilité
- API REST exposant les bilans complétés avec métriques de confiance

## Architecture microservices

```
[API Spring Boot] → [Kafka Topics] → [Service ML Python]
       ↓                                      ↓
[PostgreSQL] ←────────── [Résultats] ────────┘
```

Architecture event-driven avec 3 microservices :
- **2 services Spring Boot** - Séparation des responsabilités (ingestion et exposition des données)
- **1 service Python** - Traitement ML et prédictions
- **Kafka** - Bus d'événements asynchrone pour communication inter-services
- **PostgreSQL** - Persistance des bilans et résultats de prédiction

Flow de traitement :
1. Ingestion des bilans carbone incomplets via API REST
2. Publication d'événements Kafka avec données à prédire
3. Consommation par le service Python et application des modèles ML
4. Publication des résultats sur Kafka
5. Persistance en base et exposition via API avec métriques de confiance