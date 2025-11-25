import { PostData } from '@/packages/ui/components/home/write/WriteContainer';
import { Dispatch, SetStateAction, useState } from 'react';
import { PiDogFill } from 'react-icons/pi';

export default function WriteHeader({
  postData,
  setPostData,
}: {
  postData: PostData;
  setPostData: Dispatch<SetStateAction<PostData>>;
}) {
  return (
    <div className="flex gap-2 justify-start items-center w-full">
      <PiDogFill className="w-6 h-6" />
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        className="py-2 w-full text-2xl font-bold border-none outline-none"
      />
    </div>
  );
}
