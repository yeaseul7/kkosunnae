import { NoticeData } from '@/packages/type/noticeType';
import { Dispatch, SetStateAction } from 'react';
import Category from './Category';

export default function WriteHeader(
  {
    noticeData,
    setNoticeData,
  }: {
    noticeData: NoticeData;
    setNoticeData: Dispatch<SetStateAction<NoticeData>>;
  }) {
  return (
    <div className="flex flex-col gap-2 justify-start items-start w-full">
      <h3 className="text-xl font-bold pb-3">공지 작성하기</h3>
      <Category
        writeCategory={noticeData?.category ?? '공지'}
        setWriteCategory={(category: string) =>
          setNoticeData({ ...noticeData, category })
        }
      />
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={noticeData?.title || ''}
        onChange={(e) =>
          setNoticeData({ ...(noticeData as NoticeData), title: e.target.value })
        }
        className="py-2 w-full text-2xl font-bold outline-none border-b border-gray-200"
      />
    </div>
  );
}
