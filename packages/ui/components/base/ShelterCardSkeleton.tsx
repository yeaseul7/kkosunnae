export default function ShelterCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-4 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          <div className="mb-1 flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded shrink-0" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded shrink-0" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 bg-gray-200 rounded-2xl w-20" />
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
