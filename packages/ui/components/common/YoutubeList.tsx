'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuYoutube } from 'react-icons/lu';

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: string;
  };
  contentDetails: {
    duration: string;
  };
}

// ISO 8601 duration을 사람이 읽을 수 있는 형식으로 변환
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function YoutubeList() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularVideos() {
      try {
        const response = await fetch('/api/youtube?maxResults=3&regionCode=KR');

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API 에러:', errorData);
          throw new Error(errorData.message || errorData.error || 'Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data.items || []);
      } catch (err) {
        console.error('YouTube 로딩 에러:', err);
        setError(err instanceof Error ? err.message : '동영상을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        에러: {error}
      </div>
    );
  }

  return (
    <div className="w-full pt-8">
      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-6 px-4 sm:px-0 text-gray-900 flex items-center gap-2">
        <LuYoutube className="text-red-600" />
        Pet 인기 영상
      </h3>
      <div className="grid grid-cols-1 gap-4 px-4 w-full sm:px-0 md:grid-cols-3">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {/* 썸네일 영역 */}
            <div className="relative overflow-hidden rounded-xl mb-3">
              <Image
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                width={320}
                height={180}
                className="w-full aspect-video object-cover"
              />

              {/* 플레이 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-0 h-0 border-l-[14px] border-l-[#3ea6ff] border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
                </div>
              </div>

              {/* 동영상 길이 */}
              <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                {formatDuration(video.contentDetails.duration)}
              </div>
            </div>

            {/* 정보 영역 */}
            <div>
              <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 leading-snug group-hover:text-gray-700">
                {video.snippet.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {video.snippet.channelTitle}
              </p>

              <p className="text-gray-500 text-sm">
                {Number(video.statistics.viewCount).toLocaleString()}회 조회
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}