import Lottie from 'lottie-react';
import { RefObject } from 'react';
import Image from 'next/image';

export default function JumpDog({
  dogRef,
  animationData,
}: {
  dogRef: RefObject<HTMLDivElement>;
  animationData: object;
}) {
  return (
    <>
    <div
      ref={dogRef}
      className="absolute left-0 z-[1] transition-transform duration-0 top-10"
      style={{
        width: '100px',
      }}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={(e) => {
          e.currentTarget.classList.add('dog-jump-animation');
        }}
        onAnimationEnd={(e) => {
          e.currentTarget.classList.remove('dog-jump-animation');
        }}
      >
        <Lottie animationData={animationData} loop={true} />
      </div>
     
    </div>
   </>
  );
}
