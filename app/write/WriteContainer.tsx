'use client';
import DecorateHr from '@/packages/ui/components/base/DecorateHr';
import TagInput from '@/packages/ui/components/home/write/TagInput';
import WriteBody from '@/packages/ui/components/home/write/WriteBody';
import WriteHeader from '@/packages/ui/components/home/write/WriteHeader';

interface WriteContainerProps {
  className?: string;
}

export default function WriteContainer({ className }: WriteContainerProps) {
  return (
    <div className={`flex flex-col  w-full h-full ${className || ''}`}>
      <div className="flex flex-col items-center justify-start w-full">
        <WriteHeader />
        <TagInput />
        <DecorateHr />
        <WriteBody />
      </div>
    </div>
  );
}
