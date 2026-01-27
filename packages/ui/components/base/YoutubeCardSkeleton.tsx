export default function YoutubeCardSkeleton() {
  return (
    <div className="group block animate-pulse">
      <div className="relative overflow-hidden rounded-xl mb-3 bg-gray-200 aspect-video">
        <div className="w-full h-full bg-gray-300" />
        <div className="absolute bottom-2 right-2 bg-gray-400 rounded w-12 h-5" />
      </div>

      <div>
        <div className="h-5 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-1 w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}
