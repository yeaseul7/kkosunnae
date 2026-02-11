'use client';

import { useState, useRef } from 'react';
import { BsImages } from 'react-icons/bs';
import { MdCloudUpload } from 'react-icons/md';
import { CiCircleRemove } from 'react-icons/ci';
import type { DraftCardImage } from '@/packages/type/cardNewsType';

const MAX_IMAGES = 10;
const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp';
const MAX_SIZE_MB = 10;

interface ContentImgProps {
    images: DraftCardImage[];
    onChange: (images: DraftCardImage[]) => void;
}

export default function ContentImg({ images, onChange }: ContentImgProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const countText = `${images.length}/${MAX_IMAGES}장`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        addFiles(Array.from(files));
        e.target.value = '';
    };

    const addFiles = (files: File[]) => {
        const valid: DraftCardImage[] = [];
        let skippedSize = 0;
        let skippedType = 0;
        const maxBytes = MAX_SIZE_MB * 1024 * 1024;

        for (const file of files) {
            if (valid.length + images.length >= MAX_IMAGES) break;
            if (!file.type.match(/^image\/(jpeg|png|webp)$/i)) {
                skippedType += 1;
                continue;
            }
            if (file.size > maxBytes) {
                skippedSize += 1;
                continue;
            }
            const url = URL.createObjectURL(file);
            valid.push({ id: `${Date.now()}-${Math.random()}`, url, file });
        }

        const limit = Math.max(0, MAX_IMAGES - images.length);
        const toAppend = valid.slice(0, limit);
        const skippedCount = valid.length - toAppend.length;
        if (valid.length > limit) {
            valid.slice(limit).forEach((item) => item.url && URL.revokeObjectURL(item.url));
        }

        const messages: string[] = [];
        if (skippedSize > 0) messages.push(`용량 초과(최대 ${MAX_SIZE_MB}MB): ${skippedSize}개`);
        if (skippedType > 0) messages.push(`지원 형식 아님(JPG, PNG, WebP): ${skippedType}개`);
        if (skippedCount > 0) messages.push(`최대 ${MAX_IMAGES}장 초과: ${skippedCount}개`);
        if (messages.length > 0) {
            setTimeout(() => alert(`일부 파일이 제외되었습니다.\n\n${messages.join('\n')}`), 0);
        }

        if (toAppend.length > 0) {
            onChange([...images, ...toAppend]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files?.length) addFiles(Array.from(files));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (id: string) => {
        const item = images.find((i) => i.id === id);
        if (item?.url) URL.revokeObjectURL(item.url);
        onChange(images.filter((i) => i.id !== id));
    };

    return (
        <section className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg text-primary1">
                        <BsImages className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                        카드 이미지 관리
                    </h2>
                    <span className="text-xs text-gray-500">{countText}</span>
                </div>
            </div>

            <label
                htmlFor="content-img-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition-colors sm:py-9 ${isDragging
                    ? 'border-primary1 bg-primary1/5'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    id="content-img-upload"
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT_TYPES}
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                />
                <MdCloudUpload className="mb-1.5 h-9 w-9 text-primary1 sm:h-10 sm:w-10" />
                <p className="mb-0.5 text-xs font-medium text-gray-700">
                    클릭하거나 이미지를 드래그하여 업로드하세요
                </p>
                <p className="text-[11px] text-gray-500">
                    JPG, PNG, WebP (최대 10MB, 권장 비율 3:4)
                </p>
            </label>

            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.url}
                                alt={`카드 ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                            <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[10px] font-semibold text-green-800">
                                {index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-white text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                aria-label="삭제"
                            >
                                <CiCircleRemove className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
