export default function NoticeReadContentSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6" aria-hidden>
      {/* 브레드크럼 */}
      <nav className="mb-4 flex flex-wrap items-center gap-1.5">
        <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-14 rounded bg-gray-200 animate-pulse" />
      </nav>

      {/* 뒤로가기 */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* 공지 카드 */}
      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-3 h-7 w-14 rounded-md bg-gray-200 animate-pulse" />
        <div className="mb-6 h-8 w-3/4 max-w-md rounded bg-gray-200 animate-pulse sm:h-9" />

        {/* 메타데이터 */}
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gray-100 pb-6">
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-px bg-gray-100" />
          <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-px bg-gray-100" />
          <div className="h-4 w-14 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* 본문 */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-32 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
        </div>
      </article>

      {/* 하단 버튼 */}
      <div className="mt-8 flex justify-center">
        <div className="h-12 w-40 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
