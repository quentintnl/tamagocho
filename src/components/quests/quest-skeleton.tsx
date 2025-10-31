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
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            {/* Difficulty badge skeleton */}
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
          {/* Description skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
        </div>
      </div>

      {/* Progress section */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          {/* Progress text skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          {/* Percentage skeleton */}
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        {/* Progress bar skeleton */}
        <div className="w-full bg-gray-200 rounded-full h-3"></div>
      </div>

      {/* Rewards section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Coin reward skeleton */}
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          {/* XP reward skeleton */}
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

export function QuestsSkeleton (): React.ReactNode {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-9 bg-gray-200 rounded w-28 animate-pulse"></div>
      </div>

      {/* Quest cards skeleton */}
      <div className="grid gap-4">
        {[...Array(5)].map((_, index) => (
          <QuestSkeleton key={index} />
        ))}
      </div>

      {/* Info footer skeleton */}
      <div className="text-center mt-6">
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>
    </div>
  )
}

