import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinart';

/**
 * Cloudinary URL에서 public_id를 추출
 * @param url Cloudinary 이미지 URL
 * @returns public_id 또는 null
 */
function extractPublicId(url: string): string | null {
  try {
    // Cloudinary URL 형식: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    // 또는: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // 'upload' 다음의 경로를 찾음
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // upload 다음 부분이 version인지 확인 (v로 시작하는 경우)
    let publicIdStartIndex = uploadIndex + 1;
    if (
      publicIdStartIndex < pathParts.length &&
      pathParts[publicIdStartIndex].startsWith('v')
    ) {
      publicIdStartIndex++;
    }

    // 나머지 경로를 합쳐서 public_id 생성
    const publicIdParts = pathParts.slice(publicIdStartIndex);
    if (publicIdParts.length === 0) return null;

    // 마지막 부분의 확장자 제거
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const publicId = publicIdParts
      .slice(0, -1)
      .concat(lastPart.replace(/\.[^/.]+$/, ''))
      .join('/');

    return publicId;
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 },
      );
    }

    const publicId = extractPublicId(url);
    if (!publicId) {
      return NextResponse.json(
        { error: 'Invalid Cloudinary URL' },
        { status: 400 },
      );
    }

    // Cloudinary에서 이미지 삭제
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image from Cloudinary' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete image', details: errorMessage },
      { status: 500 },
    );
  }
}
