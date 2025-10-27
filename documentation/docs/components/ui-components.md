---
sidebar_position: 1
---

# Composants UI

Documentation des composants d'interface utilisateur réutilisables du projet Tamagotcho.

## Vue d'ensemble

Les composants UI suivent les principes :
- ✅ **Single Responsibility** : Chaque composant a une responsabilité unique
- ✅ **Type Safety** : TypeScript avec interfaces explicites
- ✅ **Customization** : Props pour la personnalisation
- ✅ **Accessibility** : Conformes aux standards ARIA

## Table des matières

1. [Button](#button) - Composant bouton réutilisable
2. [Input](#input) - Champ de saisie
3. [Header](#header) - Navigation principale
4. [Footer](#footer) - Pied de page

---

## Button

Composant de bouton hautement personnalisable avec support de multiples tailles et variantes.

### Import

```typescript
import Button from '@/components/button'
```

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | `React.ReactNode` | `'Click me'` | Contenu du bouton |
| `onClick` | `() => void` | `undefined` | Callback au clic |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Taille du bouton |
| `variant` | `'primary' \| 'ghost' \| 'underline' \| 'outline'` | `'primary'` | Style visuel |
| `disabled` | `boolean` | `false` | État désactivé |
| `type` | `'button' \| 'submit' \| 'reset'` | `undefined` | Type HTML du bouton |

### Variantes

#### Primary
Bouton principal avec fond coloré.

```tsx
<Button variant="primary">
  Action principale
</Button>
```

**Rendu :**
- Fond : `moccaccino-500` (#f7533c)
- Hover : `moccaccino-700`
- Texte : Blanc
- Transition : `scale(0.95)` au clic

#### Ghost
Bouton transparent avec texte coloré.

```tsx
<Button variant="ghost">
  Action secondaire
</Button>
```

**Rendu :**
- Fond : Transparent
- Hover : `moccaccino-100/10` (léger overlay)
- Texte : `moccaccino-500`

#### Underline
Bouton avec texte souligné.

```tsx
<Button variant="underline">
  Lien texte
</Button>
```

**Rendu :**
- Souligné par défaut (`underline-offset-6`)
- Hover : Suppression du soulignement
- Texte : Couleur héritée

#### Outline
Bouton avec bordure uniquement.

```tsx
<Button variant="outline">
  Action tertiaire
</Button>
```

**Rendu :**
- Bordure : `moccaccino-500`
- Fond : Transparent
- Hover : `moccaccino-100/10`
- Texte : `moccaccino-500`

### Tailles

```tsx
<Button size="sm">Petit</Button>
<Button size="md">Moyen (défaut)</Button>
<Button size="lg">Grand</Button>
<Button size="xl">Extra large</Button>
```

| Taille | Padding | Taille de texte |
|--------|---------|-----------------|
| `sm` | `px-2 py-1` | `text-sm` |
| `md` | `px-4 py-2` | `text-md` |
| `lg` | `px-6 py-3` | `text-lg` |
| `xl` | `px-8 py-4` | `text-xl` |

### État désactivé

```tsx
<Button disabled>
  Action désactivée
</Button>
```

**Comportement :**
- Couleurs atténuées (variantes `200` et `400`)
- Pas de transition
- Pas d'effet hover
- Curseur par défaut (pas `pointer`)

### Exemples d'utilisation

#### Formulaire de soumission

```tsx
function LoginForm() {
  return (
    <form onSubmit={handleSubmit}>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Mot de passe" />
      
      <Button 
        type="submit" 
        variant="primary" 
        size="lg"
      >
        Se connecter
      </Button>
    </form>
  )
}
```

#### Actions combinées

```tsx
function ActionBar() {
  return (
    <div className="flex gap-4">
      <Button variant="primary" onClick={handleSave}>
        Sauvegarder
      </Button>
      <Button variant="outline" onClick={handleCancel}>
        Annuler
      </Button>
      <Button variant="ghost" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  )
}
```

#### Bouton avec état de chargement

```tsx
function CreateMonsterButton() {
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    await createMonster()
    setLoading(false)
  }

  return (
    <Button 
      onClick={handleCreate}
      disabled={loading}
      variant="primary"
    >
      {loading ? 'Création...' : 'Créer un monstre'}
    </Button>
  )
}
```

### Implémentation technique

Le composant utilise deux fonctions utilitaires :

#### `getSize()`
Mappe les tailles vers les classes Tailwind appropriées.

```typescript
function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-4 py-2 text-md'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
  }
}
```

#### `getVariant()`
Mappe les variantes vers les classes de style avec gestion du state `disabled`.

```typescript
function getVariant (
  variant: 'primary' | 'ghost' | 'underline' | 'outline', 
  disabled: boolean
): string {
  switch (variant) {
    case 'primary': 
      return disabled 
        ? 'bg-moccaccino-200 text-moccaccino-400' 
        : 'bg-moccaccino-500 hover:bg-moccaccino-700 text-white'
    // ...
  }
}
```

### Animations

Tous les boutons non désactivés ont :
- `transition-all duration-300` : Transition fluide
- `active:scale-95` : Effet de pression au clic
- `cursor-pointer` : Curseur interactif

### Accessibilité

- ✅ Type HTML natif (`<button>`)
- ✅ Support du `type` (button, submit, reset)
- ✅ État `disabled` natif
- ✅ Clic clavier (Enter/Space) natif

### Tests recommandés

```typescript
describe('Button', () => {
  it('devrait appeler onClick au clic', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Cliquer</Button>)
    fireEvent.click(screen.getByText('Cliquer'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('ne devrait pas appeler onClick si désactivé', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Cliquer</Button>)
    fireEvent.click(screen.getByText('Cliquer'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('devrait appliquer la bonne taille', () => {
    const { container } = render(<Button size="lg">Grand</Button>)
    expect(container.firstChild).toHaveClass('px-6 py-3 text-lg')
  })
})
```

---

## Input

Composant de champ de saisie stylisé.

### Import

```typescript
import Input from '@/components/input'
```

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `type` | `string` | `'text'` | Type d'input HTML |
| `placeholder` | `string` | - | Texte d'indication |
| `value` | `string` | - | Valeur contrôlée |
| `onChange` | `(e) => void` | - | Callback de changement |
| `required` | `boolean` | `false` | Champ requis |
| `name` | `string` | - | Nom du champ (formulaire) |

### Exemple d'utilisation

```tsx
function EmailInput() {
  const [email, setEmail] = useState('')

  return (
    <Input
      type="email"
      placeholder="votre@email.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  )
}
```

---

## Header

Navigation principale de l'application.

### Import

```typescript
import { Header } from '@/components'
```

### Fonctionnalités

- Logo Tamagotcho
- Navigation responsive
- Liens vers Dashboard, Créatures, etc.
- Bouton de connexion/déconnexion

### Exemple de structure

```tsx
<Header />
```

---

## Footer

Pied de page de l'application.

### Import

```typescript
import { Footer } from '@/components'
```

### Contenu

- Liens utiles
- Informations de copyright
- Réseaux sociaux

---

## Bonnes pratiques

### 1. Utiliser des valeurs par défaut

```tsx
// ✅ BON : Valeurs par défaut explicites
<Button>Cliquer</Button>

// ❌ ÉVITER : Spécifier les valeurs par défaut inutilement
<Button size="md" variant="primary">Cliquer</Button>
```

### 2. Composition pour variantes complexes

```tsx
// ✅ BON : Composer des boutons spécialisés
function DangerButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="outline" className="border-red-500 text-red-500" {...props}>
      {children}
    </Button>
  )
}
```

### 3. Types stricts

```tsx
// ✅ BON : Utiliser les types fournis
import type { ButtonProps } from '@/components/button'

function MyButton(props: ButtonProps) {
  return <Button {...props} />
}
```

### 4. Accessibilité

```tsx
// ✅ BON : Labels et ARIA
<Button 
  onClick={handleDelete}
  aria-label="Supprimer le monstre"
>
  🗑️
</Button>
```

## Ressources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Principes SOLID](../architecture/solid-principles)
