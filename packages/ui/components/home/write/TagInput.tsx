'use client';
import { isEmptyOrWhitespace } from '@/lib/utils';
import { PostData } from '@/packages/type/postType';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function TagInput({
  postData,
  setPostData,
}: {
  postData: PostData;
  setPostData: Dispatch<SetStateAction<PostData>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<string>('');

  const [value, setValue] = useState('');

  // valueRef를 항상 최신 값으로 동기화
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const insertTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag || isEmptyOrWhitespace(trimmedTag)) return;

      setPostData((prev) => {
        const currentTags = prev.tags || [];
        if (currentTags.includes(trimmedTag)) return prev;
        return { ...prev, tags: [...currentTags, trimmedTag] };
      });
      setValue('');
      valueRef.current = '';
    },
    [setPostData],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        const currentValue = valueRef.current.trim();
        if (currentValue) {
          insertTag(currentValue);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [insertTag]);

  const removeTag = useCallback(
    (tag: string) => {
      setPostData((prev) => ({
        ...prev,
        tags: (prev.tags || []).filter((t) => t !== tag),
      }));
    },
    [setPostData],
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-2 my-4 w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {postData?.tags?.length > 0 &&
          postData?.tags?.map((tag) => (
            <div
              key={tag}
              className="px-2 py-1 text-sm whitespace-nowrap rounded-full cursor-pointer bg-element2 text-primary1 shrink-0"
              onClick={() => {
                removeTag(tag);
              }}
            >
              # {tag}
            </div>
          ))}
      </div>
      <input
        type="text"
        placeholder="태그를 입력하세요 (쉼표로 구분)"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue);
          valueRef.current = newValue;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const currentValue = e.currentTarget.value.trim();
            if (currentValue) {
              insertTag(currentValue);
            }
          }
        }}
        className="py-1 pt-2 w-full text-sm border-none outline-none"
      />
    </div>
  );
}
