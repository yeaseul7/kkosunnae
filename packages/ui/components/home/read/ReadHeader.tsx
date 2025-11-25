import { PostData } from '@/packages/type/postType';
import NextImage from 'next/image';

export default function ReadHeader({ post }: { post: PostData | null }) {
  return (
    <header className="mb-6">
      <h1 className="mb-4 text-3xl font-bold">{post?.title}</h1>

      <div className="flex gap-4 items-center mb-4">
        {post?.authorPhotoURL ? (
          <NextImage
            src={post?.authorPhotoURL}
            alt={post?.authorName}
            width={28}
            height={28}
            className="object-cover w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
        )}
        <div className="flex gap-2 items-center">
          <div className="pr-2 text-base font-semibold">{post?.authorName}</div>
          {post?.createdAt && (
            <div className="text-sm text-gray-500">
              {post?.createdAt.toDate().toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {post?.tags && post?.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post?.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm whitespace-nowrap rounded-full cursor-pointer bg-element2 text-primary1 shrink-0"
            >
              # {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
