import { useState } from 'react';
import { PiDogFill } from 'react-icons/pi';

export default function WriteHeader() {
  const [title, setTitle] = useState('');
  return (
    <div className="flex items-center justify-start w-full gap-2">
      <PiDogFill className="w-6 h-6" />
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full py-2 text-2xl font-bold border-none outline-none"
      />
    </div>
  );
}
