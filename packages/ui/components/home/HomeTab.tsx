'use client';

import { useEffect, useState, useRef } from 'react';
import { GoClock, GoTrophy } from 'react-icons/go';
import JumpDog from '../common/JumpDog';

interface HomeTabProps {
  mode: 'trending' | 'recent';
  setMode: (mode: 'trending' | 'recent') => void;
}
export default function HomeTab({ mode, setMode }: HomeTabProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);

  const isTrendingActive = mode === 'trending';
  const isRecentActive = mode === 'recent';

  useEffect(() => {
    fetch('/static/lottie/Moody_Dog.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  useEffect(() => {
    if (!dogRef.current || !containerRef.current || !animationData) return;

    const dog = dogRef.current;
    const container = containerRef.current;
    let position = 0;
    let currentDirection: 1 | -1 = 1;
    const speed = 1;
    const dogWidth = 100;
    
    directionRef.current = -1;
    dog.style.transform = `scaleX(-1)`; 

    const updateContainerWidth = () => {
      return container.offsetWidth;
    };

    const animate = () => {
      const containerWidth = updateContainerWidth();
      
      position += speed * currentDirection;

      if (position >= containerWidth - dogWidth) {
        currentDirection = -1;
        directionRef.current = 1;
        position = Math.min(position, containerWidth - dogWidth); 
      } 
      else if (position <= 0) {
        currentDirection = 1;
        directionRef.current = -1; 
        position = Math.max(position, 0); 
      }

      dog.style.left = `${position}px`;
      dog.style.transform = `scaleX(${directionRef.current})`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [animationData]);

  const handleTrendingClick = () => {
    setMode('trending');
  };

  const handleRecentClick = () => {
    setMode('recent');
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full mb-4">
        <div className="relative flex justify-center items-center w-full">
          <div 
            ref={containerRef}
            className="absolute inset-0 flex justify-center items-center w-full overflow-hidden"
            style={{ height: '92px' }}
          >
            {animationData && (
              <JumpDog dogRef={dogRef as React.RefObject<HTMLDivElement>} animationData={animationData} />
            )}
          </div>
        
        <div className="relative flex bg-gray-200 rounded-full p-1 w-full max-w-[320px] sm:min-w-[280px] z-10 mx-4 sm:mx-0">
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out ${
              isTrendingActive ? 'left-1 right-1/2' : 'left-1/2 right-1'
            }`}
          />
          
          <button
            onClick={handleTrendingClick}
            className={`relative z-10 flex gap-1 sm:gap-2 items-center justify-center flex-1 px-3 sm:px-8 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${
              isTrendingActive ? 'text-primary1' : 'text-gray-600'
            }`}
          >
            <GoTrophy />
            이번달 랭킹
          </button>
          
          <button
            onClick={handleRecentClick}
            className={`relative z-10 flex gap-1 sm:gap-2 items-center justify-center flex-1 px-3 sm:px-8 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer ${
              isRecentActive ? 'text-primary1' : 'text-gray-600'
            }`}
          >
            <GoClock />
            최근<span className="hidden sm:inline">귀요미</span>
          </button>
        </div>
      </div>
    </div>
  );
}
