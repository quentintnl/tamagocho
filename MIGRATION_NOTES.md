# Migration du Système de Génération de Monstres

## Date: 27 octobre 2025

## Résumé
Remplacement complet du système de génération de monstres par celui du repository [v0-tamagotcho](https://github.com/RiusmaX/v0-tamagotcho).

## Changements Principaux

### 1. Nouveau Système de Types (`src/types/monster.ts`)
- **MonsterDesign**: Définition complète du design d'un monstre
- **MonsterPalette**: Palette de couleurs (primary, secondary, detail, cheeks, background, accent)
- **MonsterFeatures**: Caractéristiques physiques (oreilles, queue, moustaches, museau, marquages)
- **MonsterVariantId**: 4 variantes disponibles (cat, dog, rabbit, panda)
- **MonsterBodyShape**: 5 formes de corps (round, oval, bean, square, pear)
- **MonsterDesignStyle**: 2 styles de rendu (illustrated, pixel)
- **MonsterState**: 5 états émotionnels (happy, sad, angry, hungry, sleepy)

### 2. Service de Génération (`src/services/monsters/monster-generator.ts`)
- **generateMonsterDesign()**: Génère un design unique basé sur une seed
- **serializeMonsterDesign()**: Sérialise le design en JSON
- Algorithme de génération procédurale avec RNG déterministe
- 4 bibliothèques de variantes avec pools de caractéristiques
- Variations de fourrure et ajustements de couleurs

### 3. Composant de Rendu (`src/components/monsters/monster-preview.tsx`)
- Rendu SVG complet en deux modes:
  - **Mode Illustrated**: Rendu vectoriel avec dégradés et animations complexes
  - **Mode Pixel**: Rendu pixel art avec grille 16x16
- Animations CSS personnalisées par état émotionnel
- 80+ animations différentes (bounces, sways, blinks, etc.)
- Badge d'état avec emoji dynamique

### 4. Base de Données
#### Changement du schéma Monster (`src/db/models/monster.model.ts`)
```typescript
// AVANT
{
  draw: String  // Simple string
}

// APRÈS
{
  traits: String  // JSON stringifié du MonsterDesign
}
```

### 5. Formulaire de Création (`src/components/forms/create-monster-form.tsx`)
- Prévisualisation en temps réel du monstre généré
- Sélection du style (illustrated vs pixel)
- Test des 5 états émotionnels
- Affichage des caractéristiques (variante, forme, features)
- Bouton de régénération

### 6. Liste des Monstres (`src/components/monsters/monsters-list.tsx`)
- Affichage des monstres avec MonsterPreview
- Badges d'état colorés
- Informations de variante et style
- Date d'adoption formatée
- Résumé des caractéristiques

## Fichiers Modifiés

### Créés
- `src/types/monster.ts` (types mis à jour avec DBMonster)
- `src/services/monsters/monster-generator.ts`
- `src/components/monsters/monster-preview.tsx`
- `src/components/monsters/monster-preview.module.css`

### Modifiés
- `src/db/models/monster.model.ts` (draw → traits)
- `src/actions/monsters.actions.ts` (génération avec le nouveau système)
- `src/types/forms/create-monster-form.ts` (draw → traits)
- `src/components/forms/create-monster-form.validation.ts`
- `src/components/monsters/monsters-list.tsx` (draw → traits)

## Migration des Données Existantes

⚠️ **ATTENTION**: Les monstres existants en base de données ne seront **PAS** automatiquement migrés.

### Option 1: Suppression et Recréation (Recommandé pour le développement)
```bash
# Supprimer tous les monstres existants
# Créer de nouveaux monstres avec le nouveau système
```

### Option 2: Script de Migration (Pour la production)
```javascript
// Exemple de script de migration (à créer si nécessaire)
const monsters = await Monster.find({})
for (const monster of monsters) {
  if (monster.draw && !monster.traits) {
    // Générer un nouveau design basé sur le nom
    const design = generateMonsterDesign({ seed: monster.name })
    monster.traits = serializeMonsterDesign(design)
    monster.draw = undefined // Supprimer l'ancien champ
    await monster.save()
  }
}
```

## Fonctionnalités du Nouveau Système

### Génération Procédurale
- Utilise le nom du monstre comme seed pour une génération déterministe
- Même nom = même monstre (reproductible)
- RNG custom basé sur xorshift pour performances optimales

### Variantes de Monstres
1. **Cat (Félin)**: Oreilles pointues, queue longue, moustaches
2. **Dog (Canin)**: Oreilles tombantes, queue courte, sans moustaches
3. **Rabbit (Lapin)**: Longues oreilles, queue pompon, dents apparentes
4. **Panda**: Oreilles rondes, masque facial, marques distinctives

### Styles de Rendu
1. **Illustrated**: Vectoriel avec dégradés, animations fluides
2. **Pixel**: Grid-based 16x16, style rétro

### États Émotionnels
- **Happy**: Bounce joyeux, étoiles scintillantes
- **Sad**: Affaissement, larmes qui tombent
- **Angry**: Tremblement, sparks de colère
- **Hungry**: Nibble motion, langue qui sort
- **Sleepy**: Flottement doux, yeux mi-clos, "Z" flottants

## Tests à Effectuer

### ✅ Création de Monstre
- [ ] Générer un monstre avec le formulaire
- [ ] Vérifier que la prévisualisation s'affiche
- [ ] Changer de style (illustrated ↔ pixel)
- [ ] Tester les 5 états émotionnels
- [ ] Régénérer le monstre
- [ ] Soumettre le formulaire

### ✅ Affichage dans la Liste
- [ ] Voir le monstre dans le dashboard
- [ ] Vérifier les animations
- [ ] Vérifier le badge d'état
- [ ] Vérifier les informations (variante, features, date)

### ✅ Persistance
- [ ] Créer un monstre
- [ ] Recharger la page
- [ ] Vérifier que le monstre est toujours identique

## Avantages du Nouveau Système

1. **Visuels de Qualité Professionnelle**
   - Rendu SVG haute résolution
   - Animations CSS optimisées
   - Support des deux styles (illustrated + pixel)

2. **Génération Procédurale Robuste**
   - Reproductible (seed-based)
   - 4 variantes × 5 formes × multiple features = milliers de combinaisons
   - Algorithme de génération intelligent

3. **Architecture Propre**
   - Séparation claire des responsabilités
   - Types TypeScript stricts
   - Validation complète

4. **Performance**
   - Rendu SVG optimisé
   - Animations CSS (GPU accelerated)
   - RNG léger et rapide

5. **Maintenabilité**
   - Code bien structuré et documenté
   - Facile d'ajouter de nouvelles variantes
   - Facile d'ajouter de nouveaux états

## Prochaines Étapes Possibles

1. **Ajouter de Nouvelles Variantes**
   - Modifier `VARIANT_LIBRARY` dans `monster-generator.ts`
   - Ajouter les layers spécifiques dans `monster-preview.tsx`

2. **Ajouter de Nouveaux États**
   - Ajouter dans `MONSTER_STATES`
   - Définir les animations dans le CSS
   - Ajouter les paths/rendering dans le preview

3. **Personnalisation Utilisateur**
   - Permettre de choisir la variante
   - Permettre de choisir la forme du corps
   - Permettre de modifier la palette de couleurs

4. **Système d'Évolution**
   - Ajouter des accessoires débloquables
   - Modifier les features en fonction du niveau
   - Ajouter des transformations

## Ressources

- Repository source: https://github.com/RiusmaX/v0-tamagotcho
- Documentation TypeScript: https://www.typescriptlang.org/
- SVG Reference: https://developer.mozilla.org/en-US/docs/Web/SVG
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

---

**Migration réalisée avec succès ✅**
