import Image from 'next/image';

export default function PageFooter() {
  return (
    <div className="flex justify-center items-center py-4 w-full bg-white border-t border-gray-200">
      <div className="px-4 w-full max-w-6xl">
        <div className="flex flex-col gap-2 justify-center items-center text-xs text-center text-gray-600">
          <Image
            src="/static/images/logorow-xl.png"
            alt="꼬순내 로고"
            width={160}
            height={160}
            className="mr-2"
          />
          <div>created by lee yeaseul</div>
          <div>© copyright 2025. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
