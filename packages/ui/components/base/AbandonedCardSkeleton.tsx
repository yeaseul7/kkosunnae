export default function AbandonedCardSkeleton() {
  return (
    <article className="flex overflow-hidden flex-col bg-white rounded-lg shadow-sm animate-pulse w-full max-w-full sm:max-w-[260px] border border-gray-100">
      <div className="relative w-full bg-gray-200 aspect-[4/5] overflow-hidden">
        <div className="w-full h-full bg-gray-300" />
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-12 ml-auto" />
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </article>
  );
}
