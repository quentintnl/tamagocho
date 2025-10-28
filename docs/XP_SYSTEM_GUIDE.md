# Système XP et Leveling - Guide d'initialisation

## Vue d'ensemble

Le système d'XP utilise une table séparée `xp_levels` pour stocker les niveaux 1-5 avec leurs seuils d'expérience requis.

## Structure des niveaux

| Niveau | XP Requis | Notes |
|--------|-----------|-------|
| 1      | 0 XP      | Niveau de départ |
| 2      | 50 XP     | |
| 3      | 100 XP    | |
| 4      | 150 XP    | |
| 5      | 200 XP    | Niveau maximum |

## Initialisation des niveaux XP

### Méthode 1 : Via l'API (Recommandée)

1. Démarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Accédez à l'URL d'initialisation :
   ```
   http://localhost:3000/api/seed-xp
   ```

3. Vous devriez voir une réponse JSON confirmant la création :
   ```json
   {
     "success": true,
     "message": "Niveaux XP initialisés avec succès",
     "levels": [...]
   }
   ```

### Méthode 2 : Via le script Node.js

```bash
npm run seed:xp
```

**Note :** Cette méthode nécessite que les variables d'environnement `MONGODB_URI` ou `DATABASE_URL` soient définies.

## Gain d'XP

### Actions correctes vs incorrectes

- **Action correcte** (correspond à l'état du monstre) : +20 XP
  - Exemple : Nourrir un monstre affamé (hungry)
  
- **Action incorrecte** : +5 XP
  - Exemple : Nourrir un monstre déjà heureux

### Mapping des actions

```typescript
{
  feed: 'hungry',    // Nourrir un monstre affamé
  comfort: 'angry',  // Réconforter un monstre en colère
  hug: 'sad',        // Câliner un monstre triste
  wake: 'sleepy'     // Réveiller un monstre endormi
}
```

## Leveling automatique

Lorsqu'un monstre gagne de l'XP :

1. L'XP est ajouté au total actuel
2. Le système calcule le nouveau niveau basé sur l'XP total accumulé
3. Si le niveau change :
   - `level_id` est mis à jour avec la référence au nouveau niveau
   - L'XP restant est calculé et stocké
4. Le monstre ne peut pas dépasser le niveau 5 (niveau maximum)

## Barre de progression

La barre de progression XP affiche :
- XP actuel / XP requis pour le prochain niveau
- Pourcentage de progression
- Message spécial à 90%+ de progression
- Badge "NIVEAU MAX" pour le niveau 5

## Intégration dans les composants

### CreatureStatsPanel

```tsx
<CreatureStatsPanel
  level={monster.level_id.level}
  xp={monster.xp}
  xpToNextLevel={monster.level_id.xpRequired}
  isMaxLevel={monster.level_id.isMaxLevel}
  state={monster.state}
  createdAt={monster.createdAt}
  updatedAt={monster.updatedAt}
/>
```

## Dépannage

### Erreur "XP levels not initialized"

Si vous voyez cette erreur lors de la création d'un monstre, cela signifie que la table `xp_levels` est vide. Utilisez une des méthodes d'initialisation ci-dessus.

### Vérification manuelle dans MongoDB

```javascript
db.xp_levels.find().sort({ level: 1 })
```

Vous devriez voir 5 documents correspondant aux niveaux 1-5.

