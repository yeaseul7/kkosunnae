/**
 * Cloudinary URL에 최적화 옵션을 안전하게 주입하는 함수
 * @param url 원본 Cloudinary URL
 * @param width (선택) 원하는 너비 (없으면 원본 비율 유지)
 * @param height (선택) 원하는 높이
 * @returns 최적화된 URL string
 */

export default function getOptimizedCloudinaryUrl(
  url: string,
  width?: number,
  height?: number,
) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // 1. 이미 최적화 파라미터가 있는지 확인 (중복 적용 방지)
  // f_auto: 브라우저에 맞춰 WebP/AVIF 자동 선택
  // q_auto: 화질 저하 없이 용량 최적화
  const defaultParams = ['f_auto', 'q_auto'];

  if (width) defaultParams.push(`w_${width}`);
  if (height) defaultParams.push(`h_${height}`);

  // c_limit: 지정한 크기보다 클 때만 줄임 (작은 이미지를 억지로 늘리지 않음)
  defaultParams.push('c_limit');

  const paramsString = defaultParams.join(',');

  // 2. '/upload/' 문자열을 찾아서 그 뒤에 파라미터를 주입 (Regex 활용)
  // 기존에 다른 옵션이 있어도 덮어쓰거나, 없으면 새로 넣음
  return url.replace(/\/upload\/(?:v\d+\/)?/, (match) => {
    // '/upload/v12345/' 형태라면 '/upload/f_auto,q_auto,w_500/v12345/'로 변경
    return match.replace('/upload/', `/upload/${paramsString}/`);
  });
}
