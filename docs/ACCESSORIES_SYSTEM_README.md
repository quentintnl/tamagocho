# 📚 Documentation du Système d'Accessoires - Tomatgotchi

Cette documentation complète décrit le système d'achat, de gestion et d'équipement d'accessoires pour les monstres Tomatgotchi.

## 📋 Table des Matières

### 📖 Documentation Markdown (docs/)

Le fichier principal de spécification se trouve dans :
- **`docs/ACCESSORIES_BACKGROUNDS_SYSTEM.md`** - Documentation complète et détaillée (50+ pages)

Cette documentation couvre :
- ✅ Vue d'ensemble du système
- ✅ Architecture Clean Architecture et SOLID
- ✅ Structure de base de données MongoDB
- ✅ Types TypeScript complets
- ✅ API Reference (services, actions, composants)
- ✅ Catalogue de 30 accessoires
- ✅ Flux d'achat détaillé
- ✅ Intégration avec les quêtes
- ✅ Exemples d'utilisation
- ✅ Guide de debugging
- ✅ Tests recommandés

### 🌐 Documentation Docusaurus (documentation/docs/accessories/)

Documentation interactive accessible via Docusaurus :

1. **`overview.md`** - Vue d'ensemble et démarrage rapide
2. **`architecture.md`** - Architecture et principes SOLID
3. **`usage-guide.md`** - Guide d'utilisation avec exemples
4. **`api-reference.md`** - Référence API complète
5. **`types.md`** - Définitions de types TypeScript

## 🚀 Comment Utiliser Cette Documentation

### Pour les Développeurs

1. **Commencer par** : `docs/ACCESSORIES_BACKGROUNDS_SYSTEM.md`
   - Lire les sections "Vue d'ensemble" et "Architecture"
   - Comprendre le flux d'achat

2. **Consulter** : `documentation/docs/accessories/api-reference.md`
   - Référence de toutes les fonctions disponibles
   - Exemples de code

3. **Implémenter** : `documentation/docs/accessories/usage-guide.md`
   - Exemples pratiques
   - Patterns recommandés

### Pour la Navigation Interactive

Lancer Docusaurus :

```bash
cd documentation
npm install
npm start
```

Accéder à : `http://localhost:3000/accessories/overview`

## 📦 Structure des Fichiers du Système

```
src/
├── types/
│   └── accessory.ts                    # Types TypeScript
├── services/
│   ├── accessory.service.ts            # Catalogue
│   └── owned-accessory.service.ts      # Propriété
├── actions/
│   └── accessory.actions.ts            # Orchestration
├── db/
│   └── models/
│       └── owned-accessory.model.ts    # MongoDB
└── components/
    └── accessories/
        ├── universal-accessory-card.tsx
        ├── purchase-confirmation-modal.tsx
        └── index.ts
```

## 🎯 Points Clés du Système

### Données Importantes

- **30 accessoires** répartis en 5 catégories
- **4 niveaux de rareté** (Common, Rare, Epic, Legendary)
- **Prix** : 50 à 400 gochoCoins
- **Architecture** : Clean Architecture avec 4 couches
- **Database** : MongoDB avec index optimisés

### Fonctionnalités Principales

1. **Achat** : `purchaseAccessory(accessoryId, monsterId)`
2. **Équipement** : Automatique lors de l'achat
3. **Inventaire** : `getUserAccessories()`
4. **Catalogue** : `getAvailableAccessories()`
5. **Quêtes** : Tracking automatique

## 🔗 Liens Rapides

### Services
- [Accessory Service](../src/services/accessory.service.ts) - Catalogue
- [Owned Accessory Service](../src/services/owned-accessory.service.ts) - Propriété

### Actions
- [Accessory Actions](../src/actions/accessory.actions.ts) - Orchestration

### Composants
- [Universal Accessory Card](../src/components/accessories/universal-accessory-card.tsx)
- [Purchase Modal](../src/components/accessories/purchase-confirmation-modal.tsx)

### Types
- [Accessory Types](../src/types/accessory.ts)

## 📊 Diagrammes

### Architecture en Couches

```
┌────────────────────────────────┐
│  Presentation Layer            │  Components UI
│  (UniversalAccessoryCard)      │
└──────────┬─────────────────────┘
           │
┌──────────▼─────────────────────┐
│  Application Layer             │  Server Actions
│  (purchaseAccessory)           │
└──────────┬─────────────────────┘
           │
┌──────────▼─────────────────────┐
│  Domain Layer                  │  Business Logic
│  (accessory.service.ts)        │
└──────────┬─────────────────────┘
           │
┌──────────▼─────────────────────┐
│  Infrastructure Layer          │  Database
│  (OwnedAccessoryModel)         │
└────────────────────────────────┘
```

### Flux d'Achat

```
User Click → UI Component → Server Action
                               ↓
                          Authenticate
                               ↓
                          Validate Accessory
                               ↓
                          Check Balance
                               ↓
                          Deduct Coins
                               ↓
                          Create OwnedAccessory
                               ↓
                          Track Quest
                               ↓
                          Revalidate Cache
                               ↓
                          Return Success
```

## 🧪 Tests

Voir la section "Tests Recommandés" dans `ACCESSORIES_BACKGROUNDS_SYSTEM.md` pour :
- Tests unitaires (Services)
- Tests d'intégration (Actions)
- Tests E2E (Cypress/Playwright)

## 🔧 Maintenance

### Ajouter un Nouvel Accessoire

1. Ouvrir `src/services/accessory.service.ts`
2. Ajouter l'objet dans le tableau de `getAvailableAccessories()`
3. Suivre la convention de nommage : `{category}-{name}`

### Modifier les Prix

Changer la constante `BASE_PRICE` dans `accessory.service.ts`.

### Ajouter une Catégorie

1. Mettre à jour le type `AccessoryCategory` dans `src/types/accessory.ts`
2. Ajouter des accessoires de cette catégorie
3. Mettre à jour `getCategoryLabel()` dans les composants

## 📝 Notes de Version

- **Version** : 1.0.0
- **Date** : 2025-01-12
- **Auteur** : Équipe Tomatgotchi
- **Status** : ✅ Production Ready

## 🆘 Support

Pour toute question ou problème :

1. Consulter la documentation complète
2. Vérifier les exemples dans `usage-guide.md`
3. Consulter les logs de la console
4. Vérifier les erreurs MongoDB

## 🎓 Ressources Externes

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Mongoose TypeScript](https://mongoosejs.com/docs/typescript.html)

---

**Dernière mise à jour** : 2025-01-12
**Mainteneur** : Équipe Tomatgotchi

