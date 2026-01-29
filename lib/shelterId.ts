import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.SHELTER_ID_SECRET || 'kkosunnae-shelter-id-secret';
  return createHash('sha256').update(secret).digest();
}

function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64url');
}

function base64urlDecode(str: string): Buffer | null {
  try {
    return Buffer.from(str, 'base64url');
  } catch {
    return null;
  }
}

/**
 * 보호소 관리번호(care_reg_no)를 URL에 노출하지 않기 위한 암호화 토큰으로 인코딩합니다.
 * 서버에서만 사용하세요.
 */
export function encodeShelterId(careRegNo: string): string {
  if (!careRegNo?.trim()) return '';
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([
    cipher.update(careRegNo.trim(), 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, encrypted, authTag]);
  return base64urlEncode(combined);
}

/**
 * URL의 토큰을 복호화하여 보호소 관리번호(care_reg_no)를 반환합니다.
 * 유효하지 않으면 null을 반환합니다. 서버에서만 사용하세요.
 */
export function decodeShelterId(token: string): string | null {
  if (!token?.trim()) return null;
  const key = getKey();
  const combined = base64urlDecode(token.trim());
  if (!combined || combined.length < IV_LENGTH + AUTH_TAG_LENGTH) return null;
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(-AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH, -AUTH_TAG_LENGTH);
  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
