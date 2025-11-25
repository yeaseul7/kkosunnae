import { PiArrowLeftLight } from 'react-icons/pi';

export default function WriteFooter({ posting }: { posting: () => Promise<void> }) {
  return (
    <div className="flex justify-between items-center pt-4 w-full border-t border-gray-200">
      <div className="flex justify-between items-center w-full">
        <button className="flex justify-center items-center p-2 font-bold rounded-xs hover:bg-gray-200">
          <PiArrowLeftLight />
          돌아가기
        </button>
        <button className="flex justify-center items-center p-2 font-bold text-white rounded-lg bg-primary2 hover:bg-primary1" onClick={posting}>
          작성하기
        </button>
      </div>
    </div>
  );
}
