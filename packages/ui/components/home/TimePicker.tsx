'use client';

import { timeframeMap } from '@/packages/utils/timeframeMap';
import { useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

export default function TimePicker() {
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

  return (
    <div className="flex relative z-50 justify-between items-center px-2 w-24 h-8 text-sm font-semibold text-gray-600 bg-white rounded shadow-sm cursor-pointer">
      <div
        className="flex gap-2 justify-between items-center w-full"
        onClick={() => setIsOpenLocal((prev) => !prev)}
      >
        {timeframeMap[selectedTimeframe as keyof typeof timeframeMap]}
        <MdArrowDropDown className="w-6 h-6" />
      </div>
      {isOpenLocal && (
        <ul className="absolute left-0 top-full z-10 p-2 mt-1 w-full bg-white rounded-lg shadow-lg">
          {Object.entries(timeframeMap).map(([key, value]) => (
            <li
              key={key}
              className="p-2 cursor-pointer hover:bg-gray-100 hover:text-[#6b85e3] transition-colors"
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
