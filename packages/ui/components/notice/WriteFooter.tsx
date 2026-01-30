import { useRouter } from 'next/navigation';
import { PiArrowLeftLight } from 'react-icons/pi';

export default function WriteFooter({
  writing,
  saving = false,
}: {
  writing: () => Promise<void>;
  saving?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center py-4 w-full ">
      <div className="flex justify-between items-center w-full">
        <button
          type="button"
          className="flex justify-center items-center p-2 font-bold rounded-xs hover:bg-gray-200 disabled:opacity-50"
          onClick={() => router.back()}
          disabled={saving}
        >
          <PiArrowLeftLight />
          돌아가기
        </button>
        <button
          type="button"
          className="flex justify-center items-center p-2 font-bold text-white rounded-lg bg-primary2 hover:bg-primary1 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={writing}
          disabled={saving}
        >
          {saving ? '저장 중...' : '작성하기'}
        </button>
      </div>
    </div>
  );
}
