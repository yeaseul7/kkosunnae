'use client';

const NOTICE_CATEGORIES = [
    { value: '공지', label: '공지' },
    { value: '안내', label: '안내' },
    { value: '이벤트', label: '이벤트' },
    { value: '점검', label: '점검' },
    { value: '업데이트', label: '업데이트' },
] as const;

export default function Category({
    writeCategory,
    setWriteCategory,
}: {
    writeCategory: string;
    setWriteCategory: (category: string) => void;
}) {
    const current = writeCategory?.replace(/^\[|\]$/g, '') || '공지';

    return (
        <div className="flex flex-wrap gap-2">
            {NOTICE_CATEGORIES.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => setWriteCategory(value)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${current === value
                            ? 'bg-primary1 text-white'
                            : 'border border-gray-200 bg-white text-gray-700'
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}