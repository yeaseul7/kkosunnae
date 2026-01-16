'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import { GoClock, GoTrophy } from 'react-icons/go';

export default function HomeTab() {
  const pathname = usePathname();
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const directionRef = useRef<1 | -1>(1);

  const isTrendingActive = pathname === '/' || pathname.startsWith('/trending');
  const isRecentActive = pathname.startsWith('/recent');

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
    
    // 초기 방향 설정 (오른쪽으로 시작하므로 Lottie가 오른쪽을 향하도록)
    // Lottie가 기본적으로 왼쪽을 향하고 있다면 -1, 오른쪽을 향하고 있다면 1
    directionRef.current = -1;
    setDirection(-1);
    dog.style.transform = `scaleX(-1)`; 

    const updateContainerWidth = () => {
      return container.offsetWidth;
    };

    const animate = () => {
      const containerWidth = updateContainerWidth();
      
      position += speed * currentDirection;

      if (position >= containerWidth - dogWidth) {
        currentDirection = -1;
        directionRef.current = 1; // 왼쪽으로 갈 예정이므로 정상 방향 (Lottie가 왼쪽을 향함)
        setDirection(1);
        position = Math.min(position, containerWidth - dogWidth); 
      } 
      else if (position <= 0) {
        currentDirection = 1;
        directionRef.current = -1; // 오른쪽으로 갈 예정이므로 뒤집기 (Lottie가 오른쪽을 향하도록)
        setDirection(-1);
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
    router.push('/trending');
  };

  const handleRecentClick = () => {
    router.push('/recent');
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8 w-full mb-2">
      <div className="relative flex justify-center items-center w-full">
        <div 
          ref={containerRef}
          className="absolute inset-0 flex justify-center items-center w-full overflow-hidden"
          style={{ height: '130px' }}
        >
          {animationData && (
            <div
              ref={dogRef}
              className="absolute left-0 z-[1] transition-transform duration-0 top-10"
              style={{
                width: '100px',
              }}
            >
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
        </div>
        
        <div className="relative flex bg-gray-200 rounded-full p-1 min-w-[280px] z-10">
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out ${
              isTrendingActive ? 'left-1 right-1/2' : 'left-1/2 right-1'
            }`}
          />
          
          <button
            onClick={handleTrendingClick}
            className={`relative z-10 flex gap-2 items-center justify-center flex-1 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
              isTrendingActive ? 'text-primary1' : 'text-gray-600'
            }`}
          >
            <GoTrophy />
            이번달 랭킹
          </button>
          
          <button
            onClick={handleRecentClick}
            className={`relative z-10 flex gap-2 items-center justify-center flex-1 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
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
