/**
 * Daily Quests Skeleton Component
 *
 * Presentation Layer: Loading skeleton for daily quests section
 *
 * Responsibilities:
 * - Display animated skeleton matching the daily quests layout
 * - Provide visual feedback during data loading
 *
 * Single Responsibility: UI skeleton component for daily quests
 */

/**
 * Skeleton pour une carte de quête quotidienne
 */
function DailyQuestCardSkeleton (): React.ReactNode {
  return (
    <div className='flex items-center gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 animate-pulse'>
      {/* Icône skeleton */}
      <div className='flex h-12 w-12 shrink-0 rounded-full bg-slate-200' />

      {/* Contenu skeleton */}
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-slate-200' />
        <div className='h-3 w-1/2 rounded bg-slate-200' />
      </div>

      {/* Bouton/Badge skeleton */}
      <div className='h-8 w-20 rounded-lg bg-slate-200' />
    </div>
  )
}

/**
 * Skeleton pour la section complète des quêtes quotidiennes
 */
export function DailyQuestsSkeleton (): React.ReactNode {
  return (
    <div className='rounded-3xl bg-white/90 p-6 shadow-[0_20px_60px_rgba(22,101,52,0.15)] ring-1 ring-meadow-200/60 backdrop-blur'>
      {/* En-tête skeleton */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-full bg-lochinvar-100 animate-pulse' />
          <div className='space-y-2'>
            <div className='h-5 w-40 rounded bg-slate-200 animate-pulse' />
            <div className='h-4 w-24 rounded bg-slate-200 animate-pulse' />
          </div>
        </div>

        {/* Badge de progression skeleton */}
        <div className='flex flex-col items-end gap-1'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-full bg-slate-200 animate-pulse' />
            <div className='h-7 w-12 rounded bg-slate-200 animate-pulse' />
          </div>
          <div className='h-3 w-16 rounded bg-slate-200 animate-pulse' />
        </div>
      </div>

      {/* Liste des quêtes skeleton */}
      <div className='mt-6 space-y-4'>
        {[...Array(3)].map((_, index) => (
          <DailyQuestCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

