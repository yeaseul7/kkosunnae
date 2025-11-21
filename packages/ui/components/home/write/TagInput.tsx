'use client';
import { isEmptyOrWhitespace } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function TagInput() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const insertTag = useCallback(
    (tag: string) => {
      if (isEmptyOrWhitespace(tag)) return;
      if (tags.includes(tag)) return;
      setTags([...tags, tag]);
      setValue('');
    },
    [tags],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        console.log('Outside clicked');
        console.log(value);
        insertTag(value);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [insertTag, value]);
  const removeTag = useCallback(
    (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    },
    [tags],
  );
  return (
    <div ref={containerRef} className="w-full flex flex-col gap-2 my-4">
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-element3 rounded-full px-2 py-1 text-sm cursor-pointer text-primary1 whitespace-nowrap shrink-0"
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
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            insertTag(value);
          }
        }}
        className="w-full py-1 text-sm border-none outline-none pt-2"
      />
    </div>
  );
}
