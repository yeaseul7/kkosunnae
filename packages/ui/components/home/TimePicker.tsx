'use client';

import { timeframeMap } from '@/packages/utils/timeframeMap';
import { useEffect, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

export default function TimePicker() {
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

  useEffect(() => {
    console.log(isOpenLocal);
  }, [isOpenLocal]);
  return (
    <div className="relative bg-white h-8 w-24 rounded flex items-center justify-between px-2 font-semibold text-gray-600 shadow-sm cursor-pointer hover:opacity-75 transition-opacity text-sm">
      <div
        className="flex items-center gap-2 justify-between w-full"
        onClick={() => setIsOpenLocal((prev) => !prev)}
      >
        {timeframeMap[selectedTimeframe as keyof typeof timeframeMap]}
        <MdArrowDropDown className="w-6 h-6" />
      </div>
      {isOpenLocal && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg p-2 z-10">
          {Object.entries(timeframeMap).map(([key, value]) => (
            <li
              key={key}
              className="p-2 cursor-pointer hover:bg-gray-100 hover:text-[#12b886] transition-colors"
              onClick={() => {
                setSelectedTimeframe(key);
                setIsOpenLocal(false);
              }}
            >
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
