export default function ShelterInfoComponentSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 py-4 mx-auto w-full sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate-pulse">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      {/* 제목 영역 */}
      <div className="flex items-center gap-2">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 lg:flex-[3] flex flex-col gap-16">
          {/* 보호소 소개 영역 */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-32 bg-gray-200 rounded w-full" />
            </div>
          </div>

          {/* 입양 대기 동물 영역 */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-4">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 사이드바 영역 */}
        <div className="flex-1 lg:flex-[2] flex flex-col gap-4">
          {/* 운영 정보 */}
          <div className="bg-white border border-gray-200 rounded-3xl p-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>

          {/* 입양 문의 */}
          <div className="bg-white border border-gray-200 rounded-3xl p-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
