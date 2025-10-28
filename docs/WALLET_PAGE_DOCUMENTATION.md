# 💰 Page Wallet - Documentation

## Vue d'ensemble

Une page dédiée à la gestion du wallet a été créée à l'URL `/wallet`. Cette page permet à l'utilisateur de :
- Visualiser son solde actuel
- Ajouter de la monnaie facilement
- Consulter des statistiques sur son wallet

## Architecture

### Route et Protection
- **URL** : `/wallet`
- **Fichier** : `src/app/wallet/page.tsx`
- **Protection** : Page protégée - redirection vers `/sign-in` si non authentifié

### Composants

#### 1. `wallet/page.tsx` (Server Component)
```typescript
- Vérifie l'authentification via better-auth
- Protège la route
- Passe la session au composant client
```

#### 2. `wallet-page-client.tsx` (Client Component)
```typescript
- Affiche le solde actuel
- Interface d'ajout de monnaie
- Statistiques du wallet
- Gestion des états (loading, success, error)
```

## Fonctionnalités

### 1. Affichage du Solde
- **Grande carte visuelle** avec icône 💰
- **Montant formaté** avec séparateurs de milliers
- **Informations utilisateur** :
  - Nom ou email du compte
  - Date de dernière mise à jour

### 2. Ajout de Monnaie

#### Montants Prédéfinis
Boutons rapides pour ajouter :
- 10 pièces
- 25 pièces
- 50 pièces
- 100 pièces
- 500 pièces

#### Montant Personnalisé
- Input numérique pour saisir un montant custom
- Validation : montant doit être > 0

#### Fonctionnement
```typescript
1. Utilisateur sélectionne ou saisit un montant
2. Clique sur "Ajouter X pièces"
3. Appel à addCoinsToWallet(amount)
4. Rafraîchissement automatique du wallet
5. Message de confirmation (disparaît après 3s)
```

### 3. Statistiques

Trois cartes d'informations :

**Capacité d'achat**
- Calcul : `solde / 5` (basé sur prix moyen item)
- Indique combien d'items peuvent être achetés

**Statut**
- Bronze : 0-100 pièces
- Argent : 101-1000 pièces  
- Or : 1000+ pièces

**Rang**
- Normal : < 100 pièces
- Aisé : 100-1000 pièces
- Riche : > 1000 pièces

## Accès à la Page

### Depuis le Dashboard
Un bouton dédié "Mon Wallet - Gérer mes pièces" a été ajouté dans la section profil du dashboard, sous les cartes de statistiques.

### Depuis n'importe où
Cliquer sur l'affichage du wallet (💰 + montant) dans :
- Le header du dashboard
- Le header de la page créature
- Le header principal

### Navigation
- Bouton "← Retour au Dashboard" en bas de page
- Bouton "← Retour" dans le header de la page

## Interface Utilisateur

### Layout
```
┌─────────────────────────────────────────────────────┐
│ ← Retour  Mon Wallet               💰 [montant]    │ ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Message de notification si action]               │
│                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │   SOLDE ACTUEL      │  │  AJOUTER MONNAIE    │ │
│  │                     │  │                     │ │
│  │   💰 [grand nb]     │  │  [Boutons +10...]   │ │
│  │   pièces            │  │  [Input custom]     │ │
│  │                     │  │  [Bouton Ajouter]   │ │
│  │   [Infos user]      │  │  [💡 Astuce]        │ │
│  └─────────────────────┘  └─────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │           STATISTIQUES                        │ │
│  │  [Capacité]  [Statut]  [Rang]                │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│         [← Retour au Dashboard]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Design System
- **Couleurs** : Palette yellow (jaune or) pour le thème monnaie
- **Dégradés** : `from-yellow-400 to-yellow-600` pour les icônes
- **Backgrounds** : `from-yellow-50 to-yellow-100` pour les cartes
- **Effets** : Hover avec scale sur l'icône, transitions smooth

## Gestion des États

### Loading
```tsx
Affiche :
- Skeleton animé pour le solde
- Bouton désactivé pendant l'ajout
```

### Success
```tsx
Affiche :
- Message vert "X pièces ajoutées avec succès !"
- Disparaît automatiquement après 3 secondes
- Wallet rafraîchi automatiquement
```

### Error
```tsx
Affiche :
- Message rouge avec description de l'erreur
- Reste visible jusqu'à la prochaine action
```

## Code d'Exemple

### Utiliser la page wallet
```typescript
// Redirection programmatique
window.location.href = '/wallet'

// Ou depuis un lien Next.js
<Link href='/wallet'>Mon Wallet</Link>
```

### Ajouter des pièces depuis une autre page
```typescript
import { addCoinsToWallet } from '@/actions/wallet.actions'

// Récompense après action monstre
const reward = await addCoinsToWallet(10)
if (reward) {
  console.log('Récompense ajoutée !')
}
```

## Intégrations

### Avec le Dashboard
- Bouton d'accès dans la carte profil
- Wallet cliquable dans le header

### Avec les Pages Créatures
- Wallet cliquable dans le header
- Possibilité de gagner des pièces via les actions

### Avec le Header Principal
- Wallet cliquable pour accéder à la page

## Responsive Design

- **Mobile** : Cartes empilées verticalement
- **Tablet** : Grille 2 colonnes
- **Desktop** : Grille 2 colonnes + statistiques pleine largeur

## Sécurité

✅ Page protégée par authentification
✅ Vérification de session côté serveur
✅ Validation des montants (> 0)
✅ Messages d'erreur clairs

## Améliorations Futures

- [ ] Historique des transactions
- [ ] Graphique d'évolution du solde
- [ ] Exportation des données
- [ ] Notifications push lors de gains/pertes
- [ ] Animation lors de l'ajout de pièces
- [ ] Système de récompenses quotidiennes

## Fichiers Modifiés

```
✅ src/app/wallet/page.tsx (créé)
✅ src/components/wallet/wallet-page-client.tsx (créé)
✅ src/components/wallet-display.tsx (modifié - cliquable)
✅ src/components/dashboard/dashboard-content.tsx (modifié - bouton ajouté)
```

## Tests

Pour tester :
1. Se connecter à l'application
2. Aller sur `/dashboard`
3. Cliquer sur le bouton "Mon Wallet"
4. Tester l'ajout de monnaie avec différents montants
5. Vérifier le rafraîchissement automatique
6. Cliquer sur le wallet dans le header pour revenir

## Support

Cette implémentation respecte :
- ✅ Clean Architecture (séparation des couches)
- ✅ SOLID principles (SRP, OCP, DIP)
- ✅ Design cohérent avec le projet
- ✅ Accessibilité (labels, aria)
- ✅ Performance (loading states)

