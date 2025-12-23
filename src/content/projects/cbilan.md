---
title: "C'bilan - Prédiction ML Bilan Carbone"
shortDesc:
  - "ML prédictif pour compléter bilans carbone incomplets"
  - "Architecture event-driven - Microservices Kafka"
  - "API REST Spring Boot + Python - Communication asynchrone scalable"
tech: ["Java Spring Boot", "Kafka", "PostgreSQL",  "Machine Learning", "Docker"]
category: "professional"
featured: true
order: 2
company: "Caisse des Dépôts (ICDC)"
---

## Vue d'ensemble

**Problématique** : Les bilans carbone obligatoires pour les entreprises contiennent de nombreux champs optionnels, rendant les données incomplètes et difficiles à analyser.

**Solution du projet** : Système de prédiction par Machine Learning pour compléter automatiquement les bilans carbone incomplets des entreprises françaises soumis à l'ADEME.

### Mes Réalisations (Projet from scratch) :
- Modelisation de la base de donnée
- Architecture microservices avec Spring Boot et Python
- API REST Spring Boot exposant les bilans complétés avec métriques de confiance
- Communication asynchrone avec ML Python via Kafka pour découplage et scalabilité

## Architecture microservices

```
[API Spring Boot] → [Kafka Topics] → [Service ML Python]
       ↓                                      ↓
[PostgreSQL] ←────────── [Résultats] ────────┘
```

Architecture avec 3 microservices :
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