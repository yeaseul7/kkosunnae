'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PiHandHeartLight } from 'react-icons/pi';
import { HiOutlineWifi } from 'react-icons/hi2';

const JumpDog = dynamic(
  () => import('../common/JumpDog'),
  {
    ssr: false,
    loading: () => <div className="absolute left-0 w-[100px] h-[100px]" />
  }
);

interface HomeTabProps {
  mode: 'trending' | 'adoption';
  setMode: (mode: 'trending' | 'adoption') => void;
}
export default function HomeTab({ mode, setMode }: HomeTabProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [dogReady, setDogReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  const isTrendingActive = mode === 'trending';
  const isRecentActive = mode === 'adoption';

  useEffect(() => {
    fetch('/static/lottie/Moody_Dog.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  useEffect(() => {
    if (!containerRef.current || !animationData || !dogReady) return;
    const dog = dogRef.current;
    const container = containerRef.current;
    if (!dog) return;

    cancelledRef.current = false;
    let position = 0;
    let currentDirection: 1 | -1 = 1;
    const speed = 2;
    const dogWidth = 100;

    const animate = () => {
      if (cancelledRef.current) return;

      const containerWidth = container.offsetWidth;
      position += speed * currentDirection;

      if (position >= containerWidth - dogWidth) {
        currentDirection = -1;
        position = Math.min(position, containerWidth - dogWidth);
      } else if (position <= 0) {
        currentDirection = 1;
        position = Math.max(position, 0);
      }

      dog.style.left = `${position}px`;
      // Lottie 강아지가 기본으로 왼쪽 향해 걸으므로, 이동 방향과 보는 방향을 맞추기 위해 -currentDirection
      dog.style.transform = `scaleX(${-currentDirection})`;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      cancelledRef.current = true;
    };
  }, [animationData, dogReady]);

  const handleTrendingClick = () => {
    setMode('trending');
  };

  const handleRecentClick = () => {
    setMode('adoption');
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full mb-4 px-4 sm:px-0">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-[600px] sm:max-w-none gap-3 sm:gap-4">
        <div
          ref={containerRef}
          className="absolute inset-0 flex min-w-full justify-center items-center w-full overflow-hidden pointer-events-none"
          style={{ height: '92px' }}
          aria-hidden
        >
          {animationData && (
            <Suspense fallback={<div className="absolute left-0 w-[100px] h-[100px]" />}>
              <JumpDog
                dogRef={dogRef as React.RefObject<HTMLDivElement>}
                animationData={animationData}
                onMount={() => setDogReady(true)}
              />
            </Suspense>
          )}
        </div>

        <div className="relative flex justify-center items-center w-full sm:w-auto">
          <div className="relative flex bg-gray-200 rounded-full p-1 w-full max-w-[320px] sm:max-w-[340px] z-10">
            {/* 흰색 배경: 왼쪽 탭이 더 넓음(55%), 오른쪽 45% */}
            <div
              className={`absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out ${isTrendingActive ? 'left-1 right-[45%]' : 'left-[55%] right-1'
                }`}
            />

            <button
              onClick={handleTrendingClick}
              className={`relative z-10 flex gap-1.5 items-center justify-center flex-[1.1] min-w-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${isTrendingActive ? 'text-primary1' : 'text-gray-600'
                }`}
            >
              <HiOutlineWifi className="w-4 h-4 flex-shrink-0" />
              반려 생활 소식
            </button>

            <button
              onClick={handleRecentClick}
              className={`relative z-10 flex gap-1.5 items-center justify-center flex-1 min-w-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${isRecentActive ? 'text-primary1' : 'text-gray-600'
                }`}
            >
              <PiHandHeartLight className="w-5 h-5 flex-shrink-0" />
              입양 소식
            </button>
          </div>
        </div>

        <Link
          href="/community"
          className="relative z-10 shrink-0 text-sm font-medium text-primary1 hover:underline text-center sm:text-right"
        >
          소식 전체 보기
        </Link>
      </div>
    </div>
  );
}
