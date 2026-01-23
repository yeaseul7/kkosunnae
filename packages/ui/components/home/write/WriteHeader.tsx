import { PostData } from '@/packages/type/postType';
import { Dispatch, SetStateAction } from 'react';
import Category from './Category';

export default function WriteHeader({
  postData,
  setPostData,
  writeCategory,
  setWriteCategory,
}: {
  postData: PostData;
  setPostData: Dispatch<SetStateAction<PostData>>;
  writeCategory: 'adoption' | 'pet-life';
  setWriteCategory: Dispatch<SetStateAction<'adoption' | 'pet-life'>>;
}) {
  return (
    <div className="flex flex-col gap-2 justify-start items-start w-full">
      <h3 className="text-xl font-bold pb-3">글 작성하기</h3>
      <Category writeCategory={writeCategory} setWriteCategory={setWriteCategory} />
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={postData?.title || ''}
        onChange={(e) =>
          setPostData({ ...(postData as PostData), title: e.target.value })
        }
        className="py-2 w-full text-2xl font-bold outline-none border-b border-gray-200"
      />
    </div>
  );
}
