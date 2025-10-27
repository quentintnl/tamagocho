---
sidebar_position: 1
---

# Introduction

Bienvenue dans la documentation technique de **Tamagotcho** ! 🎮

## Qu'est-ce que Tamagotcho ?

Tamagotcho est une application web moderne inspirée des célèbres Tamagotchi, développée dans le cadre d'un projet scolaire à My Digital School. L'application permet aux utilisateurs de créer, nourrir et s'occuper de créatures virtuelles pixelisées.

## Stack Technique

### Frontend
- **Framework**: Next.js 15.5.4 avec App Router
- **Langage**: TypeScript avec mode strict
- **Styling**: Tailwind CSS 4 avec palette de couleurs personnalisée
- **React**: Version 19.1.0
- **Fonts**: Jersey 10 & Geist Mono

### Backend
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: Better Auth 1.3.24
- **Déploiement**: Vercel

### Outils de développement
- **Build Tool**: Turbopack
- **Linter**: ts-standard
- **Documentation**: Docusaurus

## Fonctionnalités Principales

### 🎨 Génération de Monstres Aléatoires
Chaque monstre est unique avec :
- Couleurs pastels aléatoires
- Différents styles de corps (rond, carré, grand, large)
- Variations d'yeux (grands, petits, étoiles, endormis)
- Types d'antennes (simple, double, bouclé, aucun)
- Accessoires (cornes, oreilles, queue, aucun)

### 😊 Système d'États Émotionnels
Les monstres peuvent être dans différents états :
- Heureux (`happy`)
- Triste (`sad`)
- En colère (`angry`)
- Affamé (`hungry`)
- Endormi (`sleepy`)

### 🔐 Système d'Authentification
- Inscription et connexion sécurisées
- Gestion des sessions utilisateur
- Protection des données

### 📊 Dashboard Personnel
- Vue d'ensemble de vos créatures
- Statistiques de jeu
- Système de quêtes

## Architecture du Projet

Le projet suit les principes **SOLID** et de **Clean Architecture** pour garantir :
- ✅ **Maintenabilité** : Code modulaire et facile à comprendre
- ✅ **Réutilisabilité** : Composants autonomes et configurables
- ✅ **Extensibilité** : Ajout facile de nouvelles fonctionnalités
- ✅ **Testabilité** : Isolation des responsabilités

## Navigation de la Documentation

Utilisez la barre latérale pour explorer :
- **Architecture** : Principes SOLID et structure du code
- **Composants** : Documentation des composants React
- **Système de Monstres** : Génération et gestion des créatures
- **Authentification** : Système Better Auth et formulaires
- **Guide de Développement** : Comment contribuer au projet

## Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Démarrage de la documentation
npm run dev:docs

# Build complet (Next.js + Docusaurus)
npm run build
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

La documentation sera accessible sur [http://localhost:3000](http://localhost:3000)

---

**Prêt à explorer ?** Commencez par la section [Architecture](./architecture/solid-principles) pour comprendre les fondations du projet !
