'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PiHandHeartLight } from 'react-icons/pi';
import { HiOutlineSquares2X2, HiOutlineLightBulb } from 'react-icons/hi2';

const JumpDog = dynamic(
  () => import('../common/JumpDog'),
  {
    ssr: false,
    loading: () => <div className="absolute left-0 w-[100px] h-[100px]" />
  }
);

export type NewsCategoryType = 'all' | 'adoption-guide' | 'care-tips';

const CATEGORIES: { value: NewsCategoryType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: '전체보기', Icon: HiOutlineSquares2X2 },
  { value: 'adoption-guide', label: '입양& 봉사 가이드', Icon: PiHandHeartLight },
  { value: 'care-tips', label: '반려동물 케어팁', Icon: HiOutlineLightBulb },
];

interface NewsCategoryProps {
  category: NewsCategoryType;
  setCategory: (category: NewsCategoryType) => void;
}

export default function NewsCategory({ category, setCategory }: NewsCategoryProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [dogReady, setDogReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  const activeIndex = CATEGORIES.findIndex((c) => c.value === category);

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
      dog.style.transform = `scaleX(${-currentDirection})`;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      cancelledRef.current = true;
    };
  }, [animationData, dogReady]);

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full mb-4">
      <div className="relative flex justify-center items-center w-full">
        <div
          ref={containerRef}
          className="absolute inset-0 flex min-w-full justify-center items-center w-full overflow-hidden"
          style={{ height: '92px' }}
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

        <div className="relative flex bg-gray-200 rounded-full p-1 w-full max-w-[400px] sm:max-w-[440px] z-10 mx-4 sm:mx-0">
          <div
            className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out"
            style={{
              width: 'calc((100% - 8px) / 3)',
              left: `calc(4px + (100% - 8px) / 3 * ${activeIndex})`,
            }}
          />

          {CATEGORIES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`relative z-10 flex gap-1 sm:gap-1.5 items-center justify-center flex-1 min-w-0 px-2 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${category === value ? 'text-primary1' : 'text-gray-600'
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0 sm:w-5 sm:h-5" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
