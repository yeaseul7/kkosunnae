import Lottie from 'lottie-react';
import { RefObject } from 'react';

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
        top: '45px',
      }}
    >
      <div
        className="cursor-pointer"
        onMouseEnter={(e) => {
          e.currentTarget.classList.add('dog-jump-animation');
        }}
        onClick={(e) => {
          e.currentTarget.classList.add('dog-jump-animation');
        }}
        onTouchStart={(e) => {
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
