import { PostData } from '@/packages/type/postType';
import { Dispatch, SetStateAction } from 'react';

export default function WriteHeader({
  postData,
  setPostData,
}: {
  postData: PostData;
  setPostData: Dispatch<SetStateAction<PostData>>;
}) {
  return (
    <div className="flex gap-2 justify-start items-center w-full">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={postData?.title || ''}
        onChange={(e) =>
          setPostData({ ...(postData as PostData), title: e.target.value })
        }
        className="py-2 w-full text-2xl font-bold border-none outline-none"
      />
    </div>
  );
}
