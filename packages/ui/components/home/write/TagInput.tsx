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
  postData: PostData | null;
  setPostData: Dispatch<SetStateAction<PostData | null>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<string>('');

  const [value, setValue] = useState('');

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const insertTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag || isEmptyOrWhitespace(trimmedTag)) return;

      setPostData((prev) => {
        if (!prev) {
          return {
            id: '',
            title: '',
            content: '',
            tags: [trimmedTag],
            authorId: '',
            authorName: '',
            authorPhotoURL: null,
            createdAt: null,
            updatedAt: null,
            likes: 0,
          };
        }
        const currentTags = prev.tags || [];
        if (currentTags.includes(trimmedTag)) return prev;
        return { ...prev, tags: [...currentTags, trimmedTag] };
      });
      setValue('');
      valueRef.current = '';
    },
    [setPostData],
  );

  const insertMultipleTags = useCallback(
    (tags: string[]) => {
      const validTags = tags
        .map((tag) => tag.trim())
        .filter((tag) => tag && !isEmptyOrWhitespace(tag));

      if (validTags.length === 0) return;

      setPostData((prev) => {
        if (!prev) {
          return {
            id: '',
            title: '',
            content: '',
            tags: validTags,
            authorId: '',
            authorName: '',
            authorPhotoURL: null,
            createdAt: null,
            updatedAt: null,
            likes: 0,
          };
        }
        const currentTags = prev.tags || [];
        const newTags = validTags.filter((tag) => !currentTags.includes(tag));
        if (newTags.length === 0) return prev;
        return { ...prev, tags: [...currentTags, ...newTags] };
      });
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
      setPostData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tags: (prev.tags || []).filter((t) => t !== tag),
        };
      });
    },
    [setPostData],
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-2 my-4 w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {postData?.tags &&
          postData.tags.length > 0 &&
          postData.tags.map((tag) => (
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

          if (newValue.includes(',')) {
            const parts = newValue.split(',');
            const tagsToAdd = parts
              .slice(0, -1)
              .map((part) => part.trim())
              .filter((part) => part);
            const remainingText = parts[parts.length - 1].trim();

            if (tagsToAdd.length > 0) {
              insertMultipleTags(tagsToAdd);
            }

            setValue(remainingText);
            valueRef.current = remainingText;
          } else {
            setValue(newValue);
            valueRef.current = newValue;
          }
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
