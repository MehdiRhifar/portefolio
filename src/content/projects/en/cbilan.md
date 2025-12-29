---
lang: "en"
baseSlug: "cbilan"
title: "C'bilan - ML Carbon Footprint Prediction"
shortDesc:
  - "Predictive ML to complete incomplete carbon footprints"
  - "Event-driven architecture - Microservices Kafka"
  - "Spring Boot REST API + Python - Scalable async communication"
tech: [ "Java Spring Boot", "Kafka", "PostgreSQL",  "Machine Learning", "Docker" ]
category: "professional"
featured: true
order: 2
company: "Caisse des Dépôts (ICDC)"
---

## Overview

**Problem**: Mandatory carbon footprints for companies contain many optional fields, making data incomplete and
difficult to analyze.

**Project Solution**: Machine Learning prediction system to automatically complete incomplete carbon footprints of
French companies submitted to ADEME.

### My Achievements (Project from scratch):

- Database modeling
- Microservices architecture with Spring Boot and Python
- Spring Boot REST API exposing completed footprints with confidence metrics
- Asynchronous communication with ML Python via Kafka for decoupling and scalability

## Microservices Architecture

```
[Spring Boot API] → [Kafka Topics] → [Python ML Service]
       ↓                                      ↓
[PostgreSQL] ←────────── [Results] ────────┘
```

Architecture with 3 microservices:

- **2 Spring Boot services** - Responsibility separation (data ingestion and exposure)
- **1 Python service** - ML processing and predictions
- **Kafka** - Asynchronous event bus for inter-service communication
- **PostgreSQL** - Persistence of footprints and prediction results

Processing flow:

1. Ingestion of incomplete carbon footprints via REST API
2. Publication of Kafka events with data to predict
3. Consumption by Python service and ML model application
4. Publication of results on Kafka
5. Persistence in database and exposure via API with confidence metrics
