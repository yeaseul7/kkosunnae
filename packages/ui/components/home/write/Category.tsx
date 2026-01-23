'use client';

import { Dispatch, SetStateAction } from 'react';

export default function Category({ writeCategory, setWriteCategory }: { writeCategory: 'adoption' | 'pet-life', setWriteCategory: Dispatch<SetStateAction<'adoption' | 'pet-life'>> }) {

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setWriteCategory('adoption')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${writeCategory === 'adoption'
                    ? 'bg-primary1 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                    }`}
            >
                입양 후기
            </button>
            <button
                onClick={() => setWriteCategory('pet-life')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${writeCategory === 'pet-life'
                    ? 'bg-primary1 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                    }`}
            >
                반려 생활
            </button>
        </div>
    );
}