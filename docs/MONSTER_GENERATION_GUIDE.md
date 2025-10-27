# Guide du Système de Génération de Monstres

## Vue d'ensemble

Le système de génération de monstres utilise une approche procédurale basée sur des **seeds** pour créer des créatures uniques et reproductibles avec des rendus SVG animés.

## Concepts Clés

### 1. MonsterDesign

Un `MonsterDesign` contient toutes les informations nécessaires pour générer et afficher un monstre :

```typescript
interface MonsterDesign {
  id: string                     // Identifiant unique
  variant: MonsterVariantId      // cat | dog | rabbit | panda
  palette: MonsterPalette        // Couleurs
  features: MonsterFeatures      // Caractéristiques physiques
  bodyShape: MonsterBodyShape    // Forme du corps
  style: MonsterDesignStyle      // illustrated | pixel
  animations: Record<MonsterState, MonsterAnimationSpec>
}
```

### 2. Génération Procédurale

La génération utilise une **seed** (chaîne de caractères) pour produire des résultats déterministes :

```typescript
// Même seed = même monstre (toujours)
const design1 = generateMonsterDesign({ seed: 'Fluffy' })
const design2 = generateMonsterDesign({ seed: 'Fluffy' })
// design1 === design2 (structure identique)

// Seeds différentes = monstres différents
const design3 = generateMonsterDesign({ seed: 'Sparky' })
// design3 ≠ design1
```

### 3. Variantes

4 variantes de base sont disponibles :

| Variante | Caractéristiques |
|----------|-----------------|
| **Cat** | Oreilles pointues, queue longue, moustaches, nez triangulaire |
| **Dog** | Oreilles tombantes, queue courte/longue, museau proéminent |
| **Rabbit** | Longues oreilles, queue pompon, dents visibles |
| **Panda** | Oreilles rondes, masque facial, pelage bicolore |

### 4. Formes de Corps

5 formes disponibles :

- **round**: Corps sphérique équilibré
- **oval**: Corps ovale allongé verticalement
- **bean**: Forme haricot asymétrique
- **square**: Corps carré robuste
- **pear**: Forme poire (base plus large)

### 5. États Émotionnels

5 états avec animations distinctes :

| État | Animation | Éléments visuels |
|------|-----------|-----------------|
| **happy** | Bounce joyeux | Étoiles scintillantes |
| **sad** | Affaissement | Larmes qui tombent |
| **angry** | Tremblement | Sparks de colère, crocs |
| **hungry** | Nibble motion | Langue, bave |
| **sleepy** | Flottement doux | "Z" flottants, yeux mi-clos |

### 6. Styles de Rendu

Deux modes de rendu disponibles :

#### Illustrated (Défaut)
- Rendu vectoriel SVG
- Dégradés et ombres
- Animations fluides et complexes
- Détails riches

#### Pixel Art
- Grid 16×16
- Style rétro 8-bit
- Rendu crispEdges
- Animations simplifiées

## Utilisation

### Générer un Monstre

```typescript
import { generateMonsterDesign } from '@/services/monsters/monster-generator'

// Génération basique (variante aléatoire basée sur la seed)
const design = generateMonsterDesign({ 
  seed: 'MonNom' 
})

// Avec options avancées
const customDesign = generateMonsterDesign({
  seed: 'MonNom',
  style: 'pixel',                    // illustrated | pixel
  variantOverride: 'cat',            // Forcer une variante
  bodyShapeOverride: 'round',        // Forcer une forme
  paletteOverride: {                 // Override des couleurs
    primary: '#FFB5E8',
    accent: '#FF9CEE'
  }
})
```

### Afficher un Monstre

```typescript
import MonsterPreview from '@/components/monsters/monster-preview'

function MyComponent() {
  const [design, setDesign] = useState<MonsterDesign | null>(null)
  
  useEffect(() => {
    setDesign(generateMonsterDesign({ seed: 'Fluffy' }))
  }, [])
  
  return (
    <MonsterPreview 
      design={design} 
      state="happy"
      width={240}
      height={240}
    />
  )
}
```

### Sauvegarder/Charger

```typescript
import { serializeMonsterDesign } from '@/services/monsters/monster-generator'

// Sauvegarder (en base de données)
const design = generateMonsterDesign({ seed: 'Fluffy' })
const traitsJSON = serializeMonsterDesign(design)
await saveToDatabase({ traits: traitsJSON })

// Charger
const monster = await loadFromDatabase()
const design = JSON.parse(monster.traits) as MonsterDesign
```

## Palette de Couleurs

Chaque monstre a une palette de 6 couleurs :

```typescript
interface MonsterPalette {
  primary: string      // Couleur principale du corps
  secondary: string    // Couleur secondaire (ventre, oreilles internes)
  detail: string       // Contours, ombres, détails
  cheeks: string       // Joues rosées
  background: string   // Fond de la carte
  accent: string       // Accents (langue, décorations)
}
```

## Caractéristiques Physiques

```typescript
interface MonsterFeatures {
  earShape: 'pointy' | 'droopy' | 'long' | 'round'
  tailShape: 'long' | 'short' | 'puff' | 'none'
  whiskers: boolean
  muzzle: 'small' | 'medium' | 'flat'
  markings: 'plain' | 'mask' | 'patch'
}
```

## Anatomie d'un Monstre Rendu

Couches de rendu (de l'arrière vers l'avant) :

1. **Background** (dégradés, décorations d'état)
2. **Tail** (queue)
3. **Body** (corps avec dégradés)
4. **Belly** (ventre)
5. **Ears** (oreilles)
6. **Markings** (marquages spéciaux)
7. **Arms & Legs** (membres avec animations)
8. **Whiskers** (moustaches si présentes)
9. **Eyes** (yeux avec clignements)
10. **Brows** (sourcils pour l'état angry)
11. **Cheeks** (joues rosées)
12. **Muzzle** (museau)
13. **Nose** (nez, varie par variante)
14. **Mouth** (bouche avec animations d'état)
15. **Variant-specific layers** (dents, langue, etc.)

## Animations CSS

Les animations sont appliquées via des classes CSS dynamiques :

```css
.happyBounce { animation: happy-bounce 2.2s ease-in-out infinite; }
.sadDroop { animation: sad-droop 3s ease-in-out infinite; }
.angryShake { animation: angry-shake 0.55s ease-in-out infinite; }
.hungryNibble { animation: hungry-nibble 1.6s ease-in-out infinite; }
.sleepyFloat { animation: sleepy-float 3.6s ease-in-out infinite; }
```

Chaque partie du corps a ses propres animations imbriquées (bras, jambes, queue, yeux, bouche, etc.).

## Optimisations

### Performance
- RNG déterministe léger (xorshift)
- Animations GPU-accelerated (transform, opacity)
- Mémoïsation des designs générés
- Rendu SVG optimisé

### Reproductibilité
- Même seed → même résultat garanti
- Hash de seed basé sur FNV-1a
- State RNG isolé par génération

## Étendre le Système

### Ajouter une Nouvelle Variante

1. Définir la variante dans `VARIANT_LIBRARY` :

```typescript
{
  id: 'fox',
  basePalette: { /* couleurs */ },
  baseFeatures: { /* features */ },
  featurePool: { /* variations */ },
  bodyShapes: ['round', 'oval']
}
```

2. Ajouter les layers spécifiques dans `buildVariantLayers()` :

```typescript
case 'fox':
  return {
    afterMuzzle: (/* JSX pour le nez de renard */),
    afterMouth: (/* JSX pour les crocs */)
  }
```

### Ajouter un Nouvel État

1. Ajouter dans `MONSTER_STATES` :

```typescript
export const MONSTER_STATES = [..., 'excited'] as const
```

2. Définir l'animation CSS :

```css
.excitedBounce {
  animation: excited-bounce 1s ease-in-out infinite;
}

@keyframes excited-bounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}
```

3. Ajouter les éléments visuels dans `renderStateAccents()`.

## Exemples Pratiques

### Génération Aléatoire Complète

```typescript
const randomSeed = `${Date.now()}-${Math.random()}`
const design = generateMonsterDesign({ seed: randomSeed })
```

### Générer une Famille de Monstres

```typescript
const family = ['Parent1', 'Parent2', 'Child'].map(name => 
  generateMonsterDesign({ 
    seed: name,
    variantOverride: 'cat' // Même variante
  })
)
```

### Tester Tous les États

```typescript
function MonsterStateShowcase({ design }: { design: MonsterDesign }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {MONSTER_STATES.map(state => (
        <div key={state}>
          <MonsterPreview design={design} state={state} />
          <p>{state}</p>
        </div>
      ))}
    </div>
  )
}
```

## Dépannage

### Le monstre ne s'affiche pas
- Vérifier que `design` n'est pas `null`
- Vérifier que `traits` est bien un JSON valide
- Vérifier les imports du CSS module

### Les animations ne fonctionnent pas
- Vérifier que le CSS module est bien importé
- Vérifier que les classes d'animation sont appliquées
- Vérifier la compatibilité navigateur (GPU acceleration)

### Rendu pixel flou
- S'assurer que `shapeRendering="crispEdges"` est présent
- Ajouter `image-rendering: pixelated` en CSS
- Utiliser des dimensions multiples de 96px (16 × 6)

## Ressources Complémentaires

- **Type Definitions**: `src/types/monster.ts`
- **Generator Logic**: `src/services/monsters/monster-generator.ts`
- **Preview Component**: `src/components/monsters/monster-preview.tsx`
- **Animations CSS**: `src/components/monsters/monster-preview.module.css`
- **Migration Notes**: `MIGRATION_NOTES.md`

---

**Happy Monster Generating! 🎨✨**
