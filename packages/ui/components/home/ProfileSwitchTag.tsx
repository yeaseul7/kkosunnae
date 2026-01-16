'use client';

interface ProfileSwitchTagProps {
  category: 'posts' | 'shelter';
  setCategory: (category: 'posts' | 'shelter') => void;
}

export default function ProfileSwitchTag({ category, setCategory }: ProfileSwitchTagProps) {
  const isPostsActive = category === 'posts';
  const isShelterActive = category === 'shelter';

  return (
    <div className="flex flex-col gap-3 mt-4 w-full sm:flex-row sm:justify-center sm:items-center">
      <div className="flex gap-2 items-center sm:gap-2">
        <button
          onClick={() => setCategory('posts')}
          className={`flex gap-2 items-center px-2 py-1 rounded-lg border-2 transition-colors text-sm ${
            isPostsActive
              ? '!text-primary1 !border-primary1 bg-primary1/10'
              : '!text-black border-gray-300 hover:border-gray-400'
          }`}
        >
          <span className="text-sm font-bold whitespace-nowrap text-sm">
            게시글
          </span>
        </button>
        <button
          onClick={() => setCategory('shelter')}
          className={`flex gap-2 items-center px-2 py-1 rounded-lg border-2 transition-colors  text-sm ${
            isShelterActive
              ? '!text-primary1 !border-primary1 bg-primary1/10'
              : '!text-black border-gray-300 hover:border-gray-400'
          }`}
        >
          <span className="text-sm whitespace-nowrap text-sm">
            좋아요 한 구조 동물
          </span>
        </button>
      </div>
    </div>
  );
}
