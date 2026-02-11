'use client';

import { useEffect, useCallback, RefObject } from 'react';
import Lottie from 'lottie-react';

function triggerJump(el: HTMLElement) {
  el.classList.remove('dog-jump-animation');
  void el.offsetHeight; // reflow로 애니메이션 재시작
  el.classList.add('dog-jump-animation');
}

export default function JumpDog({
  dogRef,
  animationData,
  onMount,
}: {
  dogRef: RefObject<HTMLDivElement>;
  animationData: object;
  onMount?: () => void;
}) {
  useEffect(() => {
    onMount?.();
  }, [onMount]);

  const handleJump = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    triggerJump(e.currentTarget);
  }, []);

  const handleAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === 'dog-jump') {
      e.currentTarget.classList.remove('dog-jump-animation');
    }
  }, []);

  return (
    <div
      ref={dogRef}
      className="absolute left-0 z-20 transition-transform duration-0 top-10 pointer-events-auto"
      style={{
        width: '100px',
        height: '100px',
        top: '25px',
      }}
    >
      <div
        className="cursor-pointer w-full h-full flex items-center justify-center"
        style={{ minWidth: '100px', minHeight: '100px' }}
        onMouseEnter={handleJump}
        onClick={handleJump}
        onTouchStart={handleJump}
        onAnimationEnd={handleAnimationEnd}
      >
        <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
      </div>
    </div>
  );
}
