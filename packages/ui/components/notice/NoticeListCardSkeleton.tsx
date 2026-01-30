export default function NoticeListCardSkeleton() {
  return (
    <div
      className="flex items-center gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-4 animate-pulse"
      aria-hidden
    >
      <div className="h-4 w-6 shrink-0 rounded bg-gray-200 sm:h-5 sm:w-7" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <div className="h-5 w-14 shrink-0 rounded-md bg-gray-200 sm:w-16" />
          <div className="h-5 flex-1 min-w-0 max-w-[180px] rounded bg-gray-200 sm:max-w-[240px]" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-16 rounded bg-gray-200 sm:w-20" />
          <div className="h-3 w-20 rounded bg-gray-200 sm:w-24" />
        </div>
      </div>
      <div className="h-5 w-5 shrink-0 rounded bg-gray-200 sm:h-6 sm:w-6" />
    </div>
  );
}
