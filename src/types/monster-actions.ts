export type MonsterAction = 'feed' | 'comfort' | 'cuddle' | 'wake';

export interface MonsterActionDefinition {
    name: string;
    action: MonsterAction;
    icon: string;
    animation: string;
    newState?: string;
}

export const MONSTER_ACTIONS: MonsterActionDefinition[] = [
    {
        name: 'Nourrir',
        action: 'feed',
        icon: '🍎',
        animation: 'animate-wiggle',
        newState: 'happy'
    },
    {
        name: 'Consoler',
        action: 'comfort',
        icon: '💕',
        animation: 'animate-pulse',
        newState: 'happy'
    },
    {
        name: 'Câliner',
        action: 'cuddle',
        icon: '🤗',
        animation: 'animate-bounce',
        newState: 'happy'
    },
    {
        name: 'Réveiller',
        action: 'wake',
        icon: '⏰',
        animation: 'animate-shake',
        newState: 'happy'
    }
];
