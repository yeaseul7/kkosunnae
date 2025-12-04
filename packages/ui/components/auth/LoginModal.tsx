'use client';
import { useEffect, useRef, useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import { FcGoogle } from 'react-icons/fc';

interface LoginModalProps {
  onClose?: () => void;
}

// 이메일 형식 검증 함수
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const { loginWithGoogle, user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  // 사용자 로그인 상태 변경 시 모달 닫기
  useEffect(() => {
    if (user) {
      onClose?.();
    }
  }, [user, onClose]);

  useEffect(() => {
    // 링크 처리는 AuthProvider에서 전역적으로 처리됩니다

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // 이메일 입력 처리 및 실시간 검증
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setMessage(''); // 서버 메시지 초기화

    // 이메일을 입력했고, 포커스를 잃었을 때만 validation 에러 표시
    if (emailTouched) {
      if (value.trim() === '') {
        setEmailError('이메일을 입력해주세요.');
      } else if (!isValidEmail(value)) {
        setEmailError('올바른 이메일 형식을 입력해주세요.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email.trim() === '') {
      setEmailError('이메일을 입력해주세요.');
    } else if (!isValidEmail(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
    } else {
      setEmailError('');
    }
  };

  const emailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEmailError('');

    // 이메일 형식 검증
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 이메일 링크 인증: 로그인/회원가입 모두 링크를 통해 진행
      const actionCodeSettings = {
        url: `${window.location.origin}/register`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      // authMode도 저장하여 인증 후 구분할 수 있도록 함
      window.localStorage.setItem('authMode', authMode);
      setEmailSent(true);
      setMessage(
        authMode === 'login'
          ? '이메일로 로그인 링크를 전송했습니다. 이메일을 확인해주세요.'
          : '이메일로 회원가입 링크를 전송했습니다. 이메일을 확인해주세요.',
      );
    } catch (error) {
      console.error('이메일 링크 전송 오류:', error);
      // 에러 메시지 처리
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';

      // 특정 에러에 대한 사용자 친화적 메시지
      if (
        errorMessage.includes('already-in-use') ||
        errorMessage.includes('already exists')
      ) {
        setMessage('이미 등록된 이메일입니다. 로그인을 진행해주세요.');
      } else if (errorMessage.includes('invalid-email')) {
        setEmailError('올바른 이메일 형식을 입력해주세요.');
      } else {
        setMessage(`에러: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setMessage('');

    try {
      await loginWithGoogle();
      // onAuthStateChanged가 user 상태를 업데이트하면 모달이 자동으로 닫힘
    } catch (error) {
      setMessage(
        `Google 로그인 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 justify-center items-center z-[9999]">
      <div className="absolute inset-0 bg-opaque-layer z-[9998]" />
      <div
        ref={modalRef}
        className="relative p-6 w-full max-w-md rounded-lg shadow-xl bg-element1 z-[9999]"
      >
        <h3 className="mb-4 text-xl font-bold">
          {authMode === 'login' ? '로그인' : '회원가입'}
        </h3>
        {emailSent ? (
          <div className="space-y-4">
            <p className="text-text2">
              {email}로 회원가입 링크를 전송했습니다. 이메일을 확인하고 링크를
              클릭해주세요.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setEmailError('');
                setEmailTouched(false);
                setMessage('');
              }}
              className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2"
            >
              {authMode === 'login'
                ? '다른 이메일로 로그인'
                : '다른 이메일로 회원가입'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={emailAuth} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-text3">
                  이메일로 {authMode === 'login' ? '로그인' : '회원가입'}
                </label>
                <input
                  className={`p-2 w-full rounded-md border ${
                    emailError
                      ? 'border-destructive1 focus:border-destructive1 focus:ring-destructive1'
                      : 'border-border3 focus:border-primary1 focus:ring-primary1'
                  } outline-none focus:ring-1`}
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                />
                {emailError && (
                  <p className="text-sm text-destructive1">{emailError}</p>
                )}
              </div>
              {message && (
                <p
                  className={`text-sm ${
                    message.includes('성공') || message.includes('전송')
                      ? 'text-primary1'
                      : 'text-destructive1'
                  }`}
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading || !!emailError || !email.trim()}
                className="px-4 py-2 w-full rounded-md bg-primary1 text-button-text hover:bg-primary2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '전송 중...' : '이메일 링크 전송'}
              </button>
            </form>
            <div className="my-8">
              <div className="flex relative items-center mb-4">
                <label className="font-bold text-text3">
                  소셜계정으로 {authMode === 'login' ? '로그인' : '회원가입'}
                </label>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="flex justify-center items-center w-full"
              >
                {isGoogleLoading ? (
                  `${authMode === 'login' ? '로그인' : '회원가입'} 중...`
                ) : (
                  <div className="p-2 rounded-full border border-border3 hover:bg-gray-50">
                    <FcGoogle className="text-2xl" />
                  </div>
                )}
              </button>
            </div>
            {authMode === 'login' ? (
              <div className="flex justify-end mt-16 text-text3">
                아직 회원이 아니신가요?
                <button
                  className="pl-2 text-primary1 hover:text-primary2"
                  onClick={() => {
                    setAuthMode('register');
                    setEmailError('');
                    setMessage('');
                    setEmailTouched(false);
                  }}
                >
                  회원가입하기
                </button>
              </div>
            ) : (
              <div className="flex justify-end mt-16 text-text3">
                이미 회원이신가요?
                <button
                  className="pl-2 text-primary1 hover:text-primary2"
                  onClick={() => {
                    setAuthMode('login');
                    setEmailError('');
                    setMessage('');
                    setEmailTouched(false);
                  }}
                >
                  로그인하기
                </button>
              </div>
            )}
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text3 hover:text-text1"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
