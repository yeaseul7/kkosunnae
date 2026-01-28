export default function HomeTabSkeleton() {
  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full mb-4 animate-pulse">
      <div className="relative flex justify-center items-center w-full">
        <div
          className="absolute inset-0 flex justify-center items-center w-full overflow-hidden"
          style={{ height: '92px' }}
        >
          <div className="absolute left-0 w-[100px] h-[100px] bg-gray-200 rounded" />
        </div>

        <div className="relative flex bg-gray-200 rounded-full p-1 w-full max-w-[280px] sm:max-w-[300px] z-10 mx-4 sm:mx-0">
          <div className="absolute top-1 bottom-1 left-1 right-1/2 rounded-full bg-gray-300" />
          <div className="relative z-10 flex gap-1.5 items-center justify-center flex-1 px-2 sm:px-4 py-2">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-20" />
          </div>
          <div className="relative z-10 flex gap-1.5 items-center justify-center flex-1 px-2 sm:px-4 py-2">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
