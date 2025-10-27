import { mergeClasses } from '@/lib/utils'

/**
 * Props pour le composant EmptyMonstersState
 */
interface EmptyMonstersStateProps {
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * État vide affiché quand l'utilisateur n'a pas encore de monstres
 *
 * Responsabilité unique : afficher un message d'encouragement
 * quand la liste des monstres est vide.
 *
 * @param {EmptyMonstersStateProps} props - Props du composant
 * @returns {React.ReactNode} État vide stylisé
 *
 * @example
 * <EmptyMonstersState className="mt-10" />
 */
export function EmptyMonstersState ({ className }: EmptyMonstersStateProps): React.ReactNode {
  return (
    <div
      className={mergeClasses(
        'mt-10 w-full rounded-3xl bg-gradient-to-br from-white/90 via-lochinvar-50/80 to-fuchsia-blue-50/80 p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur',
        className
      )}
    >
      <h2 className='text-xl font-semibold text-slate-900'>
        Tu n&apos;as pas encore de compagnon
      </h2>
      <p className='mt-2 text-sm text-slate-600'>
        Clique sur &quot;Créer une créature&quot; pour lancer ta première adoption magique.
      </p>
    </div>
  )
}
