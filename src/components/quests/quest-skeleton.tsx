/**
 * Quest Skeleton Component
 *
 * Presentation Layer: Loading skeleton for quests
 *
 * Responsibilities:
 * - Display animated skeleton while quests are loading
 * - Match the layout of actual quest cards
 *
 * Clean Architecture: Pure UI component
 */

export function QuestSkeleton (): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-100/50 via-white to-forest-50/50 p-6 shadow-xl border-4 border-white/90 animate-pulse'>
      {/* Motif décoratif */}
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1 pr-4'>
          <div className='flex items-center gap-3 mb-2'>
            {/* Title skeleton */}
            <div className='h-7 bg-meadow-200/50 rounded-xl w-56' />
            {/* Difficulty badge skeleton */}
            <div className='h-8 bg-meadow-300/50 rounded-xl w-20' />
          </div>
          {/* Description skeleton */}
          <div className='h-5 bg-forest-200/50 rounded-lg w-full max-w-md mt-2' />
        </div>
      </div>

      {/* Progress section */}
      <div className='mb-5'>
        <div className='flex items-center justify-between mb-2'>
          {/* Progress text skeleton */}
          <div className='h-5 bg-forest-200/50 rounded-lg w-40' />
          {/* Percentage skeleton */}
          <div className='h-5 bg-forest-200/50 rounded-lg w-14' />
        </div>
        {/* Progress bar skeleton */}
        <div className='w-full bg-forest-100/50 rounded-full h-4 border-2 border-white shadow-inner' />
      </div>

      {/* Rewards section */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          {/* Coin reward skeleton */}
          <div className='h-10 bg-gold-200/50 rounded-xl w-28' />
          {/* XP reward skeleton */}
          <div className='h-10 bg-lavender-200/50 rounded-xl w-24' />
        </div>
        {/* Button skeleton */}
        <div className='h-10 bg-meadow-200/50 rounded-xl w-32' />
      </div>
    </div>
  )
}

export function QuestsSkeleton (): React.ReactNode {
  return (
    <div className='space-y-4'>
      {/* Header skeleton */}
      <div className='flex items-center justify-between mb-4'>
        <div className='h-8 bg-gray-200 rounded w-48 animate-pulse' />
        <div className='h-9 bg-gray-200 rounded w-28 animate-pulse' />
      </div>

      {/* Quest cards skeleton */}
      <div className='grid gap-4'>
        {[...Array(5)].map((_, index) => (
          <QuestSkeleton key={index} />
        ))}
      </div>

      {/* Info footer skeleton */}
      <div className='text-center mt-6'>
        <div className='h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse' />
      </div>
    </div>
  )
}
