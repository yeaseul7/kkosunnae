import { useEffect, RefObject } from 'react';

/**
 * 바깥쪽 클릭을 감지하는 커스텀 훅
 * @param ref - 감지할 요소의 ref
 * @param callback - 바깥쪽 클릭 시 실행할 콜백 함수
 * @param isEnabled - 이벤트 리스너를 활성화할지 여부 (기본값: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  isEnabled: boolean = true,
) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, isEnabled]);
}
