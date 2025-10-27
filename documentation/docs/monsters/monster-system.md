---
sidebar_position: 1
---

# Système de Monstres

Documentation complète du système de génération et de gestion des créatures Tamagotcho.

## Vue d'ensemble

Le système de monstres est au cœur de l'application Tamagotcho. Chaque monstre est une créature unique générée aléatoirement avec des traits visuels et des états émotionnels dynamiques.

## Types de données

### MonsterState

Les états émotionnels possibles d'un monstre.

```typescript
export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const
export type MonsterState = typeof MONSTER_STATES[number]
```

| État | Description | Icône |
|------|-------------|-------|
| `happy` | Heureux et satisfait | 😊 |
| `sad` | Triste et déprimé | 😢 |
| `angry` | En colère | 😠 |
| `hungry` | Affamé | 🍽️ |
| `sleepy` | Endormi ou fatigué | 😴 |

### MonsterTraits

Interface définissant les caractéristiques visuelles d'un monstre.

```typescript
export interface MonsterTraits {
  bodyColor: string        // Couleur principale du corps
  accentColor: string      // Couleur d'accentuation
  eyeColor: string         // Couleur des yeux
  antennaColor: string     // Couleur des antennes
  bobbleColor: string      // Couleur des bobbles
  cheekColor: string       // Couleur des joues
  bodyStyle: MonsterStyle  // Style du corps
  eyeStyle: EyeStyle       // Style des yeux
  antennaStyle: AntennaStyle  // Style des antennes
  accessory: AccessoryStyle   // Accessoire
}
```

### MonsterStyle

Types de morphologie du corps.

```typescript
export type MonsterStyle = 'round' | 'square' | 'tall' | 'wide'
```

| Style | Description | Aspect visuel |
|-------|-------------|---------------|
| `round` | Corps rond et mignon | ● |
| `square` | Corps carré et robuste | ■ |
| `tall` | Corps grand et élancé | ▮ |
| `wide` | Corps large et trapu | ▬ |

### EyeStyle

Variations des yeux.

```typescript
export type EyeStyle = 'big' | 'small' | 'star' | 'sleepy'
```

| Style | Description |
|-------|-------------|
| `big` | Grands yeux expressifs |
| `small` | Petits yeux mignons |
| `star` | Yeux en forme d'étoile ✨ |
| `sleepy` | Yeux endormis/fermés |

### AntennaStyle

Types d'antennes.

```typescript
export type AntennaStyle = 'single' | 'double' | 'curly' | 'none'
```

| Style | Description |
|-------|-------------|
| `single` | Une seule antenne |
| `double` | Deux antennes |
| `curly` | Antennes bouclées |
| `none` | Pas d'antennes |

### AccessoryStyle

Accessoires supplémentaires.

```typescript
export type AccessoryStyle = 'horns' | 'ears' | 'tail' | 'none'
```

| Accessoire | Description |
|------------|-------------|
| `horns` | Cornes 🦄 |
| `ears` | Oreilles 👂 |
| `tail` | Queue |
| `none` | Aucun accessoire |

### DBMonster

Interface de la version sérialisée en base de données.

```typescript
export interface DBMonster {
  _id: string           // ID MongoDB
  name: string          // Nom du monstre
  level: number         // Niveau (défaut: 1)
  traits: string        // JSON sérialisé de MonsterTraits
  state: MonsterState   // État émotionnel actuel
  ownerId: string       // ID du propriétaire
  createdAt: Date       // Date de création
  updatedAt: Date       // Date de dernière mise à jour
}
```

## Génération de Monstres

### Service: monster-generator.ts

Le service de génération crée des traits aléatoires pour chaque nouveau monstre.

#### Palettes de couleurs

```typescript
// Couleurs pastels pour les corps
const pastelColors = [
  ['#FFB5E8', '#FF9CEE'],  // Rose pastel
  ['#B5E8FF', '#9CD8FF'],  // Bleu pastel
  ['#E8FFB5', '#D8FF9C'],  // Vert pastel
  ['#FFE8B5', '#FFD89C'],  // Orange pastel
  ['#E8B5FF', '#D89CFF'],  // Violet pastel
  ['#FFB5C5', '#FF9CB5'],  // Rose vif pastel
  ['#B5FFE8', '#9CFFD8'],  // Turquoise pastel
  ['#FFC5B5', '#FFB59C']   // Pêche pastel
]

// Couleurs vives pour les antennes
const antennaColors = [
  '#FFE66D',  // Jaune vif
  '#FF6B9D',  // Rose vif
  '#6BDBFF',  // Bleu cyan
  '#B4FF6B',  // Vert lime
  '#FF9CEE',  // Violet vif
  '#FFB347'   // Orange vif
]

// Couleurs sombres pour les yeux
const eyeColors = [
  '#2C2C2C',  // Noir profond
  '#4A4A4A',  // Gris foncé
  '#1A1A1A',  // Noir très foncé
  '#3D3D3D'   // Gris anthracite
]
```

#### Fonction generateRandomTraits()

Génère un ensemble complet de traits aléatoires.

```typescript
export function generateRandomTraits (): MonsterTraits {
  // Sélection aléatoire d'une palette
  const randomPalette = pastelColors[
    Math.floor(Math.random() * pastelColors.length)
  ]
  
  // Sélection des couleurs d'antennes et d'yeux
  const randomAntenna = antennaColors[
    Math.floor(Math.random() * antennaColors.length)
  ]
  const randomEye = eyeColors[
    Math.floor(Math.random() * eyeColors.length)
  ]

  return {
    bodyColor: randomPalette[0],
    accentColor: randomPalette[1],
    eyeColor: randomEye,
    antennaColor: randomAntenna,
    bobbleColor: randomAntenna,
    cheekColor: adjustColorOpacity(randomPalette[0], 0.7),
    bodyStyle: bodyStyles[Math.floor(Math.random() * bodyStyles.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    antennaStyle: antennaStyles[Math.floor(Math.random() * antennaStyles.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)]
  }
}
```

#### Fonction adjustColorOpacity()

Ajuste l'opacité d'une couleur hexadécimale pour créer des variations.

```typescript
function adjustColorOpacity (hex: string, opacity: number): string {
  // Extraction des composantes RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Ajustement avec opacité
  const adjustedR = Math.round(r + (255 - r) * (1 - opacity))
  const adjustedG = Math.round(g + (255 - g) * (1 - opacity))
  const adjustedB = Math.round(b + (255 - b) * (1 - opacity))

  // Conversion en hexadécimal
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`
}
```

### Probabilités de génération

Chaque trait a une **probabilité égale** d'être sélectionné :

| Catégorie | Nombre d'options | Probabilité par option |
|-----------|------------------|------------------------|
| Palettes de couleurs | 8 | 12.5% |
| Couleurs d'antennes | 6 | 16.7% |
| Couleurs d'yeux | 4 | 25% |
| Styles de corps | 4 | 25% |
| Styles d'yeux | 4 | 25% |
| Styles d'antennes | 4 | 25% |
| Accessoires | 4 | 25% |

### Nombre de combinaisons possibles

Le système peut générer **un nombre astronomique** de monstres uniques :

**Calcul : 8 × 6 × 4 × 4 × 4 × 4 × 4 = 196 608 combinaisons**

:::tip Unicité garantie
Avec près de 200 000 combinaisons possibles, chaque joueur aura des monstres vraiment uniques !
:::

## Utilisation pratique

### Créer un nouveau monstre

```typescript
import { generateRandomTraits } from '@/services/monsters/monster-generator'
import type { MonsterTraits } from '@/types/monster'

function createRandomMonster() {
  // Génération des traits
  const traits: MonsterTraits = generateRandomTraits()
  
  console.log(traits)
  // {
  //   bodyColor: '#FFB5E8',
  //   accentColor: '#FF9CEE',
  //   eyeColor: '#2C2C2C',
  //   antennaColor: '#FFE66D',
  //   bobbleColor: '#FFE66D',
  //   cheekColor: '#FFD6F1',
  //   bodyStyle: 'round',
  //   eyeStyle: 'big',
  //   antennaStyle: 'double',
  //   accessory: 'horns'
  // }
}
```

### Afficher un monstre

```typescript
import PixelMonster from '@/components/monsters/pixel-monster'

function MonsterDisplay({ traits }: { traits: MonsterTraits }) {
  return (
    <div className="monster-container">
      <PixelMonster traits={traits} />
    </div>
  )
}
```

### Sauvegarder en base de données

```typescript
import { MonsterModel } from '@/db/models/monster.model'
import { generateRandomTraits } from '@/services/monsters/monster-generator'

async function createAndSaveMonster(name: string, ownerId: string) {
  const traits = generateRandomTraits()
  
  const monster = await MonsterModel.create({
    name,
    traits: JSON.stringify(traits), // Sérialisation
    level: 1,
    state: 'happy',
    ownerId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  return monster
}
```

### Désérialiser les traits

```typescript
function parseMonsterTraits(monster: DBMonster): MonsterTraits {
  return JSON.parse(monster.traits) as MonsterTraits
}

// Utilisation
const monster = await MonsterModel.findById(id)
const traits = parseMonsterTraits(monster)
```

## Constantes par défaut

```typescript
export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = 'happy'
```

## Évolutions futures

### Système de niveau
- [ ] Expérience et montée de niveau
- [ ] Déblocage de nouveaux traits à certains niveaux
- [ ] Évolution visuelle du monstre

### États dynamiques
- [ ] Transition automatique entre états
- [ ] Besoins (nourriture, sommeil, jeu)
- [ ] Animations basées sur l'état

### Traits rares
- [ ] Traits légendaires avec faible probabilité
- [ ] Combinaisons spéciales
- [ ] Événements saisonniers

### Personnalisation
- [ ] Achat de traits avec monnaie in-game
- [ ] Déblocage via quêtes
- [ ] Trading entre joueurs

## Tests recommandés

```typescript
describe('generateRandomTraits', () => {
  it('devrait générer des traits valides', () => {
    const traits = generateRandomTraits()
    
    // Vérification des couleurs hexadécimales
    expect(traits.bodyColor).toMatch(/^#[0-9A-F]{6}$/i)
    expect(traits.eyeColor).toMatch(/^#[0-9A-F]{6}$/i)
    
    // Vérification des énumérations
    expect(['round', 'square', 'tall', 'wide']).toContain(traits.bodyStyle)
    expect(['big', 'small', 'star', 'sleepy']).toContain(traits.eyeStyle)
  })

  it('devrait générer des monstres différents', () => {
    const traits1 = generateRandomTraits()
    const traits2 = generateRandomTraits()
    
    // Il est très improbable que deux générations soient identiques
    expect(JSON.stringify(traits1)).not.toBe(JSON.stringify(traits2))
  })
})
```

## Ressources

- [Code source: monster-generator.ts](https://github.com/RiusmaX/tamagotcho/blob/master/src/services/monsters/monster-generator.ts)
- [Types: monster.ts](https://github.com/RiusmaX/tamagotcho/blob/master/src/types/monster.ts)
- [Modèle DB: monster.model.ts](https://github.com/RiusmaX/tamagotcho/blob/master/src/db/models/monster.model.ts)
