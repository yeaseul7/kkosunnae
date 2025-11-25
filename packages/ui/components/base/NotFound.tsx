import { useRouter } from 'next/router';

export default function NotFound({ error }: { error: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="text-red-500">
        {error || '게시물을 찾을 수 없습니다.'}
      </div>
      <button
        onClick={() => router.back()}
        className="flex gap-2 items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded"
      >
        뒤로가기
      </button>
    </div>
  );
}
